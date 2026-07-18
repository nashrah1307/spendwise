import jwt from "jsonwebtoken"
import crypto from "crypto"
import User from "../models/User.js"
import { sendResetEmail } from "../utils/sendEmail.js"

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" })
}

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" })
    }
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: "Email already registered" })
    }
    const user = await User.create({ name, email, password })
    res.status(201).json({
      _id: user._id, name: user.name, email: user.email,
      phone: user.phone, location: user.location, dob: user.dob, bio: user.bio,
      plan: user.plan, token: generateToken(user._id),
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" })
    }
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" })
    }
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" })
    }
    res.json({
      _id: user._id, name: user.name, email: user.email,
      phone: user.phone, location: user.location, dob: user.dob, bio: user.bio,
      plan: user.plan, token: generateToken(user._id),
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getMe = async (req, res) => {
  res.json({
    _id: req.user._id, name: req.user.name, email: req.user.email,
    phone: req.user.phone, location: req.user.location, dob: req.user.dob,
    bio: req.user.bio, plan: req.user.plan, currency: req.user.currency,
  })
}

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: "User not found" })

    user.name     = req.body.name     ?? user.name
    user.email    = req.body.email    ?? user.email
    user.phone    = req.body.phone    ?? user.phone
    user.location = req.body.location ?? user.location
    user.dob      = req.body.dob      ?? user.dob
    user.bio      = req.body.bio      ?? user.bio
    user.currency = req.body.currency ?? user.currency
    if (req.body.password) user.password = req.body.password

    const updatedUser = await user.save()
    res.json({
      _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email,
      phone: updatedUser.phone, location: updatedUser.location, dob: updatedUser.dob,
      bio: updatedUser.bio, plan: updatedUser.plan, token: generateToken(updatedUser._id),
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ── NEW: Forgot Password ────────────────────────────────────────────────────
// @route  POST /api/auth/forgot-password
// @access Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ message: "Email is required" })

    const user = await User.findOne({ email })

    // Security note: we ALWAYS return the same success message, whether or
    // not the email exists. Otherwise someone could use this endpoint to
    // check which emails are registered (an "enumeration attack").
    if (!user) {
      return res.json({ message: "If that email exists, a reset link has been sent." })
    }

    // Generate a random, hard-to-guess token
    const resetToken = crypto.randomBytes(32).toString("hex")

    // Store a HASHED version in the DB (never store the raw token)
    // so that even if the database leaks, the raw tokens can't be reused
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000 // 30 minutes from now
    await user.save()

    // Build the link the user will click, pointing to your LIVE frontend
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`

    await sendResetEmail(user.email, resetUrl)

    res.json({ message: "If that email exists, a reset link has been sent." })

  } catch (error) {
    res.status(500).json({ message: "Failed to send reset email. Try again later." })
  }
}

// ── NEW: Reset Password ─────────────────────────────────────────────────────
// @route  PUT /api/auth/reset-password/:token
// @access Public
export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body
    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" })
    }

    // Hash the incoming token the same way we hashed it when storing,
    // then look for a matching, still-valid (not expired) record
    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex")

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }, // must not be expired
    })

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset link" })
    }

    user.password = password // will be auto-hashed by the pre-save hook
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()

    res.json({ message: "Password reset successful. You can now log in." })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
