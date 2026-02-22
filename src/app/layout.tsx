import type { Metadata } from "next";
import { Geist, Geist_Mono, Kalam } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const kalam = Kalam({
  weight: ["300", "400", "700"],
  variable: "--font-cursive",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Demi IO — From Idea to Working Extension, Instantly",
  description: "Describe a browser extension in plain English and get a working one instantly. No code. No setup. Just intent.",
  keywords: ["browser extension", "AI", "chrome extension", "automation", "no-code"],
  openGraph: {
    title: "Demi IO",
    description: "Build browser extensions in plain English.",
    type: "website",
    url: "https://demi.io",
  },
  twitter: {
    card: "summary_large_image",
    title: "Demi IO",
    description: "Build browser extensions in plain English.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${kalam.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
