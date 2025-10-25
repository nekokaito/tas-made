"use client";

import { Home, ShoppingBag, Heart, User, PackageSearch } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: Home },
    { href: "/products", icon: PackageSearch },
    { href: "/bag", icon: ShoppingBag },
    { href: "/wishlist", icon: Heart },
    { href: "/profile", icon: User },
  ];

  return (
    <nav className="fixed mx-3 bottom-3 left-0 right-0 md:hidden bg-[#ddd3eeda] border-t border-border rounded-4xl backdrop-blur-md">
      <div className="flex items-center justify-around py-4 relative">
        {navItems.map(({ href, icon: Icon }) => {
          const active = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className="relative flex flex-col items-center gap-1"
            >
              {/* animated background circle */}
              {active && (
                <motion.div
                  layoutId="bottomNavHighlight"
                  className="absolute w-10 h-10 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}

              {/* icon */}
              <div className="w-10 h-10 flex items-center justify-center relative z-10">
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    active ? "text-primary-foreground" : "text-foreground"
                  }`}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
