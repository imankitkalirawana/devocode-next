"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

interface Subject {
  code: string;
  title: string;
  _id: string;
}

export default function Resources() {
  const [subjects, setSubjects] = useState<Subject[]>([]);

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
      <h1>Resources</h1>
      <ul>
        {subjects.map((subject, index) => (
          <Link key={index} href={`/resources/resourceType/${subject._id}`}>
            <li>{subject.code}</li>
          </Link>
        ))}
      </ul>
    </div>
  );
}
