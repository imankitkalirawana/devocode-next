import React from "react";

const HomeWarning = () => {
  return (
    <div>
      {/* under developement notice */}
      <div className="section-warning">
        <div className="section-warning-content">
          <i className="fa-solid fa-exclamation-triangle"></i>
          <p>
            This website is under developement. You may face some issues while
            using it. Please report any issues to the developer.
          </p>
        </div>
        <div className="section-warning-button">
          <a
            className="btn btn-primary"
            href="https://github.com/imankitkalirawana/devocode/issues"
            target="_blank"
          >
            <i className="fa-brands fa-github"></i>
            <span>Report Issue</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomeWarning;
