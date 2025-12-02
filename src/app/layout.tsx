import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import { ToastProvider } from "@/lib/context/ToastContext";

export const metadata: Metadata = {
  title: "MovieDB - Explore Movies and Series",
  description: "Search and discover movies and TV series using the OMDb API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ToastProvider>
          <Navigation />
          <main className="pt-16">
            {children}
          </main>
        </ToastProvider>
      </body>
    </html>
  );
}
