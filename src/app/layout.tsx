import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientThemeProvider } from "./components/ClientThemeProvider";
import { ThemeContextProvider } from "./contexts/ThemeContext";
import { ThemeScript } from "./components/ThemeScript";
import PersistentHeader from "./components/PersistentHeader";
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
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('jobflix-theme') || 'system';
                  var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  
                  if (theme === 'dark' || (theme === 'system' && systemTheme === 'dark')) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <ClientThemeProvider>
          <ThemeContextProvider>
            <ThemeScript />
            <PersistentHeader />
            <ToastProvider>
              <div className="min-h-full pt-16 lg:pt-18">
                {/* <Navbar /> */}
                <main>{children}</main>
              </div>
            </ToastProvider>
          </ThemeContextProvider>
        </ClientThemeProvider>
      </body>
    </html>
  );
}
