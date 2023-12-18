"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import axios from "axios";
import Link from "next/link";
import Head from "next/head";

interface Subject {
  title: string;
  _id: string;
}

export default function Home() {
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
    <>
      <Head>
        <title>Resources</title>
        <meta name="description" content="Resources" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <main className={styles.main}>
          <div className="card card-auth">
            <Link className="btn " href="/auth/login">
              Login
            </Link>
            <Link href="/auth/register">Register</Link>
          </div>
          <div className="card">
            <h1 className={styles.title}>Subjects</h1>

            {subjects.map((subject, index) => (
              <li key={index}>{subject.title}</li>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
