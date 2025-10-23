"use client";

import { Menu, Bell, ShoppingBag } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-background border-b border-border">
      <div className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6">
        {/* Menu Icon - Mobile Only */}
        <button className="md:hidden">
          <Menu className="w-6 h-6 text-foreground" />
        </button>

        {/* Logo */}
        <h1 className="text-xl md:text-2xl font-serif text-foreground flex-1 text-center md:flex-none">
          Beau & Bella
        </h1>

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
