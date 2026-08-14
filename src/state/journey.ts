import { useReducer } from "react";
import type { PlanetId } from "../data/planets";

export type Target = PlanetId | "sun";

export type Phase =
  | { kind: "gate" }
  | { kind: "trailer" }
  | { kind: "constellation" }
  | { kind: "detail"; target: Target }
  | { kind: "wrapped" }
  | { kind: "finale" };

export type JourneyState = {
  phase: Phase;
  visited: Set<Target>;
};

export type JourneyAction =
  | { type: "BEGIN" }
  | { type: "TRAILER_DONE" }
  | { type: "SELECT"; target: Target }
  | { type: "BACK_TO_CONSTELLATION" }
  | { type: "GO_WRAPPED" }
  | { type: "WRAPPED_DONE" }
  | { type: "REWIND" };

function reducer(state: JourneyState, action: JourneyAction): JourneyState {
  switch (action.type) {
    case "BEGIN":
      return { ...state, phase: { kind: "trailer" } };
    case "TRAILER_DONE":
      return { ...state, phase: { kind: "constellation" } };
    case "SELECT": {
      const visited = new Set(state.visited);
      visited.add(action.target);
      return { phase: { kind: "detail", target: action.target }, visited };
    }
    case "BACK_TO_CONSTELLATION":
      return { ...state, phase: { kind: "constellation" } };
    case "GO_WRAPPED":
      return { ...state, phase: { kind: "wrapped" } };
    case "WRAPPED_DONE":
      return { ...state, phase: { kind: "finale" } };
    // Lets her jump back to the constellation from Wrapped/Finale if she
    // skipped ahead past planets she meant to explore — visited stays intact.
    case "REWIND":
      return { ...state, phase: { kind: "constellation" } };
    default:
      return state;
  }
}

const initialState: JourneyState = { phase: { kind: "gate" }, visited: new Set() };

export function useJourney() {
  return useReducer(reducer, initialState);
}
