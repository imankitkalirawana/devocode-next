import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/User";
import { connectDB } from "@/utils/db";
import { JWT_SECRET_KEY } from "../../../utils/keys";
connectDB();

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { name, username, email, phone, password, role } = req.body;

      // Check for duplicate username
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ error: "Username is already taken" });
      }

      // Check for duplicate email
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ error: "Email is already registered" });
      }

      // Check for duplicate phone
      if (phone) {
        const existingPhone = await User.findOne({ phone });
        if (existingPhone) {
          return res
            .status(400)
            .json({ error: "Phone number is already registered" });
        }
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        name,
        username,
        email,
        phone,
        password: hashedPassword,
        role,
      });

      await newUser.save();

      const token = jwt.sign(
        {
          userId: newUser.id,
          username: newUser.username,
          role: newUser.role,
        },
        JWT_SECRET_KEY,
        { expiresIn: "30d" }
      );

      res.json({
        userId: newUser.id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        token,
      });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
