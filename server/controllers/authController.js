import jwt from "jsonwebtoken"
import User from "../models/User.js"

// ── Helper: generate JWT token ─────────────────────────────────────────────
// We call this after login and signup to give the user a token
const generateToken = (id) => {
  return jwt.sign(
    { id },                          // payload — what we store inside the token
    process.env.JWT_SECRET,          // secret key to sign the token
    { expiresIn: "30d" }             // token expires in 30 days
  )
}

// ── @route   POST /api/auth/signup ────────────────────────────────────────
// ── @access  Public (no token needed)
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check all fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" })
    }

    // Check if user already exists
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: "Email already registered" })
    }

    // Create the user (password gets hashed automatically via User model)
    const user = await User.create({ name, email, password })

    // Send back user info + token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      plan: user.plan,
      token: generateToken(user._id),
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ── @route   POST /api/auth/login ─────────────────────────────────────────
// ── @access  Public (no token needed)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" })
    }

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    // Check if password matches (uses matchPassword method from User model)
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    // Send back user info + token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      plan: user.plan,
      token: generateToken(user._id),
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ── @route   GET /api/auth/me ─────────────────────────────────────────────
// ── @access  Protected (token required)
export const getMe = async (req, res) => {
  // req.user is set by authMiddleware
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    plan: req.user.plan,
    currency: req.user.currency,
  })
}

// ── @route   PUT /api/auth/profile ────────────────────────────────────────
// ── @access  Protected (token required)
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Update only the fields that were sent
    user.name     = req.body.name     || user.name
    user.email    = req.body.email    || user.email
    user.currency = req.body.currency || user.currency

    // If new password is provided, update it (will be hashed by model)
    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      plan: updatedUser.plan,
      token: generateToken(updatedUser._id),
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
