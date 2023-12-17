import React from "react";

interface SubjectPageProps {
  params: {
    resourceType: string;
  };
}

const page = ({ params }: SubjectPageProps) => {
  return <div>[resourceType]</div>;
};

export default page;
