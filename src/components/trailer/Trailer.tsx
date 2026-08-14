import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trailerBeats, trailerTitle, trailerSubtitle } from "../../data/trailer";
import { t, type Lang } from "../../data/types";
import KineticTitle from "./KineticTitle";

type TrailerProps = {
  lang: Lang;
  onDone: () => void;
};

// Rapid flash-cut sequence of real photos on a beat, then a big kinetic
// title reveal, then auto-advances into the constellation. No three.js here —
// keeps first paint light while the solar-system chunk streams in behind it.
export default function Trailer({ lang, onDone }: TrailerProps) {
  const [index, setIndex] = useState(0);
  const [showTitle, setShowTitle] = useState(trailerBeats.length === 0);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (showTitle) {
      const timeout = setTimeout(() => doneRef.current(), 3200);
      return () => clearTimeout(timeout);
    }
    if (index >= trailerBeats.length) {
      setShowTitle(true);
      return;
    }
    const beat = trailerBeats[index];
    const timeout = setTimeout(() => setIndex((i) => i + 1), beat.holdMs);
    return () => clearTimeout(timeout);
  }, [index, showTitle]);

  return (
    <div className="fixed inset-0 z-[90] bg-[#0a1128] overflow-hidden">
      <AnimatePresence mode="wait">
        {!showTitle && trailerBeats[index] && (
          <motion.img
            key={index}
            src={trailerBeats[index].photo}
            alt={t(trailerBeats[index].photoAlt, lang)}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/60 pointer-events-none" />

      {showTitle && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
          className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a1128]"
        >
          <KineticTitle
            text={t(trailerTitle, lang)}
            as="h1"
            className="font-serif text-6xl md:text-8xl text-[#faf3e6] mb-2"
          />
          <KineticTitle
            text={t(trailerSubtitle, lang)}
            as="div"
            delay={0.6}
            className="text-sm md:text-base uppercase tracking-[0.5em] text-[#c9a24b]"
          />
        </motion.div>
      )}

      {!showTitle && (
        <button
          onClick={() => setIndex(trailerBeats.length)}
          className="absolute bottom-8 right-8 text-[10px] uppercase tracking-[0.3em] text-white/60 hover:text-white transition z-10"
        >
          Skip
        </button>
      )}
    </div>
  );
}
