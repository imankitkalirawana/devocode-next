"use client";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Popup from "reactjs-popup";
import { isLoggedIn } from "@/utils/authUtils";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import S3 from "aws-sdk/clients/s3";
import SkeletonCard from "@/components/SkeletonCard";
import NotFound from "@/components/Error";
import AddedTime from "@/components/AddedTime";
import dynamic from "next/dynamic";
import Image from "next/image";

const s3 = new S3({
  accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY,
  region: process.env.NEXT_PUBLIC_REGION,
});

interface PageProps {
  params: {
    subjectCode: string;
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

const Page = ({ params }: PageProps) => {
  const { subjectCode, resourceType } = params;
  const [subject, setSubject] = useState<Subject | undefined>(undefined);
  const [resources, setResources] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { loggedIn } = isLoggedIn();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);

  const fetchResources = async (subjectId: string) => {
    try {
      const response = await axios.get(
        `/api/subjects/resource?subjectId=${subjectId}&resourceType=${params.resourceType}`
      );
      setResources(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching resources:", error);
    }
  };

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        await axios
          .get(`/api/subjects/subject-code?subjectCode=${subjectCode}`)
          .then((res) => {
            fetchResources(res.data._id);
            setSubject(res.data);
          });
      } catch (error) {
        console.error("Error fetching subject:", error);
      }
    };
    fetchSubject();
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
              fetchResources(subject?._id || "");
              router.push(`/resources/${subjectCode}/${resourceType}`);
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

  const deleteUrl = async (id: string) => {
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
          router.push(`/resources/${subjectCode}/${resourceType}`);
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
      Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME,
      Key: filename,
    };

    try {
      const url = await s3.getSignedUrlPromise("getObject", params);
      window.open(url, "_blank");
    } catch (err) {
      console.error(err);
    }
  };

  const filteredResources = resources.filter(
    (resource) =>
      (resource &&
        (resource.title || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      (resource.description || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );
  // open link in new tab
  const openLink = (url: string) => {
    window.open(url, "_blank");
  };

  const openFile = (file: string) => {
    window.open(`/api/file/view?filename=${file}`, "_blank");
  };

  // sort resources with title
  resources.sort((a, b) => {
    if (a.title < b.title) {
      return -1;
    }
    if (a.title > b.title) {
      return 1;
    }
    return 0;
  });

  return (
    <>
      <div className="section resources">
        <div className="breadcrumbs">
          <Link className="breadcrumbs-item" href="/">
            Home
          </Link>
          <Image
            src="/icons/angle-small-right.svg"
            alt="angle"
            width={20}
            height={20}
            className="icon breadcrumbs-item icon-faded"
          />
          <Link className="breadcrumbs-item" href="/resources">
            Subjects
          </Link>
          <Image
            src="/icons/angle-small-right.svg"
            alt="angle"
            width={20}
            height={20}
            className="icon breadcrumbs-item icon-faded"
          />
          <Link className="breadcrumbs-item" href={`/resources/${subjectCode}`}>
            {subjectCode}
          </Link>
          <Image
            src="/icons/angle-small-right.svg"
            alt="angle"
            width={20}
            height={20}
            className="icon breadcrumbs-item icon-faded"
          />
          <span className="breadcrumbs-item selected">{resourceType}</span>
          {loggedIn && (
            <Link
              href={`/resources/add/${resourceType}/${subject?._id}`}
              className="breadcrumbs-item selected btn"
            >
              <Image
                src="/icons/add.svg"
                alt="add"
                width={20}
                height={20}
                className="icon icon-faded icon-m"
              />
            </Link>
          )}
        </div>

        <h2 className="section-title">{resourceType}</h2>
        {resources.length > 0 && (
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
        )}
        <div className="section-content">
          <div className="section-menu">
            {loading ? (
              Array.from({ length: 12 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            ) : filteredResources.length === 0 && !loading ? (
              <NotFound title="404" message="No resources found" />
            ) : (
              filteredResources.map((resource, index) => (
                <div
                  className="section-card"
                  key={index}
                  onClick={() =>
                    resourceType === "link" || resourceType === "moocs"
                      ? openLink(resource.url)
                      : openFile(resource.file)
                  }
                  title={resource.title}
                >
                  <div className="section-card-upper">
                    <div className="section-card-upper-left">
                      <Image
                        src={`/icons/${
                          resourceType === "link" || resourceType === "moocs"
                            ? "share-square"
                            : "document"
                        }.svg`}
                        alt="bug"
                        width={20}
                        height={20}
                        className="icon icon-m"
                      />
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
                        <Image
                          src="/icons/menu-dots-vertical.svg"
                          alt="menu"
                          width={20}
                          height={20}
                          className="icon icon-faded icon-xs"
                        />
                      </button>
                      <div className="section-dropdown-content">
                        {resourceType === "link" ||
                        resourceType === "moocs" ? null : (
                          <a
                            className="section-dropdown-item"
                            onClick={() => handleDownload(resource.file)}
                          >
                            <Image
                              src="/icons/download.svg"
                              alt="download"
                              width={20}
                              height={20}
                              className="icon icon-faded icon-xs icon-left"
                            />
                            Download
                          </a>
                        )}

                        {loggedIn && (
                          <>
                            <Link
                              className="section-dropdown-item"
                              href={`/resources/update/${resourceType}/${resource._id}`}
                            >
                              <Image
                                src="/icons/pencil.svg"
                                alt="edit"
                                width={20}
                                height={20}
                                className="icon icon-faded icon-xs icon-left"
                              />
                              Edit
                            </Link>
                            <Popup
                              trigger={
                                <span className="section-dropdown-item btn-danger">
                                  <Image
                                    src="/icons/trash-danger.svg"
                                    alt="delete"
                                    width={20}
                                    height={20}
                                    className="icon icon-inverted icon-xs icon-left"
                                  />
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
                                        resourceType === "link" ||
                                        resourceType === "moocs"
                                          ? deleteUrl(resource._id)
                                          : handleDelete(
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
                    <AddedTime dateString={resource.addedDate} />
                    {/* <span>2h ago</span> */}
                    <span>
                      {resource.filesize
                        ? `${parseInt(resource.filesize)}MB`
                        : ""}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default dynamic(() => Promise.resolve(Page), { ssr: false });
