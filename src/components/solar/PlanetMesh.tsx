import { useRef } from "react";
import { Billboard, Html } from "@react-three/drei";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import type { Mesh, MeshBasicMaterial } from "three";
import type { Planet } from "../../data/planets";

type PlanetMeshProps = {
  planet: Planet;
  label: string;
  visited: boolean;
  showLabel: boolean;
  onSelect: () => void;
};

export default function PlanetMesh({ planet, label, visited, showLabel, onSelect }: PlanetMeshProps) {
  const pulseRef = useRef<Mesh>(null);

  // Unvisited planets breathe a soft pulsing halo to invite the click; once
  // visited it settles into a steady glow as quiet confirmation.
  useFrame(({ clock }) => {
    if (!pulseRef.current || visited) return;
    const t = clock.getElapsedTime();
    const pulse = 1.35 + Math.sin(t * 2.2) * 0.18;
    pulseRef.current.scale.setScalar(pulse);
    (pulseRef.current.material as MeshBasicMaterial).opacity = 0.32 + Math.sin(t * 2.2) * 0.14;
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect();
  };

  return (
    <group onClick={handleClick}>
      <mesh>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial color={planet.color} roughness={0.5} metalness={0.1} />
      </mesh>
      <mesh ref={pulseRef} scale={visited ? 1.4 : 1.35}>
        <sphereGeometry args={[0.42, 24, 24]} />
        <meshBasicMaterial color={planet.color} transparent opacity={visited ? 0.2 : 0.3} depthWrite={false} />
      </mesh>
      {showLabel && (
        <Billboard position={[0, 0.75, 0]}>
          <Html center distanceFactor={8}>
            <div className="pointer-events-none select-none whitespace-nowrap text-xs font-semibold uppercase tracking-widest text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              {planet.icon} {label}
              {!visited && <span className="ml-1 opacity-70">· tap</span>}
            </div>
          </Html>
        </Billboard>
      )}
    </group>
  );
}
