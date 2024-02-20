import Subject from "@/models/Subjects";
import { connectDB } from "@/utils/db";
connectDB();

const subjectWithCode = async (req, res) => {
  if (req.method === "GET") {
    const { subjectCode } = req.query;
    if (subjectCode) {
      const subject = await Subject.findOne({
        code: new RegExp(`^${subjectCode}$`, "i"),
      });
      if (subject) {
        res.status(200).json(subject);
      } else {
        res.status(404).json({ message: "Subject not found" });
      }
    }
  } else if (req.method === "PUT") {
    const { subjectCode } = req.query;
    const { code, title, description } = req.body;
    if (!subjectCode) {
      res
        .status(400)
        .json({ message: "Subject code is required for updating a subject." });
      return;
    }
    const subject = await Subject.findOneAndUpdate(
      { code: new RegExp(`^${subjectCode}$`, "i") },
      {
        code,
        title,
        description,
      },
      { new: true }
    );
    if (subject) {
      res.status(200).json(subject);
    } else {
      res.status(404).json({ message: "Subject not found" });
    }
  } else if (req.method === "DELETE") {
    const { subjectCode } = req.query;
    if (!subjectCode) {
      res
        .status(400)
        .json({ message: "Subject code is required for deleting a subject." });
      return;
    }
    const subject = await Subject.findOneAndDelete({
      code: new RegExp(`^${subjectCode}$`, "i"),
    });
    if (!subject) {
      res.status(404).json({ message: "Subject not found" });
    } else {
      res.status(200).json({ message: "Subject deleted successfully" });
    }
  }
};

export default subjectWithCode;
