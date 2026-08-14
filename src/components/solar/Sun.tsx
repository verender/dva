import { useRef } from "react";
import { Billboard, Html } from "@react-three/drei";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import type { Group } from "three";

type SunProps = {
  onSelect: () => void;
  showLabel: boolean;
  visited: boolean;
};

// Fake glow via layered transparent/emissive spheres — cheaper than adding
// @react-three/postprocessing for one soft bloom.
export default function Sun({ onSelect, showLabel, visited }: SunProps) {
  const ref = useRef<Group>(null);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.05;
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect();
  };

  return (
    <group ref={ref} onClick={handleClick}>
      <mesh>
        <sphereGeometry args={[1.05, 32, 32]} />
        <meshStandardMaterial color="#f3c463" emissive="#e8b978" emissiveIntensity={1.4} />
      </mesh>
      <mesh scale={1.25}>
        <sphereGeometry args={[1.05, 24, 24]} />
        <meshBasicMaterial color="#f3d68a" transparent opacity={0.25} depthWrite={false} />
      </mesh>
      <mesh scale={1.55}>
        <sphereGeometry args={[1.05, 24, 24]} />
        <meshBasicMaterial color="#f3d68a" transparent opacity={0.12} depthWrite={false} />
      </mesh>
      <pointLight color="#ffdca0" intensity={3.5} distance={30} decay={1.4} />
      {showLabel && (
        <Billboard position={[0, 1.7, 0]}>
          <Html center distanceFactor={8}>
            <div className="pointer-events-none select-none whitespace-nowrap text-xs font-semibold uppercase tracking-widest text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              ☀ You
              {!visited && <span className="ml-1 opacity-70">· tap</span>}
            </div>
          </Html>
        </Billboard>
      )}
    </group>
  );
}
