"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, ChevronLeft, Send, X } from "lucide-react";
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

  const inputClass = "w-full bg-background border-2 border-border px-3.5 py-2.5 font-semibold text-xs sm:text-sm outline-none focus:border-foreground transition-colors rounded-none";
  const labelClass = "text-xs font-black uppercase tracking-wider text-foreground block mb-1.5";

  return (
    <div className="min-h-screen bg-background py-6 px-4 sm:px-6 md:py-10 md:px-8">
      <div className="max-w-5xl mx-auto w-full">

        {/* Back Button & Title Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/products" className="inline-block">
            <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground font-bold text-xs uppercase tracking-wider mb-4 bg-transparent border-none cursor-pointer transition-colors p-0">
              <ChevronLeft className="w-4 h-4" />
              Continue Shopping
            </button>
          </Link>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-foreground uppercase tracking-tight leading-none mb-1.5">
            Shopping Bag &amp; Enquiry
          </h1>
          <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest mb-6 md:mb-8">
            {items.length} {items.length === 1 ? "item" : "items"} in your cart
          </p>
        </motion.div>

        {/* Empty State */}
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-14 px-6 border border-border bg-muted/20 my-4"
          >
            <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4 stroke-[1.2]" />
            <h2 className="text-lg sm:text-xl font-black text-foreground uppercase tracking-tight mb-1.5">
              Your Bag is Empty
            </h2>
            <p className="text-muted-foreground font-bold text-xs uppercase tracking-wider mb-6">
              Browse our premium denim catalog and add your favourite fits.
            </p>
            <Link href="/products">
              <motion.button
                whileTap={{ scale: 0.97 }}
                className="bg-foreground text-background font-black text-xs uppercase tracking-widest px-7 py-3 border-none cursor-pointer hover:bg-primary transition-colors"
              >
                Explore Shop
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start w-full">

            {/* Cart Items List (7 cols on desktop) */}
            <div className="lg:col-span-7 flex flex-col gap-3 sm:gap-4 w-full min-w-0">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={item.lineId}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-card border border-border p-3 sm:p-4 flex gap-3 sm:gap-4 items-center w-full min-w-0 overflow-hidden"
                  >
                    {/* Product Image */}
                    <div className="w-[72px] h-[92px] sm:w-[84px] sm:h-[108px] shrink-0 bg-muted border border-border/80 overflow-hidden flex items-center justify-center">
                      {item.image ? (
                        <img
                          src={item.image.url}
                          alt={item.productTitle}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ShoppingBag className="w-7 h-7 text-muted-foreground stroke-1" />
                      )}
                    </div>

                    {/* Info and Actions Container */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
                      {/* Top row: Title + Delete button */}
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-xs sm:text-sm md:text-base font-bold text-foreground uppercase tracking-wide truncate leading-tight">
                          {item.productTitle}
                        </h3>
                        <button
                          onClick={() => removeItem(item.lineId)}
                          disabled={loading}
                          aria-label="Remove item"
                          className="text-muted-foreground hover:text-red-600 p-1 cursor-pointer transition-colors shrink-0 bg-transparent border-none"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Variant / Size info */}
                      {item.variantTitle && item.variantTitle !== "Default Title" && (
                        <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Size: {item.variantTitle}
                        </p>
                      )}

                      {/* Bottom row: Unit Price & Quantity Stepper */}
                      <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-border/40 sm:border-0 sm:pt-0">
                        <div className="text-xs sm:text-sm md:text-base font-black text-foreground">
                          Rs.{item.unitPrice?.amount}
                        </div>

                        {/* Quantity Counter */}
                        <div className="flex items-center border border-border bg-background">
                          <button
                            onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                            disabled={loading}
                            aria-label="Decrease quantity"
                            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-transparent border-none cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-7 sm:w-8 text-center text-xs sm:text-sm font-black text-foreground select-none">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                            disabled={loading}
                            aria-label="Increase quantity"
                            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-transparent border-none cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary (5 cols on desktop) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-5 bg-card border border-border p-4 sm:p-5 md:p-6 lg:sticky lg:top-28 w-full"
            >
              <h2 className="text-xs sm:text-sm md:text-base font-black text-foreground uppercase tracking-tight pb-3 mb-4 border-b border-border">
                Order &amp; Enquiry Summary
              </h2>

              <div className="flex flex-col gap-2.5 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Subtotal
                  </span>
                  <span className="text-xs sm:text-sm font-black text-foreground">
                    Rs.{cart?.subtotal?.amount || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Est. Shipping
                  </span>
                  <span className="text-xs font-bold text-emerald-600 uppercase">
                    Calculated on Enquiry
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-foreground">
                    Total Amount
                  </span>
                  <span className="text-sm sm:text-base md:text-lg font-black text-foreground">
                    Rs.{cart?.total?.amount || 0}
                  </span>
                </div>
              </div>

              <motion.button
                onClick={() => setIsCheckoutOpen(true)}
                disabled={loading || createOrder.isPending}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-foreground text-background hover:bg-primary font-black text-xs sm:text-sm uppercase tracking-wider py-3.5 px-4 flex items-center justify-center gap-2 border-none cursor-pointer transition-colors shadow-sm"
              >
                Proceed to Submit Order / Enquiry
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <p className="text-[10px] sm:text-[11px] font-bold text-center uppercase tracking-wider text-muted-foreground mt-3 leading-tight">
                Instant Order Confirmation &amp; Direct WhatsApp Support
              </p>
            </motion.div>

          </div>
        )}

        {/* Checkout Modal */}
        <AnimatePresence>
          {isCheckoutOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
            >
              <motion.div
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.96, opacity: 0 }}
                className="bg-background border border-border w-full max-w-md p-4 sm:p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
              >
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  aria-label="Close modal"
                  className="absolute top-3.5 right-3.5 text-muted-foreground hover:text-foreground p-1 bg-transparent border-none cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-foreground mb-1">
                  Submit Order &amp; Details
                </h3>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                  Fill your contact details to submit order
                </p>

                <form onSubmit={handleCheckoutSubmit} className="flex flex-col gap-3.5">
                  <div>
                    <label className={labelClass}>Full Name *</label>
                    <input
                      type="text"
                      value={orderForm.name}
                      onChange={e => setOrderForm({ ...orderForm, name: e.target.value })}
                      className={inputClass}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Email Address *</label>
                    <input
                      type="email"
                      value={orderForm.email}
                      onChange={e => setOrderForm({ ...orderForm, email: e.target.value })}
                      className={inputClass}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Phone Number *</label>
                    <input
                      type="tel"
                      value={orderForm.phone}
                      onChange={e => setOrderForm({ ...orderForm, phone: e.target.value })}
                      className={inputClass}
                      placeholder="+91 9876543210"
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Shipping Address</label>
                    <textarea
                      value={orderForm.address}
                      onChange={e => setOrderForm({ ...orderForm, address: e.target.value })}
                      className={inputClass}
                      rows={2}
                      placeholder="House/Street/Flat No..."
                      style={{ resize: "vertical" }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>City</label>
                      <input
                        type="text"
                        value={orderForm.city}
                        onChange={e => setOrderForm({ ...orderForm, city: e.target.value })}
                        className={inputClass}
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Pincode</label>
                      <input
                        type="text"
                        value={orderForm.pincode}
                        onChange={e => setOrderForm({ ...orderForm, pincode: e.target.value })}
                        className={inputClass}
                        placeholder="421501"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Special Notes</label>
                    <textarea
                      value={orderForm.notes}
                      onChange={e => setOrderForm({ ...orderForm, notes: e.target.value })}
                      className={inputClass}
                      rows={2}
                      placeholder="Custom size, fitting notes..."
                      style={{ resize: "vertical" }}
                    />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={createOrder.isPending}
                    whileTap={{ scale: 0.98 }}
                    className="bg-foreground text-background hover:bg-primary font-black text-xs sm:text-sm uppercase tracking-wider py-3.5 px-4 border-none cursor-pointer flex items-center justify-center gap-2 transition-colors mt-2 disabled:opacity-60"
                  >
                    <Send className="w-4 h-4" />
                    {createOrder.isPending ? "Submitting Order..." : "Confirm & Submit Order"}
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
