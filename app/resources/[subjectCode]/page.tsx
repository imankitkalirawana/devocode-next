"use client";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import NotFound from "@/components/Error";
import SkeletonCard from "@/components/SkeletonCard";
import Image from "next/image";

interface Subject {
  code: string;
  title: string;
  description: string;
  _id: string;
}

const resourcesType = [
  "endterm",
  "ca",
  "link",
  "mcqs",
  "midterm",
  "moocs",
  "notes",
  "reference",
  "syllabus",
];

interface PageProps {
  params: {
    subjectCode: string;
  };
}

const Page = ({ params }: PageProps) => {
  const { subjectCode } = params;
  const [subject, setSubject] = useState<Subject>();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        let cachedSubject = sessionStorage.getItem(subjectCode);
        if (cachedSubject) {
          setSubject(JSON.parse(cachedSubject));
          setLoading(false);
        }
        const response = await fetch(
          `/api/subjects/subject-code?subjectCode=${subjectCode}`
        );
        const data = await response.json();
        setLoading(false);
        setSubject(data);
        sessionStorage.setItem(subjectCode, JSON.stringify(data));
      } catch (err) {
        console.error("Error fetching subject:", err);
      }
    };
    fetchSubjects();
  }, []);

  const filteredResourcesType = resourcesType.filter((resourceType) =>
    resourceType.includes(searchQuery.toLowerCase())
  );

  return (
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
        <span className="breadcrumbs-item selected">{subjectCode}</span>
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
          {loading ? (
            Array.from({ length: 10 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          ) : filteredResourcesType.length === 0 && !loading ? (
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
                    router.push(`/resources/${subjectCode}/${resourceType}`)
                  }
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
};

export default Page;
