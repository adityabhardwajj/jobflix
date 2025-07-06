import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ToastProvider } from "./components/Toast";
// import Navbar from "./components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Jobflix - Find Your Next Tech Job",
  description: "Connect with tech recruiters and find your dream job",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="antialiased min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <ThemeProvider>
          <ToastProvider>
            <div className="min-h-full">
              {/* <Navbar /> */}
              <main>{children}</main>
            </div>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
