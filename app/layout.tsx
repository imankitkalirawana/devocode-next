import { Header } from "@/components";
import "./globals.css";

export const metadata = {
  title: "Devocode by Divinely Developer",
  description: "A next gen study platform for students",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://pro.Fontawesome.com/releases/v6.0.0-beta3/css/all.css"
        />
      </head>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
