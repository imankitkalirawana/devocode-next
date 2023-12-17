"use client";
import React from "react";

const Admin = () => {
  //  handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    window.location.href = "/auth/login";
  };
  return (
    <div>
      Admin
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Admin;
