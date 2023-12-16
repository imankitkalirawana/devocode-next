import Image from "next/image";
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
        href={"https://forms.gle/yAb95M9ToQGgyWuP8"}
        className="news-banner-btn btn btn-slim btn-round "
      >
        <span className="btn-txt">Contribute</span>
        <Image
          src="/icons/arrow-small-right.svg"
          alt="bug"
          width={20}
          height={20}
          className="icon icon-right"
        />
      </Link>
    </div>
  );
};

export default NewsBanner;
