import { useEffect, useRef } from "react";

type AmbientAudioProps = {
  src: string;
  isMuted: boolean;
  pauseSignal: boolean;
  hasStarted: boolean;
};

// Ported near-verbatim from valentine/src/components/AmbientAudio.jsx — the
// hasStarted user-gesture gate + rejected-promise catch is the correct,
// already-proven pattern for browser autoplay policy.
export default function AmbientAudio({ src, isMuted, pauseSignal, hasStarted }: AmbientAudioProps) {
  const ref = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    const a = ref.current;
    if (!a) return;

    if (hasStarted && !pauseSignal) {
      a.loop = true;
      a.volume = 0;
      a.play().catch((e) => console.log("Audio play failed:", e));

      const fadeIn = setInterval(() => {
        if (a.volume < 0.35) a.volume = Math.min(0.35, a.volume + 0.05);
        else clearInterval(fadeIn);
      }, 200);

      return () => clearInterval(fadeIn);
    }
  }, [hasStarted, pauseSignal]);

  useEffect(() => {
    const a = ref.current;
    if (!a) return;

    if (pauseSignal) {
      a.pause();
    } else if (hasStarted && a.paused) {
      a.play().catch(() => {});
    }
  }, [pauseSignal, hasStarted]);

  return <audio ref={ref} src={src} />;
}
