// /resources/[resourceType]/[subjectId]/page.tsx
"use client";
import axios from "axios";
import Link from "next/link";
import React, {
  MouseEventHandler,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import Popup from "reactjs-popup";
import { isLoggedIn } from "@/utils/authUtils";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import S3 from "aws-sdk/clients/s3";

const s3 = new S3({
  accessKeyId: "AKIARVSJ7VXJAJGKXNOE",
  secretAccessKey: "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",
  region: "ap-south-1",
});

interface SubjectPageProps {
  params: {
    subjectId: string;
    resourceType: string;
  };
}

interface Subject {
  code: string;
  title: string;
  description: string;
  _id: string;
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

const Resource = ({ params }: SubjectPageProps) => {
  const { subjectId, resourceType } = params;
  const [subject, setSubject] = useState<Subject | undefined>(undefined);
  const [resources, setResources] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { loggedIn } = isLoggedIn();
  const router = useRouter();

  // fetch subjects from api
  const fetchSubject = async () => {
    try {
      const response = await axios.get(
        `/api/subjects/subject?id=${params.subjectId}`
      );
      setSubject(response.data);
    } catch (error) {
      console.error("Error fetching subject:", error);
      toast.error("Error fetching data");
    }
  };
  const fetchResources = async () => {
    try {
      const response = await axios.get(
        `/api/subjects/resource?subjectId=${params.subjectId}&resourceType=${params.resourceType}`
      );
      setResources(response.data);
    } catch (error) {
      console.error("Error fetching resources:", error);
    }
  };

  useEffect(() => {
    fetchSubject();
    fetchResources();
  }, []);

  const handleDelete = async (id: string, filename: string) => {
    await toast.promise(
      axios
        .delete(
          `/api/subjects/resource?resourceType=${resourceType}&resourceId=${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then(() => {
          axios
            .delete(`/api/file/file?filename=${filename}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            })
            .then(() => {
              fetchResources();
              router.push(`/resources/${resourceType}/${subjectId}`);
            });
        })
        .catch((error) => {
          console.error("Error deleting resource:", error);
        }),
      {
        pending: "Deleting resource...",
        success: "Resource deleted successfully!",
        error: "Error deleting resource",
      }
    );
  };

  const handleDownload = async (filename: string) => {
    const params = {
      Bucket: "devocode-resources",
      Key: filename,
    };

    try {
      const url = await s3.getSignedUrlPromise("getObject", params);
      window.open(url, "_blank");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {subject && (
        <div className="section resources">
          <div className="breadcrumbs">
            <Link className="breadcrumbs-item" href="/">
              Home
            </Link>
            <i className="fas fa-chevron-right breadcrumbs-item"></i>
            <Link className="breadcrumbs-item" href="/resources">
              Subjects
            </Link>
            <i className="fas fa-chevron-right breadcrumbs-item"></i>
            <Link
              className="breadcrumbs-item"
              href={`/resources/resourceType/${subjectId}`}
            >
              {subject.code}
            </Link>
            <i className="fas fa-chevron-right breadcrumbs-item"></i>
            <span className="breadcrumbs-item selected">{resourceType}</span>
            {loggedIn && (
              <Link
                href={`/resources/add/${resourceType}/${subjectId}`}
                className="breadcrumbs-item selected btn"
              >
                <i className="fa-solid fa-circle-plus"></i>
              </Link>
            )}
          </div>

          <h2 className="section-title">{resourceType}</h2>
          <div className="form-input">
            <label htmlFor="search">Search</label>
            <input
              id="search"
              className="input"
              name="hidden"
              type="text"
              placeholder={`Search ${resourceType}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="section-content">
            <div className="section-menu">
              {resources.map((resource, index) => (
                <div className="section-card" key={index}>
                  <div className="section-card-upper">
                    <div className="section-card-upper-left">
                      <i className="fa-solid fa-file"></i>
                      <div className="section-card-details">
                        <h3 className="section-card-title-short">
                          {resource.title}
                        </h3>
                        <p className="section-card-title">
                          {resource.description}
                        </p>
                      </div>
                    </div>
                    <div
                      className="section-card-btn"
                      onClick={(event) => {
                        event.stopPropagation();
                      }}
                    >
                      <button className="btn btn-faded">
                        <i className="fa-solid fa-ellipsis-vertical"></i>
                      </button>
                      <div className="section-dropdown-content">
                        <a
                          className="section-dropdown-item"
                          href={`/api/file/view?filename=${resource.file}`}
                          target="_blank"
                        >
                          <i className="fa-regular fa-arrow-up-right icon-left"></i>
                          View
                        </a>
                        <a
                          className="section-dropdown-item"
                          onClick={() => handleDownload(resource.file)}
                          download
                        >
                          <i className="fa-regular fa-download icon-left"></i>
                          Download
                        </a>

                        {loggedIn && (
                          <>
                            <Link
                              className="section-dropdown-item"
                              href={`/resources/update/${resourceType}/${resource._id}`}
                            >
                              <i className="fa-regular fa-edit icon-left"></i>
                              Edit
                            </Link>
                            <Popup
                              trigger={
                                <span className="section-dropdown-item btn-danger">
                                  <i className="fa-regular fa-trash icon-left"></i>
                                  Delete
                                </span>
                              }
                            >
                              <>
                                <div className="popup">
                                  <div className="popup-upper">
                                    <div className="popup-title">Delete</div>
                                    <div className="popup-message">
                                      Are you sure?
                                    </div>
                                  </div>
                                  <hr className="divider-horizontal" />
                                  <div className="popup-btns">
                                    <button
                                      className="btn btn-danger"
                                      onClick={() =>
                                        handleDelete(
                                          resource._id,
                                          resource.file
                                        )
                                      }
                                    >
                                      <i className="fa-regular fa-trash icon-left"></i>
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </>
                            </Popup>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="section-card-lower">
                    {/* <AddedTime dateString={file.addedDate} /> */}
                    <span>2h ago</span>
                    <span>
                      {resource.filesize
                        ? `${parseInt(resource.filesize)}MB`
                        : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Resource;
