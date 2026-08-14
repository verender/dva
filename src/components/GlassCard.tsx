import type { ReactNode } from "react";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  variant?: "default" | "team";
};

// Warm glass-card chrome extracted from the original Scene.tsx — shared by
// PlanetDetailPanel and FallbackPlanetPicker so the 3D UI chrome and the
// site's original aesthetic stay the same code, not a parallel restyle.
// "team" variant is a dark kit/crest look used only for the Her Team
// (Real Madrid) planet, so it reads distinct from every other card.
export default function GlassCard({ children, className = "", variant = "default" }: GlassCardProps) {
  if (variant === "team") {
    return (
      <div
        className={`relative overflow-hidden rounded-[2rem] p-8 md:p-12 bg-gradient-to-br from-[#1a1030] via-[#241542] to-[#150c26] border border-[#c9a24b]/40 shadow-[0_25px_70px_-25px_rgba(20,10,40,0.7)] backdrop-blur-lg transition-shadow duration-500 hover:shadow-[0_30px_80px_-20px_rgba(20,10,40,0.85)] ${className}`}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-[#c9a24b] to-transparent opacity-80" />
        <span className="pointer-events-none absolute top-6 right-6 text-3xl opacity-15 select-none">★</span>
        {children}
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] p-8 md:p-12 bg-gradient-to-br from-white/95 via-white/92 to-[#faf3e6]/85 border border-[#c9a24b]/25 shadow-[0_25px_70px_-25px_rgba(58,42,20,0.5)] backdrop-blur-lg transition-shadow duration-500 hover:shadow-[0_30px_80px_-20px_rgba(58,42,20,0.6)] ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-[#c9a24b] to-transparent opacity-70" />
      {children}
    </div>
  );
}
