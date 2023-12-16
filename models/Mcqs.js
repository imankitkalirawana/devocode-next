import mongoose from "mongoose";

const mcqsSchema = new mongoose.Schema({
  title: String,
  url: String,
  description: String,
  file: String,
  filesize: String,
  addedDate: {
    type: Date,
    default: Date.now(),
  },
  addedDate: {
    type: Date,
    default: Date.now(),
  },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
});

const Mcqs = mongoose.models.Mcqs || mongoose.model("Mcqs", mcqsSchema);

export default Mcqs;
