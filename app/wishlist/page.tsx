"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, X } from "lucide-react";
import { useWishlistStore } from "@/lib/wishlist-store";
import products from "@/test/product";

export default function WishlistPage() {
  const favoriteIds = useWishlistStore((state) => state.favoriteIds);
  const removeFavorite = useWishlistStore((state) => state.removeFavorite);
  const favorites = products.filter((product) =>
    favoriteIds.includes(product.id),
  );

  return (
    <main className="min-h-screen bg-transparent px-4 pb-32 pt-10 text-foreground md:px-8 md:pb-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">Saved with love</p>
            <h1 className="font-serif text-4xl md:text-5xl">Your favorites</h1>
          </div>
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary text-lg font-bold text-accent" aria-label={`${favorites.length} ${favorites.length === 1 ? "favorite" : "favorites"}`}>
            {favorites.length}
          </span>
        </div>

        {favorites.length === 0 ? (
          <div className="flex min-h-80 flex-col items-center justify-center rounded-4xl bg-secondary px-6 text-center">
            <Heart className="mb-4 size-10 text-accent" aria-hidden="true" />
            <h2 className="font-serif text-2xl">No favorites yet</h2>
            <p className="mt-2 text-muted-foreground">Tap the heart on a product to save it here.</p>
            <Link href="/products" className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 font-semibold text-primary-foreground hover:opacity-90">
              Explore products <ArrowRight className="size-5" aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {favorites.map((product) => (
              <li key={product.id} className="relative overflow-hidden rounded-3xl bg-secondary shadow-sm">
                <Link href={`/product/${product.id}`} className="group block">
                  <div className="relative aspect-square overflow-hidden">
                    <Image src={product.image} alt={product.name} fill sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                  </div>
                  <div className="flex flex-wrap items-start justify-between gap-2 p-4">
                    <h2 className="font-medium">{product.name}</h2>
                    <strong className="text-accent">${product.price.toFixed(2)}</strong>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => removeFavorite(product.id)}
                  aria-label={`Remove ${product.name} from favorites`}
                  className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-secondary text-foreground shadow-sm hover:bg-accent hover:text-primary-foreground"
                >
                  <X className="size-5" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
