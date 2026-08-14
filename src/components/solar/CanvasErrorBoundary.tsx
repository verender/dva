import { Component, type ReactNode } from "react";

type Props = { children: ReactNode; onError: () => void };
type State = { hasError: boolean };

// Catches mid-mount WebGL failures (context creation errors, driver quirks)
// and routes to the non-3D fallback instead of a blank screen.
export default class CanvasErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}
