import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { HeroUIProvider } from "./providers/HeroUIProvider";
import { SessionProvider } from "./providers/SessionProvider";
import { ToastProvider } from "./components/Toast";
import { ThemeProvider } from "./providers/ThemeProvider";
import { QueryClientProvider } from "./providers/QueryClientProvider";
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
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <body className="antialiased min-h-screen font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SessionProvider>
            <QueryClientProvider>
              <HeroUIProvider>
                <ToastProvider>
                  <SharedLayout>
                    {children}
                  </SharedLayout>
                </ToastProvider>
              </HeroUIProvider>
            </QueryClientProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}