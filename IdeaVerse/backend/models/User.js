import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["creator", "freelancer", "recruiter", "admin"],
      default: "creator",
      index: true,
    },
    headline: { type: String },
    bio: { type: String },
    skills: [{ type: String }],
    isEmailVerified: { type: Boolean, default: false, index: true },
    emailVerifiedAt: { type: Date },
    isBlocked: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

// Create indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isEmailVerified: 1 });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;

