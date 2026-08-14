import { motion, AnimatePresence } from "framer-motion";

type GestureGateProps = {
  visible: boolean;
  title: string;
  onEnter: () => void;
};

// Extracted from the original Hero.tsx overlay — AmbientAudio's play() call
// needs to happen inside a user gesture, so this stays the first thing
// rendered regardless of which phase follows it.
export default function GestureGate({ visible, title, onEnter }: GestureGateProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.2 } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#faf3e6] text-center px-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
          >
            <div className="text-xs uppercase tracking-[0.3em] text-[#a97a2e] mb-6 font-semibold">For Vika</div>
            <h1 className="font-serif text-4xl md:text-6xl text-[#3a2a14] mb-8">{title}</h1>

            <button
              onClick={onEnter}
              className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-serif tracking-widest text-[#3a2a14] border border-[#c9a24b]/60 rounded-full transition-all duration-500 hover:bg-[#c9a24b]/10 hover:border-[#c9a24b] hover:scale-105"
            >
              <span className="relative z-10 text-sm uppercase font-semibold">Begin</span>
            </button>

            <p className="mt-8 text-[10px] text-[#3a2a14]/50 uppercase tracking-widest animate-pulse font-medium">
              ( Please turn on your sound )
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
