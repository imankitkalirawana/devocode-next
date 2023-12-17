import Subject from "@/models/Subjects";
import { connectDB } from "@/utils/db";
import verifyToken from "@/middleware/verifyToken";
import cors from "@/cors";
connectDB();

// get subject api (with cors)
export default cors(async (req, res) => {
  try {
    if (req.method === "GET") {
      const { id } = req.query;

      if (id) {
        const subject = await Subject.findById(id);
        if (subject) {
          res.status(200).json(subject);
        } else {
          res.status(404).json({ message: "Subject not found" });
        }
      } else {
        const subjects = await Subject.find();
        res.status(200).json(subjects);
      }
    } else {
      verifyToken(req, res, async () => {
        if (req.method === "POST") {
          const { code, title, description } = req.body;

          if (!code || !title) {
            res.status(400).json({
              message: "Code and title are required for creating a subject.",
            });
            return;
          }

          const subject = await Subject.create({
            code,
            title,
            description,
          });

          res.status(201).json(subject);
        } else if (req.method === "PUT") {
          const { id } = req.query;
          const { code, title, description } = req.body;

          if (!id) {
            res
              .status(400)
              .json({ message: "ID is required for updating a subject." });
            return;
          }

          const subject = await Subject.findByIdAndUpdate(
            id,
            {
              code,
              title,
              description,
            },
            { new: true }
          );

          if (!subject) {
            res.status(404).json({ message: "Subject not found" });
            return;
          } else {
            res.status(200).json(subject);
          }
        } else if (req.method === "DELETE") {
          const { id } = req.query;

          if (!id) {
            res
              .status(400)
              .json({ message: "ID is required for deleting a subject." });
            return;
          }

          const subject = await Subject.findByIdAndDelete(id);

          if (!subject) {
            res.status(404).json({ message: "Subject not found" });
            return;
          }

          res.status(200).json(subject);
        } else {
          res.status(405).send("Method Not Allowed");
        }
      });
    }
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).send("Internal Server Error");
  }
});
