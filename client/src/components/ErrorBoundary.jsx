import { Component } from "react"

// ── Why we need this ────────────────────────────────────────────────────────
// If any component throws a JS error while rendering (e.g. undefined.map()),
// React normally unmounts the ENTIRE app and shows a blank white screen.
// An Error Boundary catches that error and shows a friendly fallback UI
// instead, so the user isn't left staring at nothing.
//
// This MUST be a class component — React only supports error boundaries
// via componentDidCatch, which doesn't have a hooks equivalent yet.

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info)
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = "/"
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          background: "#08080f", minHeight: "100vh", display: "flex",
          flexDirection: "column", alignItems: "center", justifyContent: "center",
          fontFamily: "'DM Sans', sans-serif", color: "#fff", padding: 24, textAlign: "center"
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>Something went wrong</h1>
          <p style={{ color: "#9ca3af", fontSize: 14, marginBottom: 28, maxWidth: 400 }}>
            An unexpected error occurred. This has been logged — try reloading the page.
          </p>
          <button onClick={this.handleReload} style={{
            background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff",
            border: "none", borderRadius: 10, padding: "12px 28px", fontSize: 14,
            fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
          }}>
            Back to Home
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
