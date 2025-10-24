"use client";

import Link from "next/link";
import Image from "next/image";
import { useProductStore } from "@/lib/product-store";
import { ProductGridProps } from "@/types/product";

export default function ProductGrid({ products }: ProductGridProps) {
  const setProduct = useProductStore((state) => state.setProduct);
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
            <div className="bg-transparent rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                fill={false}
                width={200}
                height={200}
              />
              <div className="p-3 md:p-4">
                <h3 className="text-sm md:text-base font-medium text-foreground line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-primary font-semibold text-sm md:text-base mt-2">
                  ${product.price}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
