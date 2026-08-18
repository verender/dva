import { useMemo } from "react";
import { motion } from "framer-motion";

// Cheap CSS/SVG "stellar" backdrop for the trailer — twinkling points plus
// two slow-drifting nebula blobs in the site's existing gold/blue palette.
// No three.js here on purpose (see Trailer.tsx); this is pure DOM so it
// costs nothing before the solar-system chunk streams in.
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export default function TrailerStarfield() {
  const stars = useMemo(() => {
    const rand = seededRandom(42);
    return Array.from({ length: 70 }, (_, i) => ({
      id: i,
      x: rand() * 100,
      y: rand() * 100,
      size: rand() * 1.6 + 0.6,
      duration: rand() * 3 + 2,
      delay: rand() * 4,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute -top-1/4 -left-1/4 h-[70vmin] w-[70vmin] rounded-full bg-[#7ea2e8] opacity-[0.08] blur-[100px]"
        animate={{ x: ["0%", "12%", "0%"], y: ["0%", "8%", "0%"] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-1/4 -right-1/4 h-[60vmin] w-[60vmin] rounded-full bg-[#c9a24b] opacity-[0.08] blur-[100px]"
        animate={{ x: ["0%", "-10%", "0%"], y: ["0%", "-6%", "0%"] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      {stars.map((s) => (
        <motion.span
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
          animate={{ opacity: [0.15, 0.9, 0.15] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
