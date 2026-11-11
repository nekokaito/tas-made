import type { Metadata } from "next";
import "./globals.css";
import {
  Geist,
  Geist_Mono,
  Bitcount_Grid_Single,
  Cabin_Sketch,
} from "next/font/google";
import localFont from "next/font/local";
import { Providers } from "@/context/providers";
import BottomNav from "@/components/share/bottom-nav";
import MusicToggle from "@/components/share/music-toggle";
import SakuraCursor from "@/components/share/sakura-cursor";
import SiteFooter from "@/components/share/site-footer";

const loubag = localFont({
  src: [
    { path: "./fonts/Loubag-Thin.ttf", weight: "100", style: "normal" },
    { path: "./fonts/Loubag-UltraLight.ttf", weight: "200", style: "normal" },
    { path: "./fonts/Loubag-Light.ttf", weight: "300", style: "normal" },
    { path: "./fonts/Loubag-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Loubag-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/Loubag-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/Loubag-Bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/Loubag-ExtraBold.ttf", weight: "800", style: "normal" },
    { path: "./fonts/Loubag-Black.ttf", weight: "900", style: "normal" },
  ],
  variable: "--font-loubag",
  display: "swap",
});

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
        className={`${loubag.variable} ${geistSans.variable} ${geistMono.variable} ${bitcount.variable} ${cabinSketch.variable} antialiased`}
      >
        <Providers>{children}</Providers>
        <SiteFooter />
        <BottomNav />
        <MusicToggle />
        <SakuraCursor />
      </body>
    </html>
  );
}
