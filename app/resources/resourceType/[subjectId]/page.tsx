"use client";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import NotFound from "@/components/Error";
import SkeletonCard from "@/components/SkeletonCard";

interface Subject {
  code: string;
  title: string;
  description: string;
  _id: string;
}

interface SubjectPageProps {
  params: {
    subjectId: string;
  };
}

const resourcesType = [
  "endterm",
  "ca",
  "mcqs",
  "midterm",
  "moocs",
  "notes",
  "reference",
  "syllabus",
];

export default function Subject({ params }: SubjectPageProps) {
  const [subject, setSubject] = useState<Subject>();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const response = await axios.get(
          `/api/subjects/subject?id=${params.subjectId}`
        );
        setSubject(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching subject:", error);
      }
    };
    fetchSubject();
  }, [params.subjectId]);

  // filtered resources
  const filteredResourcesType = resourcesType.filter((resourceType) =>
    resourceType.includes(searchQuery.toLowerCase())
  );

  return (
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
        <span className="breadcrumbs-item selected">{subject?.code}</span>
      </div>
      <h2 className="section-title">
        {loading ? (
          <Skeleton width={500} />
        ) : (
          <>
            {subject?.code} - {subject?.title}
          </>
        )}
      </h2>
      <div className="form-input">
        <label htmlFor="search">Search</label>
        <input
          id="search"
          className="input"
          name="hidden"
          type="text"
          placeholder="MCQs, Notes, etc."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="section-content">
        <div className="section-menu">
          {loading &&
            Array.from({ length: 10 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          {filteredResourcesType.length === 0 && !loading ? (
            <NotFound title="404" message="No search results" />
          ) : (
            filteredResourcesType
              .filter((resource) =>
                resource.includes(searchQuery.toLowerCase())
              )
              .sort()
              .map((resourceType, index) => (
                <div
                  onClick={() =>
                    router.push(
                      `/resources/${resourceType}/${params.subjectId}`
                    )
                  }
                  key={index}
                  className="section-card"
                >
                  <div className="section-card-upper">
                    <div className="section-card-upper-left">
                      <i className="fa-solid fa-folder"></i>
                      <div className="section-card-details">
                        <h3 className="section-card-title-short">
                          {resourceType}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
