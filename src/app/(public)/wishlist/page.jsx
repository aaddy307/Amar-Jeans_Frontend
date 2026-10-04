"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { trpc } from "@/lib/trpc";
import { Heart, ShoppingBag } from "lucide-react";
import ProductCard from "@/components/ProductCard";

export default function WishlistPage() {
  const { data: wishlistProducts = [], isLoading } = trpc.commerce.wishlist.get.useQuery(undefined, {
    retry: false
  });

  return (
    <div className="min-h-screen bg-background pt-8 pb-20 px-4">
      <div className="max-w-[1440px] mx-auto">
        <motion.div className="mb-10" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-xs font-black uppercase tracking-widest text-primary block mb-2">Your Collection</span>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-foreground">
            Wishlist
          </h1>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-2">
            {wishlistProducts.length} Saved {wishlistProducts.length === 1 ? "product" : "products"}
          </p>
        </motion.div>

        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="bg-muted/50 border border-border animate-pulse" style={{ aspectRatio: "3/4" }} />
            ))}
          </div>
        )}

        {!isLoading && wishlistProducts.length === 0 && (
          <div className="text-center py-24 border border-border bg-muted/10 flex flex-col items-center">
            <Heart className="w-16 h-16 text-muted-foreground mb-5 stroke-1" />
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Your Wishlist is Empty</h2>
            <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest mb-8">
              Sign in to save your favourites, or browse our catalog.
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <Link href="/products">
                <button className="bg-foreground text-background font-black uppercase tracking-widest text-xs px-8 py-3.5 hover:bg-primary transition-colors cursor-pointer border-none">
                  <ShoppingBag className="w-4 h-4 inline mr-2" />Browse Catalog
                </button>
              </Link>
              <Link href="/signin">
                <button className="bg-transparent text-foreground border-2 border-border font-black uppercase tracking-widest text-xs px-8 py-3.5 hover:bg-muted transition-colors cursor-pointer">
                  Sign In
                </button>
              </Link>
            </div>
          </div>
        )}

        {!isLoading && wishlistProducts.length > 0 && (
          <motion.div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 gap-y-8"
            initial="hidden" animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.06 } } }}>
            {wishlistProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
