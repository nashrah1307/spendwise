import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Budget from './pages/Budget'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import Notifications from './pages/Notifications'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

// ── Simple auth guard (replace with real auth later) ──
const isLoggedIn = () => {
  const user = localStorage.getItem("spendwise_user")
  const auth = localStorage.getItem("spendwise_auth")
  return user && auth === "true"
}

function ProtectedRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/"        element={<Landing />} />
        <Route path="/login"   element={<Auth />} />
        <Route path="/signup"  element={<Auth />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Protected routes */}
        <Route path="/dashboard"    element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
        <Route path="/budget"       element={<ProtectedRoute><Budget /></ProtectedRoute>} />
        <Route path="/reports"      element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        <Route path="/settings"     element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/profile"      element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

        {/* Catch all → 404 */}
        <Route path="*" element={
          <div style={{ background: "#08080f", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", color: "#fff" }}>
            <div style={{ fontSize: 80, fontWeight: 800, background: "linear-gradient(135deg,#7c3aed,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 8 }}>404</div>
            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>Page not found</div>
            <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 28 }}>The page you're looking for doesn't exist.</div>
            <a href="/" style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff", padding: "12px 28px", borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>Go Home</a>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
