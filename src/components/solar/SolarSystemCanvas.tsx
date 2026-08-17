import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { CameraControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import Sun from "./Sun";
import PlanetMesh from "./PlanetMesh";
import { planets } from "../../data/planets";
import { t, type Lang } from "../../data/types";
import type { Target } from "../../state/journey";

type SolarSystemCanvasProps = {
  target: Target | null;
  onSelect: (t: Target) => void;
  visited: Set<Target>;
  lang: Lang;
  onFatalError: () => void;
};

const ORBIT_RADII = [3.0, 4.2, 5.4, 6.6, 7.8];

function OrbitRing({ radius }: { radius: number }) {
  return (
    <mesh rotation-x={Math.PI / 2}>
      <ringGeometry args={[radius - 0.015, radius + 0.015, 96]} />
      <meshBasicMaterial color="#c9a24b" transparent opacity={0.18} side={THREE.DoubleSide} />
    </mesh>
  );
}

// Registered as its own effect (not inline in onCreated) so the listener is
// torn down on unmount — otherwise the browser's webglcontextlost event,
// which also fires during ordinary canvas teardown (e.g. leaving the
// constellation for Wrapped), gets misread as a fatal GPU error and
// permanently pins the site onto the non-WebGL fallback for the rest of
// the session.
function ContextLossWatcher({ onFatalError }: { onFatalError: () => void }) {
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    const canvasEl = gl.domElement;
    const handleLost = (e: Event) => {
      e.preventDefault();
      onFatalError();
    };
    canvasEl.addEventListener("webglcontextlost", handleLost);
    return () => canvasEl.removeEventListener("webglcontextlost", handleLost);
  }, [gl, onFatalError]);
  return null;
}

type SceneProps = Omit<SolarSystemCanvasProps, "onFatalError">;

// Orbiting is paused whenever a target is focused (sun or a planet) so the
// camera dolly-in position stays valid without needing per-frame tracking.
function Scene({ target, onSelect, visited, lang }: SceneProps) {
  const controlsRef = useRef<CameraControls | null>(null);
  const anglesRef = useRef<number[]>(planets.map((_, i) => (i * Math.PI * 2) / planets.length));
  const groupRefs = useRef<(THREE.Group | null)[]>([]);
  const size = useThree((s) => s.size);

  useFrame((_, delta) => {
    if (target !== null) return;
    anglesRef.current = anglesRef.current.map((a, i) => a + delta * (0.16 - i * 0.018));
    planets.forEach((_, i) => {
      const g = groupRefs.current[i];
      if (!g) return;
      const r = ORBIT_RADII[i];
      const a = anglesRef.current[i];
      g.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
    });
  });

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    // On narrow viewports the outer orbits would otherwise clip past the
    // screen edges — pull the camera back proportionally so every planet
    // stays reachable. The default camera position was tuned on a
    // widescreen desktop (~16:9), so the pull-back is scaled to any aspect
    // narrower than that reference, not just portrait: a single continuous,
    // monotonically-decreasing formula (no separate portrait/landscape
    // branches) so there's no jump in framing as a device rotates or a
    // window is resized through aspect 1.
    const DESIGN_ASPECT = 16 / 9;
    const aspect = size.width / size.height;
    const widen = Math.max(1, DESIGN_ASPECT / aspect);
    if (target === null) {
      controls.setLookAt(0, 5.5 * widen, 12.5 * widen, 0, 0, 0, true);
    } else if (target === "sun") {
      controls.setLookAt(0, 1.1, 3, 0, 0, 0, true);
    } else {
      const i = planets.findIndex((p) => p.id === target);
      if (i === -1) return;
      const r = ORBIT_RADII[i];
      const a = anglesRef.current[i];
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;
      const dist = 2.1;
      controls.setLookAt(x + (x / r) * dist, 1.1, z + (z / r) * dist, x, 0, z, true);
    }
  }, [target, size.width, size.height]);

  return (
    <>
      <CameraControls
        ref={controlsRef}
        makeDefault
        minDistance={2.5}
        maxDistance={34}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.9}
      />
      <ambientLight intensity={0.35} />
      <Stars radius={60} depth={30} count={1400} factor={2.4} fade speed={0.4} />

      <Sun onSelect={() => onSelect("sun")} showLabel={target === null} visited={visited.has("sun")} />

      {planets.map((p, i) => (
        <group
          key={p.id}
          ref={(el) => {
            groupRefs.current[i] = el;
          }}
        >
          <PlanetMesh
            planet={p}
            label={t(p.name, lang)}
            visited={visited.has(p.id)}
            showLabel={target === null}
            onSelect={() => onSelect(p.id)}
          />
        </group>
      ))}

      {ORBIT_RADII.map((r, i) => (
        <OrbitRing key={i} radius={r} />
      ))}
    </>
  );
}

export default function SolarSystemCanvas({ target, onSelect, visited, lang, onFatalError }: SolarSystemCanvasProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 5.5, 12.5], fov: 45 }}
      gl={{ antialias: true, alpha: false }}
      onCreated={({ gl }) => {
        gl.setClearColor("#0a1128");
      }}
    >
      <ContextLossWatcher onFatalError={onFatalError} />
      <Suspense fallback={null}>
        <Scene target={target} onSelect={onSelect} visited={visited} lang={lang} />
      </Suspense>
    </Canvas>
  );
}
