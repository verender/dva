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
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days
const PASSTHROUGH_PATHS = new Set(["/robots.txt", "/favicon.ico"]);

async function hmac(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function pinPage(showError: boolean): string {
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
    <div class="error">${showError ? "Not quite &mdash; try again" : ""}</div>
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
      } else {
        location.href = "/?e=1";
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

  if (url.pathname === "/api/verify-pin" && request.method === "POST") {
    const body = await request.json().catch(() => null);
    const pin = typeof body?.pin === "string" ? body.pin : "";
    if (!timingSafeEqual(pin, secret)) {
      return new Response("Invalid PIN", { status: 401 });
    }
    const token = await hmac(secret, "authed");
    const headers = new Headers();
    headers.append(
      "Set-Cookie",
      `${COOKIE_NAME}=${token}; Path=/; Max-Age=${MAX_AGE_SECONDS}; HttpOnly; Secure; SameSite=Strict`,
    );
    return new Response("ok", { status: 200, headers });
  }

  const cookieHeader = request.headers.get("cookie") ?? "";
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  const token = match?.[1] ?? "";
  const expected = await hmac(secret, "authed");

  if (token && timingSafeEqual(token, expected)) {
    return context.next();
  }

  return new Response(pinPage(url.searchParams.get("e") === "1"), {
    status: 401,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
};

export const config = { path: "/*" };
