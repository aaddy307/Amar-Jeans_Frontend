"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import { trpc } from "@/lib/trpc";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "sonner";

function getBaseUrl() {
  // If an explicit API URL is set via env, use it
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  // In the browser, check the current hostname to detect Vercel/production
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    // Not localhost — assume production, use Render backend
    if (host !== "localhost" && host !== "127.0.0.1") {
      return "https://amar-jeans-backend.onrender.com";
    }
  }
  return "http://localhost:5000";
}

export function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,           // 30s — reduce chatter
        refetchOnWindowFocus: false,
        retry: 1,                        // only retry once on failure
        retryDelay: 1000,
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
