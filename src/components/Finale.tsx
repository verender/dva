import { motion } from "framer-motion";
import FinalVideo from "./FinalVideo";

type FinaleProps = {
  onVideoPlay: () => void;
  onVideoPause: () => void;
};

// New — closing message + signature, embeds the adapted FinalVideo.
// Video/message copy is placeholder until real content is gathered.
export default function Finale({ onVideoPlay, onVideoPause }: FinaleProps) {
  const epilogue = [
    "Two years in, and it still feels like the beginning.",
    "I love you more today than the day this started — and that's saying something.",
  ];

  return (
    <section className="relative py-32 bg-[#faf3e6]" id="finale">
      <div className="mx-auto max-w-4xl px-6">
        <div className="rounded-3xl border border-[#c9a24b]/30 bg-white/80 p-8 md:p-12 shadow-2xl backdrop-blur-md">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="text-center md:text-left order-2 md:order-1">
              <div className="text-xs uppercase tracking-[0.25em] text-[#a97a2e] mb-3 font-semibold">
                For Vika
              </div>

              <h2 className="font-serif text-4xl md:text-5xl text-[#3a2a14] mb-6">Two Years, In Frame</h2>

              <div className="space-y-4 text-lg text-[#4a3823] font-light leading-relaxed mb-6">
                <p className="drop-cap">
                  Placeholder closing message — replace with the real thing once you're ready to write it.
                </p>
              </div>

              <p className="text-[#3a2a14]/40 font-light text-xs italic tracking-wide">
                ( Video message optional — replace src in Finale.tsx )
              </p>
            </div>

            <div className="order-1 md:order-2">
              <FinalVideo src="/video/placeholder.mp4" onPlay={onVideoPlay} onPause={onVideoPause} />
            </div>
          </div>

          <div className="mt-16 text-center space-y-4 border-t border-[#c9a24b]/20 pt-10">
            {epilogue.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.4, duration: 1 }}
                className="font-serif text-2xl md:text-3xl text-[#6b3f1d] italic leading-relaxed"
              >
                {line}
              </motion.p>
            ))}
          </div>
        </div>

        <p className="mt-16 text-center text-xs text-[#3a2a14]/40 uppercase tracking-widest font-medium">
          Made with love by Francesco for Vika
        </p>
      </div>
    </section>
  );
}
