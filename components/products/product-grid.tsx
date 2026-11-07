"use client";

import Link from "next/link";
import Image from "next/image";
import { useProductStore } from "@/lib/product-store";
import { ProductGridProps } from "@/types/product";
import { motion } from "framer-motion";

export default function ProductGrid({ products }: ProductGridProps) {
  const setProduct = useProductStore((state) => state.setProduct);

  return (
    <div className="px-4 md:px-8 py-4 md:py-8">
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="group min-w-0"
            onClick={() => setProduct(product)}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative h-full bg-primary rounded-2xl md:rounded-4xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-square bg-muted overflow-hidden">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <motion.div
                className="flex min-w-0 flex-col items-start gap-1 m-2 bg-[#ddd3eeda] rounded-xl p-2.5 sm:m-3 sm:p-3 md:absolute md:inset-x-3 md:bottom-3 md:m-0 md:flex-row md:items-center md:justify-between md:gap-2 md:rounded-4xl md:p-4 xl:inset-x-9"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 8 }}
              >
                <h3 className="min-w-0 text-xs sm:text-sm font-medium text-foreground line-clamp-2 wrap-anywhere">
                  {product.name}
                </h3>
                <p className="max-w-full text-accent font-semibold text-base sm:text-lg md:text-xl xl:text-2xl wrap-anywhere">
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
