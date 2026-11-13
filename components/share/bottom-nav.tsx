"use client";

import { Home, ShoppingBag, Heart, User, PackageSearch } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { selectCartItemCount, useCartStore } from "@/lib/cart-store";
import { selectWishlistCount, useWishlistStore } from "@/lib/wishlist-store";

export default function BottomNav() {
  const pathname = usePathname();
  const itemCount = useCartStore(selectCartItemCount);
  const favoriteCount = useWishlistStore(selectWishlistCount);

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
              data-bag-target={href === "/bag" ? "mobile" : undefined}
              data-favorite-target={href === "/wishlist" ? "mobile" : undefined}
              aria-label={href === "/bag"
                ? `View bag, ${itemCount} ${itemCount === 1 ? "item" : "items"}`
                : href === "/wishlist"
                  ? `View favorites, ${favoriteCount} ${favoriteCount === 1 ? "item" : "items"}`
                  : undefined}
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
                {href === "/bag" && itemCount > 0 && (
                  <span aria-hidden="true" className="absolute right-0 top-0 flex min-w-5 h-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-bold text-primary-foreground">{itemCount}</span>
                )}
                {href === "/wishlist" && favoriteCount > 0 && (
                  <span aria-hidden="true" className="absolute right-0 top-0 flex min-w-5 h-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-bold text-primary-foreground">{favoriteCount}</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
