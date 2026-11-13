"use client";

import Header from "@/components/share/navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { useWishlistStore } from "@/lib/wishlist-store";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const pathname = usePathname();
  const hideNavPaths = pathname.startsWith("/product/");
  useEffect(() => {
    void useCartStore.persist.rehydrate();
    void useWishlistStore.persist.rehydrate();
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      {!hideNavPaths && <Header />}
      {children}
    </QueryClientProvider>
  );
}
