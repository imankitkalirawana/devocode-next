import Image from "next/image";
import Link from "next/link";
import React from "react";

const Banner = () => {
  return (
    <>
      <div className="banner">
        <div className="banner-text">
          <h2 className="primary-text">Learn Anything, Anywhere, Anytime</h2>
          <p className="faded">
            Get access to the organized collection of resources for your
            curriculum.
          </p>
          <div className="btns">
            <Link className="btn btn-primary" href="/resources">
              Resources
            </Link>
            <a
              href="https://forms.gle/yAb95M9ToQGgyWuP8"
              target="_blank"
              className="btn"
            >
              Contribute
            </a>
          </div>
        </div>
        <div className="banner-img">
          <Image
            className="img"
            src="/Banner.webp"
            alt="banner-img"
            width={500}
            height={500}
          />
        </div>
      </div>
    </>
  );
};

export default Banner;
