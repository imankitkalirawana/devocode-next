import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide your name"],
    maxlength: [20, "Name cannot be more than 20 characters"],
  },
  username: {
    type: String,
    required: [true, "Please provide your username"],
    maxlength: [20, "Username cannot be more than 20 characters"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    maxlength: [50, "Email cannot be more than 50 characters"],
    unique: true,
  },
  phone: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide your password"],
    minlength: [6, "Password cannot be less than 6 characters"],
  },
  addedDate: {
    type: Date,
    default: Date.now(),
  },
  role: { type: String, enum: ["admin", "member", "unknown"] },
});

const User = mongoose.models.Users || mongoose.model("Users", userSchema);

export default User;
