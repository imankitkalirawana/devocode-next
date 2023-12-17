"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";

interface SubjectPageProps {
  params: {
    subjectId: string;
    resourceType: string;
  };
}

interface Subject {
  code: string;
  title: string;
  description: string;
  _id: string;
}

interface Resource {
  _id: string;
  title: string;
  url: string;
  description: string;
  file: string;
  filesize: string;
  addedDate: Date;
}

const page = ({ params }: SubjectPageProps) => {
  const { subjectId, resourceType } = params;
  const [subject, setSubject] = useState<Subject>();
  const [resources, setResources] = useState<Resource[]>([]);

  // fetch subjects from api

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

    const fetchResources = async () => {
      try {
        const response = await axios.get(
          `/api/subjects/resource?subjectId=${params.subjectId}&resourceType=${params.resourceType}`
        );
        setResources(response.data);
      } catch (error) {
        console.error("Error fetching resources:", error);
      }
    };
    fetchResources();
  }, [params.subjectId, params.resourceType]);

  // fetch resources from api

  return (
    <div>
      <h1>Resources</h1>
      <h2>{subject?.code}</h2>
      <ul>
        {resources.map((resource) => (
          <li key={resource._id}>
            <a href={`/resources/${resourceType}/${subjectId}/${resource._id}`}>
              {resource.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default page;
