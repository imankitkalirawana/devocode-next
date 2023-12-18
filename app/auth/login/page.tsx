"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { isLoggedIn } from "../../../utils/authUtils";
const Login = () => {
  const [userData, setUserData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const { loggedIn, user } = isLoggedIn();

  useEffect(() => {
    if (loggedIn && user) {
      if (user.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/resources";
      }
    }
  }, [loggedIn, user]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/login", userData);
      const { data } = response;
      if (data && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userData", JSON.stringify(data));
        if (data.role === "admin") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/resources";
        }
      }
    } catch (error: any) {
      console.error("Error logging in user:", error);
      if (error.response) {
        setError(
          error.response.data.error || "Incorrect username or password."
        );
      } else if (error.request) {
        setError("No response received from the server.");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="section resources login-form">
      <h1 className="section-title">Log in to Devocode</h1>
      <form className="form">
        <div className="form-input">
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleInput}
          />
        </div>
        <div className="form-input">
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleInput}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button className="btn btn-primary" onClick={handleSubmit}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
