import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/components/providers/UserProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ajaia Docs — Lightweight Collaborative Workspace",
  description:
    "An AI-native collaborative document editor featuring rich-text editing, universal file import (.txt, .md, .docx), granular sharing permissions, and version history.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans min-h-screen bg-[#fcfcfd] text-zinc-900 antialiased selection:bg-zinc-900 selection:text-white">
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
