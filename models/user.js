import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  confirmPassword: { type: String, required: true },
  phone: { type: Number, required: true },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  twoFactorSecret: { type: String },
});

export default mongoose.model("User", userSchema);
