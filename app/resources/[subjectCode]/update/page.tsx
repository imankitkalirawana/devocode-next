"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/utils/authUtils";
import axios from "axios";
import Popup from "reactjs-popup";
import { toast } from "react-toastify";

interface PageProps {
  params: {
    subjectCode: string;
  };
}

interface Subject {
  _id: string;
  title: string;
  code: string;
  description: string;
}

const UpdateSubject = ({ params }: PageProps) => {
  const { subjectCode } = params;
  const [subject, setSubject] = useState<Subject>({} as Subject);
  const [processing, setProcessing] = useState<boolean>(false);
  const { loggedIn } = isLoggedIn();
  const Router = useRouter();

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSubject({ ...subject, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (!loggedIn) {
      Router.push("/auth/login");
    }
    const fetchSubject = async () => {
      try {
        const response = await axios.get(
          `/api/subjects/subject-code?subjectCode=${subjectCode}`
        );
        setSubject(response.data);
      } catch (error) {
        console.error("Error fetching subject:", error);
      }
    };
    fetchSubject();
  }, [loggedIn, Router]);

  const handleSubmit = async () => {
    setProcessing(true);
    // handle empty fields
    if (subject.code === "" || subject.title === "") {
      toast.error("Please fill in all fields");
      setProcessing(false);
      return;
    }
    try {
      await toast.promise(
        axios.put(
          `/api/subjects/subject-code?subjectCode=${subjectCode}`,
          subject,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
        {
          pending: "Updating subject...",
          success: "Subject updated successfully!",
          error: "Error updating subject",
        }
      );

      Router.push("/resources");
    } catch (error) {
      console.error("Error updating subject:", error);
      toast.error("Error updating subject");
    }
    setProcessing(false);
  };

  const handleDelete = async () => {
    setProcessing(true);
    try {
      await toast
        .promise(
          axios.delete(
            `/api/subjects/subject-code?subjectCode=${subjectCode}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          ),
          {
            pending: "Deleting subject...",
            success: "Subject deleted successfully!",
            error: "Error deleting subject",
          }
        )
        .then(() => {
          Router.push("/resources");
        });
    } catch (error) {
      console.error("Error deleting subject:", error);
      toast.error("Error deleting subject");
    }
    setProcessing(false);
  };

  return (
    <div className="container-fluid">
      <div className="container-stack">
        <div className="btn btn-slim btn-faded" onClick={() => Router.back()}>
          <i className="fa-regular fa-arrow-left icon-left"></i>Back
        </div>
        <div className="container-narrative">
          <h1>Update Subject</h1>
          <p>
            Use this form to update a subject. You can update the code, title,
            and description.
          </p>
        </div>
      </div>
      <div className="container-stack-horizontal">
        <div className="container-sidebar">
          <div className="stack-title-card">
            <i className="fa-regular fa-file"></i>
            <h1>{subject.code}</h1>
          </div>
          <hr className="divider-horizontal" />
          <div className="stack-details">
            <div className="stack-progress">
              <div className="progress-circle"></div>
              <div className="progress-line"></div>
              <span className="stack-name">{subject.code}</span>
            </div>
            <div className="stack-progress">
              <div className="progress-circle"></div>
              <div className="progress-line"></div>
              <span className="stack-name">Subjects</span>
            </div>
          </div>
        </div>
        <div className="container-card">
          <div className="container-card-header">
            <h2>Update Subject</h2>
          </div>
          <hr className="divider-horizontal" />
          <div className="container-card-form form">
            <div className="form-input">
              <label htmlFor="code">Code</label>
              <input
                type="text"
                name="code"
                id="code"
                placeholder="Enter subject code"
                value={subject.code}
                onChange={handleInput}
                disabled={processing}
              />
            </div>
            <div className="form-input">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                name="title"
                id="title"
                placeholder="Enter subject title"
                value={subject.title}
                onChange={handleInput}
                disabled={processing}
              />
            </div>
            <div className="form-input">
              <label htmlFor="description">Description</label>
              <input
                name="description"
                id="description"
                placeholder="Enter subject description"
                value={subject.description}
                onChange={handleInput}
                disabled={processing}
              />
            </div>
            <div className="form-input form-btns">
              <Popup
                trigger={
                  <button className="btn btn-danger" disabled={processing}>
                    <i className="fa-regular fa-trash icon-left"></i>
                    Delete
                  </button>
                }
              >
                <>
                  <div className="popup">
                    <div className="popup-upper">
                      <div className="popup-title">Delete</div>
                      <div className="popup-message">Are you sure?</div>
                    </div>
                    <hr className="divider-horizontal" />
                    <div className="popup-btns">
                      <button className="btn btn-danger" onClick={handleDelete}>
                        <i className="fa-regular fa-trash icon-left"></i>
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              </Popup>
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <i className="fa-duotone fa-spinner icon-left rotating"></i>{" "}
                    Updating...
                  </>
                ) : (
                  <>
                    <i className="fa-duotone fa-check icon-left"></i> Update
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateSubject;
