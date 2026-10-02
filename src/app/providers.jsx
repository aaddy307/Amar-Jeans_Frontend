"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import { trpc } from "@/lib/trpc";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "sonner";

function getBaseUrl() {
  if (typeof window !== "undefined") {
    // Browser should use relative path or configured backend
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  }
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
}

export function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 1000,
        refetchOnWindowFocus: false,
      }
    }
  }));

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          transformer: superjson,
          fetch(input, init) {
            return globalThis.fetch(input, {
              ...(init ?? {}),
              credentials: "include",
            });
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          {children}
          <Toaster position="top-right" richColors />
        </CartProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
