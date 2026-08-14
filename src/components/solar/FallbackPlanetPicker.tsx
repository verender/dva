import { planets } from "../../data/planets";
import type { Target } from "../../state/journey";

type FallbackPlanetPickerProps = {
  onSelect: (target: Target) => void;
  visited: Set<Target>;
};

// Mandatory non-WebGL / reduced-motion path — shares the exact same data and
// PlanetDetailPanel as the 3D constellation; only the "pick a planet"
// affordance differs (a grid instead of drag-to-orbit).
export default function FallbackPlanetPicker({ onSelect, visited }: FallbackPlanetPickerProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-6 py-24 overflow-y-auto">
      <div className="w-full max-w-3xl">
        <p className="mb-8 text-center text-xs uppercase tracking-[0.3em] text-white/70">
          Tap each one to unveil your story
        </p>
        <button onClick={() => onSelect("sun")} className="mx-auto mb-10 flex flex-col items-center gap-2 group">
          <div
            className={`h-24 w-24 rounded-full bg-gradient-to-br from-[#f3d68a] to-[#c9a24b] shadow-[0_0_40px_rgba(232,185,120,0.5)] transition group-hover:scale-105 ${
              visited.has("sun") ? "ring-2 ring-offset-4 ring-offset-transparent ring-[#f3d68a]" : ""
            }`}
          />
          <span className="text-xs uppercase tracking-widest text-white/80">You</span>
        </button>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {planets.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelect(p.id)}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md hover:bg-white/10 hover:border-white/25 transition"
            >
              <div
                className="h-14 w-14 rounded-full flex items-center justify-center text-2xl shadow-lg transition group-hover:scale-110"
                style={{
                  background: p.color,
                  boxShadow: visited.has(p.id) ? `0 0 0 3px ${p.color}88` : undefined,
                }}
              >
                {p.icon}
              </div>
              <span className="text-xs uppercase tracking-widest text-white/80 text-center">{p.name.en}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
