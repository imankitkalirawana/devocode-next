"use client";
import axios from "axios";
import { useEffect, useState } from "react";

interface Subject {
  code: string;
  title: string;
  _id: string;
}

interface SubjectPageProps {
  params: {
    subjectId: string;
  };
}

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
  }, []);

  return (
    <div>
      <h1>Resources {subject?.code}</h1>
      <ul></ul>
    </div>
  );
}
