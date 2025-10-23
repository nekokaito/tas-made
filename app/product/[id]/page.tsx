"use client";

import { useState } from "react";
import { ArrowLeft, ShoppingBag, Heart, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ProductDetail({ params }: { params: { id: string } }) {
  const [isFavorite, setIsFavorite] = useState(false);


  const product = {
    id: params.id,
    name: "Bella Skinhydra Masque",
    price: 40,
    rating: 4.8,
    image: "/bella-skinhydra-masque-product-detail.jpg",
    description:
      "Enrich your skin with the essence of Rose and Chamomile. Gives a soothing effect and calms the skin. Has anti-ageing properties best used as a sleeping masque.",
    tags: ["Cruelty Free", "Vegan"],
    benefits: [
      "Deep hydration",
      "Anti-aging properties",
      "Soothing effect",
      "Calms sensitive skin",
    ],
    isBestSeller: true,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6">
          <Link href="/">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </Link>
          <button>
            <ShoppingBag className="w-6 h-6 text-foreground" />
          </button>
        </div>
      </header>

      <main className="pb-32 md:pb-8">
        {/* Product Image */}
        <div className="relative bg-gradient-to-b from-secondary to-background px-4 md:px-8 py-8 md:py-12">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover"
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
        <div className="px-4 md:px-8 py-6 md:py-8 space-y-6 md:space-y-8">
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
            <p className="text-foreground leading-relaxed text-sm md:text-base">
              Enrich your skin with the essence of{" "}
              <span className="font-bold">Rose</span> and{" "}
              <span className="font-bold">Chamomile</span>. Gives a soothing
              effect and calms the skin. Has anti-ageing properties best used as
              a sleeping masque.
            </p>
          </div>

          {/* Tags */}
          <div className="flex gap-3 flex-wrap">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 bg-secondary text-foreground text-sm font-medium rounded-full border border-border"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Other Benefits */}
          <button className="flex items-center gap-2 text-foreground font-medium hover:text-primary transition-colors">
            <span>Other benefits</span>
            <span className="text-lg">∨</span>
          </button>

          {/* Add to Bag Button */}
          <div className="flex gap-4 pt-4 md:pt-8">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-primary flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <Heart
                className={`w-6 h-6 md:w-7 md:h-7 ${
                  isFavorite ? "fill-primary text-primary" : "text-primary"
                }`}
              />
            </button>
            <button className="flex-1 bg-primary text-primary-foreground rounded-full py-4 md:py-5 font-semibold text-lg md:text-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
              <span>Add to bag</span>
              <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
