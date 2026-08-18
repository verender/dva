import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trailerBeats, trailerTitle, trailerSubtitle } from "../../data/trailer";
import { t, type Lang } from "../../data/types";
import KineticTitle from "./KineticTitle";
import TrailerStarfield from "./TrailerStarfield";

type TrailerProps = {
  lang: Lang;
  onDone: () => void;
};

// How many photos linger on screen together, and how long each new one
// takes to arrive — slow enough to actually register a face/place, unlike
// the original one-at-a-time full-bleed flash-cut.
const MAX_ON_SCREEN = 3;
const FRAME_HOLD_MS = 900;

// Scatter offsets per on-screen slot (not per photo) so the trio always
// reads as a loose, natural polaroid cluster regardless of which photos
// currently occupy those slots.
const SLOT_LAYOUT = [
  { x: "-24%", y: "-4%", rotate: -7, scale: 0.88, z: 1 },
  { x: "4%", y: "3%", rotate: 2, scale: 1, z: 3 },
  { x: "26%", y: "-6%", rotate: 8, scale: 0.86, z: 2 },
];

// Per-photo entrance styles, cycled by beat index so the same photo always
// arrives the same way even as it moves between slots, and 13 photos in a
// row don't all repeat the same fade-and-settle.
const ENTRANCE_VARIANTS = [
  { dx: 110, dy: -20, rotateDelta: -8, scaleStart: 0.78 }, // slides in from the right
  { dx: -110, dy: 20, rotateDelta: 8, scaleStart: 0.78 }, // slides in from the left
  { dx: 0, dy: -90, rotateDelta: -3, scaleStart: 0.85 }, // drops from above
  { dx: 0, dy: 90, rotateDelta: 3, scaleStart: 0.85 }, // rises from below
  { dx: 0, dy: 0, rotateDelta: 0, scaleStart: 1.35, blurStart: 14 }, // materializes out of focus
  { dx: 0, dy: 0, rotateDelta: 0, scaleStart: 0.9, rotateYStart: 110 }, // flips into place
];

// A trailing window of up to MAX_ON_SCREEN beat indices ending at frame k —
// ramps up from one photo, holds at three, then drains back to zero as the
// sequence runs out, so entry and exit both feel deliberate.
function framePhotos(k: number): number[] {
  const start = Math.max(0, k - MAX_ON_SCREEN + 1);
  const end = Math.min(k, trailerBeats.length - 1);
  const indices: number[] = [];
  for (let i = start; i <= end; i++) indices.push(i);
  return indices;
}

const TOTAL_FRAMES = trailerBeats.length + MAX_ON_SCREEN - 1;

// Rapid-but-readable collage of real photos on a beat, then a big kinetic
// title reveal, then auto-advances into the constellation. No three.js here —
// keeps first paint light while the solar-system chunk streams in behind it.
export default function Trailer({ lang, onDone }: TrailerProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [showTitle, setShowTitle] = useState(trailerBeats.length === 0);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (showTitle) {
      const timeout = setTimeout(() => doneRef.current(), 3200);
      return () => clearTimeout(timeout);
    }
    if (frameIndex >= TOTAL_FRAMES) {
      setShowTitle(true);
      return;
    }
    const timeout = setTimeout(() => setFrameIndex((i) => i + 1), FRAME_HOLD_MS);
    return () => clearTimeout(timeout);
  }, [frameIndex, showTitle]);

  const frame = framePhotos(frameIndex);

  return (
    <div className="fixed inset-0 z-[90] bg-[#0a1128] overflow-hidden">
      <TrailerStarfield />

      {!showTitle && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: 1200 }}>
          <AnimatePresence>
            {frame.map((beatIndex, slot) => {
              const beat = trailerBeats[beatIndex];
              const pos = SLOT_LAYOUT[slot % SLOT_LAYOUT.length];
              const variant = ENTRANCE_VARIANTS[beatIndex % ENTRANCE_VARIANTS.length];
              return (
                <motion.div
                  key={beatIndex}
                  initial={{
                    opacity: 0,
                    scale: variant.scaleStart,
                    x: `calc(${pos.x} + ${variant.dx}px)`,
                    y: `calc(${pos.y} + ${variant.dy}px)`,
                    rotate: pos.rotate + variant.rotateDelta,
                    rotateY: variant.rotateYStart ?? 0,
                    filter: variant.blurStart ? `blur(${variant.blurStart}px)` : "blur(0px)",
                  }}
                  animate={{
                    opacity: 1,
                    scale: pos.scale,
                    x: pos.x,
                    y: pos.y,
                    rotate: pos.rotate,
                    rotateY: 0,
                    filter: "blur(0px)",
                  }}
                  exit={{ opacity: 0, scale: pos.scale * 0.9 }}
                  transition={{ duration: 0.65, ease: "easeOut" }}
                  className="absolute w-[46vw] max-w-sm aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                  style={{ zIndex: pos.z }}
                >
                  <img
                    src={beat.photo}
                    alt={t(beat.photoAlt, lang)}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

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
          onClick={() => setFrameIndex(TOTAL_FRAMES)}
          className="absolute bottom-8 right-8 text-[10px] uppercase tracking-[0.3em] text-white/60 hover:text-white transition z-10"
        >
          Skip
        </button>
      )}
    </div>
  );
}
