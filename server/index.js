import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import transactionRoutes from "./routes/transactionRoutes.js"
import budgetRoutes from "./routes/budgetRoutes.js"

// ── Load environment variables ─────────────────────────────────────────────
dotenv.config()

// ── Connect to MongoDB ─────────────────────────────────────────────────────
connectDB()

const app = express()

// ── Middleware ─────────────────────────────────────────────────────────────
// CORS — allows your React frontend to talk to this backend
app.use(cors({
  origin: "http://localhost:5173", // Vite dev server
  credentials: true,
}))

// Parse incoming JSON request bodies
app.use(express.json())

// ── Routes ─────────────────────────────────────────────────────────────────
app.use("/api/auth",         authRoutes)
app.use("/api/transactions", transactionRoutes)
app.use("/api/budgets",      budgetRoutes)

// ── Health check ───────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "SpendWise API is running..." })
})

// ── 404 handler ────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` })
})

// ── Global error handler ───────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: err.message || "Server Error" })
})

// ── Start server ───────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
