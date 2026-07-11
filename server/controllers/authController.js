import jwt from "jsonwebtoken"
import User from "../models/User.js"

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
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      location: user.location,
      dob: user.dob,
      bio: user.bio,
      plan: user.plan,
      token: generateToken(user._id),
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
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      location: user.location,
      dob: user.dob,
      bio: user.bio,
      plan: user.plan,
      token: generateToken(user._id),
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getMe = async (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    phone: req.user.phone,
    location: req.user.location,
    dob: req.user.dob,
    bio: req.user.bio,
    plan: req.user.plan,
    currency: req.user.currency,
  })
}

// ── UPDATED: now saves phone, location, dob, bio too ────────────────────────
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    user.name     = req.body.name     ?? user.name
    user.email    = req.body.email    ?? user.email
    user.phone    = req.body.phone    ?? user.phone
    user.location = req.body.location ?? user.location
    user.dob      = req.body.dob      ?? user.dob
    user.bio      = req.body.bio      ?? user.bio
    user.currency = req.body.currency ?? user.currency

    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      location: updatedUser.location,
      dob: updatedUser.dob,
      bio: updatedUser.bio,
      plan: updatedUser.plan,
      token: generateToken(updatedUser._id),
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
