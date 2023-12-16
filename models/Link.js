import mongoose from "mongoose";

const linkSchema = new mongoose.Schema({
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

const Link = mongoose.models.Link || mongoose.model("Link", linkSchema);

export default Link;
