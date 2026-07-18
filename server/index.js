import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import rateLimit from "express-rate-limit"
// import mongoSanitize from "express-mongo-sanitize"
import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import transactionRoutes from "./routes/transactionRoutes.js"
import budgetRoutes from "./routes/budgetRoutes.js"

dotenv.config()
connectDB()

const app = express()
// ── NEW: disable caching for all API responses ─────────────────────────────
// By default Express auto-generates ETags, which makes browsers send
// "if this hasn't changed, just give me the cached version" requests.
// For user-specific data like budgets/transactions, this causes stale/wrong
// data to be shown across different logins. Turning this off forces every
// request to always hit the server fresh.
app.disable('etag')
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})

const allowedOrigins = [
  "http://localhost:5173",
  "https://spendwise-red-three.vercel.app",
  "https://spendwise-allwave.vercel.app/signup",
]

app.use(cors({
  origin: function (origin, callback) {
    const allowed =
      !origin ||
      origin === "http://localhost:5173" ||
      origin.endsWith(".vercel.app")   // allows any Vercel preview/production URL
    
    if (allowed) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}))

app.use(express.json())

// ── NEW: strip out any $ or . operators from request data ──────────────────
// Protects against NoSQL injection, e.g. someone sending
// { "email": { "$gt": "" } } to bypass login checks
// ── Custom sanitizer (replaces express-mongo-sanitize) ──────────────────────
// Recursively strips out any keys starting with $ or containing a dot,
// which are used in NoSQL injection attacks
function sanitize(obj) {
  if (obj && typeof obj === "object") {
    for (const key in obj) {
      if (key.startsWith("$") || key.includes(".")) {
        delete obj[key]
      } else if (typeof obj[key] === "object") {
        sanitize(obj[key])
      }
    }
  }
  return obj
}

app.use((req, res, next) => {
  if (req.body) sanitize(req.body)
  next()
})
// ── NEW: rate limiting ───────────────────────────────────────────────────────
// General limiter: 100 requests per 15 min per IP for all routes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests, please try again later." },
})

// Stricter limiter just for auth routes (prevents brute-force login attempts)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many login attempts, please try again in 15 minutes." },
})

app.use("/api/", generalLimiter)
app.use("/api/auth/login", authLimiter)
app.use("/api/auth/signup", authLimiter)

// ── Routes ─────────────────────────────────────────────────────────────────
app.use("/api/auth",         authRoutes)
app.use("/api/transactions", transactionRoutes)
app.use("/api/budgets",      budgetRoutes)

app.get("/", (req, res) => {
  res.json({ message: "SpendWise API is running..." })
})

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: err.message || "Server Error" })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
