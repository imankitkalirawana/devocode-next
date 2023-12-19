import path from "path";
import fs from "fs";
import multer from "multer";
import aws from "aws-sdk";
import verifyToken from "@/middleware/verifyToken";

const s3 = new aws.S3({
  accessKeyId: "AKIARVSJ7VXJAJGKXNOE",
  secretAccessKey: "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",
  region: "ap-south-1",
});

const storage = multer.memoryStorage();

const upload = multer({ storage }).single("file");

export default async function handler(req, res) {
  verifyToken(req, res, async () => {
    if (req.method === "POST") {
      // upload file to server
      try {
        // upload to aws s3
        upload(req, res, (err) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ error: "Internal Server Error" });
          }
          const { originalname, buffer } = req.file;
          const params = {
            Bucket: "devocode-resources",
            Key: originalname,
            Body: buffer,
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
          Bucket: "devocode-resources",
          Key: filename,
        };

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
