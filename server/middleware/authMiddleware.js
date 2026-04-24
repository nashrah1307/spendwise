import jwt from "jsonwebtoken"
import User from "../models/User.js"

const protect = async (req, res, next) => {
  let token

  // ── Step 1: Check if token exists in request headers ──────────────────
  // Frontend sends token like: Authorization: Bearer eyJhbGci...
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // ── Step 2: Extract the token (remove "Bearer " prefix) ───────────
      token = req.headers.authorization.split(" ")[1]

      // ── Step 3: Verify the token using our secret key ─────────────────
      // If token is fake or expired, this will throw an error
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // ── Step 4: Find the user from the token's payload ────────────────
      // We attach user info to req.user so controllers can access it
      // .select("-password") means "give me everything EXCEPT the password"
      req.user = await User.findById(decoded.id).select("-password")

      if (!req.user) {
        return res.status(401).json({ message: "User not found" })
      }

      // ── Step 5: Move on to the actual controller ───────────────────────
      next()

    } catch (error) {
      console.error("Token verification failed:", error.message)
      return res.status(401).json({ message: "Not authorized, token failed" })
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" })
  }
}

export default protect
