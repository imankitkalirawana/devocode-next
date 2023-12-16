import Image from "next/image";
import React from "react";

interface Props {
  title: string;
  message: string;
}

const NotFound = ({ title, message }: Props) => {
  return (
    <div className="error-page">
      <Image
        className="error-page-img"
        src="/error.svg"
        alt="404 not found"
        width={300}
        height={300}
      />
      <h1 className="error-page-title">{title}</h1>
      <p className="error-page-message">{message}</p>
    </div>
  );
};

export default NotFound;
