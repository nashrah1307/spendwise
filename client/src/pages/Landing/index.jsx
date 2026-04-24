import { useState, useEffect, useRef } from "react"
import {
  LayoutDashboard, Wallet, Target, FileText,
  Bell, Shield, ChevronDown, ChevronUp, Menu, X,
  TrendingUp, ArrowUpRight
} from "lucide-react"
import { useNavigate } from "react-router-dom"

// ── Animated counter hook ──────────────────────────────────────────────────
function useCounter(end, duration = 2000, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * end))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [end, duration, start])
  return count
}

// ── Intersection observer hook ─────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect() }
    }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

// ── FAQ data ───────────────────────────────────────────────────────────────
const faqs = [
  { q: "Is SpendWise free to use?", a: "Yes — SpendWise offers a robust free tier with essential tracking and budgeting tools. Premium plans unlock bank sync, advanced reports, and priority support." },
  { q: "Can I export my transactions?", a: "Absolutely. Export transaction history and monthly reports in CSV or PDF formats for accounting and tax purposes." },
  { q: "Can I set budget limits per category?", a: "You can create monthly or custom-period budgets for any category and receive alerts when you approach limits." },
  { q: "Is my financial data safe?", a: "Security is a priority: we use bank-level encryption, regular audits, and never sell your personal financial data to third parties." },
  { q: "Does it support multiple currencies?", a: "Yes. Track accounts and transactions in multiple currencies, with consolidated reporting using live or manual exchange rates." },
  { q: "Is there a mobile app?", a: "Yes. SpendWise is available on iOS and Android with full feature parity for tracking, budgets, and notifications." },
]

// ── Stats data ─────────────────────────────────────────────────────────────
const stats = [
  { label: "Users", end: 10000, prefix: "", suffix: "+" },
  { label: "Tracked", end: 5, prefix: "₹", suffix: "Cr+" },
  { label: "Categories", end: 50, prefix: "", suffix: "+" },
  { label: "Uptime", end: 99.9, prefix: "", suffix: "%" },
]

// ── Feature cards ──────────────────────────────────────────────────────────
const features = [
  { icon: LayoutDashboard, title: "Visual Dashboard", desc: "Interactive charts and graphs to understand where your money goes each month." },
  { icon: Wallet, title: "Expense Tracking", desc: "Add expenses and income in seconds with quick-entry and smart categorization." },
  { icon: Target, title: "Budget Goals", desc: "Set monthly limits per category and track progress with clear visual cues." },
  { icon: FileText, title: "Monthly Reports", desc: "Receive a detailed and exportable breakdown of every month's spending and income." },
  { icon: Bell, title: "Bill Reminders", desc: "Never miss payments with scheduled reminders and upcoming bill summaries." },
  { icon: Shield, title: "Secure & Private", desc: "Bank-level encryption and strict privacy policies keep your financial data safe." },
]

// ── Testimonials ───────────────────────────────────────────────────────────
const testimonials = [
  { initials: "AR", name: "Aisha Rahman", role: "College Student", stars: 5, text: "SpendWise makes budgeting simple. I easily track daily spending and saved more this semester than ever." },
  { initials: "MK", name: "Manish Kapoor", role: "Freelancer", stars: 4, text: "Automated reports and category insights helped me reduce subscription costs by 18%." },
  { initials: "SR", name: "Suraj Reddy", role: "Product Manager", stars: 5, text: "Clear visualizations let me spot overspending categories in seconds and adjust budgets quickly." },
]

// ── FAQ Item ───────────────────────────────────────────────────────────────
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="border-b border-white/10 py-4 cursor-pointer"
      onClick={() => setOpen(!open)}
    >
      <div className="flex justify-between items-center">
        <span className="text-white font-semibold text-sm">{q}</span>
        {open ? <ChevronUp size={16} className="text-purple-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
      </div>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-40 mt-3" : "max-h-0"}`}>
        <p className="text-gray-400 text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  )
}

// ── Stat Counter ───────────────────────────────────────────────────────────
function StatCounter({ label, end, prefix, suffix, started }) {
  const count = useCounter(end, 2000, started)
  const display = end === 99.9
    ? (started ? "99.9" : "0")
    : count.toLocaleString()
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-white mb-1">
        {prefix}<span>{display}</span>{suffix}
      </div>
      <div className="text-gray-400 text-sm">{label}</div>
    </div>
  )
}

// ── Main Landing Page ──────────────────────────────────────────────────────
export default function Landing() {
      const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [statsRef, statsInView] = useInView(0.3)
  const [featuresRef, featuresInView] = useInView(0.1)
  const [stepsRef, stepsInView] = useInView(0.1)
  const [testimonialsRef, testimonialsInView] = useInView(0.1)
  const [faqRef, faqInView] = useInView(0.1)
  const [ctaRef, ctaInView] = useInView(0.3)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    setMobileOpen(false)
  }

  return (
    <div style={{ background: "#08080f", fontFamily: "'DM Sans', sans-serif", color: "#fff", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        /* Animated hero orbs */
        @keyframes orb1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(60px,-40px) scale(1.1)} 66%{transform:translate(-30px,50px) scale(0.95)} }
        @keyframes orb2 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-50px,60px) scale(1.05)} 66%{transform:translate(40px,-30px) scale(1.1)} }
        @keyframes orb3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,30px) scale(1.08)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes gradMove { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }

        .orb1 { animation: orb1 12s ease-in-out infinite; }
        .orb2 { animation: orb2 15s ease-in-out infinite; }
        .orb3 { animation: orb3 18s ease-in-out infinite; }
        .float-card { animation: float 4s ease-in-out infinite; }
        .float-card2 { animation: float 5s ease-in-out infinite 1s; }

        .fade-up { opacity: 0; transform: translateY(32px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .fade-up.visible { opacity: 1; transform: translateY(0); }
        .fade-up-delay-1 { transition-delay: 0.1s; }
        .fade-up-delay-2 { transition-delay: 0.2s; }
        .fade-up-delay-3 { transition-delay: 0.3s; }
        .fade-up-delay-4 { transition-delay: 0.4s; }
        .fade-up-delay-5 { transition-delay: 0.5s; }

        .hero-animate { animation: fadeUp 0.9s ease forwards; }
        .hero-animate-2 { animation: fadeUp 0.9s ease 0.15s forwards; opacity: 0; }
        .hero-animate-3 { animation: fadeUp 0.9s ease 0.3s forwards; opacity: 0; }
        .hero-animate-4 { animation: fadeUp 0.9s ease 0.45s forwards; opacity: 0; }

        .btn-primary {
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          color: #fff; border: none; border-radius: 8px;
          padding: 11px 24px; font-size: 14px; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
          box-shadow: 0 4px 20px rgba(124,58,237,0.35);
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(124,58,237,0.5); background: linear-gradient(135deg,#8b5cf6,#7c3aed); }

        .btn-outline {
          background: transparent; color: #fff;
          border: 1px solid rgba(255,255,255,0.25); border-radius: 8px;
          padding: 11px 24px; font-size: 14px; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
        }
        .btn-outline:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.45); transform: translateY(-2px); }

        .feature-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px; padding: 24px;
          transition: all 0.3s;
        }
        .feature-card:hover { background: rgba(124,58,237,0.1); border-color: rgba(124,58,237,0.35); transform: translateY(-4px); }

        .testimonial-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px; padding: 24px;
          transition: all 0.3s;
        }
        .testimonial-card:hover { border-color: rgba(124,58,237,0.3); }

        .stat-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px; padding: 32px 24px;
        }

        .navbar-blur {
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          background: rgba(8,8,15,0.85);
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }

        .shimmer-text {
          background: linear-gradient(90deg, #a78bfa, #fff, #a78bfa);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }

        .gradient-border {
          background: linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.1));
          border: 1px solid rgba(124,58,237,0.3);
        }

        .cta-gradient {
          background: linear-gradient(135deg, #1e1040, #0f0a2a);
          border: 1px solid rgba(124,58,237,0.25);
        }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #08080f; }
        ::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.5); border-radius: 3px; }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          transition: "all 0.3s",
          ...(scrolled ? {} : { background: "transparent", borderBottom: "1px solid transparent" })
        }}
        className={scrolled ? "navbar-blur" : ""}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => scrollTo("hero")}>
            <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#7c3aed,#06b6d4)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TrendingUp size={16} color="#fff" />
            </div>
            <span style={{ fontWeight: 700, fontSize: 18 }}>SpendWise</span>
          </div>

          {/* Desktop links */}
          <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="desktop-nav">
            {["features", "how-it-works", "faq"].map(id => (
              <button key={id} onClick={() => scrollTo(id)} style={{ background: "none", border: "none", color: "#d1d5db", fontSize: 14, fontWeight: 500, cursor: "pointer", transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = "#fff"}
                onMouseLeave={e => e.target.style.color = "#d1d5db"}>
                {id === "how-it-works" ? "How it Works" : id.charAt(0).toUpperCase() + id.slice(1)}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="btn-outline" onClick={() => navigate("/login")} style={{ padding: "8px 18px" }}>Login</button>
            <button className="btn-primary" onClick={() => navigate("/signup")} style={{ padding: "8px 18px" }}>Get Started Free</button>
            <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", display: "none" }} className="mobile-menu-btn">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{ background: "rgba(8,8,15,0.98)", padding: "16px 24px 24px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            {["features", "how-it-works", "faq"].map(id => (
              <button key={id} onClick={() => scrollTo(id)} style={{ display: "block", background: "none", border: "none", color: "#d1d5db", fontSize: 15, fontWeight: 500, cursor: "pointer", padding: "10px 0", width: "100%", textAlign: "left" }}>
                {id === "how-it-works" ? "How it Works" : id.charAt(0).toUpperCase() + id.slice(1)}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section id="hero" style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden", paddingTop: 80 }}>
        {/* Animated background orbs */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          <div className="orb1" style={{ position: "absolute", top: "10%", left: "15%", width: 500, height: 500, background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)", borderRadius: "50%" }} />
          <div className="orb2" style={{ position: "absolute", top: "30%", right: "10%", width: 400, height: 400, background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)", borderRadius: "50%" }} />
          <div className="orb3" style={{ position: "absolute", bottom: "10%", left: "40%", width: 350, height: 350, background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)", borderRadius: "50%" }} />
          {/* Grid overlay */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center", position: "relative" }}>
          {/* Left */}
          <div>
            <div className="hero-animate" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 100, padding: "6px 14px", marginBottom: 24 }}>
              <ArrowUpRight size={14} color="#a78bfa" />
              <span style={{ fontSize: 13, color: "#a78bfa", fontWeight: 500 }}>Smart Finance Tracking</span>
            </div>
            <h1 className="hero-animate-2" style={{ fontSize: "clamp(36px, 5vw, 58px)", fontWeight: 800, lineHeight: 1.1, marginBottom: 20 }}>
              Take Control of<br />
              <span className="shimmer-text">Your Finances</span>
            </h1>
            <p className="hero-animate-3" style={{ fontSize: 16, color: "#9ca3af", lineHeight: 1.7, marginBottom: 32, maxWidth: 440 }}>
              Track expenses, set budgets, and understand your spending — all in one beautiful dashboard designed for clarity and action.
            </p>
            <div className="hero-animate-4" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button className="btn-primary" onClick={() => navigate("/signup")} style={{ fontSize: 15, padding: "12px 28px" }}>Get Started Free</button>
              <button className="btn-outline" style={{ fontSize: 15, padding: "12px 28px" }}>See Demo</button>
            </div>

            {/* Floating stat cards */}
            <div style={{ display: "flex", gap: 12, marginTop: 40, flexWrap: "wrap" }}>
              <div className="float-card gradient-border" style={{ borderRadius: 12, padding: "14px 18px", minWidth: 140 }}>
                <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4 }}>This month</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#34d399" }}>₹3,420 saved</div>
                <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>Compared to last month</div>
              </div>
              <div className="float-card2 gradient-border" style={{ borderRadius: 12, padding: "14px 18px", minWidth: 140 }}>
                <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4 }}>Top category</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#a78bfa" }}>Dining +</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>₹8,120</div>
                <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>24% of total spend</div>
              </div>
            </div>
          </div>

          {/* Right — mockup */}
          <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
            <div style={{ width: "100%", maxWidth: 480, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,0.5)" }}>
              {/* Mockup top bar */}
              <div style={{ background: "rgba(124,58,237,0.15)", padding: "12px 16px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10b981" }} />
                <div style={{ flex: 1, background: "rgba(255,255,255,0.07)", borderRadius: 4, height: 20, marginLeft: 8 }} />
              </div>
              {/* Mockup content */}
              <div style={{ padding: 20 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                  {[["Total Balance", "₹45,230", "#34d399"], ["Monthly Spend", "₹12,840", "#f87171"]].map(([label, val, color]) => (
                    <div key={label} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 14 }}>
                      <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 6 }}>{label}</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color }}>{val}</div>
                    </div>
                  ))}
                </div>
                {/* Bar chart mock */}
                <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 14, marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 10 }}>Monthly Overview</div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 60 }}>
                    {[40, 65, 45, 80, 55, 70, 90, 50, 75, 60, 85, 95].map((h, i) => (
                      <div key={i} style={{ flex: 1, height: `${h}%`, background: i === 11 ? "linear-gradient(180deg,#7c3aed,#6d28d9)" : "rgba(124,58,237,0.3)", borderRadius: "3px 3px 0 0", transition: "height 0.3s" }} />
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                    {["J","F","M","A","M","J","J","A","S","O","N","D"].map((m,i) => (
                      <div key={i} style={{ fontSize: 9, color: "#4b5563", flex: 1, textAlign: "center" }}>{m}</div>
                    ))}
                  </div>
                </div>
                {/* Category pills */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[["Food", "#7c3aed"], ["Travel", "#06b6d4"], ["Rent", "#f59e0b"], ["Shopping", "#ec4899"]].map(([cat, color]) => (
                    <div key={cat} style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 100, background: `${color}22`, color, border: `1px solid ${color}44` }}>{cat}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" ref={featuresRef} style={{ padding: "100px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div className={`fade-up ${featuresInView ? "visible" : ""}`} style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 800, marginBottom: 14 }}>Everything you need to manage money</h2>
          <p style={{ color: "#9ca3af", fontSize: 16 }}>Powerful tools to track, budget, and visualize your finances with minimal setup.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {features.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className={`feature-card fade-up fade-up-delay-${i % 3 + 1} ${featuresInView ? "visible" : ""}`}>
              <div style={{ width: 42, height: 42, background: "rgba(124,58,237,0.18)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <Icon size={20} color="#a78bfa" />
              </div>
              <h3 style={{ fontWeight: 700, marginBottom: 8, fontSize: 16 }}>{title}</h3>
              <p style={{ color: "#9ca3af", fontSize: 14, lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" ref={stepsRef} style={{ padding: "80px 24px", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className={`fade-up ${stepsInView ? "visible" : ""}`} style={{ textAlign: "center", marginBottom: 56 }}>
            <h2 style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 800, marginBottom: 14 }}>Get started in 3 simple steps</h2>
            <p style={{ color: "#9ca3af", fontSize: 16 }}>From signup to insights in just a few clicks.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 32, position: "relative" }}>
            {[
              { n: 1, title: "Create your free account", desc: "Sign up with email or continue with Google to start tracking immediately." },
              { n: 2, title: "Add your income and expenses", desc: "Quick add, recurring transactions, and auto-categorization make entry effortless." },
              { n: 3, title: "View insights and take control", desc: "Actionable recommendations help you optimize spending and reach goals faster." },
            ].map(({ n, title, desc }, i) => (
              <div key={n} className={`fade-up fade-up-delay-${i + 1} ${stepsInView ? "visible" : ""}`} style={{ textAlign: "center" }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 20, fontWeight: 800, boxShadow: "0 8px 24px rgba(124,58,237,0.35)" }}>{n}</div>
                <h3 style={{ fontWeight: 700, marginBottom: 10, fontSize: 17 }}>{title}</h3>
                <p style={{ color: "#9ca3af", fontSize: 14, lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section ref={statsRef} style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 20 }}>
          {stats.map((s, i) => (
            <div key={s.label} className={`stat-card fade-up fade-up-delay-${i + 1} ${statsInView ? "visible" : ""}`}>
              <StatCounter {...s} started={statsInView} />
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section ref={testimonialsRef} style={{ padding: "80px 24px", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className={`fade-up ${testimonialsInView ? "visible" : ""}`} style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 800, marginBottom: 14 }}>Loved by thousands of users</h2>
            <p style={{ color: "#9ca3af", fontSize: 16 }}>Real stories from people using SpendWise to make smarter decisions.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {testimonials.map(({ initials, name, role, stars, text }, i) => (
              <div key={name} className={`testimonial-card fade-up fade-up-delay-${i + 1} ${testimonialsInView ? "visible" : ""}`}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>{initials}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{name}</div>
                    <div style={{ color: "#6b7280", fontSize: 12 }}>{role}</div>
                  </div>
                </div>
                <p style={{ color: "#d1d5db", fontSize: 14, lineHeight: 1.6, marginBottom: 14 }}>"{text}"</p>
                <div style={{ display: "flex", gap: 3 }}>
                  {Array.from({ length: stars }).map((_, j) => (
                    <span key={j} style={{ color: "#f59e0b", fontSize: 14 }}>★</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" ref={faqRef} style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className={`fade-up ${faqInView ? "visible" : ""}`} style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 800, marginBottom: 14 }}>Frequently Asked Questions</h2>
            <p style={{ color: "#9ca3af", fontSize: 16 }}>Answers to how SpendWise works and what you can expect.</p>
          </div>
          <div className={`fade-up fade-up-delay-1 ${faqInView ? "visible" : ""}`} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 48px" }}>
            <div>{faqs.slice(0, 3).map(f => <FAQItem key={f.q} {...f} />)}</div>
            <div>{faqs.slice(3).map(f => <FAQItem key={f.q} {...f} />)}</div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section ref={ctaRef} style={{ padding: "40px 24px 80px" }}>
        <div className={`fade-up ${ctaInView ? "visible" : ""}`} style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="cta-gradient" style={{ borderRadius: 20, padding: "48px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
            <div>
              <h2 style={{ fontSize: "clamp(22px,3.5vw,34px)", fontWeight: 800, marginBottom: 8 }}>Ready to take control of your money?</h2>
              <p style={{ color: "#9ca3af", fontSize: 15 }}>Join thousands of users who track smarter with SpendWise.</p>
            </div>
            <button className="btn-primary" onClick={() => navigate("/signup")} style={{ fontSize: 15, padding: "14px 32px", whiteSpace: "nowrap" }}>Get Started for Free</button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "48px 24px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 40 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 28, height: 28, background: "linear-gradient(135deg,#7c3aed,#06b6d4)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <TrendingUp size={14} color="#fff" />
                </div>
                <span style={{ fontWeight: 700, fontSize: 16 }}>SpendWise</span>
              </div>
              <p style={{ color: "#6b7280", fontSize: 13, lineHeight: 1.6 }}>Smart, private, and simple personal finance tracking for everyone.</p>
            </div>
            {[
              { title: "Product", links: ["Features", "Pricing", "Integrations"] },
              { title: "Company", links: ["About Us", "Careers", "Press"] },
              { title: "Support", links: ["Help Center", "Contact", "Privacy Policy"] },
            ].map(({ title, links }) => (
              <div key={title}>
                <div style={{ fontWeight: 600, marginBottom: 16, fontSize: 14 }}>{title}</div>
                {links.map(l => (
                  <div key={l} style={{ color: "#6b7280", fontSize: 13, marginBottom: 10, cursor: "pointer", transition: "color 0.2s" }}
                    onMouseEnter={e => e.target.style.color = "#fff"}
                    onMouseLeave={e => e.target.style.color = "#6b7280"}>{l}</div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <span style={{ color: "#4b5563", fontSize: 13 }}>© 2026 SpendWise Inc. All rights reserved.</span>
            <div>
            </div>
          </div>
        </div>
      </footer>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          section > div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
          footer > div > div[style*="grid-template-columns: 2fr"] { grid-template-columns: 1fr 1fr !important; }
          div[style*="grid-template-columns: 1fr 1fr"][class*="fade-up"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
