import Link from "next/link";
import React from "react";

const Profile = () => {
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
        </div>
      </div>
    </div>
  );
};

export default Profile;
