import express from "express"
import {
  signup, login, getMe, updateProfile,
  forgotPassword, resetPassword
} from "../controllers/authController.js"
import protect from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/signup", signup)
router.post("/login",  login)
router.post("/forgot-password", forgotPassword)
router.put("/reset-password/:token", resetPassword)

router.get("/me",      protect, getMe)
router.put("/profile", protect, updateProfile)

export default router
