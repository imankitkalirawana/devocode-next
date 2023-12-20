// /resources/add/[resourceType]/[subjectId]/page.tsx
"use client";
import React, { MouseEventHandler, useEffect, useState } from "react";
import { isLoggedIn } from "@/utils/authUtils";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import S3 from "aws-sdk/clients/s3";
import { set } from "mongoose";

const s3 = new S3({
  accessKeyId: "AKIARVSJ7VXJAJGKXNOE",
  secretAccessKey: "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",
  region: "ap-south-1",
});
interface PageProps {
  params: {
    resourceType: string;
    subjectId: string;
  };
}

interface Resource {
  _id: string;
  title: string;
  url: string;
  description: string;
  file: string;
  filesize: string;
  addedDate: Date;
}

interface Subject {
  code: string;
  title: string;
  description: string;
  _id: string;
}

const Page = ({ params }: PageProps) => {
  const { resourceType, subjectId } = params;
  const { loggedIn } = isLoggedIn();
  const [resource, setResource] = useState<Resource>({} as Resource);
  const [subject, setSubject] = useState<Subject>({} as Subject);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [upload, setUpload] = useState<S3.ManagedUpload | null>(null);

  const router = useRouter();

  const fetchSubject = async () => {
    if (!loggedIn) {
      router.push("/auth/login");
    }
    try {
      const response = await axios.get(`/api/subjects/subject?id=${subjectId}`);
      setSubject(response.data);
    } catch (error) {
      console.error("Error fetching subject:", error);
    }
  };

  useEffect(() => {
    fetchSubject();
  }, []);

  //   handle input
  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setResource({ ...resource, [e.target.name]: e.target.value });
  };

  //   handle file input
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files![0];

    // Check if a file is selected
    if (selectedFile) {
      // Get the file size in bytes
      const fileSize = selectedFile.size;
      const fileSizeInMB = (fileSize / (1024 * 1024)).toFixed(2);

      var file = e.target.files![0];
      var extension = file.name.split(".").pop();
      var dataTitle = resource.title;
      if (dataTitle === undefined) dataTitle = "untitled";
      dataTitle = dataTitle.replace(/\s+/g, "_").toLowerCase();
      file = new File(
        [file],
        `${
          subject?.code
        }_${resourceType}_${dataTitle}_${Date.now()}.${extension}`,
        {
          type: file.type,
        }
      );
      setFile(file);
      setResource({ ...resource, file: file.name, filesize: fileSizeInMB });
    }
  };
  // upload file function to /api/file/user api
  const handleSubmit = async () => {
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
        setProgress((p.loaded / p.total) * 100);
      });
      await toast
        .promise(upload.promise(), {
          pending: "Uploading...",
          success: "File uploaded successfully",
          error: "Error uploading file",
        })
        .then(() => {
          console.log(`File uploaded successfully... uploading to db`);
          addData();
          console.log("Data added successfully");
          router.push(`/resources/${resourceType}/${subjectId}`);
        })
        .catch((err) => {
          console.error("Error uploading file:", err);
        });
    } catch (err) {
      console.error(err);
    }
  };

  //   handle submit
  const addData = async () => {
    axios
      .post(
        `/api/subjects/resource?resourceType=${resourceType}&subjectId=${subjectId}`,
        resource,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => console.error("Error adding resource:", error));
  };

  const handleCancel: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (!upload) return;
    upload.abort();
    setUpload(null);
    setProgress(0);
  };

  return (
    <div className="container-fluid">
      <div className="container-stack">
        <div className="btn btn-slim btn-faded" onClick={() => router.back()}>
          <i className="fa-regular fa-arrow-left icon-left"></i>Back
        </div>
        <div className="container-narrative">
          <h1>Add {resourceType}</h1>
          <p>
            Use this form to add a file. You can add the title, file, and
            description.
          </p>
        </div>
      </div>
      <div className="container-stack-horizontal">
        <div className="container-sidebar">
          <div className="stack-title-card">
            <i className="fa-regular fa-file"></i>
            <h1>Add {resourceType}</h1>
          </div>
          <hr className="divider-horizontal" />
          <div className="stack-details">
            <div className="stack-progress">
              <div className="progress-circle"></div>
              <div className="progress-line"></div>
              <span className="stack-name">Add</span>
            </div>
            <div className="stack-progress">
              <div className="progress-circle"></div>
              <div className="progress-line"></div>
              <span className="stack-name">{resourceType}</span>
            </div>
            <div className="stack-progress">
              <div className="progress-circle"></div>
              <div className="progress-line"></div>
              <span className="stack-name">Subject</span>
            </div>
          </div>
        </div>
        <div className="container-card">
          <div className="container-card-header">
            <h2>Add {resourceType}</h2>
          </div>
          <hr className="divider-horizontal" />
          <div className="container-card-form form">
            <div className="form-input">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                name="title"
                id="title"
                placeholder="Unit 1"
                value={resource.title}
                onChange={handleInput}
              />
            </div>
            <div className="form-input">
              <label htmlFor="description">Description (Optional)</label>
              <input
                type="text"
                name="description"
                id="description"
                placeholder="Description"
                value={resource.description}
                onChange={handleInput}
              />
            </div>
            <div className="form-input form-input-file">
              <label htmlFor="file">File</label>
              <input
                type="file"
                name="file"
                id="file"
                onChange={handleFileInput}
              />
            </div>
            {upload && (
              <div className="form-input progress-input">
                <span className="progress-text">{progress.toFixed(0)}%</span>
                <progress
                  className="progress"
                  value={progress.toFixed(0)}
                  max="100"
                />
                {progress < 100 && progress > 0 && (
                  <button
                    className="btn btn-danger btn-slim"
                    onClick={handleCancel}
                  >
                    <i className="fa-regular fa-xmark"></i>
                  </button>
                )}
                {progress === 100 && (
                  <i className="fa-solid fa-circle-check success"></i>
                )}
              </div>
            )}
            <div className="form-input form-btns">
              <button className="btn" onClick={() => router.back()}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSubmit}>
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
