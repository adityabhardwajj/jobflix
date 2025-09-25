import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { HeroUIProvider } from "./providers/HeroUIProvider";
import { SessionProvider } from "./providers/SessionProvider";
import { ToastProvider } from "./components/Toast";
import SharedLayout from "./components/SharedLayout";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "JobFlix - Your Career, Your Next Step",
  description: "A precise way to find verified roles and connect with decision-makers.",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' }
    ],
    apple: { url: '/favicon.svg', type: 'image/svg+xml' }
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} jobflix-light`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('jobflix-theme') || 'system';
                  var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  
                  if (theme === 'dark' || (theme === 'system' && systemTheme === 'dark')) {
                    document.documentElement.className = 'jobflix-dark';
                  } else {
                    document.documentElement.className = 'jobflix-light';
                  }
                } catch (e) {
                  document.documentElement.className = 'jobflix-light';
                }
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-screen font-sans">
        <SessionProvider>
          <HeroUIProvider>
            <ToastProvider>
              <SharedLayout>
                {children}
              </SharedLayout>
            </ToastProvider>
          </HeroUIProvider>
        </SessionProvider>
      </body>
    </html>
  );
}