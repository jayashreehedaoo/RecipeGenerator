"use client";

import Header from "@/components/Layouts/Header";
import NavBar from "@/components/Layouts/NavBar";
import "./globals.css";
import Footer from "@/components/Layouts/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full flex flex-col">
        <Header />
        <NavBar />
        <main className="flex-1 overflow-y-auto py-8 px-20 bg-gray-50">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
