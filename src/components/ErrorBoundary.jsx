import { Component } from 'react';

// Keeps one broken piece (a 3D canvas that lost its GPU context, a chunk that failed to load) from blanking the whole page.
class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error(error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    if (this.props.fallback !== undefined) return this.props.fallback;
    return (
      <div className="min-h-[60vh] grid place-items-center px-6 text-center">
        <div>
          <h1 className="font-sans text-2xl font-bold text-ink">Something went wrong loading this page.</h1>
          <p className="mt-2 text-ink-soft">Reloading usually fixes it.</p>
          <button type="button" className="btn btn-primary mt-5" onClick={() => window.location.reload()}>Reload</button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
