"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Popup from "reactjs-popup";
import axios from "axios";

const Profile = () => {
  const [files, setFiles] = useState([]);
  // get data from api/file/admin
  const fetchFiles = async () => {
    try {
      const response = await axios.get("/api/file/viewAll", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setFiles(response.data.files);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);
  return (
    <div className="container-fluid">
      <div className="container-stack">
        <div className="btn btn-slim btn-faded">
          <Link href="/">
            <i className="fa-regular fa-arrow-left icon-left"></i>Back
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
            <i className="fa-regular fa-file"></i>
            <h1>username</h1>
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
                  //   value={userDetails.name}
                  //   onChange={handleUpdateDetailsInput}
                />
              </div>
              <div className="form-input">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="johndoe"
                  //   value={userDetails.username}
                  //   onChange={handleUpdateDetailsInput}
                />
              </div>
              <div className="form-input">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="johndoe@gmail.com"
                  //   value={userDetails.email}
                  //   onChange={handleUpdateDetailsInput}
                />
              </div>
              <div className="form-input form-btns">
                <button
                  className="btn btn-primary"
                  // onClick={updateUserDetails}
                >
                  Update
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
                  //   onChange={handlePasswordInput}
                />
              </div>
              <div className="form-input">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  placeholder="********"
                  //   onChange={handlePasswordInput}
                />
              </div>
              <div className="form-input">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="********"
                  //   onChange={handlePasswordInput}
                />
              </div>
              <div className="form-input form-btns">
                <button
                  className="btn btn-primary"
                  //  onClick={changePassword}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
          <div className="container-card">
            <div className="container-card-header">
              <h2>Backup and Restore</h2>
            </div>
            <hr className="divider-horizontal" />
            <div className="container-card-form form">
              <div className="form-input">
                <label htmlFor="restore">Restore (Only Zip)</label>
                <input
                  type="file"
                  id="restore"
                  name="restore"
                  //   onChange={handleRestoreInput}
                />
              </div>
              <div className="form-input form-btns">
                <button
                  className="btn"
                  //  onClick={download}
                >
                  Backup
                </button>
                <Popup
                  trigger={<button className="btn btn-primary">Restore</button>}
                >
                  <div className="popup">
                    <div className="popup-upper">
                      <div className="popup-title">Restore</div>
                      <div className="popup-message">
                        Restoring data may replace your existing files. Are you
                        sure?
                      </div>
                    </div>
                    <hr className="divider-horizontal" />
                    <div className="popup-btns">
                      <button
                        className="btn btn-danger"
                        //    onClick={restore}
                      >
                        Restore
                      </button>
                    </div>
                  </div>
                </Popup>
              </div>
            </div>
          </div>
          <div className="container-card container-card-danger">
            <div className="container-card-header">
              <h2>Delete all files</h2>
            </div>
            <hr className="divider-horizontal" />
            <div className="container-card-form form">
              <div className="form-input">
                <p>
                  This action will delete all the files present in the database.
                </p>
              </div>
              <hr className="divider-horizontal no-margin" />
              <div className="form-input form-btns">
                <Popup
                  trigger={
                    <button className="btn btn-danger">Delete all files</button>
                  }
                >
                  <div className="popup">
                    <div className="popup-upper">
                      <div className="popup-title">Delete</div>
                      <div className="popup-message">
                        Are you sure you want to delete all files?
                      </div>
                      <div className="form-input">
                        <input
                          type="text"
                          id="confirm"
                          name="confirm"
                          placeholder="Type 'confirm' to delete"
                          onChange={(e) => {
                            if (e.target.value === "confirm") {
                              //   setCanDelete(true);
                            } else {
                              //   setCanDelete(false);
                            }
                          }}
                        />
                      </div>
                    </div>

                    <hr className="divider-horizontal" />
                    <div className="popup-btns">
                      <button
                        className="btn btn-danger"
                        // onClick={deleteAll}
                        // disabled={!canDelete}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </Popup>
              </div>
            </div>
          </div>
          <div className="container-card">
            <div className="container-card-header">
              <h2>View Available Files</h2>
            </div>
            <hr className="divider-horizontal" />
            <div className="container-card-form form">
              <div className="form-input">
                <ul>
                  {files.map((fileName, index) => (
                    <li key={index}>
                      {index + 1}:- {fileName}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
