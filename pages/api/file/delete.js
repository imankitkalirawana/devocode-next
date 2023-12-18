import path from "path";
import fs from "fs";

export default function handler(req, res) {
  const { filename } = req.query;

  if (!filename) {
    return res.status(400).json({ error: "Filename is required." });
  }

  const filePath = path.join(process.cwd(), "public/uploads", filename);

  try {
    // Check if the file exists
    if (fs.existsSync(filePath)) {
      // Delete the file
      fs.unlinkSync(filePath);
      res
        .status(200)
        .json({ message: `File ${filename} deleted successfully.` });
    } else {
      res.status(404).json({ error: `File ${filename} not found.` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
