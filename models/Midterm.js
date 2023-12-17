import mongoose from "mongoose";

const midtermSchema = new mongoose.Schema({
  title: String,
  url: String,
  description: String,
  file: String,
  filesize: String,
  addedDate: {
    type: Date,
    default: Date.now(),
  },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
});

const Midterm =
  mongoose.models.Midterm || mongoose.model("Midterm", midtermSchema);

export default Midterm;
