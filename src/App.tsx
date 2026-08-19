import { lazy, Suspense, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Lang } from "./data/types";
import { useJourney } from "./state/journey";
import { useCanUse3D } from "./hooks/useCanUse3D";
import AmbientAudio from "./components/AmbientAudio";
import GestureGate from "./components/GestureGate";
import Trailer from "./components/trailer/Trailer";
import ConstellationHUD from "./components/solar/ConstellationHUD";
import PlanetDetailPanel from "./components/solar/PlanetDetailPanel";
import FallbackPlanetPicker from "./components/solar/FallbackPlanetPicker";
import CanvasErrorBoundary from "./components/solar/CanvasErrorBoundary";
import WrappedSequence from "./components/wrapped/WrappedSequence";
import Finale from "./components/Finale";

const SolarSystemCanvas = lazy(() => import("./components/solar/SolarSystemCanvas"));

// lang is hardcoded during the English-first build phase (see CLAUDE.md /
// the anniversary plan). Flip this to state + a toggle UI only once the
// Ukrainian translation pass begins.
const lang: Lang = "en";

export default function App() {
  const [{ phase, visited }, dispatch] = useJourney();
  const [muted, setMuted] = useState(false);
  const [pauseMusic, setPauseMusic] = useState(false);
  const [can3D, disable3D] = useCanUse3D();

  const hasStarted = phase.kind !== "gate";

  // Prime the three.js chunk during the trailer's flash-cuts, not only once
  // the constellation is reached — Vite dedupes this against React.lazy's
  // later import() of the same specifier.
  useEffect(() => {
    if (phase.kind === "trailer") {
      import("./components/solar/SolarSystemCanvas");
    }
  }, [phase.kind]);

  useEffect(() => {
    const scrollable = phase.kind === "wrapped" || phase.kind === "finale" || phase.kind === "detail";
    document.body.style.overflow = scrollable ? "auto" : "hidden";
  }, [phase.kind]);

  const showHud = phase.kind === "constellation" || phase.kind === "detail" || phase.kind === "wrapped" || phase.kind === "finale";

  return (
    <div className="min-h-screen text-[#3a2a14] font-sans bg-[#0a1128]">
      <AmbientAudio src="/audio/audio.m4a" isMuted={muted} pauseSignal={pauseMusic} hasStarted={hasStarted} />

      <GestureGate
        visible={phase.kind === "gate"}
        title="Two Years, In Frame"
        onEnter={() => dispatch({ type: "BEGIN" })}
      />

      <AnimatePresence>
        {showHud && (
          <motion.header
            key="hud"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="fixed top-0 inset-x-0 z-50 flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-5 py-3 sm:py-4 pointer-events-none"
          >
            <div className="pointer-events-auto rounded-full bg-[#0a1128]/40 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 font-serif text-xs sm:text-sm text-white/90 whitespace-nowrap">
              <span className="hidden sm:inline">Two Years, In Frame</span>
              <span className="sm:hidden">Two Years</span>
            </div>
            <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
              {(phase.kind === "wrapped" || phase.kind === "finale") && (
                <button
                  className="rounded-full border border-white/20 bg-[#0a1128]/40 backdrop-blur-md px-2.5 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold text-white/90 hover:bg-white/10 transition uppercase tracking-wider whitespace-nowrap"
                  onClick={() => dispatch({ type: "REWIND" })}
                  title="Back to the constellation, in case you skipped a planet"
                >
                  ⟲ <span className="hidden sm:inline">Rewind</span>
                </button>
              )}
              <button
                className="rounded-full border border-white/20 bg-[#0a1128]/40 backdrop-blur-md px-2.5 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold text-white/90 hover:bg-white/10 transition uppercase tracking-wider whitespace-nowrap"
                onClick={() => setMuted((m) => !m)}
              >
                <span className="sm:hidden">{muted ? "♪ On" : "♪ Off"}</span>
                <span className="hidden sm:inline">{muted ? "Music On" : "Music Off"}</span>
              </button>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      <AnimatePresence mode="sync">
        {phase.kind === "trailer" && (
          <motion.div
            key="trailer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <Trailer lang={lang} onDone={() => dispatch({ type: "TRAILER_DONE" })} />
          </motion.div>
        )}

        {(phase.kind === "constellation" || phase.kind === "detail") && (
          <motion.div
            key="constellation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
            className="fixed inset-0 z-0 bg-gradient-to-b from-[#0a1128] via-[#151c3f] to-[#0a1128]"
          >
            {can3D ? (
              <CanvasErrorBoundary onError={disable3D}>
                <Suspense
                  fallback={
                    <div className="absolute inset-0 flex items-center justify-center text-white/60 text-xs uppercase tracking-widest">
                      Loading the constellation…
                    </div>
                  }
                >
                  <SolarSystemCanvas
                    target={phase.kind === "detail" ? phase.target : null}
                    onSelect={(target) => dispatch({ type: "SELECT", target })}
                    visited={visited}
                    lang={lang}
                    onFatalError={disable3D}
                  />
                </Suspense>
              </CanvasErrorBoundary>
            ) : (
              <FallbackPlanetPicker onSelect={(target) => dispatch({ type: "SELECT", target })} visited={visited} />
            )}

            {phase.kind === "constellation" && (
              <ConstellationHUD visited={visited} onGoWrapped={() => dispatch({ type: "GO_WRAPPED" })} />
            )}

            <AnimatePresence>
              {phase.kind === "detail" && (
                <PlanetDetailPanel
                  target={phase.target}
                  lang={lang}
                  onBack={() => dispatch({ type: "BACK_TO_CONSTELLATION" })}
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {phase.kind === "wrapped" && (
          <motion.div
            key="wrapped"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.9, ease: "easeInOut" } }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <WrappedSequence lang={lang} onDone={() => dispatch({ type: "WRAPPED_DONE" })} />
          </motion.div>
        )}

        {phase.kind === "finale" && (
          <motion.div
            key="finale"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          >
            <Finale onVideoPlay={() => setPauseMusic(true)} onVideoPause={() => setPauseMusic(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
