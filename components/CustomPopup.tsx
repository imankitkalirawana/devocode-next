import React, { useState } from "react";

// popup based upon status
// status: idle, success, error

interface Props {
  status: string;
  message: string;
  title: string;
}

const Popup: React.FC<Props> = ({ status, message, title }) => {
  return (
    <>
      <div className={`snackbar ${status}`}>
        <div className="snackbar-icon">
          <i
            className={`fa-sharp fa-solid fa-circle-${
              status == "error" ? "exclamation" : "check"
            }`}
          ></i>
        </div>
        <div className="snackbar-details">
          <div className="snackbar-title">{title}</div>
          <div className="snackbar-message">{message}</div>
        </div>
        <div className="snackbar-progress">
          <div className="snackbar-progress-bar"></div>
        </div>
      </div>
    </>
  );
};

export default Popup;
