import { stats, daysTogether } from "../../data/stats";
import type { Lang } from "../../data/types";
import WrappedCard from "./WrappedCard";

type WrappedSequenceProps = {
  lang: Lang;
  onDone: () => void;
};

// Spotify-Wrapped-style full-bleed stat cards on native CSS scroll-snap —
// no swipe-gesture library needed.
export default function WrappedSequence({ lang, onDone }: WrappedSequenceProps) {
  const days = daysTogether();

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto snap-y snap-mandatory bg-[#0a1128]">
      <section className="relative h-screen w-full snap-start flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-[#0a1128] to-[#3a2a14]">
        <div className="text-xs uppercase tracking-[0.3em] text-[#e8b978] mb-4 font-semibold">Two Years</div>
        <h2 className="font-serif text-4xl md:text-6xl text-white">In Numbers</h2>
        <p className="mt-6 rounded-full border border-white/25 bg-[#0a1128]/50 backdrop-blur-md px-4 py-1.5 text-xs uppercase tracking-widest text-white/90 shadow-lg animate-pulse">
          ↓ Scroll
        </p>
      </section>

      {stats.map((stat) => (
        <WrappedCard key={stat.id} stat={stat} days={days} lang={lang} />
      ))}

      <section className="relative h-screen w-full snap-start flex flex-col items-center justify-center text-center px-6 bg-[#faf3e6]">
        <p className="font-serif text-2xl md:text-3xl text-[#6b3f1d] italic mb-10 max-w-xl">
          And here's to every day still ahead.
        </p>
        <button
          onClick={onDone}
          className="rounded-full border border-[#c9a24b]/60 bg-white/40 px-8 py-3 text-xs font-semibold uppercase tracking-widest text-[#3a2a14] hover:bg-[#c9a24b]/10 hover:border-[#c9a24b] transition"
        >
          Continue
        </button>
      </section>
    </div>
  );
}
