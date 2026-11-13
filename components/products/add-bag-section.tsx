"use client";

import { useRef, useState, type MouseEvent } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useCartStore } from "@/lib/cart-store";
import { useWishlistStore } from "@/lib/wishlist-store";
import type { Product } from "@/types/product";

type IconFlight = {
  id: number;
  kind: "bag" | "favorite";
  x: number;
  y: number;
  distanceX: number;
  distanceY: number;
};

export default function AddToBagSection({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [flights, setFlights] = useState<IconFlight[]>([]);
  const nextFlightId = useRef(0);
  const reduceMotion = useReducedMotion();
  const addItem = useCartStore((state) => state.addItem);
  const isFavorite = useWishlistStore((state) =>
    state.favoriteIds.includes(product.id),
  );
  const toggleFavorite = useWishlistStore((state) => state.toggleFavorite);

  const startFlight = (
    event: MouseEvent<HTMLButtonElement>,
    kind: IconFlight["kind"],
  ) => {
    if (reduceMotion) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const selector = kind === "bag"
      ? isMobile ? '[data-bag-target="mobile"]' : '[data-bag-target="product"]'
      : isMobile ? '[data-favorite-target="mobile"]' : '[data-favorite-target="product"]';
    const target = document.querySelector<HTMLElement>(
      selector,
    );
    if (!target) return;

    const buttonRect = event.currentTarget.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const x = buttonRect.left + buttonRect.width / 2;
    const y = buttonRect.top + buttonRect.height / 2;
    const id = ++nextFlightId.current;

    setFlights((current) => [
      ...current,
      {
        id,
        kind,
        x,
        y,
        distanceX: targetRect.left + targetRect.width / 2 - x,
        distanceY: targetRect.top + targetRect.height / 2 - y,
      },
    ]);
  };

  const handleAddToBag = (event: MouseEvent<HTMLButtonElement>) => {
    addItem(product);
    setAdded(true);
    setStatusMessage(`${product.name} added to bag`);
    startFlight(event, "bag");
  };

  const handleFavorite = (event: MouseEvent<HTMLButtonElement>) => {
    toggleFavorite(product.id);
    setStatusMessage(
      isFavorite
        ? `${product.name} removed from favorites`
        : `${product.name} added to favorites`,
    );
    if (!isFavorite) startFlight(event, "favorite");
  };

  return (
    <div className="px-3 w-full flex justify-between gap-4 pt-4 md:pt-8">
      <button
        type="button"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        aria-pressed={isFavorite}
        onClick={handleFavorite}
        className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-primary flex items-center justify-center hover:bg-secondary transition-colors"
      >
        <Heart
          className={`w-6 h-6 md:w-7 md:h-7 ${
            isFavorite ? "fill-accent text-accent" : "text-accent"
          }`}
        />
      </button>

      <button
        type="button"
        onClick={handleAddToBag}
        className="flex-1 bg-accent text-primary-foreground rounded-full py-4 md:py-5 font-semibold text-lg md:text-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
      >
        <span>{added ? "Added to bag · Add another" : "Add to bag"}</span>
        <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
      </button>
      <span className="sr-only" role="status">
        {statusMessage}
      </span>
      {flights.map(({ id, kind, x, y, distanceX, distanceY }) => (
        <motion.span
          key={id}
          data-flight-kind={kind}
          aria-hidden="true"
          className="pointer-events-none fixed z-[100] flex size-11 items-center justify-center rounded-full bg-accent text-primary-foreground shadow-lg"
          style={{ left: x - 22, top: y - 22 }}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{
            x: distanceX,
            y: distanceY,
            scale: [0.4, 1.2, 0.55],
            opacity: [0, 1, 1, 0],
          }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          onAnimationComplete={() =>
            setFlights((current) => current.filter((flight) => flight.id !== id))
          }
        >
          {kind === "favorite" ? (
            <Heart className="size-6 fill-current" />
          ) : (
            <ShoppingBag className="size-6" />
          )}
        </motion.span>
      ))}
    </div>
  );
}
