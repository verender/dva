import { loc, type LocalizedText } from "./types";

export type PlanetId = "sea-sun" | "her-team" | "her-style" | "her-words" | "wanderlust";

export type Planet = {
  id: PlanetId;
  name: LocalizedText;
  tagline: LocalizedText;
  color: string;
  icon: string;
};

// Registry order also drives orbit order (closest to farthest from the Sun).
export const planets: Planet[] = [
  {
    id: "sea-sun",
    name: loc("Sea & Sun"),
    tagline: loc("Salt air, warm light, and you at your most free."),
    color: "#3aa7c9",
    icon: "🌊",
  },
  {
    id: "her-team",
    name: loc("Your Team"),
    tagline: loc("Real Madrid, every match, no half-measures."),
    color: "#5e3a9e",
    icon: "⚽",
  },
  {
    id: "her-style",
    name: loc("Your Style"),
    tagline: loc("An eye for beauty that finds you before it finds anything else."),
    color: "#c9a24b",
    icon: "✨",
  },
  {
    id: "her-words",
    name: loc("Your Words"),
    tagline: loc("Poems, pages, and a mind that never stops reading."),
    color: "#a9455d",
    icon: "📖",
  },
  {
    id: "wanderlust",
    name: loc("Wanderlust"),
    tagline: loc("Every place you haven't seen yet, already half-loved."),
    color: "#4a8f5c",
    icon: "✈️",
  },
];

export const planetsById = new Map(planets.map((p) => [p.id, p]));
