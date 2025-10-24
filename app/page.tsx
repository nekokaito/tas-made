"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import Header from "@/components/share/navbar";
import ProductGrid from "@/components/products/product-grid";
import BottomNav from "@/components/share/bottom-nav";
import products from "@/test/product";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("Popular");
   
  const categories = ["Popular", "Vegan", "Natural", "Dermatologi"];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 overflow-y-auto pb-24 md:pb-8">
        {/* Search Bar */}
        <div className="px-4 md:px-8 py-4 md:py-6">
          <div className="flex items-center gap-3 bg-secondary rounded-full px-4 py-3 md:py-4">
            <Search className="w-6 h-6 md:w-5 md:h-5 text-primary shrink-0" />
            <input
              type="text"
              placeholder="Search products"
              className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-sm md:text-base"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="px-4 md:px-8 py-4 md:py-6">
          <div className="flex gap-6 md:gap-8 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap pb-2 text-sm md:text-base font-medium transition-colors ${
                  activeCategory === category
                    ? "text-foreground border-b-2 border-primary"
                    : "text-muted-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <ProductGrid products={products} />
      </main>

      <BottomNav />
    </div>
  );
}
