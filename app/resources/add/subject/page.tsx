"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import Link from "next/link";

interface Subject {
  _id: string;
  code: string;
  title: string;
  description: string;
}

const Page = () => {
  const [subject, setSubject] = useState<Subject>({} as Subject);
  const router = useRouter();

  //   handle input
  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSubject({ ...subject, [e.target.name]: e.target.value });
  };

  //   handle submit
  const handleSubmit = async () => {
    // check if empty code and title
    if (subject.code === undefined || subject.title === undefined) {
      toast.error("Please enter a code and title.");
      return;
    }
    await axios
      .post(
        `/api/subjects/subject`,
        {
          code: subject.code,
          title: subject.title,
          description: subject.description,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => {
        toast.success("Subject added successfully");
        router.push("/resources");
      })
      .catch((error) => {
        console.error("Error adding subject:", error);
        toast.error("Error adding subject");
      });
  };

  return (
    <>
      <div className="container-fluid">
        <div className="container-stack">
          <div className="btn btn-slim btn-faded" onClick={() => router.back()}>
            <i className="fa-regular fa-arrow-left icon-left"></i>Back
          </div>
          <div className="container-narrative">
            <h1>Add Subject</h1>
            <p>
              Use this form to add a subject. You can add the code, title, and
              description.
            </p>
          </div>
        </div>
        <div className="container-stack-horizontal">
          <div className="container-sidebar">
            <div className="stack-title-card">
              <i className="fa-regular fa-file"></i>
              <h1>Add Subject</h1>
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
                <span className="stack-name">Subject</span>
              </div>
            </div>
          </div>
          <div className="container-card">
            <div className="container-card-header">
              <h2>Add Subject</h2>
            </div>
            <hr className="divider-horizontal" />
            <div className="container-card-form form">
              <div className="form-input">
                <label htmlFor="code">Code</label>
                <input
                  type="text"
                  name="code"
                  id="code"
                  placeholder="CSE101"
                  value={subject.code}
                  onChange={handleInput}
                />
              </div>
              <div className="form-input">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  placeholder="Introduction to Computer Science"
                  value={subject.title}
                  onChange={handleInput}
                />
              </div>
              <div className="form-input">
                <label htmlFor="description">Description (Optional)</label>
                <input
                  name="description"
                  id="description"
                  placeholder="This is an introductory course to computer science."
                  value={subject.description}
                  onChange={handleInput}
                />
              </div>
              <div className="form-input form-btns">
                <Link className="btn" href={`/resources/`}>
                  Cancel
                </Link>
                <button className="btn btn-primary" onClick={handleSubmit}>
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
