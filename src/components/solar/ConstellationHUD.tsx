import { motion } from "framer-motion";
import { planets } from "../../data/planets";
import type { Target } from "../../state/journey";

type ConstellationHUDProps = {
  visited: Set<Target>;
  onGoWrapped: () => void;
};

// Progress is quiet and spatial (a dot row here, a glow-ring on visited
// planet meshes) — never a popup, never a checklist. Wrapped is always
// reachable, never gated on visiting all planets.
export default function ConstellationHUD({ visited, onGoWrapped }: ConstellationHUDProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-6 md:p-10">
      <div className="pointer-events-auto flex justify-center gap-2">
        <span
          className={`h-2 w-2 rounded-full transition ${visited.has("sun") ? "bg-[#e8b978]" : "bg-white/25"}`}
          title="You"
        />
        {planets.map((p) => (
          <span
            key={p.id}
            className={`h-2 w-2 rounded-full transition ${visited.has(p.id) ? "bg-[#e8b978]" : "bg-white/25"}`}
            title={p.name.en}
          />
        ))}
      </div>

      <div className="pointer-events-auto flex flex-col items-center gap-3">
        <motion.p
          animate={visited.size === 0 ? { opacity: [0.75, 1, 0.75] } : { opacity: 0.85 }}
          transition={visited.size === 0 ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" } : { duration: 0.6 }}
          className={`max-w-[92vw] text-center rounded-2xl sm:rounded-full border border-white/25 bg-[#0a1128]/50 backdrop-blur-md uppercase tracking-[0.15em] sm:tracking-[0.3em] text-white shadow-lg ${
            visited.size === 0 ? "text-[10px] sm:text-xs font-semibold px-4 sm:px-5 py-2" : "text-[9px] sm:text-[10px] px-3 sm:px-4 py-1.5"
          }`}
        >
          Click each planet to unveil your story &bull; drag to orbit
        </motion.p>
        <button
          onClick={onGoWrapped}
          className="rounded-full border border-[#c9a24b]/60 bg-[#0a1128]/40 backdrop-blur-md px-6 py-3 text-xs font-semibold uppercase tracking-widest text-[#faf3e6] hover:bg-[#c9a24b]/20 hover:border-[#c9a24b] transition"
        >
          Continue to your two years in numbers →
        </button>
      </div>
    </div>
  );
}
