import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next.js Todo App",
  description: "A modern Todo application built with Next.js, React, TypeScript, and Tailwind CSS",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  authors: [{ name: "Your Name" }],
  keywords: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Todo App"]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
