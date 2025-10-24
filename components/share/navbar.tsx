"use client";

import { Menu, Bell, ShoppingBag } from "lucide-react";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-[#c09bfcbb]">
      <div className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6">
        {/* Menu Icon - Mobile Only */}
        <button className="md:hidden">
          <Menu className="w-6 h-6 text-foreground" />
        </button>

        {/* Logo */}
        <div className="flex w-auto gap-2 justify-center items-center">
          <Image
            src="/logo.png"
            alt="Tas Made Logo"
            width={40}
            height={30}
            className="object-contain"
          />
          <h1 className="cabin-sketch-font lg:text-3xl md:text-2xl text-foreground flex-1 text-center md:flex-none">
            Tas Made
          </h1>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-4 md:gap-6">
          <button className="md:hidden">
            <Bell className="w-6 h-6 text-foreground" />
          </button>
          <button className="hidden md:block">
            <ShoppingBag className="w-6 h-6 text-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
}
