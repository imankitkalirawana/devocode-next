import path from "path";
import fs from "fs";

export default function handler(req, res) {
  if (req.method === "GET") {
    const { filename } = req.query;

    if (!filename) {
      return res.status(400).json({ error: "File parameter is missing." });
    }

    const filePath = path.join(process.cwd(), "public/uploads", filename);

    // Check if the file exists
    if (fs.existsSync(filePath)) {
      // Set the appropriate headers for the response
      res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
      res.setHeader("Content-Type", "application/octet-stream");

      // Create a read stream from the file path
      const stream = fs.createReadStream(filePath);

      // Pipe the file stream to the response object
      stream.pipe(res);

      // Handle errors during the streaming
      stream.on("error", (error) => {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      });
    } else {
      res.status(404).json({ error: "File not found." });
    }
  }
}
