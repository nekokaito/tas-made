"use client";

import { Home, ShoppingBag, Heart, User } from "lucide-react";
import Link from "next/link";

export default function BottomNav() {
  return (
    <nav className="fixed mx-3 bottom-3 left-0 right-0 md:hidden bg-secondary from-secondary to-secondary/50 border-t border-border rounded-4xl">
      <div className="flex items-center justify-around py-4">
        <Link href="/" className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <Home className="w-5 h-5 text-primary-foreground" />
          </div>
        </Link>
        <Link href="/bag" className="flex flex-col items-center gap-1">
          <ShoppingBag className="w-6 h-6 text-foreground" />
        </Link>
        <Link href="/wishlist" className="flex flex-col items-center gap-1">
          <Heart className="w-6 h-6 text-foreground" />
        </Link>
        <Link href="/profile" className="flex flex-col items-center gap-1">
          <User className="w-6 h-6 text-foreground" />
        </Link>
      </div>
    </nav>
  );
}
