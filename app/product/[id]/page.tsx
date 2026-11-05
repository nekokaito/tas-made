"use client";

import { ArrowLeft, ShoppingBag, Instagram, Facebook } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useProductStore } from "@/lib/product-store";
import AddToBagSection from "@/components/products/add-bag-section";
import RelatedProducts from "@/components/products/related-products";

export default function ProductDetail() {
  const product = useProductStore((state) => state.product);

  const facebookUserId = process.env.NEXT_PUBLIC_FACEBOOK_USER_ID;
  const instagramUserId = process.env.NEXT_PUBLIC_INSTAGRAM_USER_ID;

  if (!product) {
    return <p className="p-6">Product not found</p>;
  }

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <header className="sticky bg-secondary top-0 z-40 border-b border-border">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-8 md:py-6">
          <Link
            href="/products"
            className="bg-primary text-primary-foreground hover:opacity-90 rounded-full px-2 py-2"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <button className="bg-primary text-primary-foreground hover:opacity-90 rounded-full px-2 py-2">
            <ShoppingBag className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 pb-32 md:gap-8 md:px-8 md:py-12 lg:grid lg:grid-cols-2 lg:items-stretch lg:gap-12">
        {/* Product Image */}
        <div className="relative w-full min-w-0 max-w-full px-4 py-8 md:p-0 lg:aspect-[3/4] lg:overflow-hidden lg:rounded-4xl">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="h-auto w-full rounded-4xl object-cover lg:absolute lg:inset-0 lg:h-full lg:max-w-full"
            sizes="(min-width: 1280px) 584px, (min-width: 1024px) calc((100vw - 112px) / 2), (min-width: 768px) calc(100vw - 64px), calc(100vw - 32px)"
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

        <div className="flex min-w-0 flex-col gap-6 lg:gap-8">
          {/* Product Info */}
          <div className="mx-4 min-w-0 rounded-4xl bg-[#ddd3eece] px-4 py-6 space-y-6 md:mx-0 md:p-6 md:space-y-8 lg:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              {/* Title and Rating */}
              <div className="min-w-0 max-w-full">
                <h1 className="text-2xl md:text-3xl font-serif text-foreground mb-4 wrap-break-word">
                  {product.name}
                </h1>
                <div className="flex items-center gap-2">
                  <Link
                    href={`https://www.instagram.com/direct/t/${instagramUserId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary text-primary-foreground hover:opacity-90 rounded-full px-2 py-2"
                  >
                    <Instagram className="w-6 h-6" />
                  </Link>
                  <Link
                    href={`https://www.messenger.com/t/${facebookUserId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary text-primary-foreground hover:opacity-90 rounded-full px-2 py-2"
                  >
                    <Facebook className="w-6 h-6" />
                  </Link>
                </div>
              </div>

              {/* Price */}
              <div className="min-w-0 max-w-full">
                <p className="text-4xl lg:text-5xl font-bold text-foreground wrap-break-word">
                  ${product.price}
                </p>
              </div>
            </div>
            {/* Description */}
            <div>
              <p className="text-foreground text-base md:text-lg leading-relaxed wrap-break-word">
                {product.description}
              </p>
            </div>
            {/* Tags */}
            <div className="flex gap-3 flex-wrap">
              {product.tags?.map((tag) => (
                <span
                  key={tag}
                  className="max-w-full wrap-break-word px-4 py-2 bg-secondary text-foreground text-sm font-medium rounded-full border border-border"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="hidden md:block">
              <AddToBagSection />
            </div>
          </div>
          <RelatedProducts key={product.id} productId={product.id} />
        </div>
        {/* Add to Bag Button */}
        <div className="block md:hidden">
          <AddToBagSection />
        </div>
      </main>
    </div>
  );
}
