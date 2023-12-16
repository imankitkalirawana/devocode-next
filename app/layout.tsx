import { Header } from "@/components";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";
import "./globals.css";
import "@/styles/container.css";
import "@/styles/section.css";
import { useEffect } from "react";

export const metadata: Metadata = {
  title: "Devocode By Divinely Developer",
  description:
    "Devocode by Divinely Developer is a platform for LPU students to share study resources and get easy access to study materials.",
  // openGraph: {
  //   title: "Home - Devocode",
  //   description:
  //     "Devocode is a platform, developed my Divinely Developer aka Bhuneshvar for LPU students to share resources and get easy access to study materials.",
  //   type: "website",
  //   url: "https://devocode-lpu.vercel.app/",
  //   images: [
  //     {
  //       url: "https://devocode-lpu.vercel.app/images/banner.png",
  //       width: 1200,
  //       height: 630,
  //       alt: "Devocode Banner",
  //     },
  //   ],
  // },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {/* <link
          rel="stylesheet"
          href="https://pro.Fontawesome.com/releases/v6.0.0-beta3/css/all.css"
        /> */}
      </head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PLFZ97DH"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <Header />
        <SkeletonTheme baseColor="#202020" highlightColor="#444">
          {children}
          <Analytics />
          <SpeedInsights />
        </SkeletonTheme>
        <ToastContainer theme="dark" autoClose={5000} position="bottom-right" />
      </body>
    </html>
  );
}
