"use client";

import { use, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { useCart } from "@/contexts/CartContext";
import { ShoppingBag, ChevronLeft, Star, MessageSquare, Check, PhoneCall, Truck, ShieldCheck, RefreshCw, Ruler, ChevronDown, Heart } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import ProductCard from "@/components/ProductCard";

export default function ProductDetailPage({ params }) {
  const resolvedParams = use(params);
  const handle = resolvedParams.handle;

  const utils = trpc.useUtils();
  const { data: product, isLoading } = trpc.commerce.products.byHandle.useQuery({ handle });
  const { data: allProducts = [] } = trpc.commerce.products.list.useQuery();
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

  // Size chart modal
  const [sizeChartOpen, setSizeChartOpen] = useState(false);

  // Accordions
  const [openAccordion, setOpenAccordion] = useState("details");

  // Pincode checker
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState(null);

  // Direct enquiry modal
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

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6) {
      setPincodeStatus({ valid: false, message: "Please enter a valid 6-digit PIN code." });
      return;
    }
    // Static pincode delivery check simulation
    setPincodeStatus({
      valid: true,
      message: `Delivery available for ${pincode}! Expected in 3-5 business days.`
    });
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
  const relatedProducts = allProducts.filter(p => p.id !== product.id).slice(0, 4);

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

  // Structured JSON-LD schema
  const productJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.title,
    "image": product.images?.map(i => i.url) || [],
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "AMAR JEANS"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": product.priceRange?.min?.amount || 0,
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

  return (
    <div className="min-h-screen bg-background pt-6 pb-24 px-4">
      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

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
                <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest px-3 py-1.5 shadow">
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
                    className={`shrink-0 w-20 h-24 overflow-hidden border-2 transition-all cursor-pointer ${selectedImage === i ? "border-foreground scale-105" : "border-border hover:border-muted-foreground"}`}
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
            <span className="text-xs font-black uppercase tracking-widest text-primary mb-2 block">
              {product.brand || "AMAR JEANS"} &bull; {product.productType || "Denim"}
            </span>

            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-foreground leading-tight mb-3">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
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

            <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-6 border-l-2 border-primary pl-4">
              {product.description || "Premium stretch denim engineered for maximum durability, style, and everyday comfort."}
            </p>

            {/* Waist Size Selector */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-black uppercase tracking-widest text-foreground">
                  Select Waist Size (Inches):
                </label>
                <button
                  onClick={() => setSizeChartOpen(true)}
                  className="text-xs font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Ruler className="w-3.5 h-3.5" /> Size Chart
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {(product.sizes || ["28", "30", "32", "34", "36", "38"]).map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 border-2 font-black text-sm transition-colors cursor-pointer ${selectedSize === size
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background text-foreground hover:border-foreground"
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Pincode Checker */}
            <div className="mb-6 p-4 bg-muted/20 border border-border">
              <label className="text-xs font-black uppercase tracking-widest text-foreground block mb-2">Check Delivery Availability</label>
              <form onSubmit={handleCheckPincode} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={e => setPincode(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 6-digit PIN code"
                  className="flex-1 bg-background border border-border px-3 py-2 text-xs font-bold uppercase outline-none focus:border-foreground"
                />
                <button
                  type="submit"
                  className="bg-foreground text-background px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-primary transition-colors cursor-pointer"
                >
                  Check
                </button>
              </form>
              {pincodeStatus && (
                <p className={`text-[10px] font-bold uppercase tracking-wider mt-2 ${pincodeStatus.valid ? "text-emerald-600" : "text-destructive"}`}>
                  {pincodeStatus.message}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mb-8">
              {cartItem ? (
                <button
                  onClick={handleRemove}
                  disabled={adding}
                  className="w-full py-4 font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-colors bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer text-xs"
                >
                  <ShoppingBag className="w-4 h-4" /> Remove from Cart
                </button>
              ) : (
                <button
                  onClick={handleAdd}
                  disabled={adding}
                  className="w-full py-4 font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-colors bg-foreground text-background hover:bg-primary hover:text-white cursor-pointer text-xs"
                >
                  <ShoppingBag className="w-4 h-4" /> Add to Shopping Cart
                </button>
              )}

              <button
                onClick={() => setIsDirectEnquiryOpen(true)}
                className="w-full py-4 font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-colors border-2 border-foreground bg-background text-foreground hover:bg-foreground hover:text-background cursor-pointer text-xs"
              >
                <MessageSquare className="w-4 h-4" /> Send Product / Bulk Enquiry
              </button>
            </div>

            {/* Accordions */}
            <div className="border-t border-border divide-y divide-border">
              {/* Product Specifications */}
              <div>
                <button
                  onClick={() => setOpenAccordion(openAccordion === "details" ? "" : "details")}
                  className="w-full py-4 flex items-center justify-between font-black uppercase text-xs tracking-widest text-foreground cursor-pointer"
                >
                  <span>Product Specifications</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${openAccordion === "details" ? "rotate-180" : ""}`} />
                </button>
                {openAccordion === "details" && (
                  <div className="pb-4 text-xs text-muted-foreground space-y-1.5 font-medium">
                    <p><strong className="text-foreground">Fit Type:</strong> {product.fit || "Slim / Regular Denim Fit"}</p>
                    <p><strong className="text-foreground">Gender:</strong> {product.gender || "Men"}</p>
                    <p><strong className="text-foreground">Fabric:</strong> 98% Premium Mill-Washed Cotton Denim, 2% Elastane</p>
                    <p><strong className="text-foreground">Origin:</strong> Crafted in Factory Direct Unit, Ambernath (MH)</p>
                    <p><strong className="text-foreground">Closure:</strong> Heavy Duty YKK Metal Zip & Metal Button</p>
                  </div>
                )}
              </div>

              {/* Denim Wash & Care */}
              <div>
                <button
                  onClick={() => setOpenAccordion(openAccordion === "care" ? "" : "care")}
                  className="w-full py-4 flex items-center justify-between font-black uppercase text-xs tracking-widest text-foreground cursor-pointer"
                >
                  <span>Fabric & Denim Care Instructions</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${openAccordion === "care" ? "rotate-180" : ""}`} />
                </button>
                {openAccordion === "care" && (
                  <div className="pb-4 text-xs text-muted-foreground space-y-1 font-medium">
                    <p>&bull; Machine wash cold inside out with like colors.</p>
                    <p>&bull; Do not bleach or use harsh chemical detergents.</p>
                    <p>&bull; Tumble dry low or line dry in shade to preserve indigo wash depth.</p>
                    <p>&bull; Warm iron on reverse side if needed.</p>
                  </div>
                )}
              </div>

              {/* Shipping & Returns */}
              <div>
                <button
                  onClick={() => setOpenAccordion(openAccordion === "shipping" ? "" : "shipping")}
                  className="w-full py-4 flex items-center justify-between font-black uppercase text-xs tracking-widest text-foreground cursor-pointer"
                >
                  <span>Shipping & Hassle-Free Returns</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${openAccordion === "shipping" ? "rotate-180" : ""}`} />
                </button>
                {openAccordion === "shipping" && (
                  <div className="pb-4 text-xs text-muted-foreground space-y-1 font-medium">
                    <p>&bull; Dispatched within 24–48 hours from Ambernath factory.</p>
                    <p>&bull; Express Pan-India delivery within 3–6 business days.</p>
                    <p>&bull; Easy size exchanges & returns within 7 days of delivery.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 border-t border-border pt-6 mt-6">
              <div className="text-center">
                <ShieldCheck className="w-5 h-5 mx-auto mb-1 text-primary" />
                <p className="text-[9px] font-black uppercase tracking-widest text-foreground">100% Factory Direct</p>
              </div>
              <div className="text-center">
                <Truck className="w-5 h-5 mx-auto mb-1 text-primary" />
                <p className="text-[9px] font-black uppercase tracking-widest text-foreground">Fast Express Delivery</p>
              </div>
              <div className="text-center">
                <RefreshCw className="w-5 h-5 mx-auto mb-1 text-primary" />
                <p className="text-[9px] font-black uppercase tracking-widest text-foreground">7-Day Easy Exchange</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* You May Also Like Rail */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-border pt-16 mt-16">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-foreground mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

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

          <div className="max-w-3xl space-y-6">
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

        {/* Size Chart Modal */}
        <AnimatePresence>
          {sizeChartOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-background border border-border max-w-xl w-full p-6 shadow-2xl relative"
              >
                <button
                  onClick={() => setSizeChartOpen(false)}
                  className="absolute top-4 right-4 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  ✕ Close
                </button>
                <div className="flex items-center gap-2 mb-2">
                  <Ruler className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-black uppercase tracking-tighter text-foreground">Amar Jeans Size Guide</h3>
                </div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6">
                  Measurements in inches (Waist, Hip, Inseam & Thigh)
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-bold border-collapse border border-border">
                    <thead>
                      <tr className="bg-muted/40 uppercase tracking-widest text-foreground">
                        <th className="p-3 border border-border">Waist Size</th>
                        <th className="p-3 border border-border">Waist (in)</th>
                        <th className="p-3 border border-border">Hip (in)</th>
                        <th className="p-3 border border-border">Inseam (in)</th>
                        <th className="p-3 border border-border">Thigh (in)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-muted-foreground">
                      <tr>
                        <td className="p-3 border border-border font-black text-foreground">28</td>
                        <td className="p-3 border border-border">28 – 29</td>
                        <td className="p-3 border border-border">36</td>
                        <td className="p-3 border border-border">31</td>
                        <td className="p-3 border border-border">21</td>
                      </tr>
                      <tr>
                        <td className="p-3 border border-border font-black text-foreground">30</td>
                        <td className="p-3 border border-border">30 – 31</td>
                        <td className="p-3 border border-border">38</td>
                        <td className="p-3 border border-border">31.5</td>
                        <td className="p-3 border border-border">22</td>
                      </tr>
                      <tr>
                        <td className="p-3 border border-border font-black text-foreground">32</td>
                        <td className="p-3 border border-border">32 – 33</td>
                        <td className="p-3 border border-border">40</td>
                        <td className="p-3 border border-border">32</td>
                        <td className="p-3 border border-border">23</td>
                      </tr>
                      <tr>
                        <td className="p-3 border border-border font-black text-foreground">34</td>
                        <td className="p-3 border border-border">34 – 35</td>
                        <td className="p-3 border border-border">42</td>
                        <td className="p-3 border border-border">32</td>
                        <td className="p-3 border border-border">24</td>
                      </tr>
                      <tr>
                        <td className="p-3 border border-border font-black text-foreground">36</td>
                        <td className="p-3 border border-border">36 – 37</td>
                        <td className="p-3 border border-border">44</td>
                        <td className="p-3 border border-border">32.5</td>
                        <td className="p-3 border border-border">25</td>
                      </tr>
                      <tr>
                        <td className="p-3 border border-border font-black text-foreground">38</td>
                        <td className="p-3 border border-border">38 – 39</td>
                        <td className="p-3 border border-border">46</td>
                        <td className="p-3 border border-border">33</td>
                        <td className="p-3 border border-border">26</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-4">
                  * Note: All denim is pre-shrunk factory stretch denim. For a relaxed fit, pick one size larger.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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

      {/* Sticky Mobile Add To Cart / Enquiry Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur border-t border-border p-3 lg:hidden flex gap-3 shadow-2xl">
        {cartItem ? (
          <button
            onClick={handleRemove}
            className="flex-1 py-3 text-xs font-black uppercase tracking-widest bg-destructive text-destructive-foreground"
          >
            Remove Cart
          </button>
        ) : (
          <button
            onClick={handleAdd}
            className="flex-1 py-3 text-xs font-black uppercase tracking-widest bg-foreground text-background flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" /> Add ₹{product.priceRange?.min?.amount}
          </button>
        )}
        <button
          onClick={() => setIsDirectEnquiryOpen(true)}
          className="py-3 px-4 text-xs font-black uppercase tracking-widest border border-foreground bg-background text-foreground flex items-center justify-center"
        >
          <MessageSquare className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
