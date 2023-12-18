import path from "path";
import fs from "fs";
import multer from "multer";
import verifyToken from "@/middleware/verifyToken";

const storage = multer.diskStorage({
  destination: path.join(process.cwd(), "public/uploads"),
  filename: (req, file, callback) => {
    // Keep the original file name
    callback(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
}).single("file");

export default async function handler(req, res) {
  if (req.method === "GET") {
    // download file from server
    const { filename } = req.query;
    if (!filename) {
      return res.status(400).json({ error: "Filename is required." });
    }

    const filePath = path.join(process.cwd(), "public/uploads", filename);
    // check if file exists
    if (fs.existsSync(filePath)) {
      // Read the file content
      const fileContent = fs.readFileSync(filePath);

      // Set appropriate headers
      res.setHeader("Content-Type", "application/octet-stream");
      res.setHeader("Content-Disposition", `inline; filename="${filename}"`);

      // Send the file content
      res.send(fileContent);
    } else {
      res.status(404).json({ error: "File not found." });
    }
    return;
  }
  verifyToken(req, res, async () => {
    if (req.method === "POST") {
      // upload file to server
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
        //   do something after the file upload if needed
        res.status(200).json({ message: "File uploaded successfully." });
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    } else if (req.method === "DELETE") {
      // try and catch block
      try {
        const { filename } = req.query;
        if (!filename) {
          return res.status(400).json({ error: "Filename is required." });
        }
        const filePath = path.join(process.cwd(), "public/uploads", filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          res
            .status(200)
            .json({ message: `File ${filename} deleted successfully.` });
        } else {
          res.status(404).json({ error: `File ${filename} not found.` });
        }
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
