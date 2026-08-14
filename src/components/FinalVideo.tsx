type FinalVideoProps = {
  src: string;
  onPlay?: () => void;
  onPause?: () => void;
};

// Adapted from valentine/src/components/FinalVideo.jsx — same
// onPlay/onPause -> pause-ambient-music coordination, warm gold glow instead
// of the red one.
export default function FinalVideo({ src, onPlay, onPause }: FinalVideoProps) {
  return (
    <div className="w-full flex justify-center md:justify-end">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-tr from-[#c9a24b]/40 via-[#e8b978]/20 to-[#c9a24b]/40 rounded-2xl blur-md opacity-80 group-hover:opacity-100 transition duration-1000" />

        <video
          src={src}
          controls
          playsInline
          className="relative w-full max-w-[260px] md:max-w-[280px] h-auto rounded-2xl shadow-[0_0_40px_rgba(201,162,75,0.35)] border border-[#c9a24b]/50 bg-black"
          onPlay={onPlay}
          onPause={onPause}
          onEnded={onPause}
        />
      </div>
    </div>
  );
}
