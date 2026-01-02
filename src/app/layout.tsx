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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <title>Pantry Chef - Your Smart Kitchen Companion</title>
      </head>
      <body className="h-full flex flex-col">
        <Header />
        <NavBar />
        <main className="flex-1 overflow-y-auto py-4 px-4 sm:py-6 sm:px-8 lg:py-8 lg:px-20 bg-gray-50">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
