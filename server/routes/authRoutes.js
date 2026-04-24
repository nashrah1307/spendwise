import express from "express"
import { signup, login, getMe, updateProfile } from "../controllers/authController.js"
import protect from "../middleware/authMiddleware.js"

const router = express.Router()

// Public routes — no token needed
router.post("/signup", signup)
router.post("/login",  login)

// Protected routes — token required
router.get("/me",          protect, getMe)
router.put("/profile",     protect, updateProfile)

export default router
