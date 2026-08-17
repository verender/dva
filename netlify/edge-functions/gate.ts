// Server-side PIN gate. Runs on every request before any static asset
// (HTML, JS bundle, photos, video, audio) is served, so — unlike the old
// client-side PinGate — the PIN itself never ships in the JS bundle and
// direct links to media files are blocked too, not just the app shell.
//
// Requires a `SITE_PIN` environment variable set in the Netlify dashboard
// (Site settings -> Environment variables). Deliberately NOT prefixed
// VITE_ — that prefix tells Vite to inline a var into the client bundle,
// which is exactly what we're avoiding here.

const COOKIE_NAME = "va_auth";
const ATTEMPTS_COOKIE = "va_att";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days
const MAX_ATTEMPTS = 6;
const LOCKOUT_SECONDS = 15 * 60;
// The attempts cookie itself only lives an hour, so a cleared cookie jar
// eventually resets the counter — this is a per-browser throttle, not a
// true per-IP rate limit (no persistent store available at the edge here).
// It's meant to slow down casual/scripted guessing, not stop a determined
// attacker with a fresh session each time.
const ATTEMPTS_COOKIE_MAX_AGE = 60 * 60;
const PASSTHROUGH_PATHS = new Set(["/robots.txt", "/favicon.ico"]);

async function hmac(key: string, message: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(message));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

// Only ever called on two values expected to be the same fixed length
// (both HMAC digests) — never short-circuits on length, so there's no
// timing signal that distinguishes a wrong-length guess from a
// wrong-content guess of the correct length.
function constantTimeEqual(a: string, b: string): boolean {
  const len = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;
  for (let i = 0; i < len; i++) {
    const ca = i < a.length ? a.charCodeAt(i) : 0;
    const cb = i < b.length ? b.charCodeAt(i) : 0;
    diff |= ca ^ cb;
  }
  return diff === 0;
}

// Compares the candidate PIN to the real one via HMAC digests instead of
// directly, so the comparison is always fixed-length and never leaks the
// real PIN's length or content through response timing.
async function pinMatches(secret: string, candidate: string): Promise<boolean> {
  if (!candidate) return false;
  try {
    const [expected, actual] = await Promise.all([
      hmac(secret, "pin-check"),
      hmac(candidate, "pin-check"),
    ]);
    return constantTimeEqual(expected, actual);
  } catch {
    return false;
  }
}

function getCookie(cookieHeader: string, name: string): string {
  const match = cookieHeader.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  return match?.[1] ?? "";
}

// Auth token binds its own expiry into the signed payload, rather than
// relying solely on the cookie's Max-Age, so a copied/replayed cookie
// stops working exactly when it should even if the Max-Age handling is
// bypassed somewhere in the chain — and every login mints a fresh token.
async function makeAuthToken(secret: string, expiresAt: number): Promise<string> {
  const sig = await hmac(secret, `authed:${expiresAt}`);
  return `${expiresAt}.${sig}`;
}

async function verifyAuthToken(secret: string, token: string): Promise<boolean> {
  if (!token) return false;
  const dot = token.indexOf(".");
  if (dot === -1) return false;
  const expiresAtStr = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expiresAt = Number(expiresAtStr);
  if (!Number.isFinite(expiresAt) || Math.floor(Date.now() / 1000) > expiresAt) return false;
  const expected = await hmac(secret, `authed:${expiresAtStr}`);
  return constantTimeEqual(sig, expected);
}

async function makeAttemptsToken(secret: string, count: number, lockUntil: number): Promise<string> {
  const payload = `${count}:${lockUntil}`;
  const sig = await hmac(secret, `att:${payload}`);
  return `${payload}.${sig}`;
}

async function readAttempts(secret: string, cookieVal: string): Promise<{ count: number; lockUntil: number }> {
  const dot = cookieVal.lastIndexOf(".");
  if (dot === -1) return { count: 0, lockUntil: 0 };
  const payload = cookieVal.slice(0, dot);
  const sig = cookieVal.slice(dot + 1);
  const expected = await hmac(secret, `att:${payload}`);
  if (!constantTimeEqual(sig, expected)) return { count: 0, lockUntil: 0 };
  const [countStr, lockStr] = payload.split(":");
  return { count: Number(countStr) || 0, lockUntil: Number(lockStr) || 0 };
}

function pinPage(variant: "none" | "wrong" | "locked"): string {
  const message =
    variant === "locked"
      ? "Too many tries — wait a bit and try again"
      : variant === "wrong"
        ? "Not quite &mdash; try again"
        : "";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="robots" content="noindex, nofollow" />
<title>For Vika</title>
<style>
  body { margin:0; min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#faf3e6; font-family: Georgia, serif; color:#3a2a14; text-align:center; padding:0 16px; }
  .kicker { font-size:11px; letter-spacing:0.3em; text-transform:uppercase; color:#a97a2e; margin-bottom:24px; font-weight:600; }
  h1 { font-size:32px; margin:0 0 32px; font-weight:400; }
  input { width:200px; text-align:center; letter-spacing:0.4em; font-size:18px; padding:12px 0; border-radius:999px; border:1px solid rgba(201,162,75,0.6); background:rgba(255,255,255,0.6); color:#3a2a14; margin-bottom:24px; }
  input:focus { outline:none; border-color:#c9a24b; }
  button { padding:12px 32px; border-radius:999px; border:1px solid rgba(201,162,75,0.6); background:transparent; color:#3a2a14; font-family: Georgia, serif; letter-spacing:0.15em; text-transform:uppercase; font-size:13px; font-weight:600; cursor:pointer; }
  button:hover { background:rgba(201,162,75,0.1); border-color:#c9a24b; }
  .error { margin-top:20px; font-size:10px; color:#a9455d; text-transform:uppercase; letter-spacing:0.15em; font-weight:500; height:14px; }
</style>
</head>
<body>
  <div class="kicker">For Vika</div>
  <h1>Enter your code</h1>
  <form id="f">
    <div><input id="pin" type="password" inputmode="numeric" autofocus /></div>
    <button type="submit">Unlock</button>
    <div class="error">${message}</div>
  </form>
  <script>
    document.getElementById("f").addEventListener("submit", async (e) => {
      e.preventDefault();
      const pin = document.getElementById("pin").value;
      const res = await fetch("/api/verify-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      if (res.ok) {
        location.href = "/";
      } else if (res.status === 429) {
        location.href = "/?e=locked";
      } else {
        location.href = "/?e=wrong";
      }
    });
  </script>
</body>
</html>`;
}

export default async (request: Request, context: { next: () => Promise<Response> }) => {
  const url = new URL(request.url);

  if (PASSTHROUGH_PATHS.has(url.pathname)) {
    return context.next();
  }

  const secret = Deno.env.get("SITE_PIN");
  if (!secret) {
    // Fail closed: without a configured PIN, don't accidentally expose the site.
    return new Response("Site not configured", { status: 503 });
  }

  const cookieHeader = request.headers.get("cookie") ?? "";

  if (url.pathname === "/api/verify-pin" && request.method === "POST") {
    const now = Math.floor(Date.now() / 1000);
    const { count, lockUntil } = await readAttempts(secret, getCookie(cookieHeader, ATTEMPTS_COOKIE));

    if (lockUntil > now) {
      return new Response("Too many attempts", {
        status: 429,
        headers: { "Retry-After": String(lockUntil - now), "Cache-Control": "no-store" },
      });
    }

    const body = await request.json().catch(() => null);
    const pin = typeof body?.pin === "string" ? body.pin : "";
    const ok = await pinMatches(secret, pin);

    if (!ok) {
      const newCount = count + 1;
      const newLockUntil = newCount >= MAX_ATTEMPTS ? now + LOCKOUT_SECONDS : 0;
      const token = await makeAttemptsToken(secret, newLockUntil > 0 ? 0 : newCount, newLockUntil);
      const headers = new Headers();
      headers.append(
        "Set-Cookie",
        `${ATTEMPTS_COOKIE}=${token}; Path=/; Max-Age=${ATTEMPTS_COOKIE_MAX_AGE}; HttpOnly; Secure; SameSite=Strict`,
      );
      headers.set("Cache-Control", "no-store");
      return new Response("Invalid PIN", { status: 401, headers });
    }

    const expiresAt = now + SESSION_TTL_SECONDS;
    const authToken = await makeAuthToken(secret, expiresAt);
    const headers = new Headers();
    headers.append(
      "Set-Cookie",
      `${COOKIE_NAME}=${authToken}; Path=/; Max-Age=${SESSION_TTL_SECONDS}; HttpOnly; Secure; SameSite=Strict`,
    );
    headers.append("Set-Cookie", `${ATTEMPTS_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict`);
    headers.set("Cache-Control", "no-store");
    return new Response("ok", { status: 200, headers });
  }

  const authed = await verifyAuthToken(secret, getCookie(cookieHeader, COOKIE_NAME));
  if (authed) {
    return context.next();
  }

  const e = url.searchParams.get("e");
  const variant = e === "locked" ? "locked" : e === "wrong" ? "wrong" : "none";
  return new Response(pinPage(variant), {
    status: 401,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
};

export const config = { path: "/*" };
