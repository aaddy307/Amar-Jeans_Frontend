"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, X, Tag } from "lucide-react";
import Link from "next/link";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useState } from "react";

export default function CartDrawer({ open, onClose }) {
  const { cart, loading, updateQuantity, removeItem, clearCart } = useCart();
  const createOrder = trpc.commerce.orders.create.useMutation();
  const { data: settings } = trpc.commerce.settings.get.useQuery();
  const items = cart?.items ?? [];

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");

  const subtotal = Number(cart?.total?.amount || 0);
  const discount = appliedCoupon?.discount || 0;
  const finalTotal = Math.max(0, subtotal - discount);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    try {
      const result = await trpc.useUtils().commerce.coupons.validate.fetch({
        code: couponInput.trim(),
        cartTotal: subtotal
      });
      if (result.valid) {
        setAppliedCoupon(result);
        setCouponError("");
        toast.success(result.message);
      } else {
        setCouponError(result.message);
        setAppliedCoupon(null);
      }
    } catch {
      setCouponError("Failed to validate coupon");
    }
  };

  const handleWhatsAppOrder = () => {
    const phoneRaw = settings?.whatsappNumber || "919834557990";
    const phone = phoneRaw.replace(/[^\d]/g, "");
    let text = `*AMAR JEANS ORDER ENQUIRY*\n\n*Items:*\n`;
    items.forEach(item => {
      text += `- ${item.productTitle} × ${item.quantity} — ₹${item.lineTotal?.amount}\n`;
    });
    text += `\n*Subtotal: ₹${subtotal}*`;
    if (discount > 0) text += `\n*Discount (${couponInput}): -₹${discount}*\n*Total: ₹${finalTotal}*`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(4px)", zIndex: 60
            }}
          />

          {/* Drawer Panel */}
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            style={{
              position: "fixed", top: 0, right: 0, bottom: 0,
              width: "100%", maxWidth: 440,
              background: "var(--background)",
              borderLeft: "1px solid var(--border)",
              zIndex: 61, display: "flex", flexDirection: "column",
              boxShadow: "-20px 0 60px rgba(0,0,0,0.15)"
            }}
          >
            {/* Header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "20px 24px", borderBottom: "1px solid var(--border)",
              background: "var(--background)"
            }}>
              <div>
                <h2 style={{ fontSize: "1rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>
                  Your Cart
                </h2>
                <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.15em", marginTop: 2 }}>
                  {items.length} {items.length === 1 ? "item" : "items"}
                </p>
              </div>
              <button onClick={onClose} style={{ background: "transparent", border: "1px solid var(--border)", cursor: "pointer", padding: 8, display: "flex", alignItems: "center", justifyContent: "center" }} aria-label="Close cart">
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>

            {/* Items */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
              {items.length === 0 ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", padding: "40px 0" }}>
                  <ShoppingBag style={{ width: 48, height: 48, color: "var(--muted-foreground)", marginBottom: 16, strokeWidth: 1 }} />
                  <p style={{ fontWeight: 900, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Your bag is empty</p>
                  <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 24 }}>
                    Add denim from our catalog
                  </p>
                  <Link href="/products" onClick={onClose}>
                    <button style={{
                      background: "var(--foreground)", color: "var(--background)",
                      fontWeight: 900, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.15em",
                      padding: "12px 28px", border: "none", cursor: "pointer"
                    }}>
                      Explore Shop
                    </button>
                  </Link>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map(item => (
                    <motion.div
                      key={item.lineId}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 40 }}
                      style={{
                        display: "flex", gap: 12, marginBottom: 16,
                        paddingBottom: 16, borderBottom: "1px solid var(--border)"
                      }}
                    >
                      {/* Image */}
                      <div style={{ width: 72, height: 90, background: "var(--muted)", flexShrink: 0, overflow: "hidden", border: "1px solid var(--border)" }}>
                        {item.image?.url
                          ? <img src={item.image.url} alt={item.productTitle} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          : <ShoppingBag style={{ width: 28, height: 28, margin: "auto", color: "var(--muted-foreground)" }} />
                        }
                      </div>

                      {/* Details */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
                          <p style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", lineHeight: 1.3, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                            {item.productTitle}
                          </p>
                          <button
                            onClick={() => removeItem(item.lineId)}
                            disabled={loading}
                            style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--muted-foreground)", padding: 2, flexShrink: 0 }}
                          >
                            <Trash2 style={{ width: 14, height: 14 }} />
                          </button>
                        </div>
                        {item.variantTitle && item.variantTitle !== "Default Title" && (
                          <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                            Size: {item.variantTitle}
                          </p>
                        )}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ fontSize: "0.85rem", fontWeight: 900 }}>₹{item.lineTotal?.amount}</span>
                          {/* Qty stepper */}
                          <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border)" }}>
                            <button
                              onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                              disabled={loading}
                              style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", cursor: "pointer", color: "var(--muted-foreground)" }}
                            >
                              <Minus style={{ width: 12, height: 12 }} />
                            </button>
                            <span style={{ width: 28, textAlign: "center", fontSize: "0.8rem", fontWeight: 900 }}>{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                              disabled={loading}
                              style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", cursor: "pointer", color: "var(--muted-foreground)" }}
                            >
                              <Plus style={{ width: 12, height: 12 }} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer: coupon + totals + CTA */}
            {items.length > 0 && (
              <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border)", background: "var(--background)" }}>
                {/* Coupon */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                    <div style={{ display: "flex", flex: 1, border: "1px solid var(--border)", alignItems: "center", paddingLeft: 10 }}>
                      <Tag style={{ width: 14, height: 14, color: "var(--muted-foreground)", flexShrink: 0 }} />
                      <input
                        type="text"
                        value={couponInput}
                        onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError(""); setAppliedCoupon(null); }}
                        placeholder="COUPON CODE"
                        style={{
                          flex: 1, background: "transparent", border: "none", outline: "none",
                          fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.12em", padding: "10px 8px",
                          color: "var(--foreground)"
                        }}
                      />
                    </div>
                    <button
                      onClick={handleApplyCoupon}
                      style={{
                        background: "var(--foreground)", color: "var(--background)", border: "none", cursor: "pointer",
                        padding: "0 14px", fontSize: "0.65rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", flexShrink: 0
                      }}
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#dc2626", letterSpacing: "0.08em" }}>{couponError}</p>}
                  {appliedCoupon && <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#16a34a", letterSpacing: "0.08em" }}>✓ {appliedCoupon.message}</p>}
                </div>

                {/* Totals */}
                <div style={{ marginBottom: 16, display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: 700, color: "var(--muted-foreground)" }}>
                    <span>Subtotal</span><span>₹{subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: 700, color: "#16a34a" }}>
                      <span>Discount ({couponInput})</span><span>-₹{discount}</span>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: 700, color: "var(--muted-foreground)" }}>
                    <span>Shipping</span><span style={{ color: "#16a34a" }}>On Enquiry</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border)", paddingTop: 8, marginTop: 4 }}>
                    <span style={{ fontWeight: 900, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total</span>
                    <span style={{ fontWeight: 900, fontSize: "1.1rem" }}>₹{finalTotal}</span>
                  </div>
                </div>

                {/* Buttons */}
                <Link href="/cart" onClick={onClose}>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: "100%", background: "var(--foreground)", color: "var(--background)",
                      border: "none", cursor: "pointer", fontWeight: 900, fontSize: "0.75rem",
                      textTransform: "uppercase", letterSpacing: "0.15em", padding: "14px 0",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      marginBottom: 10, transition: "background 0.2s"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#dc2626"}
                    onMouseLeave={e => e.currentTarget.style.background = "var(--foreground)"}
                  >
                    Checkout <ArrowRight style={{ width: 16, height: 16 }} />
                  </motion.button>
                </Link>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleWhatsAppOrder}
                  style={{
                    width: "100%", background: "#16a34a", color: "#fff",
                    border: "none", cursor: "pointer", fontWeight: 900, fontSize: "0.75rem",
                    textTransform: "uppercase", letterSpacing: "0.15em", padding: "14px 0",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    transition: "background 0.2s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#15803d"}
                  onMouseLeave={e => e.currentTarget.style.background = "#16a34a"}
                >
                  📱 Order on WhatsApp
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
