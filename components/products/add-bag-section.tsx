"use client";

import { useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";

export default function AddToBagSection() {
  const [isWishList, setIsWishList] = useState(false);

  return (
    <div className="px-3 w-full flex justify-between gap-4 pt-4 md:pt-8">
      <button
        onClick={() => setIsWishList(!isWishList)}
        className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-primary flex items-center justify-center hover:bg-secondary transition-colors"
      >
        <Heart
          className={`w-6 h-6 md:w-7 md:h-7 ${
            isWishList ? "fill-primary text-primary" : "text-primary"
          }`}
        />
      </button>

      <button className="flex-1 bg-primary text-primary-foreground rounded-full py-4 md:py-5 font-semibold text-lg md:text-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
        <span>Add to bag</span>
        <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
      </button>
    </div>
  );
}
