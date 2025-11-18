import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopMenu from "@/components/TopMenu"
import ReduxProvider from "@/redux/ReduxProvider";
import { AuthProvider } from "@/contexts/AuthContext";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="m-0 p-0">
      <body className={`${geistSans.variable} ${geistMono.variable} m-0 p-0 overflow-x-hidden`}>
        <ReduxProvider>
          <AuthProvider>
            <TopMenu />
            <main className="pt-26"> {/* เพิ่ม padding-top เพื่อไม่ให้ content ทับกับ fixed navbar */}
              {children}
            </main>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}