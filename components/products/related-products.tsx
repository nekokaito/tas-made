"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useProductStore } from "@/lib/product-store";
import products from "@/test/product";

export default function RelatedProducts({ productId }: { productId: number }) {
  const [startIndex, setStartIndex] = useState(0);
  const setProduct = useProductStore((state) => state.setProduct);
  const otherProducts = products.filter((product) => product.id !== productId);
  const count = otherProducts.length;

  if (count === 0) return null;

  const visibleProducts = Array.from(
    { length: Math.min(2, count) },
    (_, index) => otherProducts[(startIndex + index) % count],
  );
  const canBrowse = count > 2;
  const browse = (direction: number) => {
    if (canBrowse) {
      setStartIndex((index) => (index + direction + count) % count);
    }
  };

  return (
    <section
      aria-label="More products"
      aria-roledescription="carousel"
      className="mx-4 hidden min-h-72 min-w-0 flex-1 grid-rows-[auto_minmax(0,1fr)] gap-4 rounded-4xl bg-[#ddd3eece] px-4 py-6 md:mx-0 md:grid md:p-6 lg:p-8"
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          browse(event.key === "ArrowLeft" ? -1 : 1);
        }
      }}
    >
      <h2 className="px-1 font-serif text-xl text-foreground">
        You may also like
      </h2>
      <div className="grid min-h-0 grid-cols-[2.5rem_minmax(0,1fr)_2.5rem] items-center gap-2 lg:gap-3">
        <button
          type="button"
          aria-label="Previous products"
          onClick={() => browse(-1)}
          disabled={!canBrowse}
          className="flex size-10 items-center justify-center rounded-full border border-primary/30 text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-30"
        >
          <ArrowLeft className="size-5" aria-hidden="true" />
        </button>
        <div className="grid h-full min-h-0 min-w-0 grid-cols-2 gap-3 lg:gap-4">
          {visibleProducts.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              onClick={() => setProduct(product)}
              className="group grid min-h-0 min-w-0 grid-rows-[minmax(0,1fr)_auto] overflow-hidden rounded-2xl bg-background/80 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <div className="relative min-h-24 w-full overflow-hidden md:aspect-[4/3] lg:aspect-auto">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  sizes="(min-width: 1280px) 200px, (min-width: 1024px) calc((100vw - 480px) / 4), (min-width: 768px) calc((100vw - 220px) / 2), 1px"
                  className="object-cover transition-transform duration-300 motion-safe:group-hover:scale-105"
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 p-3 backdrop-blur-md">
                <h3 className="min-w-0 flex-1 basis-20 line-clamp-2 text-xs font-medium text-foreground lg:text-sm">
                  {product.name}
                </h3>
                <p className="shrink-0 text-base font-semibold text-primary">
                  ${product.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <button
          type="button"
          aria-label="Next products"
          onClick={() => browse(1)}
          disabled={!canBrowse}
          className="flex size-10 items-center justify-center rounded-full border border-primary/30 text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-30"
        >
          <ArrowRight className="size-5" aria-hidden="true" />
        </button>
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {visibleProducts.map((product) => product.name).join(", ")}
      </p>
    </section>
  );
}
