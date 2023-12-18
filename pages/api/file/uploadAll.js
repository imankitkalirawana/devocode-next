import path from "path";
import fs from "fs";
import extract from "extract-zip";
import multer from "multer";

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

    // Extract the uploaded zip file
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
}

export const config = {
  api: {
    bodyParser: false,
  },
};
