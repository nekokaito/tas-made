"use client";

import Link from "next/link";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="px-4 md:px-8 py-4 md:py-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="group"
          >
            <div className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
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
