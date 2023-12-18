import path from "path";
import fs from "fs";
import archiver from "archiver";
import multer from "multer";
import extract from "extract-zip";
import verifyToken from "@/middleware/verifyToken";

const uploadDestination = path.join(process.cwd(), "public/uploads");

// Create the destination directory if it doesn't exist
if (!fs.existsSync(uploadDestination)) {
  fs.mkdirSync(uploadDestination, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadDestination,
  filename: (req, file, callback) => {
    // Keep the original file name
    callback(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
}).single("file");
export default async function handler(req, res) {
  verifyToken(req, res, async () => {
    if (req.method === "GET") {
      // download all file
      try {
        const folderPath = path.join(process.cwd(), "public/uploads");
        if (fs.existsSync(folderPath)) {
          res.setHeader("Content-Type", "application/zip");
          res.setHeader(
            "Content-Disposition",
            `attachment; filename=Backup${Date.now()}.zip`
          );
          const archive = archiver("zip", { zlib: { level: 9 } });
          archive.pipe(res);
          archive.directory(folderPath, false);
          archive.finalize();
          archive.on("error", (error) => {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
          });
        } else {
          res.status(404).json({ error: "Folder not found." });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    } else if (req.method === "POST") {
      try {
        await new Promise((resolve, reject) => {
          upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
              // A Multer error occurred when uploading.
              reject(err);
            } else if (err) {
              // An unknown error occurred.
              reject(err);
            }

            // File upload was successful.
            resolve();
          });
        });
        const zipFilePath = path.join(
          process.cwd(),
          "public/uploads",
          req.file.originalname
        );
        const extractPath = path.join(process.cwd(), "public/uploads");

        await extract(zipFilePath, { dir: extractPath });

        // Delete the uploaded zip file
        fs.unlinkSync(zipFilePath);
        res
          .status(200)
          .json({ message: "File uploaded and extracted successfully." });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    } else if (req.method === "DELETE") {
      try {
        const uploadFolder = path.join(process.cwd(), "public/uploads");
        if (fs.existsSync(uploadFolder)) {
          const files = fs.readdirSync(uploadFolder);

          files.forEach((file) => {
            const filePath = path.join(uploadFolder, file);
            fs.unlinkSync(filePath);
          });

          res.status(200).json({ message: "All files deleted successfully." });
        } else {
          res.status(404).json({ error: "Upload folder not found." });
        }
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    } else {
      res.status(405).json({ error: "Not allowed" });
    }
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
