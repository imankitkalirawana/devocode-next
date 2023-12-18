"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { isLoggedIn } from "@/utils/authUtils";
import { useRouter } from "next/navigation";

interface Subject {
  code: string;
  title: string;
  description: string;
  _id: string;
}

export default function Resources() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const { loggedIn } = isLoggedIn();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get("/api/subjects/subject");
        setSubjects(response.data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };
    fetchSubjects();
  }, []);

  return (
    <div>
      <div className="section resources">
        <div className="section-title">Subjects</div>
        <div className="breadcrumbs">
          <Link className="breadcrumbs-item" href="/">
            Home
          </Link>
          <i className="fas fa-chevron-right breadcrumbs-item"></i>
          <span className="breadcrumbs-item selected">Subjects</span>
        </div>
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
        <div className="section-content">
          <div className="section-menu">
            {subjects
              .filter(
                (subject) =>
                  subject.code
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  subject.title
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  subject.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
              )
              .map((subject, index) => (
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
                            Edit
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="section-card-lower">
                    {/* <AddedTime dateString={subject.addedDate} /> */}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
