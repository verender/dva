import { loc, type LocalizedText } from "./types";
import type { PlanetId } from "./planets";

export type ComplimentChapter = {
  id: string;
  kicker: LocalizedText; // "I", "II", "III"... or a short label
  theme: LocalizedText; // "Your Words", "Your Style", "Your Team"...
  title: LocalizedText;
  paragraphs: LocalizedText[];
  image: string;
  planet: PlanetId | "sun";
};

// PLACEHOLDER CONTENT — swap in real verses once the tone/structure is approved.
// Each chapter belongs to one planet (or "sun" for content about her as a
// whole) and is surfaced inside that planet's detail panel in the
// constellation, grouped at render time via `.filter(c => c.planet === id)`.
export const compliments: ComplimentChapter[] = [
  {
    id: "her-words",
    kicker: loc("I"),
    theme: loc("Your Words"),
    title: loc("Placeholder Title — Your Words"),
    paragraphs: [
      loc("Placeholder paragraph about your intelligence and the way you think."),
      loc("A second placeholder paragraph, replace with real verses."),
    ],
    image: "/photos/compliments/mind.png",
    planet: "her-words",
  },
  {
    id: "her-beauty",
    kicker: loc("II"),
    theme: loc("Your Beauty"),
    title: loc("Placeholder Title — Your Beauty"),
    paragraphs: [
      loc("Placeholder paragraph about your beauty."),
      loc("A second placeholder paragraph, replace with real verses."),
    ],
    image: "/photos/compliments/beauty.png",
    planet: "sun",
  },
  {
    id: "her-team",
    kicker: loc("III"),
    theme: loc("Your Team"),
    title: loc("Placeholder Title — Your Competitive Spirit"),
    paragraphs: [
      loc(
        "Placeholder — one playful, grounded paragraph about you being sporty, " +
          "loving football, and cheering for Real Madrid. Keep it warm and specific, " +
          "not the whole site's theme, just one true thing about you."
      ),
    ],
    image: "/photos/compliments/football.png",
    planet: "her-team",
  },
  {
    id: "her-style",
    kicker: loc("IV"),
    theme: loc("Your Style"),
    title: loc("Placeholder Title — Your Style"),
    paragraphs: [
      loc("Placeholder paragraph about your sense of fashion."),
      loc("A second placeholder paragraph, replace with real verses."),
    ],
    image: "/photos/compliments/style.png",
    planet: "her-style",
  },
  {
    id: "sea-sun",
    kicker: loc("V"),
    theme: loc("Sea & Sun"),
    title: loc("Placeholder Title — Sea & Sun"),
    paragraphs: [
      loc("Placeholder — a paragraph about how you light up near the water, replace with a real memory of you at the beach."),
    ],
    image: "/photos/compliments/sea.jpg",
    planet: "sea-sun",
  },
  {
    id: "wanderlust",
    kicker: loc("VI"),
    theme: loc("Wanderlust"),
    title: loc("Placeholder Title — Wanderlust"),
    paragraphs: [
      loc("Placeholder — a paragraph about the places you dream of going, replace with real plans or shared dreams."),
    ],
    image: "/photos/compliments/travel.jpg",
    planet: "wanderlust",
  },
];
