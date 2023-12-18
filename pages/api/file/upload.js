import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: path.join(process.cwd(), "public/uploads"),
  filename: (req, file, callback) => {
    // Keep the original file name
    callback(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("file"); // Use .single() if expecting a single file upload

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

    // Do something after the file upload if needed

    res.status(200).json({ message: "File uploaded successfully." });
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
