"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { isLoggedIn } from "../authUtils";
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
    <div>
      <h1>Login</h1>
      <form>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleInput}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleInput}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button onClick={handleSubmit}>Login</button>
      </form>
    </div>
  );
};

export default Login;
