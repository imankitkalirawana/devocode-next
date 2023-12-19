"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/utils/authUtils";
import Popup from "reactjs-popup";
import { toast } from "react-toastify";

interface PageProps {
  params: {
    resourceId: string;
    resourceType: string;
  };
}

interface Resource {
  _id: string;
  title: string;
  url: string;
  description: string;
  file: string;
  subject: {
    $oid: string;
  };
}

const Page = ({ params }: PageProps) => {
  const { resourceId, resourceType } = params;
  const [resource, setResource] = useState<Resource>({} as Resource);
  const loggedIn = isLoggedIn();
  const router = useRouter();

  useEffect(() => {
    if (!loggedIn) {
      router.push("/login");
    }
  }, []);

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setResource({ ...resource, [e.target.name]: e.target.value });
  };

  //   get resource from api
  const fetchResources = async () => {
    try {
      const response = await axios.get(
        `/api/subjects/resource?resourceId=${resourceId}&resourceType=${resourceType}`
      );
      setResource(response.data);
    } catch (error) {
      console.error("Error fetching resources:", error);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleSubmit = async () => {
    // check empty title
    if (resource.title === undefined || resource.title === "") {
      toast.error("Please enter a title");
      return;
    }

    await toast
      .promise(
        axios
          .put(
            `/api/subjects/resource?resourceId=${resourceId}&resourceType=${resourceType}`,
            resource,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
          .then((response) => {
            console.log("response:", response);
            fetchResources();
          }),
        {
          pending: "Updating resource...",
          success: "Updated successfully!",
          error: "Error updating!",
        }
      )
      .then(() => {
        router.push(`/resources/${resourceType}/${resource.subject}`);
      });
  };

  const handleDelete = async () => {
    await toast
      .promise(
        axios
          .delete(
            `/api/subjects/resource?resourceId=${resourceId}&resourceType=${resourceType}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
          .then(() => {
            axios
              .delete(`/api/file/file?filename=${resource.file}`, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              })
              .catch((error) => {
                console.error("Error deleting file:", error);
              });
          }),
        {
          pending: "Deleting resource...",
          success: "Resource deleted successfully!",
          error: "Error deleting resource",
        }
      )
      .then(() => {
        router.push(`/resources/${resourceType}/${resource.subject}`);
      });
  };
  return (
    <div className="container-fluid">
      <div className="container-stack">
        <div className="btn btn-slim btn-faded" onClick={() => router.back()}>
          <i className="fa-regular fa-arrow-left icon-left"></i>Back
        </div>
        <div className="container-narrative">
          <h1>Update File</h1>
          <p>
            Use this form to update a file. You can update the title, file, and
            description.
          </p>
        </div>
      </div>
      <div className="container-stack-horizontal">
        <div className="container-sidebar">
          <div className="stack-title-card">
            <i className="fa-regular fa-file"></i>
            <h1>{resource.title}</h1>
          </div>
          <div className="divider-horizontal"></div>
          <div className="stack-details">
            <div className="stack-progress">
              <div className="progress-circle"></div>
              <div className="progress-line"></div>
              <span className="stack-name">{resource.title}</span>
            </div>
            <div className="stack-progress">
              <div className="progress-circle"></div>
              <div className="progress-line"></div>
              <span className="stack-name">Update</span>
            </div>
            <div className="stack-progress">
              <div className="progress-circle"></div>
              <div className="progress-line"></div>
              <span className="stack-name">{resourceType}</span>
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
            <h2>Update File</h2>
          </div>
          <hr className="divider-horizontal" />
          <div className="container-card-form form">
            <div className="form-input">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                name="title"
                id="title"
                placeholder="my-file"
                value={resource.title}
                onChange={handleInput}
              />
            </div>
            <div className="form-input">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                name="description"
                id="description"
                placeholder="This is my file."
                value={resource.description}
                onChange={handleInput}
              />
            </div>
            <div className="form-input form-btns">
              <Popup
                trigger={<button className="btn btn-danger">Delete</button>}
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
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              </Popup>

              <button className="btn btn-primary" onClick={handleSubmit}>
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
