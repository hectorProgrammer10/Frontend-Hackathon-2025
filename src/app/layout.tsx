import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import { ToastProvider } from "@/lib/context/ToastContext";
import { ThemeProvider } from "@/lib/context/ThemeContext";

export const metadata: Metadata = {
  title: "ComePelículas - Explore Movies and Series",
  description: "Search and discover movies and TV series using the OMDb API",
  icons: {
    icon: '/iconM.svg',
  },
};

import AppSplash from "@/components/layout/AppSplash";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ThemeProvider>
          <ToastProvider>
            <AppSplash />
            <Navigation />
            <main className="pt-16">
              {children}
            </main>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
