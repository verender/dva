import { loc, type LocalizedText } from "./types";

export const RELATIONSHIP_START_DATE = "2024-09-15";

export function daysTogether(fromISO: string = RELATIONSHIP_START_DATE, toDate: Date = new Date()): number {
  const from = new Date(fromISO);
  const diffMs = toDate.getTime() - from.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

export type StatEntry = {
  id: string;
  label: LocalizedText;
  compute: (days: number) => string;
  background: string;
  emphasis?: "huge" | "normal";
};

// Every value is derived from `days`, never hand-typed, so nothing drifts if
// the launch date slips within the build window. `background` drives each
// full-bleed Wrapped card's gradient.
export const stats: StatEntry[] = [
  {
    id: "days",
    label: loc("days together"),
    compute: (days) => `${days}`,
    background: "linear-gradient(160deg, #3a2a14 0%, #6b3f1d 55%, #c9a24b 100%)",
    emphasis: "huge",
  },
  {
    id: "months",
    label: loc("months of us"),
    compute: (days) => `${Math.round(days / 30.44)}`,
    background: "linear-gradient(160deg, #1d3a3a 0%, #2f6b63 55%, #79c9a2 100%)",
  },
  {
    id: "trips",
    label: loc("placeholder — trips taken together"),
    compute: () => "?",
    background: "linear-gradient(160deg, #1d2a4a 0%, #3a4f8f 55%, #7ea2e8 100%)",
  },
  {
    id: "photos",
    label: loc("placeholder — photos taken (probably)"),
    compute: () => "∞",
    background: "linear-gradient(160deg, #3a1d3a 0%, #6b2f6b 55%, #c978c9 100%)",
  },
];
