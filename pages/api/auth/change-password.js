import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectDB } from "@/utils/db";
import { JWT_SECRET_KEY } from "@/utils/keys";
connectDB();

export default async function handler(req, res) {
  if (req.method === "POST") {
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
  }
}
