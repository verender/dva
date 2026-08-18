import { useEffect, useRef } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import type { StatEntry } from "../../data/stats";
import { t, type Lang } from "../../data/types";

type WrappedCardProps = {
  stat: StatEntry;
  days: number;
  lang: Lang;
};

function CountUp({ target }: { target: number }) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const count = useMotionValue(0);

  useEffect(() => {
    const controls = animate(count, target, { duration: 1.8, ease: "easeOut" });
    const unsubscribe = count.on("change", (v) => {
      if (spanRef.current) spanRef.current.textContent = Math.round(v).toLocaleString();
    });
    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [target, count]);

  return <span ref={spanRef}>0</span>;
}

export default function WrappedCard({ stat, days, lang }: WrappedCardProps) {
  const raw = stat.compute(days);
  const isNumeric = /^-?\d+$/.test(raw);

  return (
    <section
      className="relative h-screen w-full snap-start flex flex-col items-center justify-center text-center px-6"
      style={{ background: stat.background }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 0.8 }}
      >
        <div
          className={`font-serif text-white leading-none mb-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] ${
            stat.emphasis === "huge" ? "text-8xl md:text-[10rem]" : "text-7xl md:text-8xl"
          }`}
        >
          {isNumeric ? <CountUp target={Number(raw)} /> : raw}
        </div>
        <div className="text-sm md:text-base uppercase tracking-[0.3em] text-white/80 drop-shadow-[0_1px_6px_rgba(0,0,0,0.4)]">
          {t(stat.label, lang)}
        </div>
      </motion.div>
    </section>
  );
}
