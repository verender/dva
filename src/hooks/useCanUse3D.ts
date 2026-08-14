import { useEffect, useState } from "react";

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

// Mandatory fallback gate: reduced-motion users and anything without real
// WebGL goes straight to FallbackPlanetPicker instead of mounting the Canvas.
// `disable` is also handed to the canvas error boundary / context-loss
// listener so a mid-session GPU failure degrades gracefully too.
export function useCanUse3D(): [boolean, () => void] {
  const [ok, setOk] = useState(true);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setOk(!reducedMotion && detectWebGL());
  }, []);

  const disable = () => setOk(false);
  return [ok, disable];
}
