import path from "path";
import fs from "fs";

export default function handler(req, res) {
  const uploadFolder = path.join(process.cwd(), "public/uploads");

  try {
    // Check if the folder exists
    if (fs.existsSync(uploadFolder)) {
      // Get a list of all files in the folder
      const files = fs.readdirSync(uploadFolder);

      res.status(200).json({ files });
    } else {
      res.status(404).json({ error: "Upload folder not found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
