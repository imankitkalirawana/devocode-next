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
import NotFound from "@/components/Error";
import SkeletonCard from "@/components/SkeletonCard";
import Image from "next/image";

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

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        let cachedSubjects = sessionStorage.getItem("subjects");
        if (cachedSubjects) {
          setSubjects(JSON.parse(cachedSubjects));
          setLoading(false);
        }
        const response = await axios.get("/api/subjects/subject");
        setSubjects(response.data);
        sessionStorage.setItem("subjects", JSON.stringify(response.data));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching subjects:", error);
        toast.error("Error fetching subjects");
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  // handle delete
  const handleDelete = async (subjectCode: string) => {
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
            success: "Subject deleted",
            error: "Error deleting subject",
          }
        )
        .then(() => {
          // fetchSubjectsHere
          setSubjects(
            subjects.filter((subject) => subject.code !== subjectCode)
          );
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
          <Image
            src="/icons/angle-small-right.svg"
            alt="angle"
            width={20}
            height={20}
            className="icon breadcrumbs-item icon-faded"
          />
          <span className="breadcrumbs-item selected">Subjects</span>
          {loggedIn && (
            <Link
              className="breadcrumbs-item btn"
              href="/resources/add/subject"
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
            {loading ? (
              Array.from({ length: 12 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            ) : filteredSubjects.length === 0 && !loading ? (
              <NotFound title="404" message="No subjects found" />
            ) : (
              filteredSubjects.map((subject, index) => (
                <div
                  onClick={() => {
                    router.push(`/resources/${subject.code}`);
                  }}
                  key={index}
                  className="section-card"
                >
                  <div className="section-card-upper">
                    <div className="section-card-upper-left">
                      <Image
                        src="/icons/folder.svg"
                        alt="bug"
                        width={20}
                        height={20}
                        className="icon icon-m"
                      />
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
                          <Image
                            src="/icons/menu-dots-vertical.svg"
                            alt="menu"
                            width={20}
                            height={20}
                            className="icon icon-faded icon-xs"
                          />
                        </button>
                        <div className="section-dropdown-content">
                          <Link
                            className="section-dropdown-item"
                            href={`/resources/${subject.code}/update`}
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
                              <a className="section-dropdown-item danger">
                                <Image
                                  src="/icons/trash-danger.svg"
                                  alt="trash"
                                  width={20}
                                  height={20}
                                  className="icon icon-inverted icon-xs icon-left"
                                />
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
                                    onClick={() => handleDelete(subject.code)}
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
