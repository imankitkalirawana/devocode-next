"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { isLoggedIn } from "@/utils/authUtils";
import dynamic from "next/dynamic";
import { useRouter, usePathname } from "next/navigation";

const Header = () => {
  const { loggedIn, user } = isLoggedIn();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const location = usePathname();
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    router.push("/auth/login");
  };

  return (
    <>
      <header className="header">
        <div className="header-left">
          <Link href="/" className="logo">
            <img className="logo-icon" src="/logo-dark.png" alt="logo" />
            <h1 className="logo-text">
              Devo<span className="color">Code</span>
            </h1>
          </Link>
          <ul className="list-items">
            <li className="list-items-item">
              <Link href="/" className="list-items-link">
                Home
              </Link>
            </li>
            <li className="list-items-item">
              <Link href="/resources" className="list-items-link">
                Resources
              </Link>
            </li>
            <li className="list-items-item">
              <a
                href="https://divinelydeveloper.me"
                className="list-items-link"
              >
                About
              </a>
            </li>
            <li className="list-items-item">
              <a
                href="https://github.com/imankitkalirawana"
                className="list-items-link"
              >
                Github
              </a>
            </li>
            {loggedIn ? (
              <>
                <li className="list-items-item">
                  <Link href="/logs" className="list-items-link">
                    Logs
                  </Link>
                </li>
              </>
            ) : null}
          </ul>
        </div>

        <div className="auth">
          {loggedIn ? (
            <>
              {/* dropdown */}
              <div className="header-dropdown">
                <button className="btn btn-slim">Profile</button>
                <div className="dropdown-menu">
                  <ul className="list-items">
                    {user?.role === "admin" ? (
                      <li className="list-items-item">
                        <Link href="/admin" className="list-items-link">
                          Admin
                        </Link>
                      </li>
                    ) : null}
                    <li className="list-items-item">
                      <Link href="/profile" className="list-items-link">
                        Account
                      </Link>
                    </li>

                    <li className="list-items-item">
                      <Link href="/settings" className="list-items-link">
                        Settings
                      </Link>
                    </li>
                    <li className="list-items-item">
                      <Link href="/logs" className="list-items-link">
                        Logs
                      </Link>
                    </li>

                    <li className="list-items-item">
                      <a
                        className="list-items-link btn-danger"
                        onClick={handleLogout}
                      >
                        Logout
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <div className="btns">
              <Link
                href="/contact"
                className="btn login-register btn-faded faded"
              >
                Contact
              </Link>
              {location === "/auth/login" ? (
                <Link
                  href="/auth/register"
                  className="btn login-register btn-slim"
                >
                  Signup
                </Link>
              ) : (
                <Link
                  href="/auth/login"
                  className="btn login-register btn-slim"
                >
                  Login
                </Link>
              )}
            </div>
          )}
        </div>
        <div className="toggler" onClick={toggleSidebar}>
          <i
            className={`fa-regular ${
              sidebarOpen ? "fa-xmark " : ""
            }fa-grip-lines`}
          ></i>
        </div>
      </header>
      <aside
        className="sidebar"
        style={{
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        {/* logo */}
        <Link href="/" className="logo">
          <img className="logo-icon" src="/logo-dark.png" alt="logo" />
          <h1 className="logo-text">
            Devo<span className="color">Code</span>
          </h1>
        </Link>
        <ul className="sidebar-list">
          <li className="sidebar-list-item">
            <Link href="/" className="sidebar-list-link">
              <i className="fa-regular fa-home-lg-alt"></i>
              Home
            </Link>
          </li>

          <li className="sidebar-list-item">
            <Link href="/resources" className="sidebar-list-link">
              <i className="fa-regular fa-layer-group"></i>
              Resources
            </Link>
          </li>

          {loggedIn ? (
            <>
              <li className="sidebar-list-item">
                <Link href="/resources/add" className="sidebar-list-link">
                  <i className="fa-regular fa-add"></i>
                  Add
                </Link>
              </li>
              <li className="sidebar-list-item">
                <Link className="sidebar-list-link" href="/resources/update">
                  <i className="fa-regular fa-file-arrow-up"></i>
                  Update
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="sidebar-list-item">
                <a
                  className="sidebar-list-link"
                  href="https://divinelydeveloper.me"
                >
                  <i className="fa-regular fa-user"></i>
                  About
                </a>
              </li>
              <li className="sidebar-list-item">
                <a
                  className="sidebar-list-link"
                  href="https://github.com/imankitkalirawana"
                >
                  <i className="fa-brands fa-github"></i>
                  Github
                </a>
              </li>
            </>
          )}
          <li className="sidebar-list-item">
            <a
              className="sidebar-list-link"
              href="https://divinelydeveloper.me#contact"
            >
              <i className="fa-regular fa-envelope"></i>
              Contact
            </a>
          </li>

          <li className="sidebar-list-item">
            <a
              className="sidebar-list-link"
              href="
              https://github.com/imankitkalirawana/devocode/issues"
              target="_blank"
            >
              <i className="fa-regular fa-bug"></i>
              Report Issue
            </a>
          </li>
        </ul>
        {loggedIn ? (
          <button
            className="btn login-register btn-slim"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <Link
            href="/login"
            className="btn btn-primary login-register btn-slim"
          >
            Login
          </Link>
        )}
      </aside>
    </>
  );
};

export default dynamic(() => Promise.resolve(Header), { ssr: false });
