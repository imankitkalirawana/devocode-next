// /resources/add/[resourceType]/[subjectId]/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { isLoggedIn } from "@/utils/authUtils";
import { useRouter } from "next/navigation";
import axios from "axios";
import { set } from "mongoose";

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

const page = ({ params }: PageProps) => {
  const { resourceType, subjectId } = params;
  const { loggedIn } = isLoggedIn();
  const [resource, setResource] = useState<Resource>({} as Resource);
  const [subject, setSubject] = useState<Subject>({} as Subject);
  const [file, setFile] = useState<any>(null);
  const router = useRouter();

  const fetchSubject = async () => {
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
  //   handle submit
  const handleSubmit = () => {
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
    </div>
  );
};

export default page;
