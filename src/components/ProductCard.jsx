"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Heart, ShoppingBag, Star, Zap } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

export default function ProductCard({ product, className = "" }) {
  const [hovered, setHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [showSizes, setShowSizes] = useState(false);
  const { addItem } = useCart();

  if (!product) return null;

  const price = Number(product.priceRange?.min?.amount || product.price || 0);
  const compareAt = Number(product.compareAtPrice || 0);
  const isSale = compareAt > price;
  const discount = isSale ? Math.round(((compareAt - price) / compareAt) * 100) : 0;

  const primaryImg = product.images?.[0]?.url || "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop";
  const hoverImg = product.images?.[1]?.url || primaryImg;
  const sizes = product.sizes?.length ? product.sizes : ["28", "30", "32", "34", "36", "38"];
  const variantId = product.variants?.[0]?.id || product.id;

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedSize && sizes.length > 0) {
      setShowSizes(true);
      return;
    }
    try {
      await addItem(variantId, 1);
      toast.success("Added to Cart!");
      setShowSizes(false);
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  return (
    <motion.div
      className={`group relative cursor-pointer flex flex-col ${className}`}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => { setHovered(false); setShowSizes(false); }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Link href={`/products/${product.handle}`}>
        {/* Image Container */}
        <div className="relative overflow-hidden bg-muted border border-border mb-3" style={{ aspectRatio: "3/4" }}>
          {/* Primary image */}
          <img
            src={primaryImg}
            alt={product.title}
            className="w-full h-full object-cover transition-opacity duration-500"
            style={{ opacity: hovered && hoverImg !== primaryImg ? 0 : 1, position: "absolute", inset: 0 }}
          />
          {/* Hover image */}
          {hoverImg !== primaryImg && (
            <img
              src={hoverImg}
              alt={product.title + " hover"}
              className="w-full h-full object-cover transition-opacity duration-500 absolute inset-0"
              style={{ opacity: hovered ? 1 : 0 }}
            />
          )}

          {/* Zoom effect overlay */}
          <div
            className="absolute inset-0 transition-transform duration-700"
            style={{ transform: hovered ? "scale(1.04)" : "scale(1)", background: "transparent" }}
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
            {isSale && (
              <span className="bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest px-2.5 py-1 shadow-sm">
                -{discount}%
              </span>
            )}
            {product.isNew && (
              <span className="bg-foreground text-background text-[10px] font-black uppercase tracking-widest px-2.5 py-1">
                NEW
              </span>
            )}
            {product.isBestseller && !product.isNew && (
              <span className="bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 flex items-center gap-1">
                <Zap className="w-2.5 h-2.5 fill-white" /> BEST
              </span>
            )}
          </div>

          {/* Wishlist button */}
          <button
            onClick={e => { e.preventDefault(); e.stopPropagation(); toast.success("Added to wishlist"); }}
            className="absolute top-2 right-2 z-10 w-8 h-8 bg-background/90 backdrop-blur-sm border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:border-primary hover:text-white cursor-pointer"
          >
            <Heart className="w-3.5 h-3.5" />
          </button>

          {/* Quick add panel */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ duration: 0.22 }}
                className="absolute bottom-0 left-0 right-0 bg-background/97 border-t border-border z-20 p-2"
              >
                {showSizes ? (
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 text-center">Select Size</p>
                    <div className="flex flex-wrap gap-1.5 justify-center mb-2">
                      {sizes.map(s => (
                        <button
                          key={s}
                          onClick={e => { e.preventDefault(); e.stopPropagation(); setSelectedSize(s); }}
                          className={`h-7 min-w-[28px] px-1.5 text-[10px] font-black border transition-colors cursor-pointer ${selectedSize === s ? "bg-foreground text-background border-foreground" : "border-border hover:border-foreground"}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    {selectedSize && (
                      <button onClick={handleQuickAdd} className="w-full bg-primary text-white text-[10px] font-black uppercase tracking-widest py-2 flex items-center justify-center gap-1.5 cursor-pointer border-none">
                        <ShoppingBag className="w-3 h-3" /> Add to Cart
                      </button>
                    )}
                  </div>
                ) : (
                  <button onClick={handleQuickAdd} className="w-full text-[10px] font-black uppercase tracking-widest text-foreground hover:text-primary transition-colors flex items-center justify-center gap-1.5 py-1.5 cursor-pointer bg-transparent border-none">
                    <ShoppingBag className="w-3.5 h-3.5" /> Quick Add
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex flex-col flex-1">
        <div className="flex items-center gap-1 mb-1 text-primary">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-3 h-3 ${i < Math.round(product.averageRating || 5) ? "fill-primary text-primary" : "fill-transparent text-muted-foreground"}`} />
          ))}
          <span className="text-[10px] font-bold text-muted-foreground ml-1">({product.totalReviews || 0})</span>
        </div>

        <Link href={`/products/${product.handle}`}>
          <h3 className="font-black text-foreground text-xs uppercase tracking-tight leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">
            {product.title}
          </h3>
        </Link>

        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">{product.brand || "AMAR JEANS"}</p>

        <div className="mt-auto flex items-center gap-2">
          <span className="text-base font-black text-foreground">₹{price}</span>
          {isSale && (
            <span className="text-xs font-bold text-muted-foreground line-through">₹{compareAt}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
