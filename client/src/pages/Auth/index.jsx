import { useState } from "react";
import {
  Eye,
  EyeOff,
  TrendingUp,
  LayoutDashboard,
  Target,
  FileText,
  Check,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../services/api";

// ── Google Icon SVG ────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path
        fill="#4285F4"
        d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.86-1.6 2.43v2h2.6c1.52-1.4 2.4-3.47 2.4-5.93 0-.4-.04-.79-.1-1.16-.01.14-.07.09-.07.16z"
      />
      <path
        fill="#34A853"
        d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2c-.72.48-1.63.76-2.7.76-2.08 0-3.84-1.4-4.47-3.29H1.88v2.07C3.2 15.27 5.94 17 8.98 17z"
      />
      <path
        fill="#FBBC05"
        d="M4.51 10.53A5.06 5.06 0 0 1 4.24 9c0-.53.09-1.04.27-1.53V5.4H1.88A8.96 8.96 0 0 0 1 9c0 1.45.35 2.82.96 4.03l2.55-2.5z"
      />
      <path
        fill="#EA4335"
        d="M8.98 3.58c1.17 0 2.23.4 3.06 1.2l2.3-2.3C12.95 1.19 11.14.4 8.98.4 5.94.4 3.2 2.13 1.88 4.6l2.63 2.07c.63-1.89 2.39-3.1 4.47-3.1z"
      />
    </svg>
  );
}

// ── Password strength ──────────────────────────────────────────────────────
function getStrength(pwd) {
  if (!pwd) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const map = [
    { label: "Weak", color: "#ef4444" },
    { label: "Fair", color: "#f59e0b" },
    { label: "Good", color: "#3b82f6" },
    { label: "Strong", color: "#10b981" },
  ];
  return { score, ...map[Math.min(score - 1, 3)] };
}

// ── Left branding panel ────────────────────────────────────────────────────
function BrandPanel({ isLogin }) {
  const benefits = [
    { icon: LayoutDashboard, text: "Visual dashboard with charts & insights" },
    { icon: Target, text: "Set budgets and track goals per category" },
    { icon: FileText, text: "Monthly reports exported in one click" },
  ];
  return (
    <div
      style={{
        background:
          "linear-gradient(145deg, #13102a 0%, #0d0b1f 50%, #08080f 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px 48px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background orbs */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            top: "5%",
            left: "-10%",
            width: 340,
            height: 340,
            background:
              "radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 70%)",
            borderRadius: "50%",
            animation: "orb1 12s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "5%",
            right: "-10%",
            width: 280,
            height: 280,
            background:
              "radial-gradient(circle, rgba(6,182,212,0.14) 0%, transparent 70%)",
            borderRadius: "50%",
            animation: "orb2 15s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div style={{ position: "relative" }}>
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 56,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              background: "linear-gradient(135deg,#7c3aed,#06b6d4)",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TrendingUp size={18} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 20, color: "#fff" }}>
            SpendWise
          </span>
        </div>

        {/* Headline */}
        <h2
          style={{
            fontSize: "clamp(26px,3.5vw,38px)",
            fontWeight: 800,
            color: "#fff",
            lineHeight: 1.2,
            marginBottom: 16,
          }}
        >
          {isLogin ? "Welcome\nback" : "Start your\njourney"}
        </h2>
        <p
          style={{
            color: "#9ca3af",
            fontSize: 15,
            lineHeight: 1.7,
            marginBottom: 48,
            maxWidth: 320,
          }}
        >
          {isLogin
            ? "Log in to pick up where you left off. Your finances are waiting."
            : "Join thousands of users tracking smarter with SpendWise."}
        </p>

        {/* Benefits */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {benefits.map(({ icon: Icon, text }) => (
            <div
              key={text}
              style={{ display: "flex", alignItems: "center", gap: 14 }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "rgba(124,58,237,0.18)",
                  border: "1px solid rgba(124,58,237,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={16} color="#a78bfa" />
              </div>
              <span style={{ color: "#d1d5db", fontSize: 14 }}>{text}</span>
            </div>
          ))}
        </div>

        {/* Mini dashboard mockup */}
        <div
          style={{
            marginTop: 52,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 14,
            padding: 18,
            maxWidth: 320,
          }}
        >
          <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 12 }}>
            Your balance overview
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 5,
              height: 48,
              marginBottom: 12,
            }}
          >
            {[30, 55, 40, 70, 50, 85, 65, 90, 55, 75].map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${h}%`,
                  background:
                    i === 9
                      ? "linear-gradient(180deg,#7c3aed,#6d28d9)"
                      : "rgba(124,58,237,0.25)",
                  borderRadius: "3px 3px 0 0",
                }}
              />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 10, color: "#6b7280" }}>
                Saved this month
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#34d399" }}>
                ₹3,420
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10, color: "#6b7280" }}>Top spend</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#a78bfa" }}>
                Dining
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Auth Page ─────────────────────────────────────────────────────────
export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const strength = getStrength(form.password);

  const update = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!isLogin && !form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6)
      e.password = "Password must be at least 6 characters";
    if (!isLogin && form.password !== form.confirm)
      e.confirm = "Passwords do not match";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    setLoading(true);
    try {
      let response;

      if (isLogin) {
        // Call login API
        response = await authAPI.login({
          email: form.email,
          password: form.password,
        });
      } else {
        // Call signup API
        response = await authAPI.signup({
          name: form.name,
          email: form.email,
          password: form.password,
        });
      }

      // Save user info + token to localStorage
      localStorage.setItem("spendwise_user", JSON.stringify(response.data));
      localStorage.setItem("spendwise_auth", "true");

      setLoading(false);
      setSuccess(true);

      // Redirect to dashboard after short delay
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      setLoading(false);
      // Show error from server (e.g. "Email already registered")
      const message = err.response?.data?.message || "Something went wrong";
      setErrors({ submit: message });
    }
  };

  // ── Also add this below the confirm password field to show server errors ───
  

  const toggle = () => {
    setIsLogin(!isLogin);
    setForm({ name: "", email: "", password: "", confirm: "" });
    setErrors({});
    setSuccess(false);
  };

  return (
    <div
      style={{
        background: "#08080f",
        minHeight: "100vh",
        fontFamily: "'DM Sans', sans-serif",
        color: "#fff",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes orb1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(40px,-30px)} }
        @keyframes orb2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-30px,40px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes successPop { 0%{transform:scale(0.8);opacity:0} 100%{transform:scale(1);opacity:1} }

        .auth-input {
          width: 100%; background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1); border-radius: 10px;
          padding: 12px 16px; color: #fff; font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s; outline: none;
        }
        .auth-input:focus { border-color: rgba(124,58,237,0.6); background: rgba(124,58,237,0.08); box-shadow: 0 0 0 3px rgba(124,58,237,0.12); }
        .auth-input::placeholder { color: #4b5563; }
        .auth-input.error { border-color: rgba(239,68,68,0.5); }

        .btn-primary {
          width: 100%; background: linear-gradient(135deg,#7c3aed,#6d28d9);
          color: #fff; border: none; border-radius: 10px;
          padding: 13px; font-size: 15px; font-weight: 700;
          cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif;
          box-shadow: 0 4px 20px rgba(124,58,237,0.35);
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(124,58,237,0.5); }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }

        .btn-google {
          width: 100%; background: rgba(255,255,255,0.05);
          color: #fff; border: 1px solid rgba(255,255,255,0.12); border-radius: 10px;
          padding: 12px; font-size: 14px; font-weight: 600;
          cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif;
          display: flex; align-items: center; justify-content: center; gap: 10px;
        }
        .btn-google:hover { background: rgba(255,255,255,0.09); border-color: rgba(255,255,255,0.22); transform: translateY(-1px); }

        .form-panel { animation: fadeUp 0.5s ease; }
        .spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
        .success-anim { animation: successPop 0.4s ease forwards; }

        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
          div[style*="padding: 60px 48px"] { display: none !important; }
        }
      `}</style>

      {/* ── LEFT PANEL ── */}
      <BrandPanel isLogin={isLogin} />

      {/* ── RIGHT FORM PANEL ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "48px 40px",
          background: "#08080f",
          position: "relative",
        }}
      >
        {/* Back to home */}
        <div
          onClick={() => navigate("/")}
          href="/"
          style={{
            position: "absolute",
            top: 28,
            left: 28,
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "#6b7280",
            fontSize: 13,
            textDecoration: "none",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
        >
          
          <ArrowLeft size={15} /> Back to home
        </div>

        <div
          className="form-panel"
          key={isLogin ? "login" : "signup"}
          style={{ width: "100%", maxWidth: 400 }}
        >
          {/* Success state */}
          {success ? (
            <div className="success-anim" style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "rgba(52,211,153,0.15)",
                  border: "2px solid rgba(52,211,153,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                }}
              >
                <Check size={32} color="#34d399" />
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 10 }}>
                {isLogin ? "Welcome back!" : "Account created!"}
              </h2>
              <p style={{ color: "#9ca3af", fontSize: 15, marginBottom: 32 }}>
                {isLogin
                  ? "Redirecting you to your dashboard..."
                  : "Let's set up your first transaction."}
              </p>
              <button
                onClick={() => navigate("/dashboard")}
                className="btn-primary"
              >
                Go to Dashboard
              </button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div style={{ marginBottom: 32 }}>
                <h1
                  style={{
                    fontSize: "clamp(22px,3vw,30px)",
                    fontWeight: 800,
                    marginBottom: 8,
                  }}
                >
                  {isLogin ? "Welcome back" : "Create your account"}
                </h1>
                <p style={{ color: "#6b7280", fontSize: 14 }}>
                  {isLogin
                    ? "Enter your credentials to access your dashboard."
                    : "Start tracking your finances for free today."}
                </p>
              </div>

              {/* Google OAuth */}
              <button className="btn-google" style={{ marginBottom: 24 }}>
                <GoogleIcon />
                Continue with Google
              </button>

              {/* Divider */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    background: "rgba(255,255,255,0.08)",
                  }}
                />
                <span style={{ color: "#4b5563", fontSize: 12 }}>
                  or continue with email
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    background: "rgba(255,255,255,0.08)",
                  }}
                />
              </div>

              {/* Form fields */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {/* Full name — signup only */}
                {!isLogin && (
                  <div>
                    <label
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#d1d5db",
                        display: "block",
                        marginBottom: 6,
                      }}
                    >
                      Full Name
                    </label>
                    <input
                      className={`auth-input${errors.name ? " error" : ""}`}
                      placeholder="Aisha Rahman"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                    />
                    {errors.name && (
                      <div
                        style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}
                      >
                        {errors.name}
                      </div>
                    )}
                  </div>
                )}

                {/* Email */}
                <div>
                  <label
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#d1d5db",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    Email Address
                  </label>
                  <input
                    className={`auth-input${errors.email ? " error" : ""}`}
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                  />
                  {errors.email && (
                    <div
                      style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}
                    >
                      {errors.email}
                    </div>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#d1d5db",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      className={`auth-input${errors.password ? " error" : ""}`}
                      type={showPass ? "text" : "password"}
                      placeholder="Min. 6 characters"
                      value={form.password}
                      onChange={(e) => update("password", e.target.value)}
                      style={{ paddingRight: 44 }}
                    />
                    <button
                      onClick={() => setShowPass(!showPass)}
                      style={{
                        position: "absolute",
                        right: 14,
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        color: "#6b7280",
                        cursor: "pointer",
                        display: "flex",
                      }}
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && (
                    <div
                      style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}
                    >
                      {errors.password}
                    </div>
                  )}

                  {/* Forgot password — login only */}
                  {isLogin && (
                    <div style={{ textAlign: "right", marginTop: 6 }}>
                      <span
                        onClick={() => navigate("/forgot-password")}
                        style={{
                          fontSize: 12,
                          color: "#a78bfa",
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        Forgot password?
                      </span>
                    </div>
                  )}

                  {/* Password strength — signup only */}
                  {!isLogin && form.password && (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            style={{
                              flex: 1,
                              height: 3,
                              borderRadius: 2,
                              background:
                                i <= strength.score
                                  ? strength.color
                                  : "rgba(255,255,255,0.1)",
                              transition: "background 0.3s",
                            }}
                          />
                        ))}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: strength.color,
                          fontWeight: 600,
                        }}
                      >
                        {strength.label}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm password — signup only */}
                {!isLogin && (
                  <div>
                    <label
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#d1d5db",
                        display: "block",
                        marginBottom: 6,
                      }}
                    >
                      Confirm Password
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        className={`auth-input${errors.confirm ? " error" : ""}`}
                        type={showConfirm ? "text" : "password"}
                        placeholder="Repeat your password"
                        value={form.confirm}
                        onChange={(e) => update("confirm", e.target.value)}
                        style={{ paddingRight: 44 }}
                      />
                      <button
                        onClick={() => setShowConfirm(!showConfirm)}
                        style={{
                          position: "absolute",
                          right: 14,
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "none",
                          border: "none",
                          color: "#6b7280",
                          cursor: "pointer",
                          display: "flex",
                        }}
                      >
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.confirm && (
                      <div
                        style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}
                      >
                        {errors.confirm}
                      </div>
                    )}
                  </div>
                )}

                {/* Submit button */}

                {errors.submit && (
                  <div
                    style={{
                      background: "rgba(239,68,68,0.1)",
                      border: "1px solid rgba(239,68,68,0.3)",
                      borderRadius: 8,
                      padding: "10px 14px",
                      fontSize: 13,
                      color: "#f87171",
                      textAlign: "center",
                    }}
                  >
                    {errors.submit}
                  </div>
                )}

                <button
                  className="btn-primary"
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{ marginTop: 4 }}
                >
                  {loading ? (
                    <>
                      <div className="spinner" />{" "}
                      {isLogin ? "Signing in..." : "Creating account..."}
                    </>
                  ) : isLogin ? (
                    "Sign In"
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>

              {/* Toggle login/signup */}
              <p
                style={{
                  textAlign: "center",
                  color: "#6b7280",
                  fontSize: 14,
                  marginTop: 24,
                }}
              >
                {isLogin
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <button
                  onClick={toggle}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#a78bfa",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: 14,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {isLogin ? "Sign Up" : "Sign In"}
                </button>
              </p>

              {/* Terms — signup only */}
              {!isLogin && (
                <p
                  style={{
                    textAlign: "center",
                    color: "#4b5563",
                    fontSize: 12,
                    marginTop: 16,
                    lineHeight: 1.5,
                  }}
                >
                  By creating an account you agree to our{" "}
                  <span style={{ color: "#7c3aed", cursor: "pointer" }}>
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span style={{ color: "#7c3aed", cursor: "pointer" }}>
                    Privacy Policy
                  </span>
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
