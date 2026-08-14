import { loc, type LocalizedText } from "./types";
import type { PlanetId } from "./planets";

export type MemoryTag = "milestone" | "everyday" | "trip";

export type MemoryEntry = {
  id: string;
  date: string; // ISO "YYYY-MM-DD" — drives chronological order + day-count math
  title: LocalizedText;
  caption: LocalizedText;
  photo: string;
  photoAlt: LocalizedText;
  tag?: MemoryTag;
  // Tagged memories surface inside that planet's detail panel; untagged
  // milestone memories feed the trailer's flash-cuts and the Sun's detail view.
  planet?: PlanetId | "sun";
};

// PLACEHOLDER CONTENT — replace date/title/caption/photo with real ones once
// gathered. Keep the ids stable if they're referenced elsewhere (trailer.ts
// pulls untagged entries automatically; planet tags live on individual entries).
export const memories: MemoryEntry[] = [
  {
    id: "first-message",
    date: "2024-09-15",
    title: loc("Placeholder — The First Message"),
    caption: loc("Replace with the real story of how it started."),
    photo: "/photos/memories/placeholder-01.jpg",
    photoAlt: loc("Placeholder photo"),
    tag: "milestone",
  },
  {
    id: "first-date",
    date: "2024-09-14",
    title: loc("Placeholder — The First Date"),
    caption: loc("Replace with the real memory and a real photo."),
    photo: "/photos/memories/placeholder-02.jpg",
    photoAlt: loc("Placeholder photo"),
    tag: "milestone",
  },
  {
    id: "everyday-one",
    date: "2024-10-20",
    title: loc("Placeholder — An Ordinary Tuesday"),
    caption: loc("A small, everyday moment worth remembering."),
    photo: "/photos/memories/placeholder-03.jpg",
    photoAlt: loc("Placeholder photo"),
    tag: "everyday",
  },
  {
    id: "first-trip",
    date: "2024-12-10",
    title: loc("Placeholder — First Trip Together"),
    caption: loc("Where did you go? Replace with the real place and story."),
    photo: "/photos/memories/placeholder-04.jpg",
    photoAlt: loc("Placeholder photo"),
    tag: "trip",
    planet: "wanderlust",
  },
  {
    id: "winter",
    date: "2025-01-15",
    title: loc("Placeholder — A Winter Memory"),
    caption: loc("Replace with a real winter moment together."),
    photo: "/photos/memories/placeholder-05.jpg",
    photoAlt: loc("Placeholder photo"),
    tag: "everyday",
  },
  {
    id: "eight-march",
    date: "2025-03-08",
    title: loc("Placeholder — March 8th"),
    caption: loc("A nod to the earlier 8mar site — replace with this year's version."),
    photo: "/photos/memories/placeholder-06.jpg",
    photoAlt: loc("Placeholder photo"),
    tag: "milestone",
  },
  {
    id: "spring-trip",
    date: "2025-05-02",
    title: loc("Placeholder — Spring Trip"),
    caption: loc("Replace with a real trip memory."),
    photo: "/photos/memories/placeholder-07.jpg",
    photoAlt: loc("Placeholder photo"),
    tag: "trip",
    planet: "wanderlust",
  },
  {
    id: "everyday-two",
    date: "2025-06-18",
    title: loc("Placeholder — A Quiet Evening"),
    caption: loc("Another small everyday moment."),
    photo: "/photos/memories/placeholder-08.jpg",
    photoAlt: loc("Placeholder photo"),
    tag: "everyday",
  },
  {
    id: "one-year",
    date: "2025-09-15",
    title: loc("Placeholder — One Year Together"),
    caption: loc("Replace with how the first-anniversary day actually went."),
    photo: "/photos/memories/placeholder-09.jpg",
    photoAlt: loc("Placeholder photo"),
    tag: "milestone",
  },
  {
    id: "autumn",
    date: "2025-10-25",
    title: loc("Placeholder — Autumn Together"),
    caption: loc("Replace with a real autumn memory."),
    photo: "/photos/memories/placeholder-10.jpg",
    photoAlt: loc("Placeholder photo"),
    tag: "everyday",
  },
  {
    id: "holidays",
    date: "2025-12-25",
    title: loc("Placeholder — The Holidays"),
    caption: loc("Replace with a real holiday-season memory."),
    photo: "/photos/memories/placeholder-11.jpg",
    photoAlt: loc("Placeholder photo"),
    tag: "milestone",
  },
  {
    id: "valentine-day",
    date: "2026-02-14",
    title: loc("Placeholder — This Year's Valentine's"),
    caption: loc("Replace with a real memory from this year."),
    photo: "/photos/memories/placeholder-12.jpg",
    photoAlt: loc("Placeholder photo"),
    tag: "everyday",
  },
  {
    id: "summer-trip",
    date: "2026-06-10",
    title: loc("Placeholder — Summer Trip"),
    caption: loc("Replace with a real summer trip memory."),
    photo: "/photos/memories/placeholder-13.jpg",
    photoAlt: loc("Placeholder photo"),
    tag: "trip",
    planet: "sea-sun",
  },
  {
    id: "recent",
    date: "2026-08-05",
    title: loc("Placeholder — Right Before the Anniversary"),
    caption: loc("Replace with the most recent memory before launch."),
    photo: "/photos/memories/placeholder-14.jpg",
    photoAlt: loc("Placeholder photo"),
    tag: "everyday",
  },
];
