import { motion } from "framer-motion";
import GlassCard from "../GlassCard";
import { compliments } from "../../data/compliments";
import { memories } from "../../data/memories";
import { planetsById } from "../../data/planets";
import { t, type Lang } from "../../data/types";
import type { Target } from "../../state/journey";

type PlanetDetailPanelProps = {
  target: Target;
  lang: Lang;
  onBack: () => void;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" });

// Shared identically between the 3D constellation and the non-WebGL
// fallback picker — only the "pick a planet" affordance differs upstream.
export default function PlanetDetailPanel({ target, lang, onBack }: PlanetDetailPanelProps) {
  const planet = target === "sun" ? null : (planetsById.get(target) ?? null);
  const chapters = compliments.filter((c) => c.planet === target);
  const relatedMemories = memories.filter((m) => m.planet === target);
  const isTeam = target === "her-team";

  const name = target === "sun" ? "You" : planet ? t(planet.name, lang) : target;
  const tagline = target === "sun" ? "The center of all of it." : planet ? t(planet.tagline, lang) : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 z-30 overflow-y-auto"
    >
      <div className="mx-auto max-w-3xl px-5 py-24 md:py-32">
        <button
          onClick={onBack}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/30 bg-[#0a1128]/40 backdrop-blur-md px-5 py-2 text-xs uppercase tracking-widest text-white hover:bg-white/10 transition"
        >
          ← Back to the constellation
        </button>

        <div className="text-center mb-12 flex flex-col items-center gap-3">
          <div className="inline-block rounded-full border border-white/10 bg-[#0a1128]/45 backdrop-blur-md px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-[#e8b978] font-semibold">
            {tagline}
          </div>
          <h2 className="inline-block rounded-3xl bg-[#0a1128]/30 backdrop-blur-md px-6 py-2 font-serif text-4xl md:text-6xl text-white">
            {name}
          </h2>
        </div>

        <div className="space-y-8">
          {chapters.map((chapter) => (
            <GlassCard key={chapter.id} variant={isTeam ? "team" : "default"}>
              <div className="flex items-center gap-3 mb-5">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-serif text-xs font-semibold ${
                    isTeam ? "bg-[#c9a24b]/20 text-[#f3d68a]" : "bg-[#c9a24b]/15 text-[#a97a2e]"
                  }`}
                >
                  {t(chapter.kicker, lang)}
                </span>
                <span className={`h-px flex-1 ${isTeam ? "bg-[#c9a24b]/30" : "bg-[#c9a24b]/20"}`} />
              </div>
              <h3 className={`font-serif text-2xl md:text-3xl mb-5 ${isTeam ? "text-white" : "text-[#3a2a14]"}`}>
                {t(chapter.title, lang)}
              </h3>
              <div
                className={`space-y-4 text-base md:text-lg font-light leading-relaxed ${
                  isTeam ? "text-white/85" : "text-[#4a3823]"
                }`}
              >
                {chapter.paragraphs.map((p, i) => (
                  <p key={i} className={i === 0 ? "drop-cap" : ""}>
                    {t(p, lang)}
                  </p>
                ))}
              </div>
            </GlassCard>
          ))}

          {relatedMemories.map((memory) => (
            <GlassCard
              key={memory.id}
              variant={isTeam ? "team" : "default"}
              className="flex flex-col md:flex-row gap-6 md:gap-8 items-center"
            >
              <div className="relative w-full md:w-56 shrink-0">
                <img
                  src={memory.photo}
                  alt={t(memory.photoAlt, lang)}
                  className="w-full h-44 object-cover rounded-2xl shadow-lg"
                />
                <span className="absolute -bottom-3 left-3 rounded-full bg-[#3a2a14] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#f3d68a] shadow-md">
                  {dateFormatter.format(new Date(memory.date))}
                </span>
              </div>
              <div className="pt-3 md:pt-0">
                <h3 className={`font-serif text-xl mb-2 ${isTeam ? "text-white" : "text-[#3a2a14]"}`}>
                  {t(memory.title, lang)}
                </h3>
                <p className={`font-light leading-relaxed ${isTeam ? "text-white/85" : "text-[#4a3823]"}`}>
                  {t(memory.caption, lang)}
                </p>
              </div>
            </GlassCard>
          ))}

          {chapters.length === 0 && relatedMemories.length === 0 && (
            <GlassCard variant={isTeam ? "team" : "default"}>
              <p className={`font-light italic text-center ${isTeam ? "text-white/70" : "text-[#4a3823]"}`}>
                More to come here soon.
              </p>
            </GlassCard>
          )}
        </div>
      </div>
    </motion.div>
  );
}
