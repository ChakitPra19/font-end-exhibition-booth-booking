import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopMenu from "@/components/TopMenu"
import { getServerSession } from 'next-auth'
import { authOptions } from "./api/auth/[...nextauth]/authOptions";
import NextAuthProvider from "../providers/NextAuthProvider";
import ReduxProvider from "@/redux/ReduxProvider";
import { AuthProvider } from "@/providers/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Exhibition Booth Booking",
  description: "Exhibition booth booking system",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await getServerSession(authOptions)
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ReduxProvider>
          <AuthProvider>
            {/* <NextAuthProvider session={session}> */}
            <TopMenu/>
            {children}
            {/* </NextAuthProvider> */}
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
