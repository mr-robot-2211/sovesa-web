"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({children}: {children: React.ReactNode;}){
  return (
    <SessionProvider>
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        {/* Main Content with padding for fixed header */}
        <main className="pt-16 sm:pt-20">
          {children}
        </main>
      </body>
    </html>
    </SessionProvider>
  );
}
