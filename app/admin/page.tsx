"use client";
import React, { useEffect } from "react";
import { isLoggedIn } from "@/utils/authUtils";
import { redirect } from "next/navigation";

const Admin = () => {
  const { loggedIn, user } = isLoggedIn();
  useEffect(() => {
    if (!loggedIn || !user) {
      redirect("/auth/login");
    }
    if (loggedIn && user.role !== "admin") {
      window.location.href = "/resources";
    }
  }, [loggedIn, user]);

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
