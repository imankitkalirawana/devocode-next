"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { isLoggedIn } from "@/utils/authUtils";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";

const Register = () => {
  const { loggedIn } = isLoggedIn();
  const [userData, setUserData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    password2: "",
  });

  const [error, setError] = useState<string | null>(null);

  if (!loggedIn) {
    toast.error("Please fill registration form first.");
    // redirect after 5 seconds
    setTimeout(() => {
      window.location.href = "https://forms.gle/yAb95M9ToQGgyWuP8";
    }, 5000);
    return null;
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (userData.password !== userData.password2) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("/api/auth/register", userData);
      console.log(response);
      // Optionally, you can redirect the user or perform other actions upon successful registration
    } catch (error: any) {
      console.error("Error registering user:", error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(
          error.response.data.error || "An error occurred during registration."
        );
      } else if (error.request) {
        // The request was made but no response was received
        setError("No response received from the server.");
      } else {
        // Something happened in setting up the request that triggered an Error
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="section resources login-form">
      <h1 className="section-title">Sign up to Devocode</h1>
      <form className="form">
        <div className="form-input-group">
          <div className="form-input">
            <input
              type="text"
              name="name"
              placeholder="Name"
              onChange={handleInput}
            />
          </div>
          <div className="form-input">
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleInput}
            />
          </div>
        </div>
        <div className="form-input-group">
          <div className="form-input">
            <input
              type="text"
              name="email"
              placeholder="Email"
              onChange={handleInput}
            />
          </div>
          <div className="form-input">
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              onChange={handleInput}
            />
          </div>
        </div>
        <div className="form-input-group">
          <div className="form-input">
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleInput}
            />
          </div>
          <div className="form-input">
            <input
              type="password"
              name="password2"
              placeholder="Confirm Password"
              onChange={handleInput}
            />
          </div>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <button
          className="btn btn-primary"
          type="submit"
          onClick={handleSubmit}
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Register), { ssr: false });
