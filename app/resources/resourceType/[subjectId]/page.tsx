"use client";
import axios from "axios";
import { useEffect, useState } from "react";

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
  "ca",
  "endterm",
  "midterm",
  "mcqs",
  "moocs",
  "notes",
  "reference",
  "syllabus",
];

export default function Subject({ params }: SubjectPageProps) {
  const [subject, setSubject] = useState<Subject>();

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const response = await axios.get(
          `/api/subjects/subject?id=${params.subjectId}`
        );
        setSubject(response.data);
      } catch (error) {
        console.error("Error fetching subject:", error);
      }
    };
    fetchSubject();
  }, [params.subjectId]);

  return (
    <div>
      <h1>Resources Types</h1>
      <ul>
        {resourcesType.map((resourceType) => (
          <li key={resourceType}>
            <a href={`/resources/${resourceType}/${params.subjectId}`}>
              {resourceType}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
