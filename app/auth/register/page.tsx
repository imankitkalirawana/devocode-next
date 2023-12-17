"use client";
import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";

const Register = () => {
  const [userData, setUserData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    password2: "",
  });

  const [error, setError] = useState<string | null>(null);

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
    <div>
      <h1>Register</h1>
      <div>
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleInput}
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleInput}
        />
        <input
          type="text"
          name="email"
          placeholder="Email"
          onChange={handleInput}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          onChange={handleInput}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleInput}
        />
        <input
          type="password"
          name="password2"
          placeholder="Confirm Password"
          onChange={handleInput}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" onClick={handleSubmit}>
          Register
        </button>
      </div>
      <Link href="/auth/login">Login</Link>
      <Link href="/">Home</Link>
    </div>
  );
};

export default Register;
