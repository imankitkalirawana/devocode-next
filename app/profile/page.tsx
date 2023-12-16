"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import { isLoggedIn } from "@/utils/authUtils";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import ContainerSkeleton from "@/components/ContainerSkeleton";
interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  username: string;
}

const Profile = () => {
  const [userDetails, setUserDetails] = useState<User>({} as User);
  const [processing, setProcessing] = useState<boolean>(false);
  const [passwordProcessing, setPasswordProcessing] = useState<boolean>(false);
  const [canDelete, setCanDelete] = useState<boolean>(false);
  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const router = useRouter();
  const { loggedIn } = isLoggedIn();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `/api/auth/user/${localStorage.getItem("userId")}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUserDetails(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast.error("Error fetching user details");
      }
    };
    fetchUser();
    if (!loggedIn) {
      router.push("/auth/login");
    }
  }, [loggedIn, router]);

  // check if userDetails is empty
  if (Object.keys(userDetails).length === 0) {
    return (
      <>
        <ContainerSkeleton />
      </>
    );
  }

  // handle password input
  const handlePasswordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  // handle user details input
  const handleUpdateDetailsInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  // handle password change
  const changePassword = async () => {
    setPasswordProcessing(true);
    if (
      !password.oldPassword ||
      !password.newPassword ||
      !password.confirmPassword
    ) {
      setPasswordProcessing(false);
      return toast.error("Please fill all the fields");
    }
    if (password.newPassword !== password.confirmPassword) {
      setPasswordProcessing(false);
      return toast.error("Password does not match");
    }

    try {
      console.log("axios");
      await axios.post(
        `/api/auth/user/${userDetails._id}`,
        {
          currentPassword: password.oldPassword,
          newPassword: password.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Password changed");
      setPassword({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      // Handle error
      if (error.response) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Error changing password");
      }
    }
    setPasswordProcessing(false);
  };

  // handle user details update
  const updateUserDetails = async () => {
    setProcessing(true);
    if (
      !userDetails.name ||
      !userDetails.username ||
      !userDetails.email ||
      !userDetails.phone
    ) {
      setProcessing(false);
      return toast.error("Please fill all the fields");
    }

    try {
      await axios.put(`/api/auth/user/${userDetails._id}`, userDetails, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Details updated");
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.error);
      } else if (error.request) {
        console.error("Error making request:", error.request);
      } else {
        console.error("General error:", error.message);
      }
    }
    setProcessing(false);
  };

  // handle user delete
  const handleDelete = async () => {
    setProcessing(true);
    try {
      await toast
        .promise(
          axios.delete(`/api/auth/user/${userDetails._id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          {
            pending: "Deleting user...",
            success: "User deleted",
            error: "Error deleting user",
          }
        )
        .then(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("userData");
          localStorage.removeItem("userId");
          router.push("/auth/login");
        });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error deleting user");
    }
    setProcessing(false);
  };

  return (
    <div className="container-fluid">
      <div className="container-stack">
        <div className="btn btn-slim btn-faded">
          <Link className="btn-align" href="/">
            <Image
              className="icon icon-left"
              src="/icons/arrow-small-left.svg"
              alt="home"
              width={20}
              height={20}
            />
            Back
          </Link>
        </div>
        <div className="container-narrative">
          <h1>Profile</h1>
          <p>You can manage your account here.</p>
        </div>
      </div>
      <div className="container-stack-horizontal">
        <div className="container-sidebar">
          <div className="stack-title-card">
            <Image
              className="icon icon-m"
              src="/icons/user.svg"
              alt="user"
              width={20}
              height={20}
            />
            {/* display user name before space */}
            <h1>Hi, {userDetails.name.split(" ")[0]}</h1>
          </div>
          <div className="divider-horizontal"></div>
          <div className="stack-details">
            <div className="stack-progress">
              <div className="progress-circle"></div>
              <div className="progress-line"></div>
              <span className="stack-name">Profile</span>
            </div>
            <div className="stack-progress">
              <div className="progress-circle"></div>
              <div className="progress-line"></div>
              <span className="stack-name">Home</span>
            </div>
          </div>
        </div>
        <div className="container-card-cover">
          <div className="container-card">
            <div className="container-card-header">
              <h2>Manage Profile</h2>
            </div>
            <hr className="divider-horizontal" />
            <div className="container-card-form form">
              <div className="form-input">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={userDetails.name}
                  onChange={handleUpdateDetailsInput}
                  disabled={processing}
                />
              </div>
              <div className="form-input">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="johndoe"
                  value={userDetails.username}
                  onChange={handleUpdateDetailsInput}
                  disabled={processing}
                />
              </div>
              <div className="form-input">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="johndoe@gmail.com"
                  value={userDetails.email}
                  onChange={handleUpdateDetailsInput}
                  disabled={processing}
                />
              </div>
              <div className="form-input">
                <label htmlFor="phone">Phone</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  placeholder="+91 9876543210"
                  value={userDetails.phone}
                  onChange={handleUpdateDetailsInput}
                  disabled={processing}
                />
              </div>
              <div className="form-input form-btns">
                <button
                  className="btn btn-primary"
                  onClick={updateUserDetails}
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <Image
                        className="icon icon-inverted icon-left icon-s rotating"
                        src="/icons/spinner.svg"
                        alt="loading"
                        width={20}
                        height={20}
                      />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Image
                        className="icon icon-inverted icon-left icon-xs"
                        src="/icons/check.svg"
                        alt="check"
                        width={20}
                        height={20}
                      />
                      Update
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="container-card">
            <div className="container-card-header">
              <h2>Update Password</h2>
            </div>
            <hr className="divider-horizontal" />
            <div className="container-card-form form">
              <div className="form-input">
                <label htmlFor="oldPassword">Old Password</label>
                <input
                  type="password"
                  id="oldPassword"
                  name="oldPassword"
                  placeholder="********"
                  value={password.oldPassword}
                  onChange={handlePasswordInput}
                  disabled={passwordProcessing}
                />
              </div>
              <div className="form-input">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  placeholder="********"
                  value={password.newPassword}
                  onChange={handlePasswordInput}
                  disabled={passwordProcessing}
                />
              </div>
              <div className="form-input">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="********"
                  value={password.confirmPassword}
                  onChange={handlePasswordInput}
                  disabled={passwordProcessing}
                />
              </div>
              <div className="form-input form-btns">
                <button
                  className="btn btn-primary"
                  disabled={passwordProcessing}
                  onClick={changePassword}
                >
                  {passwordProcessing ? (
                    <>
                      <Image
                        className="icon icon-inverted icon-left rotating"
                        src="/icons/spinner.svg"
                        alt="loading"
                        width={20}
                        height={20}
                      />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Image
                        className="icon icon-inverted icon-left icon-xs"
                        src="/icons/check.svg"
                        alt="check"
                        width={20}
                        height={20}
                      />
                      Update
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="container-card container-card-danger">
            <div className="container-card-header">
              <h2>Delete Account</h2>
            </div>
            <hr className="divider-horizontal" />
            <div className="container-card-form form">
              <div className="form-input">
                <label htmlFor="delete">
                  Type <b>Permanently Delete</b> to delete your account.
                </label>
                <input
                  type="delete"
                  id="delete"
                  name="delete"
                  placeholder="Permanently Delete"
                  onChange={(e) => {
                    if (e.target.value === "Permanently Delete") {
                      setCanDelete(true);
                    } else {
                      setCanDelete(false);
                    }
                  }}
                />
              </div>
              <div className="form-input form-btns">
                <button
                  className="btn btn-danger"
                  onClick={handleDelete}
                  // disable if canDelete is false
                  disabled={!canDelete}
                >
                  <Image
                    className="icon icon-inverted icon-left icon-xs"
                    src="/icons/trash-danger.svg"
                    alt="trash"
                    width={20}
                    height={20}
                  />
                  Delete my account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Profile), { ssr: false });
