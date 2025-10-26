"use client";

import { ArrowLeft, ShoppingBag, Heart, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useProductStore } from "@/lib/product-store";
import AddToBagSection from "@/components/products/add-bag-section";

export default function ProductDetail() {
  const product = useProductStore((state) => state.product);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!product) {
    return <p className="p-6">Product not found</p>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky bg-secondary top-0 z-40 border-b border-border">
        <div className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6">
          <Link
            href="/products"
            className="bg-primary text-primary-foreground rounded-full px-2 py-2"
          >
            <ArrowLeft className="w-6 h-6 " />
          </Link>
          <button className="bg-primary text-primary-foreground rounded-full px-2 py-2">
            <ShoppingBag className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="pb-32 md:pb-8 bg-secondary flex flex-col gap-6 md:flex-row md:gap-12">
        {/* Product Image */}
        <div className="relative from-secondary to-background px-4 md:px-8 py-8 md:py-12">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover rounded-4xl"
            width={1000}
            height={1000}
            priority
          />
          {product.isBestSeller && (
            <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-secondary border-2 border-primary rounded-full px-4 py-2 md:px-6 md:py-3">
              <span className="text-xs md:text-sm font-bold text-primary">
                BEST
                <br />
                SELLER
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className=" mx-4 bg-[#ddd3eece] rounded-4xl px-4 md:px-8 py-6 md:py-8 space-y-6 md:space-y-8">
          {/* Title and Rating */}
          <div>
            <h1 className="text-2xl md:text-3xl font-serif text-foreground mb-4">
              {product.name}
            </h1>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-primary text-primary" />
              <span className="text-foreground font-medium">
                {product.rating}
              </span>
            </div>
          </div>

          {/* Price */}
          <div>
            <p className="text-4xl md:text-5xl font-bold text-foreground">
              ${product.price}
            </p>
          </div>
          {/* Description */}
          <div>
            <p className="text-foreground text-base md:text-lg leading-relaxed">
              {product.description}
            </p>
          </div>
          {/* Tags */}
          <div className="flex gap-3 flex-wrap">
            {product.tags?.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 bg-secondary text-foreground text-sm font-medium rounded-full border border-border"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="hidden md:block">
            <AddToBagSection />
          </div>
        </div>
        {/* Add to Bag Button */}
        <div className="block md:hidden">
          <AddToBagSection />
        </div>
      </main>
    </div>
  );
}
