"use client";

import NewsBanner from "@/components/NewsBanner";
import Banner from "@/components/Banner";
import HomeWarning from "@/components/HomeWarning";
import "@/styles/home.css";

export default function Home() {
  return (
    <>
      <div className="container-fluid">
        <NewsBanner />
        <Banner />
        <HomeWarning />
      </div>
    </>
  );
}
