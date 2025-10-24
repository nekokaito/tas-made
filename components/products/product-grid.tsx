"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useProductStore } from "@/lib/product-store";
import { useUIStore } from "@/lib/ui-store";
import { ProductGridProps } from "@/types/product";
import { motion } from "framer-motion";

export default function ProductGrid({ products }: ProductGridProps) {
  const setProduct = useProductStore((state) => state.setProduct);
  const { isMobile, checkScreen } = useUIStore();

  useEffect(() => {
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, [checkScreen]);

  const getRowSpan = (index: number) => {
    const patterns = [
      [2, 1, 1],
      [1, 2, 1],
      [2, 1, 2],
    ];
    const group = Math.floor(index / 3) % patterns.length;
    return patterns[group][index % 3];
  };
  if (isMobile) {
    return (
      <div className="px-4 md:px-8 py-4 md:py-8">
        <div
          className="grid gap-4 md:gap-6 auto-rows-[200px]"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gridAutoFlow: "dense",
          }}
        >
          {products.map((product, index) => {
            const rowSpan = getRowSpan(index);
            return (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group"
                style={{
                  gridRowEnd: `span ${rowSpan}`,
                }}
                onClick={() => setProduct(product)}
              >
                <div className="relative w-full h-full rounded-2xl overflow-hidden transition-all">
                  <div className="relative w-full h-3/4 md:w-full md:h-full">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover rounded-3xl"
                    />
                  </div>
                  <div className="flex p-3 items-center gap-3 justify-between md:p-4 bg-background/80 backdrop-blur-md">
                    <h3 className="text-xs md:text-base font-medium text-foreground line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-primary font-semibold text-xl md:text-base mt-2">
                      ${product.price}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  } else {
    return (
      <div className="px-4 md:px-8 py-4 md:py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="group"
              onClick={() => setProduct(product)}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="h-full bg-card rounded-4xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="h-full relative aspect-square bg-muted overflow-hidden">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <motion.div
                  className="flex items-center justify-between mx-9 relative bottom-22 bg-[#ddd3eeda] rounded-4xl p-3 md:p-4"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 8 }}
                >
                  <h3 className="text-xs font-medium text-foreground line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-primary font-semibold text-2xl mt-2">
                    ${product.price}
                  </p>
                </motion.div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    );
  }
}
