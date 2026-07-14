import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/userContext";
import { ActiveViewProvider } from "@/context/activeViewContext";
import { Rye } from "next/font/google";
import { Providers } from "./providers/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const rye = Rye({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-rye",
});

export const metadata: Metadata = {
  title: "Rhon OS",
  description: "Rhon studio company page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${rye.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <UserProvider>
          <Providers>

          <ActiveViewProvider>{children}</ActiveViewProvider>
          </Providers>
        </UserProvider>
      </body>
    </html>
  );
}
