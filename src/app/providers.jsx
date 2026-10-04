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
          <Toaster
            position="top-right"
            expand={false}
            visibleToasts={4}
            toastOptions={{
              duration: 3500,
              style: {
                background: "linear-gradient(135deg, rgba(15,15,20,0.92) 0%, rgba(30,20,40,0.95) 100%)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1.5px solid transparent",
                backgroundClip: "padding-box",
                borderRadius: "16px",
                boxShadow: "0 8px 40px rgba(0,0,0,0.5), 0 0 0 1.5px rgba(220,38,38,0.45), inset 0 1px 0 rgba(255,255,255,0.07)",
                color: "#ffffff",
                fontFamily: "'Inter', 'Segoe UI', sans-serif",
                fontSize: "14px",
                fontWeight: "600",
                letterSpacing: "0.01em",
                padding: "14px 18px",
                minWidth: "280px",
              },
              classNames: {
                success: "toast-success-crazy",
                error: "toast-error-crazy",
              },
            }}
          />
        </CartProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
