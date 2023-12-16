import Image from "next/image";
import React from "react";

const HomeWarning = () => {
  return (
    <div>
      {/* under developement notice */}
      <div className="section-warning">
        <div className="section-warning-content">
          <Image
            src="/icons/triangle-warning.svg"
            alt="bug"
            width={100}
            height={100}
          />
          <p>
            This website is under developement. You may face some issues while
            using it. Please report any issues to the developer.
          </p>
        </div>
        <div className="section-warning-button">
          <a
            className="btn btn-primary"
            href="https://telegram.me/divinelydeveloper"
            target="_blank"
          >
            <Image
              src="/icons/bug-slash.svg"
              alt="bug"
              width={20}
              height={20}
              className="icon icon-left icon-inverted icon-s"
            />
            <span>Report Issue</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomeWarning;
