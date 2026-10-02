"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, ChevronLeft, Send } from "lucide-react";
import Link from "next/link";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useState } from "react";

export default function CartPage() {
  const { cart, loading, updateQuantity, removeItem, clearCart } = useCart();
  const createOrder = trpc.commerce.orders.create.useMutation();
  const { data: settings } = trpc.commerce.settings.get.useQuery();
  const items = cart?.items ?? [];

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderForm, setOrderForm] = useState({
    name: "", email: "", phone: "", address: "", city: "", pincode: "", notes: ""
  });

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone, address, city, pincode, notes } = orderForm;
    if (!name || !email || !phone) {
      toast.error("Please fill in your name, email and phone number.");
      return;
    }
    try {
      const orderData = await createOrder.mutateAsync({
        orderType: "order",
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        shippingAddress: address,
        city, pincode,
        totalPrice: cart?.total?.amount || "0",
        notes: notes || "Order placed via website checkout",
        items: items.map(item => ({
          productId: item.productId || item.variantId,
          title: item.productTitle,
          price: Number(item.unitPrice?.amount || 0),
          quantity: item.quantity,
          size: item.variantTitle || "32",
          image: item.image?.url
        }))
      });

      toast.success(orderData.message || "Order & Enquiry submitted successfully!");
      const supportPhoneRaw = settings?.whatsappNumber || settings?.supportPhone?.split("/")?.[0] || "919834557990";
      const phoneNumber = supportPhoneRaw.replace(/[^\d+]/g, "").replace(/^\+/, "");
      let text = `*AMAR JEANS ORDER #${orderData.orderNumber}*\n\n*Customer:*\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nAddress: ${address}, ${city} - ${pincode}\n\n*Items:*\n`;
      items.forEach(item => {
        text += `- ${item.productTitle} (Qty: ${item.quantity}) - Rs.${item.lineTotal?.amount}\n`;
      });
      text += `\n*Total: Rs.${cart?.total?.amount}*`;
      if (notes) text += `\nNotes: ${notes}`;

      window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`, "_blank");
      clearCart();
      setIsCheckoutOpen(false);
    } catch (err) {
      toast.error(err.message || "Failed to submit order");
    }
  };

  const inputClass = "w-full bg-background border-2 border-border px-4 py-3 font-semibold text-base outline-none focus:border-foreground transition-colors rounded-none";
  const labelClass = "text-sm font-black uppercase tracking-widest text-foreground block mb-2";

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)", padding: "48px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Back Button */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/products">
            <button style={{
              display: "flex", alignItems: "center", gap: 8,
              color: "var(--muted-foreground)", fontWeight: 800,
              fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase",
              marginBottom: 32, background: "none", border: "none", cursor: "pointer"
            }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--foreground)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--muted-foreground)"}
            >
              <ChevronLeft style={{ width: 20, height: 20 }} />
              Continue Shopping
            </button>
          </Link>

          <h1 style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900,
            color: "var(--foreground)", textTransform: "uppercase",
            letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 12
          }}>
            Shopping Bag &amp; Enquiry
          </h1>
          <p style={{ color: "var(--muted-foreground)", fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 48 }}>
            {items.length} item{items.length !== 1 ? "s" : ""}
          </p>
        </motion.div>

        {/* Empty State */}
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: "center", padding: "96px 32px", border: "1px solid var(--border)", background: "var(--muted)", marginTop: 16 }}
          >
            <ShoppingBag style={{ width: 80, height: 80, color: "var(--muted-foreground)", margin: "0 auto 24px", strokeWidth: 1 }} />
            <h2 style={{ fontSize: "2rem", fontWeight: 900, color: "var(--foreground)", textTransform: "uppercase", letterSpacing: "-0.02em", marginBottom: 12 }}>
              Your Bag is Empty
            </h2>
            <p style={{ color: "var(--muted-foreground)", fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 40 }}>
              Browse our denim catalog and add your favourite fits.
            </p>
            <Link href="/products">
              <motion.button
                whileTap={{ scale: 0.97 }}
                style={{ background: "var(--foreground)", color: "var(--background)", fontWeight: 900, fontSize: "0.9rem", letterSpacing: "0.18em", textTransform: "uppercase", padding: "18px 48px", border: "none", cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--primary)"}
                onMouseLeave={e => e.currentTarget.style.background = "var(--foreground)"}
              >
                Explore Shop
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 32 }}>

            {/* Items + Summary side by side on desktop */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 32 }} className="cart-grid">
              
              {/* Items List */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.lineId}
                      layout
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10, height: 0 }}
                      style={{ background: "var(--background)", border: "1px solid var(--border)", padding: "24px", display: "flex", gap: 24, alignItems: "center" }}
                    >
                      {/* Product Image */}
                      <div style={{ width: 100, height: 130, flexShrink: 0, background: "var(--muted)", border: "1px solid var(--border)", overflow: "hidden" }}>
                        {item.image
                          ? <img src={item.image.url} alt={item.productTitle} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <ShoppingBag style={{ width: 36, height: 36, color: "var(--muted-foreground)" }} />
                            </div>
                        }
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ color: "var(--foreground)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.01em", fontSize: "1.1rem", marginBottom: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {item.productTitle}
                        </h3>
                        {item.variantTitle && item.variantTitle !== "Default Title" && (
                          <p style={{ color: "var(--muted-foreground)", fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>
                            Size: {item.variantTitle}
                          </p>
                        )}
                        <p style={{ color: "var(--foreground)", fontWeight: 900, fontSize: "1.3rem" }}>
                          Rs.{item.unitPrice?.amount}
                        </p>
                      </div>

                      {/* Controls */}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 16 }}>
                        <button
                          onClick={() => removeItem(item.lineId)}
                          disabled={loading}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)", padding: 4 }}
                          onMouseEnter={e => e.currentTarget.style.color = "#dc2626"}
                          onMouseLeave={e => e.currentTarget.style.color = "var(--muted-foreground)"}
                        >
                          <Trash2 style={{ width: 20, height: 20 }} />
                        </button>

                        <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border)" }}>
                          <button
                            onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                            disabled={loading}
                            style={{ padding: "10px 14px", background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)", fontSize: "1.1rem", display: "flex", alignItems: "center" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "var(--muted)"; e.currentTarget.style.color = "var(--foreground)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--muted-foreground)"; }}
                          >
                            <Minus style={{ width: 16, height: 16 }} />
                          </button>
                          <span style={{ color: "var(--foreground)", fontWeight: 900, width: 44, textAlign: "center", fontSize: "1rem" }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                            disabled={loading}
                            style={{ padding: "10px 14px", background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)", fontSize: "1.1rem", display: "flex", alignItems: "center" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "var(--muted)"; e.currentTarget.style.color = "var(--foreground)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--muted-foreground)"; }}
                          >
                            <Plus style={{ width: 16, height: 16 }} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: "var(--background)", border: "1px solid var(--border)", padding: "32px" }}
              >
                <h2 style={{ fontSize: "1.4rem", fontWeight: 900, color: "var(--foreground)", textTransform: "uppercase", letterSpacing: "-0.02em", marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
                  Order &amp; Enquiry Summary
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "var(--muted-foreground)", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>Subtotal</span>
                    <span style={{ color: "var(--foreground)", fontWeight: 900, fontSize: "1.05rem" }}>Rs.{cart?.subtotal?.amount}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
                    <span style={{ color: "var(--muted-foreground)", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>Est. Shipping</span>
                    <span style={{ color: "#059669", fontWeight: 700, fontSize: "0.9rem" }}>Calculated on Enquiry</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "var(--foreground)", fontWeight: 900, fontSize: "1.1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Amount</span>
                    <span style={{ color: "var(--foreground)", fontWeight: 900, fontSize: "1.4rem" }}>Rs.{cart?.total?.amount}</span>
                  </div>
                </div>

                <motion.button
                  onClick={() => setIsCheckoutOpen(true)}
                  disabled={loading || createOrder.isPending}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  style={{
                    width: "100%", background: "var(--foreground)", color: "var(--background)",
                    fontWeight: 900, fontSize: "0.9rem", letterSpacing: "0.15em", textTransform: "uppercase",
                    padding: "20px 24px", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
                    marginBottom: 16, transition: "background 0.2s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--primary)"}
                  onMouseLeave={e => e.currentTarget.style.background = "var(--foreground)"}
                >
                  Proceed to Submit Order / Enquiry
                  <ArrowRight style={{ width: 20, height: 20 }} />
                </motion.button>

                <p style={{ color: "var(--muted-foreground)", fontWeight: 600, fontSize: "0.78rem", textAlign: "center", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Instant Order Confirmation &amp; Direct WhatsApp Support
                </p>
              </motion.div>
            </div>

          </div>
        )}

        {/* Checkout Modal */}
        <AnimatePresence>
          {isCheckoutOpen && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                style={{ background: "var(--background)", border: "1px solid var(--border)", width: "100%", maxWidth: 520, padding: "40px 36px", boxShadow: "0 25px 60px rgba(0,0,0,0.3)", position: "relative", maxHeight: "90vh", overflowY: "auto" }}
              >
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)", fontWeight: 900, fontSize: "1.2rem" }}
                >
                  ✕
                </button>

                <h3 style={{ fontSize: "1.6rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.02em", color: "var(--foreground)", marginBottom: 8 }}>
                  Submit Order &amp; Details
                </h3>
                <p style={{ color: "var(--muted-foreground)", fontWeight: 600, fontSize: "0.85rem", marginBottom: 32, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Fill your contact details to submit order
                </p>

                <form onSubmit={handleCheckoutSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div>
                    <label className={labelClass}>Full Name *</label>
                    <input type="text" value={orderForm.name} onChange={e => setOrderForm({ ...orderForm, name: e.target.value })}
                      className={inputClass} placeholder="Your full name" required />
                  </div>
                  <div>
                    <label className={labelClass}>Email Address *</label>
                    <input type="email" value={orderForm.email} onChange={e => setOrderForm({ ...orderForm, email: e.target.value })}
                      className={inputClass} placeholder="your.email@example.com" required />
                  </div>
                  <div>
                    <label className={labelClass}>Phone Number *</label>
                    <input type="tel" value={orderForm.phone} onChange={e => setOrderForm({ ...orderForm, phone: e.target.value })}
                      className={inputClass} placeholder="+91 9876543210" required />
                  </div>
                  <div>
                    <label className={labelClass}>Shipping Address</label>
                    <textarea value={orderForm.address} onChange={e => setOrderForm({ ...orderForm, address: e.target.value })}
                      className={inputClass} rows={2} placeholder="House/Street/Flat No..." style={{ resize: "vertical" }} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label className={labelClass}>City</label>
                      <input type="text" value={orderForm.city} onChange={e => setOrderForm({ ...orderForm, city: e.target.value })}
                        className={inputClass} placeholder="City" />
                    </div>
                    <div>
                      <label className={labelClass}>Pincode</label>
                      <input type="text" value={orderForm.pincode} onChange={e => setOrderForm({ ...orderForm, pincode: e.target.value })}
                        className={inputClass} placeholder="421501" />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Special Notes</label>
                    <textarea value={orderForm.notes} onChange={e => setOrderForm({ ...orderForm, notes: e.target.value })}
                      className={inputClass} rows={2} placeholder="Custom size, fitting notes..." style={{ resize: "vertical" }} />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={createOrder.isPending}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    style={{ background: "var(--foreground)", color: "var(--background)", fontWeight: 900, fontSize: "0.9rem", letterSpacing: "0.15em", textTransform: "uppercase", padding: "18px 24px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, opacity: createOrder.isPending ? 0.6 : 1 }}
                  >
                    <Send style={{ width: 18, height: 18 }} />
                    {createOrder.isPending ? "Submitting Order..." : "Confirm & Submit Order"}
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      <style>{`
        @media (min-width: 900px) {
          .cart-grid {
            grid-template-columns: 1fr 380px !important;
            align-items: start;
          }
        }
      `}</style>
    </div>
  );
}
