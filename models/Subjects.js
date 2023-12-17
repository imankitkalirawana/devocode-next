// subjectModel.js
import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  url: String,
  description: String,
  file: String,
  addedDate: {
    type: Date,
    default: Date.now(),
  },
  ca: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ca" }],
  endterm: [{ type: mongoose.Schema.Types.ObjectId, ref: "Endterm" }],
  midterm: [{ type: mongoose.Schema.Types.ObjectId, ref: "Midterm" }],
  moocs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Moocs" }],
  notes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notes" }],
  reference: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reference" }],
  syllabus: [{ type: mongoose.Schema.Types.ObjectId, ref: "Syllabus" }],
});

const Subject =
  mongoose.models.Subject || mongoose.model("Subject", subjectSchema);

export default Subject;
