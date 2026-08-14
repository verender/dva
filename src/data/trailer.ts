import { loc, type LocalizedText } from "./types";
import { memories } from "./memories";

export type TrailerBeat = {
  photo: string;
  photoAlt: LocalizedText;
  holdMs: number;
};

export const trailerTitle: LocalizedText = loc("Two Years");
export const trailerSubtitle: LocalizedText = loc("In Frame");

// Untagged milestone memories double as the trailer's flash-cut source pool —
// nothing from data/memories.ts becomes orphaned by the planet regrouping.
export const trailerBeats: TrailerBeat[] = memories
  .filter((m) => !m.planet)
  .map((m) => ({ photo: m.photo, photoAlt: m.photoAlt, holdMs: 420 }));
