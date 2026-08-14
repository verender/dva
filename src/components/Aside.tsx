import { useEffect, useState } from "react";

type AsideProps = {
  lines?: string[];
};

// Ported from valentine/src/components/Whisper.jsx — same delayed fade-in
// single-line caption logic, renamed since there's no "whisper" concept here.
export default function Aside({ lines = [] }: AsideProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 1800);
    return () => clearTimeout(timeout);
  }, []);

  if (!visible || !lines.length) return null;

  return (
    <div className="mt-8 flex justify-center animate-fade-in">
      <div className="px-6 py-3 rounded-full bg-white/60 backdrop-blur-sm border border-[#c9a24b]/30 shadow-md">
        <p className="text-lg italic text-[#6b3f1d] font-serif tracking-wide">
          ~ {lines[Math.floor(Math.random() * lines.length)]} ~
        </p>
      </div>
    </div>
  );
}
