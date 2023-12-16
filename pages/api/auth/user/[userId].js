// pages/api/user/[userId].js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "@/utils/keys";
import { connectDB } from "@/utils/db";
import User from "@/models/User";

connectDB();

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const userId = req.query.userId;
      const userData = await User.findById(userId).select("-password");

      if (!userData) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (req.method === "POST") {
    try {
      const { userId } = req.query;
      const { currentPassword, newPassword } = req.body;

      // Find the user by userId
      const user = await User.findById(userId);

      // Check if the user exists
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if the current password is correct
      if (!bcrypt.compareSync(currentPassword, user.password)) {
        return res.status(401).json({ error: "Invalid current password" });
      }

      // Update the password with the new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedNewPassword;
      await user.save();

      // Generate a new JWT token with the updated user information
      const token = jwt.sign(
        { userId: user.id, username: user.username, role: user.role },
        JWT_SECRET_KEY,
        { expiresIn: "30d" }
      );

      // Send user data except password and token
      res.json({
        userId: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        token,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === "PUT") {
    // update user details
    try {
      const { userId } = req.query;
      const { name, username, email, phone } = req.body;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      // check if username is already taken
      const existingUsername = await User.findOne({ username });
      if (existingUsername && existingUsername.id !== userId) {
        return res.status(400).json({ error: "Username is already taken" });
      }
      // check if email is already registered
      const existingEmail = await User.findOne({ email });
      if (existingEmail && existingEmail.id !== userId) {
        return res.status(401).json({ error: "Email is already registered" });
      }
      // check if phone number is already registered
      const phoneExisting = await User.findOne({ phone });
      if (phoneExisting && phoneExisting.id !== userId) {
        return res
          .status(402)
          .json({ error: "Phone number is already registered" });
      }
      // update user details
      user.name = name;
      user.username = username;
      user.email = email;
      user.phone = phone;
      await user.save();
      // generate new jwt token
      const token = jwt.sign(
        { userId: user.id, username: user.username, role: user.role },
        JWT_SECRET_KEY,
        { expiresIn: "30d" }
      );
      // send user data except password and token
      res.json({
        userId: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        token,
      });
    } catch (error) {
      console.log("Error updating user: ", error);
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === "DELETE") {
    try {
      const { userId } = req.query;
      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.log("Error deleting user: ", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
