import multer from "multer";
import { Readable } from "stream";
import S3 from "aws-sdk/clients/s3";
import verifyToken from "@/middleware/verifyToken";

const s3 = new S3({
  accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY,
  region: process.env.NEXT_PUBLIC_REGION,
});

const storage = multer.memoryStorage();

const upload = multer({ storage }).single("file");

export default async function handler(req, res) {
  verifyToken(req, res, async () => {
    if (req.method === "POST") {
      try {
        upload(req, res, async (err) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          const { originalname, buffer } = req.file;

          // Create a readable stream from the buffer
          const readStream = new Readable();
          readStream.push(buffer);
          readStream.push(null); // Signal the end of the stream

          const params = {
            Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME,
            Key: originalname,
            Body: readStream, // Pass the stream as the Body
          };

          s3.upload(params, (err, data) => {
            if (err) {
              console.log(err);
              return res.status(500).json({ error: "Internal Server Error" });
            }

            const { Location, Key } = data;
            res.status(200).json({
              message: "File uploaded successfully.",
              file: { url: Location, name: Key },
            });
          });
        });
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    } else if (req.method === "DELETE") {
      // try and catch block
      try {
        // code to delete file from aws s3
        const { filename } = req.query;
        if (!filename) {
          return res.status(400).json({ error: "Filename is required." });
        }

        const deleteParams = {
          Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME,
          Key: filename,
        };
        2;
        s3.deleteObject(deleteParams, (err) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          res
            .status(200)
            .json({ message: `File ${filename} deleted successfully.` });
        });
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
