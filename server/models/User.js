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
    unique: true,       // no two users can have the same email
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6,
  },
  avatar: {
    type: String,
    default: "",
  },
  currency: {
    type: String,
    default: "INR",
  },
  plan: {
    type: String,
    enum: ["free", "pro"],
    default: "free",
  },
}, {
  timestamps: true, // auto adds createdAt and updatedAt fields
})

// ── Hash password before saving ────────────────────────────────────────────
// This runs automatically every time a user is saved
// We NEVER store plain text passwords in the database
UserSchema.pre("save", async function () {
  // Only hash if password was changed (not on every save)
  if (!this.isModified("password")) return

  const salt = await bcrypt.genSalt(10) // generate a random salt
  this.password = await bcrypt.hash(this.password, salt) // hash the password
  // next()
})

// ── Method to compare passwords on login ──────────────────────────────────
// We call this when user tries to log in
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model("User", UserSchema)
export default User
