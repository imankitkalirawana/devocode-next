import mongoose from "mongoose";

const moocsSchema = new mongoose.Schema({
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

const Moocs = mongoose.models.Moocs || mongoose.model("Moocs", moocsSchema);

export default Moocs;
