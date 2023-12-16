import mongoose from "mongoose";

const caSchema = new mongoose.Schema({
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

const Ca = mongoose.models.Ca || mongoose.model("Ca", caSchema);

export default Ca;
