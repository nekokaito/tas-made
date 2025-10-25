"use client";

import {
  Menu,
  Bell,
  ShoppingBag,
  Home,
  Heart,
  User,
  PackageSearch,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: Home },
    { href: "/products", icon: PackageSearch },
  ];

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
        <div className="flex items-center gap-4 md:gap-6">
          {navItems.map(({ href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="relative flex-col items-center gap-1 hidden md:flex"
              >
                {active && (
                  <motion.div
                    layoutId="navHighlight"
                    className="absolute inset-0 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}

                {/* icon */}
                <div className="w-10 h-10 rounded-full flex items-center justify-center relative z-10">
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      active ? "text-primary-foreground" : "text-black"
                    }`}
                  />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-4 md:gap-6">
          <button className="">
            <Bell className="w-6 h-6 text-foreground" />
          </button>

          <Link
            href="/bag"
            className="flex-col items-center gap-1 hidden md:flex"
          >
            <ShoppingBag className="w-6 h-6 text-foreground" />
          </Link>

          <Link
            href="/wishlist"
            className="flex-col items-center gap-1 hidden md:flex"
          >
            <Heart className="w-6 h-6 text-foreground" />
          </Link>
          <Link
            href="/profile"
            className="flex-col items-center gap-1 hidden md:flex"
          >
            <User className="w-6 h-6 text-foreground" />
          </Link>
        </div>
      </div>
    </header>
  );
}
