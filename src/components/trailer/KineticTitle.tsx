import { motion } from "framer-motion";

type KineticTitleProps = {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "div";
};

// Staggered letter reveal — used by the Trailer's title card and reused by
// WrappedCard's language of "kinetic type" throughout the finale.
export default function KineticTitle({ text, className = "", delay = 0, as = "h1" }: KineticTitleProps) {
  const letters = Array.from(text);
  const MotionTag = as === "h2" ? motion.h2 : as === "div" ? motion.div : motion.h1;

  return (
    <MotionTag className={className} aria-label={text}>
      {letters.map((ch, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: delay + i * 0.045, ease: "easeOut" }}
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {ch}
        </motion.span>
      ))}
    </MotionTag>
  );
}
