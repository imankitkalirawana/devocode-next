import Link from "next/link";
import React from "react";

const NewsBanner = () => {
  return (
    <div className="news-banner">
      <span className="news-banner-icon success-icon">New</span>
      <span className="news-banner-text">
        <p>
          Contribute to the community by adding resources and study materials,
          to make it free and accessible to everyone.
        </p>
      </span>
      <Link
        href={"/contribute"}
        className="news-banner-btn btn btn-slim btn-round "
      >
        <span className="btn-txt">Contribute</span>
        <i className="fa-regular fa-arrow-right"></i>
      </Link>
    </div>
  );
};

export default NewsBanner;
