"use client";

import { use, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { useCart } from "@/contexts/CartContext";
import { ShoppingBag, ChevronLeft, Star, MessageSquare, Check, PhoneCall } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ProductDetailPage({ params }) {
  const resolvedParams = use(params);
  const handle = resolvedParams.handle;

  const utils = trpc.useUtils();
  const { data: product, isLoading } = trpc.commerce.products.byHandle.useQuery({ handle });
  const { data: settings } = trpc.commerce.settings.get.useQuery();
  const { data: reviews = [] } = trpc.commerce.reviews.listByProduct.useQuery(
    { productId: product?.id },
    { enabled: !!product?.id }
  );
  
  const { addItem, removeItem, cart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("32");
  const [adding, setAdding] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewForm, setReviewForm] = useState({ authorName: "", rating: 5, comment: "" });

  const [isDirectEnquiryOpen, setIsDirectEnquiryOpen] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({ name: "", email: "", phone: "", address: "", pincode: "", notes: "" });

  const cartItem = cart?.items?.find(i => i.variantId === product?.variants?.[0]?.id);

  const createReviewMutation = trpc.commerce.reviews.create.useMutation({
    onSuccess: () => {
      toast.success("Review submitted!");
      setIsReviewing(false);
      setReviewForm({ authorName: "", rating: 5, comment: "" });
      utils.commerce.reviews.listByProduct.invalidate({ productId: product.id });
    },
    onError: (err) => toast.error(err.message)
  });

  const createEnquiryMutation = trpc.commerce.orders.create.useMutation({
    onSuccess: (data) => {
      toast.success(data.message || "Enquiry submitted!");
      setIsDirectEnquiryOpen(false);
      setEnquiryForm({ name: "", email: "", phone: "", address: "", pincode: "", notes: "" });
    },
    onError: (err) => toast.error(err.message)
  });

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    createReviewMutation.mutate({ productId: product.id, ...reviewForm });
  };

  const handleDirectEnquirySubmit = (e) => {
    e.preventDefault();
    if (!enquiryForm.name || !enquiryForm.phone || !enquiryForm.email) {
      toast.error("Please fill in your name, email and phone number.");
      return;
    }

    createEnquiryMutation.mutate({
      orderType: "enquiry",
      customerName: enquiryForm.name,
      customerEmail: enquiryForm.email,
      customerPhone: enquiryForm.phone,
      shippingAddress: enquiryForm.address,
      pincode: enquiryForm.pincode,
      totalPrice: product?.priceRange?.min?.amount || "0",
      notes: enquiryForm.notes || `Product Enquiry for ${product?.title}, Size: ${selectedSize}`,
      items: [{
        productId: product?.id,
        title: product?.title,
        price: Number(product?.priceRange?.min?.amount || 0),
        quantity: 1,
        size: selectedSize,
        image: product?.images?.[0]?.url
      }]
    });
  };

  const handleWhatsAppEnquiry = () => {
    const message = `*AMAR JEANS PRODUCT ENQUIRY*
Product: ${product?.title}
Price: ₹${product?.priceRange?.min?.amount}
Selected Size: ${selectedSize}

*Customer Enquiry:*
Name: ${enquiryForm.name || "Customer"}
Phone: ${enquiryForm.phone || "N/A"}
Notes: ${enquiryForm.notes || "Interested in purchasing or bulk details."}`;

    const supportPhoneRaw = settings?.whatsappNumber || settings?.supportPhone?.split('/')?.[0] || "919834557990";
    const whatsappNumber = supportPhoneRaw.replace(/[^\d+]/g, "").replace(/^\+/, "");
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-12 px-4">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-3/4 bg-muted animate-pulse border border-border" />
          <div className="space-y-4">
            <div className="h-16 bg-muted animate-pulse" />
            <div className="h-8 bg-muted animate-pulse w-2/3" />
            <div className="h-32 bg-muted animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-5xl font-black uppercase tracking-tighter text-foreground mb-4">Product Not Found</h2>
          <Link href="/products">
            <button className="text-primary font-bold uppercase tracking-widest hover:underline cursor-pointer">
              &larr; Back to Shop Catalog
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const variant = product.variants?.[0];

  const handleAdd = async () => {
    if (!variant) return;
    setAdding(true);
    try {
      await addItem(variant.id, 1);
      toast.success("Added to Cart!");
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async () => {
    if (!cartItem) return;
    setAdding(true);
    try {
      await removeItem(cartItem.lineId);
      toast.success("Removed from Cart");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-6 pb-24 px-4">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Back Link */}
        <Link href="/products">
          <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-xs font-black uppercase tracking-widest mb-8 transition-colors cursor-pointer">
            <ChevronLeft className="w-4 h-4" /> Back to Products
          </button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20">
          
          {/* Photo Gallery */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <div className="aspect-3/4 bg-muted overflow-hidden mb-4 border border-border relative">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={product.images?.[selectedImage]?.url || "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800"}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </AnimatePresence>
              {product.compareAtPrice > Number(product.priceRange?.min?.amount) && (
                <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest px-3 py-1.5">
                  Sale -{Math.round(((product.compareAtPrice - Number(product.priceRange.min.amount)) / product.compareAtPrice) * 100)}%
                </div>
              )}
            </div>

            {product.images?.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`shrink-0 w-20 h-24 overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImage === i ? "border-foreground scale-105" : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Details Column */}
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <span className="text-xs font-black uppercase tracking-widest text-primary mb-3 block">
              {product.brand || "AMAR JEANS"} &bull; {product.productType || "Denim"}
            </span>

            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-foreground leading-tight mb-4">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-primary">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} className={`w-4 h-4 ${i <= (product.averageRating || 5) ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                ))}
              </div>
              <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest">({reviews.length} Verified Reviews)</span>
            </div>

            {/* Pricing */}
            <div className="text-3xl md:text-4xl font-black text-foreground mb-6 flex items-center gap-4">
              <span>₹{product.priceRange?.min?.amount}</span>
              {product.compareAtPrice > Number(product.priceRange?.min?.amount) && (
                <>
                  <span className="text-xl font-bold text-muted-foreground line-through">₹{product.compareAtPrice}</span>
                  <span className="bg-primary text-primary-foreground text-xs px-2.5 py-1 font-black uppercase tracking-widest">
                    -{Math.round(((product.compareAtPrice - Number(product.priceRange.min.amount)) / product.compareAtPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-8 border-l-2 border-primary pl-4">
              {product.description || "Premium stretch denim engineered for maximum durability, style, and everyday comfort."}
            </p>

            {/* Waist Size Selector */}
            <div className="mb-8">
              <label className="text-xs font-black uppercase tracking-widest text-foreground block mb-3">
                Select Waist Size (Inches):
              </label>
              <div className="flex flex-wrap gap-3">
                {["28", "30", "32", "34", "36", "38"].map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 border-2 font-black text-sm transition-colors cursor-pointer ${
                      selectedSize === size
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-background text-foreground hover:border-foreground"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 mt-auto">
              {cartItem ? (
                <button
                  onClick={handleRemove}
                  disabled={adding}
                  className="w-full py-4 font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-colors bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
                >
                  <ShoppingBag className="w-5 h-5" /> Remove from Cart
                </button>
              ) : (
                <button
                  onClick={handleAdd}
                  disabled={adding}
                  className="w-full py-4 font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-colors bg-foreground text-background hover:bg-primary hover:text-white cursor-pointer"
                >
                  <ShoppingBag className="w-5 h-5" /> Add to Shopping Cart
                </button>
              )}

              <button
                onClick={() => setIsDirectEnquiryOpen(true)}
                className="w-full py-4 font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-colors border-2 border-foreground bg-background text-foreground hover:bg-foreground hover:text-background cursor-pointer"
              >
                <MessageSquare className="w-5 h-5" /> Send Product / Bulk Enquiry
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 border-t border-border pt-6 mt-8">
              {["100% Genuine Denim", "Custom Fit Available", "Pan-India Shipping"].map(f => (
                <div key={f} className="text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{f}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Customer Reviews Section */}
        <div className="border-t border-border pt-16 mt-16">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-foreground">Customer Reviews</h2>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Verified Buyer Rating & Reviews</p>
            </div>
            {!isReviewing && (
              <button 
                onClick={() => setIsReviewing(true)}
                className="bg-foreground text-background font-black uppercase tracking-widest px-6 py-3 hover:bg-primary transition-colors text-xs cursor-pointer"
              >
                Write a Review
              </button>
            )}
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <AnimatePresence>
              {isReviewing && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: "auto" }} 
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-muted/20 border border-border p-6 overflow-hidden"
                >
                  <h3 className="font-black uppercase tracking-widest text-foreground mb-4">Write Your Review</h3>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs font-black uppercase tracking-widest text-foreground block mb-2">Your Name</label>
                      <input 
                        type="text" 
                        value={reviewForm.authorName} 
                        onChange={e => setReviewForm({ ...reviewForm, authorName: e.target.value })}
                        className="w-full bg-background border border-border px-4 py-2.5 focus:outline-none focus:border-foreground font-bold text-sm" 
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-black uppercase tracking-widest text-foreground block mb-2">Rating</label>
                      <select 
                        value={reviewForm.rating} 
                        onChange={e => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })}
                        className="w-full bg-background border border-border px-4 py-2.5 focus:outline-none focus:border-foreground font-bold text-sm cursor-pointer"
                      >
                        {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-black uppercase tracking-widest text-foreground block mb-2">Review Details</label>
                      <textarea 
                        value={reviewForm.comment} 
                        onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        className="w-full bg-background border border-border px-4 py-2.5 focus:outline-none focus:border-foreground font-bold text-sm resize-y" 
                        rows={4} 
                        required
                      />
                    </div>
                    <div className="flex gap-4 pt-2">
                      <button 
                        type="submit" 
                        disabled={createReviewMutation.isPending}
                        className="bg-foreground text-background font-black uppercase tracking-widest px-6 py-3 hover:bg-primary transition-colors text-xs disabled:opacity-50 cursor-pointer"
                      >
                        {createReviewMutation.isPending ? "Submitting..." : "Submit Review"}
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setIsReviewing(false)}
                        className="border border-border bg-transparent text-foreground font-black uppercase tracking-widest px-6 py-3 hover:bg-muted transition-colors text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {reviews.length === 0 ? (
              <div className="bg-muted/10 border border-border p-10 text-center flex flex-col items-center justify-center">
                <MessageSquare className="w-10 h-10 text-muted-foreground mb-3" />
                <p className="text-foreground font-black uppercase tracking-widest text-sm">No reviews yet.</p>
                <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-1">Be the first customer to share a review for this product!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map(review => (
                  <div key={review._id} className="bg-background border border-border p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-bold uppercase tracking-widest text-foreground text-sm">{review.authorName || "Verified Buyer"}</h4>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex text-primary">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star key={star} className={`w-3.5 h-3.5 ${star <= review.rating ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground text-xs font-medium leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Enquiry Modal */}
        <AnimatePresence>
          {isDirectEnquiryOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-background border border-border w-full max-w-lg p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
              >
                <button 
                  onClick={() => setIsDirectEnquiryOpen(false)}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-foreground font-black uppercase text-xs cursor-pointer"
                >
                  ✕ Close
                </button>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-foreground mb-2">Product Enquiry</h3>
                <p className="text-xs font-bold text-muted-foreground mb-6 uppercase tracking-widest">
                  Enquire for {product.title} (Size: {selectedSize})
                </p>
                <form onSubmit={handleDirectEnquirySubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-foreground block mb-1">Your Full Name *</label>
                    <input 
                      type="text" 
                      value={enquiryForm.name} 
                      onChange={e => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                      className="w-full bg-background border border-border px-4 py-2.5 focus:outline-none focus:border-foreground font-bold text-sm" 
                      placeholder="Enter name"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-foreground block mb-1">Email Address *</label>
                    <input 
                      type="email" 
                      value={enquiryForm.email} 
                      onChange={e => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                      className="w-full bg-background border border-border px-4 py-2.5 focus:outline-none focus:border-foreground font-bold text-sm" 
                      placeholder="Enter email"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-foreground block mb-1">Phone Number *</label>
                    <input 
                      type="tel" 
                      value={enquiryForm.phone} 
                      onChange={e => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                      className="w-full bg-background border border-border px-4 py-2.5 focus:outline-none focus:border-foreground font-bold text-sm" 
                      placeholder="+91 9876543210"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-foreground block mb-1">City / Address</label>
                    <input 
                      type="text" 
                      value={enquiryForm.address} 
                      onChange={e => setEnquiryForm({ ...enquiryForm, address: e.target.value })}
                      className="w-full bg-background border border-border px-4 py-2.5 focus:outline-none focus:border-foreground font-bold text-sm" 
                      placeholder="City or delivery location"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-foreground block mb-1">Enquiry Notes / Custom Requirements</label>
                    <textarea 
                      value={enquiryForm.notes} 
                      onChange={e => setEnquiryForm({ ...enquiryForm, notes: e.target.value })}
                      className="w-full bg-background border border-border px-4 py-2.5 focus:outline-none focus:border-foreground font-bold text-sm resize-y" 
                      rows={3} 
                      placeholder="Specify quantity, size preference, custom fitting or bulk requirement..."
                    />
                  </div>
                  <div className="pt-2 flex flex-col gap-3">
                    <button 
                      type="submit"
                      disabled={createEnquiryMutation.isPending}
                      className="w-full bg-foreground text-background font-black uppercase tracking-widest px-6 py-3.5 hover:bg-primary transition-colors text-xs disabled:opacity-50 cursor-pointer"
                    >
                      {createEnquiryMutation.isPending ? "Submitting Enquiry..." : "Submit Direct Enquiry"}
                    </button>
                    <button 
                      type="button"
                      onClick={handleWhatsAppEnquiry}
                      className="w-full bg-emerald-600 text-white font-black uppercase tracking-widest px-6 py-3.5 hover:bg-emerald-700 transition-colors text-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <PhoneCall className="w-4 h-4" /> Quick Enquiry via WhatsApp
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
