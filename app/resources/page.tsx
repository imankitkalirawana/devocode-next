// /resources

"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { isLoggedIn } from "@/utils/authUtils";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddedTime from "@/components/AddedTime";
import Popup from "reactjs-popup";
import dynamic from "next/dynamic";
import Skeleton from "react-loading-skeleton";
import NotFound from "@/components/Error";
import SkeletonCard from "@/components/SkeletonCard";

interface Subject {
  code: string;
  title: string;
  description: string;
  addedDate: Date;
  _id: string;
}

const Resources = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const { loggedIn } = isLoggedIn();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get("/api/subjects/subject");
      setSubjects(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      toast.error("Error fetching subjects");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // handle delete
  const handleDelete = async (id: string) => {
    try {
      await toast
        .promise(
          axios.delete(`/api/subjects/subject?id=${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          {
            pending: "Deleting subject...",
            success: "Subject deleted",
            error: "Error deleting subject",
          }
        )
        .then(() => {
          fetchSubjects();
          router.push("/resources");
        });
    } catch (error) {
      console.error("Error deleting subject:", error);
      toast.error("Error deleting subject");
    }
  };

  // sort subjects with code
  subjects.sort((a, b) => {
    if (a.code < b.code) {
      return -1;
    }
    if (a.code > b.code) {
      return 1;
    }
    return 0;
  });

  const filteredSubjects = subjects.filter(
    (subject) =>
      (subject &&
        (subject.code || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      (subject.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (subject.description || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="section resources">
        <div className="section-title">Subjects</div>
        <div className="breadcrumbs">
          <Link className="breadcrumbs-item" href="/">
            Home
          </Link>
          <i className="fas fa-chevron-right breadcrumbs-item"></i>
          <span className="breadcrumbs-item selected">Subjects</span>
          {loggedIn && (
            <Link
              className="breadcrumbs-item btn"
              href="/resources/add/subject"
            >
              <i className="fa-solid fa-circle-plus"></i>
            </Link>
          )}
        </div>
        {subjects.length > 0 && (
          <div className="form-input">
            <label htmlFor="search">Search</label>
            <input
              id="search"
              className="input"
              type="text"
              name="hidden"
              placeholder="CSE101, MTH302, etc."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
        <div className="section-content">
          <div className="section-menu">
            {loading &&
              Array.from({ length: 12 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            {filteredSubjects.length === 0 && !loading ? (
              <NotFound title="404" message="No subjects found" />
            ) : (
              filteredSubjects.map((subject, index) => (
                <div
                  onClick={() => {
                    router.push(`/resources/resourceType/${subject._id}`);
                  }}
                  key={index}
                  className="section-card"
                >
                  <div className="section-card-upper">
                    <div className="section-card-upper-left">
                      <i className="fa-solid fa-folder"></i>
                      <div className="section-card-details">
                        <h3 className="section-card-title-short">
                          {subject.code}
                        </h3>
                        <p className="section-card-title">{subject.title}</p>
                      </div>
                    </div>
                    {loggedIn && (
                      <div
                        className="section-card-btn"
                        onClick={(event) => {
                          event.stopPropagation();
                          console.log("Performing other action");
                        }}
                      >
                        <button className="btn btn-faded">
                          <i className="fa-solid fa-ellipsis-vertical"></i>
                        </button>
                        <div className="section-dropdown-content">
                          <Link
                            className="section-dropdown-item"
                            href={`/resources/update/subject/${subject._id}`}
                          >
                            <i className="fa-regular fa-edit icon-left"></i>
                            Edit
                          </Link>
                          <Popup
                            trigger={
                              <a className="section-dropdown-item danger">
                                <i className="fa-regular fa-trash icon-left"></i>
                                Delete
                              </a>
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
                                    onClick={() => handleDelete(subject._id)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </>
                          </Popup>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="section-card-lower">
                    <AddedTime dateString={subject.addedDate} />
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

export default dynamic(() => Promise.resolve(Resources), { ssr: false });
