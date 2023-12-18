import path from "path";
import fs from "fs";
import archiver from "archiver";

export default function handler(req, res) {
  const folderPath = path.join(process.cwd(), "public/uploads");

  // Check if the folder exists
  if (fs.existsSync(folderPath)) {
    // Set the appropriate headers for the response
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", "attachment; filename=uploads.zip");

    // Create a zip archive
    const archive = archiver("zip", { zlib: { level: 9 } });

    // Pipe the archive to the response object
    archive.pipe(res);

    // Add all files from the folder to the archive
    archive.directory(folderPath, false);

    // Finalize the archive and send it to the client
    archive.finalize();

    // Handle errors during the archiving
    archive.on("error", (error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    });
  } else {
    res.status(404).json({ error: "Folder not found." });
  }
}
