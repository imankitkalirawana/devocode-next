import { Header } from "@/components";
import { ToastContainer } from "react-toastify";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";
import "./globals.css";

export const metadata = {
  title: "Devocode by Divinely Developer",
  description: "A next gen study platform for students",
  image: "/logo-dark.png",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://pro.Fontawesome.com/releases/v6.0.0-beta3/css/all.css"
        />
      </head>
      <body>
        <Header />
        <SkeletonTheme baseColor="#202020" highlightColor="#444">
          {children}
        </SkeletonTheme>
        <ToastContainer theme="dark" autoClose={5000} position="bottom-right" />
      </body>
    </html>
  );
}
