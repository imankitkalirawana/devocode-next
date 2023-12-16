import { NextApiRequest, NextApiResponse } from "next";
import Subject from "./models/Subjects";
import { connectDB } from "@/utils/db";
import cors from "@/cors";

connectDB();

// get subject api (with cors)
export default cors(async (req, res) => {
  try {
    // Fetch all subjects from the database
    const subjects = await Subject.find();

    res.status(200).json(subjects);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).send("Internal Server Error");
  }
});
