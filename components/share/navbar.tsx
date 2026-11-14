"use client";

import {
  Menu,
  Bell,
  ShoppingBag,
  Home,
  Heart,
  User,
  PackageSearch,
  Scissors,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { selectCartItemCount, useCartStore } from "@/lib/cart-store";
import { selectWishlistCount, useWishlistStore } from "@/lib/wishlist-store";

export default function Header() {
  const pathname = usePathname();
  const itemCount = useCartStore(selectCartItemCount);
  const favoriteCount = useWishlistStore(selectWishlistCount);

  const navItems = [
    { href: "/", icon: Home },
    { href: "/products", icon: PackageSearch },
    { href: "/custom-order", icon: Scissors },
  ];

  return (
    <header className="bg-primary">
      <div className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6">
        {/* Menu Icon - Mobile Only */}
        <button className="md:hidden">
          <Menu className="w-6 h-6 text-foreground" />
        </button>

        {/* Logo */}
        <div className="flex w-auto gap-2 justify-center items-center">
          <Image
            src="/tas-logo.png"
            alt="Tas Made Logo"
            width={40}
            height={30}
            className="object-contain"
          />
          <h1 className="loubag-font lg:text-2xl md:text-xl text-foreground flex-1 text-center md:flex-none">
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
                aria-label={href === "/custom-order" ? "Custom orders" : href === "/products" ? "Products" : "Home"}
                className="relative flex-col items-center gap-1 hidden md:flex"
              >
                {active && (
                  <motion.div
                    layoutId="navHighlight"
                    className="absolute inset-0 rounded-full bg-accent"
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
            aria-label={`View bag, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
            className="relative flex-col items-center gap-1 hidden md:flex"
          >
            <ShoppingBag className="w-6 h-6 text-foreground" />
            {itemCount > 0 && (
              <span
                aria-hidden="true"
                className="absolute -right-3 -top-3 flex min-w-5 h-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-bold text-primary-foreground"
              >
                {itemCount}
              </span>
            )}
          </Link>

          <Link
            href="/wishlist"
            aria-label={`View favorites, ${favoriteCount} ${favoriteCount === 1 ? "item" : "items"}`}
            className="relative flex-col items-center gap-1 hidden md:flex"
          >
            <Heart className="w-6 h-6 text-foreground" />
            {favoriteCount > 0 && (
              <span
                aria-hidden="true"
                className="absolute -right-3 -top-3 flex min-w-5 h-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-bold text-primary-foreground"
              >
                {favoriteCount}
              </span>
            )}
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
