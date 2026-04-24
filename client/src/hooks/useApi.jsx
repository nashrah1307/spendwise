import { useState, useEffect, useCallback } from "react"

// ── Generic fetch hook ─────────────────────────────────────────────────────
// Use this in any page to fetch data from the API
// Usage: const { data, loading, error, refetch } = useFetch(fn, deps)
export function useFetch(fetchFn, deps = []) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetchFn()
      setData(res.data)
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }, deps)

  useEffect(() => { fetch() }, [fetch])

  return { data, loading, error, refetch: fetch }
}

// ── Loading spinner component ──────────────────────────────────────────────
export function LoadingSpinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 40, height: 40, border: "3px solid rgba(124,58,237,0.2)", borderTop: "3px solid #7c3aed", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
        <div style={{ color: "#6b7280", fontSize: 14 }}>Loading...</div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

// ── Error message component ────────────────────────────────────────────────
export function ErrorMessage({ message, onRetry }) {
  return (
    <div style={{ textAlign: "center", padding: "48px 20px" }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: "#f87171", marginBottom: 8 }}>Something went wrong</div>
      <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>{message}</div>
      {onRetry && (
        <button onClick={onRetry} style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 8, color: "#a78bfa", fontSize: 13, fontWeight: 600, padding: "8px 20px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
          Try Again
        </button>
      )}
    </div>
  )
}
