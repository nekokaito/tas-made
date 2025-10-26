"use client";

import Header from "@/components/share/navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const pathname = usePathname();
  const hideNavPaths = pathname.startsWith("/product/");
  return (
    <QueryClientProvider client={queryClient}>
      {!hideNavPaths && <Header />}
      {children}
    </QueryClientProvider>
  );
}
