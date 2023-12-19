import Link from "next/link";
import React from "react";

const Banner = () => {
  return (
    <>
      <div className="banner">
        <div className="banner-text">
          <h2 className="primary-text">Learn Anything, Anywhere, Anytime</h2>
          <p className="faded">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt
            quisquam eos nulla, aspernatur nobis sunt!
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
          <img className="img" src="/Banner.png" alt="" />
        </div>
      </div>
    </>
  );
};

export default Banner;
