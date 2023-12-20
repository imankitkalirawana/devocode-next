"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import axios from "axios";
import Link from "next/link";
import Head from "next/head";
import NewsBanner from "@/components/NewsBanner";
import Banner from "@/components/Banner";
import HomeWarning from "@/components/HomeWarning";


import "./style.css";

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
      <div className="container-fluid">
        <NewsBanner />
        <Banner />
        <HomeWarning />
      </div>
    </>
  );
}
