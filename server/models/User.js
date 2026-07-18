import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6,
  },
  avatar: { type: String, default: "" },
  phone: { type: String, default: "", trim: true },
  location: { type: String, default: "", trim: true },
  dob: { type: String, default: "" },
  bio: { type: String, default: "", trim: true, maxlength: 300 },
  currency: { type: String, default: "INR" },
  plan: { type: String, enum: ["free", "pro"], default: "free" },

  // ── NEW: password reset fields ──────────────────────────────────────────
  resetPasswordToken: { type: String, default: undefined },
  resetPasswordExpire: { type: Date, default: undefined },
}, {
  timestamps: true,
})

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model("User", UserSchema)
export default User
