import aws from "aws-sdk";

const s3 = new aws.S3({
  accessKeyId: "AKIARVSJ7VXJAJGKXNOE",
  secretAccessKey: "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",
  region: "ap-south-1",
});

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end(); // Method Not Allowed
  }

  const filename = req.query.filename;

  const params = {
    Bucket: "devocode-resources",
    Key: filename,
  };

  try {
    const data = await s3.getObject(params).promise();

    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.setHeader("Content-Type", data.ContentType);
    res.send(data.Body);
  } catch (error) {
    console.error("Error fetching file from S3:", error);
    res.status(404).send("File not found");
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
