import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Bitcount_Grid_Single,
  Cabin_Sketch,
} from "next/font/google";
import "./globals.css";
import { Providers } from "@/context/providers";
import BottomNav from "@/components/share/bottom-nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bitcount = Bitcount_Grid_Single({
  subsets: ["latin"],
  variable: "--font-bitcount",
});

const cabinSketch = Cabin_Sketch({
  subsets: ["latin"], // required
  variable: "--font-cabin-sketch", // optional css variable
  weight: ["400", "700"], // optional weights
});

export const metadata: Metadata = {
  title: "Tas Made",
  description: "High-quality & heartfelt\nMade to last, stitched with care",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bitcount.variable} ${cabinSketch.variable} antialiased`}
      >
        
        <Providers>{children}</Providers>
        <BottomNav />
      </body>
    </html>
  );
}
