"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import axios from "axios";

interface Subject {
  title: string;
  _id: string;
}

export default function Home() {
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get("/api/getSubjects");
        setSubjects(response.data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };
    fetchSubjects();
  }, []);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {subjects.map((subject, index) => (
          <li key={index}>{subject.title}</li>
        ))}
      </main>
    </div>
  );
}
