"use client";

import { usePathname } from "next/navigation";
import HomeFooter from "@/components/home/home-footer";

export default function SiteFooter() {
  const pathname = usePathname();

  if (pathname?.startsWith("/product/")) return null;

  return <HomeFooter />;
}
