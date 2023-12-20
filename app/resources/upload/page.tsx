"use client";
import S3 from "aws-sdk/clients/s3";
import {
  ChangeEventHandler,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";

const s3 = new S3({
  accessKeyId: "AKIARVSJ7VXJAJGKXNOE",
  secretAccessKey: "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",
  region: "ap-south-1",
});

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [upload, setUpload] = useState<S3.ManagedUpload | null>(null);
  //   const progress = useMotionValue(0);

  useEffect(() => {
    return upload?.abort();
  }, []);

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
    console.log(params);

    try {
      const upload = s3.upload(params);
      setUpload(upload);
      upload.on("httpUploadProgress", (p: any) => {
        console.log(p.loaded / p.total);
      });
      await upload.promise();
      console.log(`File uploaded successfully: ${file.name}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (!upload) return;
    upload.abort();
    setUpload(null);
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
        </form>
      </main>
    </div>
  );
}
