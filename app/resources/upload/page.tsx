"use client";
import S3 from "aws-sdk/clients/s3";
import {
  ChangeEventHandler,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";

const s3 = new S3({
  accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY,
  region: process.env.NEXT_PUBLIC_REGION,
});

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [upload, setUpload] = useState<S3.ManagedUpload | null>(null);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    return upload?.abort();
  }, [upload]);

  useEffect(() => {
    setUpload(null);
  }, [file]);

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    setFile(e.target.files![0]);
  };

  const handleUpload: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    if (!file) return;
    const params = {
      Bucket: "devocode-resources",
      Key: file.name,
      Body: file,
    };

    try {
      const upload = s3.upload(params);
      setUpload(upload);
      upload.on("httpUploadProgress", (p: any) => {
        setProgress((p.loaded / p.total) * 100);
      });
      await toast.promise(upload.promise(), {
        pending: "Uploading...",
        success: "File uploaded successfully",
        error: "Error uploading file",
      });
      console.log(`File uploaded successfully: ${file.name}`);
    } catch (err) {
      console.error(err);
    }
    setProgress(0);
  };

  const handleCancel: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (!upload) return;
    upload.abort();
    setUpload(null);
    setProgress(0);
  };

  const handleDownload: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    if (!file) return;

    const params = {
      Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME,
      Key: file.name,
    };

    try {
      const url = await s3.getSignedUrlPromise("getObject", params);
      window.open(url, "_blank");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container-fluid">
      <main>
        <form className="flex flex-col gap-4 rounded bg-stone-800 p-10 text-white shadow">
          <input type="file" onChange={handleFileChange} />
          <button
            className="rounded bg-green-500 p-2 shadow"
            onClick={handleUpload}
          >
            Upload
          </button>
          {upload && (
            <>
              <button
                className="rounded bg-red-500 p-2 shadow"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </>
          )}
          <button
            className="rounded bg-green-500 p-2 shadow"
            onClick={handleDownload}
          >
            Download
          </button>
          <progress value={progress} max={100} />
        </form>
      </main>
    </div>
  );
}
