"use client";
import Link from "next/link";
import React, { useState } from "react";
import { isLoggedIn } from "@/utils/authUtils";
import dynamic from "next/dynamic";
import { useRouter, usePathname } from "next/navigation";
import "@/styles/header.css";
import Image from "next/image";

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
    localStorage.removeItem("userId");
    router.push("/auth/login");
  };

  return (
    <>
      <header className="header">
        <div className="header-left">
          <Link href="/" className="logo">
            <Image
              className="logo-icon"
              src="/logo-dark.webp"
              alt="logo"
              width={30}
              height={30}
            />
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
          <Image
            className="icon icon-faded"
            src={`/icons/${sidebarOpen ? "cross-small" : "grip-lines"}.svg`}
            alt="grip-lines"
            width={20}
            height={20}
          />
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
          <Image
            className="logo-icon"
            src="/logo-dark.webp"
            alt="logo"
            width={30}
            height={30}
          />
          <h1 className="logo-text">
            Devo<span className="color">Code</span>
          </h1>
        </Link>
        <ul className="sidebar-list">
          <li className="sidebar-list-item">
            <Link href="/" className="sidebar-list-link">
              <Image
                className="icon icon-left"
                src="/icons/home.svg"
                alt="home"
                width={20}
                height={20}
              />
              Home
            </Link>
          </li>

          <li className="sidebar-list-item">
            <Link href="/resources" className="sidebar-list-link">
              <Image
                className="icon"
                src="/icons/resources.svg"
                alt="resources"
                width={20}
                height={20}
              />
              Resources
            </Link>
          </li>

          <li className="sidebar-list-item">
            <a
              className="sidebar-list-link"
              href="https://divinelydeveloper.me"
            >
              <Image
                className="icon"
                src="/icons/info.svg"
                alt="about"
                width={20}
                height={20}
              />
              About
            </a>
          </li>
          <li className="sidebar-list-item">
            <a
              className="sidebar-list-link"
              href="https://github.com/imankitkalirawana"
            >
              <Image
                className="icon"
                src="/icons/github.svg"
                alt="github"
                width={20}
                height={20}
              />
              Github
            </a>
          </li>
          <li className="sidebar-list-item">
            <a
              className="sidebar-list-link"
              href="https://divinelydeveloper.me#contact"
            >
              <Image
                className="icon"
                src="/icons/envelope.svg"
                alt="envelope"
                width={20}
                height={20}
              />
              Contact
            </a>
          </li>

          <li className="sidebar-list-item">
            <a
              className="sidebar-list-link"
              href="
              https://telegram.me/divinelydeveloper"
              target="_blank"
            >
              <Image
                className="icon"
                src="/icons/bug-slash.svg"
                alt="bug"
                width={20}
                height={20}
              />
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
            href="/auth/login"
            className="btn btn-primary login-register btn-slim"
          >
            Login
          </Link>
        )}
      </aside>
      {/* bottom bar */}
      <div className="bottom-bar">
        <div
          className={`bottom-bar-list-item ${
            location === "/" ? "selected" : ""
          }`}
        >
          <Link href="/" className="bottom-bar-list-link">
            <Image
              className="icon icon-faded"
              src="/icons/home.svg"
              alt="home"
              width={20}
              height={20}
            />
            <span className="bottom-bar-title">Home</span>
          </Link>
        </div>
        <div
          className={`bottom-bar-list-item ${
            location?.startsWith("/resources") ? "selected" : ""
          }`}
        >
          <Link href="/resources" className="bottom-bar-list-link">
            <Image
              className="icon icon-faded"
              src="/icons/resources.svg"
              alt="resources"
              width={20}
              height={20}
            />
            <span className="bottom-bar-title">Resources</span>
          </Link>
        </div>
        <div
          className={`bottom-bar-list-item ${
            location?.startsWith("/auth") || location?.startsWith("/profile")
              ? "selected"
              : ""
          }`}
        >
          <Link
            href={`${loggedIn ? "/profile" : "/auth/login"}`}
            className="bottom-bar-list-link"
          >
            <Image
              className="icon icon-faded"
              src="/icons/circle-user.svg"
              alt="profile"
              width={20}
              height={20}
            />
            <span className="bottom-bar-title">Profile</span>
          </Link>
        </div>
        <div className="bottom-bar-list-item">
          <a
            href="https://telegram.me/divinelydeveloper"
            className="bottom-bar-list-link"
          >
            <Image
              className="icon icon-faded"
              src="/icons/bug-slash.svg"
              alt="home"
              width={20}
              height={20}
            />
          </a>
        </div>
      </div>
    </>
  );
};

export default dynamic(() => Promise.resolve(Header), { ssr: false });
