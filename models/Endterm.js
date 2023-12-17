import mongoose from "mongoose";

const endtermSchema = new mongoose.Schema({
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

const Endterm =
  mongoose.models.Endterm || mongoose.model("Endterm", endtermSchema);

export default Endterm;
