"use client";

import {
  ArrowLeft,
  ShoppingBag,
  Heart,
  Instagram,
  Facebook,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { selectCartItemCount, useCartStore } from "@/lib/cart-store";
import { selectWishlistCount, useWishlistStore } from "@/lib/wishlist-store";
import AddToBagSection from "@/components/products/add-bag-section";
import RelatedProducts from "@/components/products/related-products";
import products from "@/test/product";
import type { Product } from "@/types/product";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product: Product | undefined = products.find(
    (item) => item.id === Number(id),
  );
  const itemCount = useCartStore(selectCartItemCount);
  const favoriteCount = useWishlistStore(selectWishlistCount);

  const facebookUserId = process.env.NEXT_PUBLIC_FACEBOOK_USER_ID;
  const instagramUserId = process.env.NEXT_PUBLIC_INSTAGRAM_USER_ID;

  if (!product) {
    return <p className="p-6">Product not found</p>;
  }

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <header className="sticky bg-secondary top-0 z-40 border-b border-border">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-8 md:py-6">
          <Link
            href="/products"
            className="bg-accent text-primary-foreground hover:opacity-90 rounded-full px-2 py-2"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/wishlist"
              data-favorite-target="product"
              aria-label={`View favorites, ${favoriteCount} ${favoriteCount === 1 ? "item" : "items"}`}
              className="relative rounded-full bg-accent px-2 py-2 text-primary-foreground hover:opacity-90"
            >
              <Heart className="size-6" />
              {favoriteCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -right-2 -top-2 flex min-w-5 h-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-bold text-primary-foreground"
                >
                  {favoriteCount}
                </span>
              )}
            </Link>
            <Link
              href="/bag"
              data-bag-target="product"
              aria-label={`View bag, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
              className="relative bg-accent text-primary-foreground hover:opacity-90 rounded-full px-2 py-2"
            >
              <ShoppingBag className="w-6 h-6" />
              {itemCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -right-2 -top-2 flex min-w-5 h-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-bold text-primary-foreground"
                >
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 pb-32 md:gap-8 md:px-8 md:py-12 lg:grid lg:grid-cols-2 lg:items-stretch lg:gap-12">
        {/* Product Image */}
        <div className="relative w-full min-w-0 max-w-full px-4 py-8 md:p-0 lg:aspect-3/4 lg:overflow-hidden lg:rounded-4xl">
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
                    className="bg-accent text-primary-foreground hover:opacity-90 rounded-full px-2 py-2"
                  >
                    <Instagram className="w-6 h-6" />
                  </Link>
                  <Link
                    href={`https://www.messenger.com/t/${facebookUserId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-accent text-primary-foreground hover:opacity-90 rounded-full px-2 py-2"
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
              <AddToBagSection key={product.id} product={product} />
            </div>
          </div>
          <RelatedProducts key={product.id} productId={product.id} />
        </div>
        {/* Add to Bag Button */}
        <div className="block md:hidden">
          <AddToBagSection key={product.id} product={product} />
        </div>
      </main>
    </div>
  );
}
