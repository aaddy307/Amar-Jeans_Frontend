"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { trpc } from "@/lib/trpc";

const DEFAULT_MESSAGES = [
  { text: "🏭 FACTORY DIRECT PRICES — No middlemen, maximum value", link: "/products" },
  { text: "🎉 Extra 10% OFF with code AMAR10 — Min cart ₹999", link: "/products" },
  { text: "📦 FREE SHIPPING on orders above ₹1500 | Pan-India Delivery", link: "/products" },
  { text: "👖 BULK ORDERS WELCOME — Custom fit available", link: "/contact" },
  { text: "🏭 SINCE 1995 — 30+ years of premium denim craftsmanship", link: "/" },
];

export default function AnnouncementBar() {
  const { data: settings } = trpc.commerce.settings.get.useQuery();
  const [idx, setIdx] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  const messages = (
    settings?.announcementMessages?.filter(m => m.active).length
      ? settings.announcementMessages.filter(m => m.active)
      : DEFAULT_MESSAGES
  );

  useEffect(() => {
    if (messages.length <= 1) return;
    const t = setInterval(() => setIdx(i => (i + 1) % messages.length), 3500);
    return () => clearInterval(t);
  }, [messages.length]);

  if (dismissed) return null;

  const current = messages[idx] || messages[0];

  return (
    <div
      style={{
        background: "linear-gradient(90deg, #111 0%, #1a0505 40%, #111 100%)",
        position: "relative",
        overflow: "hidden",
        borderBottom: "1px solid rgba(220,38,38,0.25)"
      }}
    >
      {/* Shimmer line */}
      <motion.div
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
        style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "100%",
          background: "linear-gradient(90deg, transparent, rgba(220,38,38,0.1), transparent)",
          pointerEvents: "none"
        }}
      />

      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 1rem", height: 36, maxWidth: 1440, margin: "0 auto"
      }}>
        {/* Prev */}
        <button
          onClick={() => setIdx(i => (i - 1 + messages.length) % messages.length)}
          style={{ background: "transparent", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", padding: "4px", flexShrink: 0 }}
        >
          <ChevronLeft style={{ width: 14, height: 14 }} />
        </button>

        {/* Message */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", justifyContent: "center" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              style={{ textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
            >
              {current.link ? (
                <Link href={current.link || "#"} style={{ textDecoration: "none" }}>
                  <span style={{
                    fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.12em",
                    textTransform: "uppercase", color: "rgba(255,255,255,0.9)", cursor: "pointer"
                  }}>
                    {current.text}
                  </span>
                </Link>
              ) : (
                <span style={{
                  fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.12em",
                  textTransform: "uppercase", color: "rgba(255,255,255,0.9)"
                }}>
                  {current.text}
                </span>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots + Dismiss */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <button
            onClick={() => setIdx(i => (i + 1) % messages.length)}
            style={{ background: "transparent", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", padding: "4px" }}
          >
            <ChevronRight style={{ width: 14, height: 14 }} />
          </button>
          <button
            onClick={() => setDismissed(true)}
            style={{ background: "transparent", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", padding: "4px" }}
            aria-label="Close announcement bar"
          >
            <X style={{ width: 12, height: 12 }} />
          </button>
        </div>
      </div>

      {/* Progress dots */}
      <div style={{
        position: "absolute", bottom: 2, left: "50%", transform: "translateX(-50%)",
        display: "flex", gap: 4
      }}>
        {messages.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            style={{
              width: i === idx ? 16 : 4, height: 2, borderRadius: 2,
              background: i === idx ? "#dc2626" : "rgba(255,255,255,0.2)",
              border: "none", cursor: "pointer", transition: "all 0.3s", padding: 0
            }}
          />
        ))}
      </div>
    </div>
  );
}
