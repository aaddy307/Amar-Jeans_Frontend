"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronRight, Zap, Star, Truck, Lock, MessageSquare, ShoppingBag, Factory, Package, BadgePercent, Award } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useRef, useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";

/* ─── HERO CAROUSEL ──────────────────────────────────────────────────────── */
const DEFAULT_SLIDES = [
  {
    headline: "AMAR JEANS",
    subText: "Premium Denim — Factory Direct Since 1995",
    ctaText: "Explore Catalog", ctaLink: "/products",
    imageUrl: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=90&w=2400",
  },
  {
    headline: "URBAN CARGO",
    subText: "Tactical 6-Pocket Heavy Duty Denim",
    ctaText: "Shop Cargo", ctaLink: "/products?cat=cargo-jeans",
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=90&w=2400",
  },
  {
    headline: "BULK ORDERS",
    subText: "Custom Fit Manufacturing — Wholesale Welcome",
    ctaText: "Get Quote", ctaLink: "/contact",
    imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=90&w=2400",
  },
];

const TICKER_WORDS = [
  "AMAR JEANS", "•", "PREMIUM DENIM", "•", "BULK ORDERS", "•",
  "DIRECT FACTORY", "•", "PAN-INDIA", "•", "SLIM FIT", "•",
  "CARGO JEANS", "•", "CUSTOM FIT", "•", "SINCE 1995", "•",
];

function HeroBanner({ slides }) {
  const [slide, setSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    setLoaded(true);
    const t = setInterval(() => setSlide(s => (s + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  const current = slides[slide];

  return (
    <section ref={heroRef} style={{ position: "relative", height: "100vh", minHeight: 640, width: "100%", overflow: "hidden", background: "#080808" }}>
      {/* BG IMAGE */}
      <AnimatePresence mode="wait">
        <motion.div key={slide}
          initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
          style={{ position: "absolute", inset: 0, y: imgY }}>
          <img src={current.imageUrl} alt={current.headline}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", opacity: 0.42 }} />
        </motion.div>
      </AnimatePresence>

      {/* Overlays */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right,rgba(0,0,0,0.92) 0%,rgba(0,0,0,0.28) 55%,rgba(0,0,0,0.08) 100%)", zIndex: 2 }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,0.88) 0%,transparent 60%)", zIndex: 3 }} />
      <motion.div animate={{ opacity: [0.12, 0.22, 0.12] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", left: 0, top: "20%", width: "45%", height: "40%", background: "radial-gradient(ellipse at left center,rgba(220,38,38,0.28) 0%,transparent 70%)", zIndex: 4, pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 4, opacity: 0.04, backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)", backgroundSize: "80px 80px", pointerEvents: "none" }} />

      {/* Slide dots */}
      <div style={{ position: "absolute", right: 28, top: "50%", transform: "translateY(-50%)", zIndex: 20, display: "flex", flexDirection: "column", gap: 10 }}>
        {slides.map((_, i) => (
          <button key={i} onClick={() => setSlide(i)}
            style={{ width: i === slide ? 4 : 2, height: i === slide ? 40 : 20, background: i === slide ? "#dc2626" : "rgba(255,255,255,0.3)", border: "none", cursor: "pointer", transition: "all 0.4s", borderRadius: 2, padding: 0 }} />
        ))}
      </div>

      {/* Main text */}
      <motion.div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", zIndex: 15, y: textY, opacity }}>
        <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 1.5rem", width: "100%" }}>
          <div style={{ maxWidth: 860 }}>
            <motion.div initial={{ opacity: 0, x: -30 }} animate={loaded ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay: 0.1 }}
              style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 32, height: 2, background: "#dc2626" }} />
              <span style={{ color: "#dc2626", fontSize: "0.7rem", fontWeight: 900, letterSpacing: "0.25em", textTransform: "uppercase" }}>
                {current.subText}
              </span>
            </motion.div>

            <div style={{ overflow: "hidden", marginBottom: 8 }}>
              <motion.div initial={{ y: "110%" }} animate={loaded ? { y: 0 } : {}} transition={{ duration: 0.9, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}>
                <AnimatePresence mode="wait">
                  <motion.span key={slide + "-hl"}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
                    style={{ display: "block", fontWeight: 900, fontSize: "clamp(2.8rem,7vw,5.5rem)", lineHeight: 0.88, letterSpacing: "-0.03em", textTransform: "uppercase", color: "#fff" }}>
                    {current.headline}
                  </motion.span>
                </AnimatePresence>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={loaded ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.7 }}
              style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 44 }}>
              <div style={{ width: 4, height: 56, background: "#dc2626", flexShrink: 0 }} />
              <p style={{ color: "rgba(255,255,255,0.7)", fontWeight: 700, fontSize: "0.82rem", letterSpacing: "0.15em", textTransform: "uppercase", maxWidth: 360, lineHeight: 1.7 }}>
                Engineered for maximum fit, comfort & durability. Direct manufacturer quality — no middlemen.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={loaded ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.88 }}
              style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
              <Link href={current.ctaLink || "/products"}>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  style={{ display: "flex", alignItems: "center", gap: 12, background: "#dc2626", color: "#fff", fontWeight: 900, fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", padding: "18px 36px", border: "none", cursor: "pointer" }}>
                  <ShoppingBag style={{ width: 18, height: 18 }} />
                  {current.ctaText || "Shop Now"}
                  <ArrowRight style={{ width: 18, height: 18 }} />
                </motion.button>
              </Link>
              <Link href="/contact">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  style={{ display: "flex", alignItems: "center", gap: 10, background: "transparent", color: "#fff", fontWeight: 900, fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", padding: "16px 32px", border: "2px solid rgba(255,255,255,0.35)", cursor: "pointer" }}>
                  <MessageSquare style={{ width: 16, height: 16 }} />
                  Bulk Enquiry
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Floating stats */}
      <motion.div initial={{ opacity: 0, x: 40 }} animate={loaded ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.9, delay: 1.1 }}
        style={{ position: "absolute", right: 72, top: "18%", zIndex: 20 }}
        className="hidden lg:block">
        {[
          { val: "30+", lbl: "Years of Craft", color: "#dc2626", bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.12)", dy: [0, -10, 0], delay: 0 },
          { val: "10K+", lbl: "Happy Customers", color: "#fff", bg: "rgba(220,38,38,0.15)", border: "rgba(220,38,38,0.3)", dy: [0, 10, 0], delay: 0.5 },
          { val: "PAN", lbl: "India Shipping", color: "#dc2626", bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.12)", dy: [0, -8, 0], delay: 1 },
        ].map((s, i) => (
          <motion.div key={i} animate={{ y: s.dy }} transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: s.delay }}
            style={{ background: s.bg, backdropFilter: "blur(20px)", border: `1px solid ${s.border}`, padding: "20px 24px", marginBottom: 14, minWidth: 155 }}>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: "0.6rem", fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 4 }}>{s.lbl}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Progress bars */}
      <div style={{ position: "absolute", bottom: 32, left: 0, right: 0, zIndex: 20, display: "flex" }}>
        {slides.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 3, background: "rgba(255,255,255,0.08)", position: "relative", overflow: "hidden" }}>
            {i === slide && (<motion.div key={slide} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 5, ease: "linear" }} style={{ position: "absolute", inset: 0, background: "#dc2626", transformOrigin: "left" }} />)}
            {i < slide && <div style={{ position: "absolute", inset: 0, background: "rgba(220,38,38,0.5)" }} />}
          </div>
        ))}
      </div>

      {/* Red ticker */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 19, background: "rgba(220,38,38,0.93)", padding: "9px 0", overflow: "hidden" }}>
        <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          style={{ display: "flex", gap: 40, whiteSpace: "nowrap", width: "max-content" }}>
          {[...TICKER_WORDS, ...TICKER_WORDS].map((w, i) => (
            <span key={i} style={{ fontSize: "0.62rem", fontWeight: 900, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)" }}>{w}</span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── PRODUCT RAIL ─────────────────────────────────────────────────────────── */
function ProductRail({ title, tag, products, href = "/products" }) {
  if (!products?.length) return null;
  return (
    <div className="py-14 border-b border-border">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            {tag && <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-primary mb-2"><Zap className="w-4 h-4 fill-primary" /> {tag}</span>}
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-foreground">{title}</h2>
          </div>
          <Link href={href}>
            <button className="hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-foreground hover:text-primary transition-colors cursor-pointer border-none bg-transparent">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-6 -mx-4 px-4 lg:mx-0 lg:px-0" style={{ scrollbarWidth: "none" }}>
          {products.map((product, i) => (
            <div key={product.id || i} className="min-w-[200px] md:min-w-[260px] flex-shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN HOME PAGE ──────────────────────────────────────────────────────── */
export default function Home() {
  const { data: settings } = trpc.commerce.settings.get.useQuery();
  const { data: recentReviews = [] } = trpc.commerce.reviews.listRecent.useQuery();
  const { data: allCategories = [] } = trpc.commerce.categories.list.useQuery();
  const { data: allProducts = [] } = trpc.commerce.products.list.useQuery();
  const { data: newProducts = [] } = trpc.commerce.products.list.useQuery({ isNew: true });
  const { data: bestProducts = [] } = trpc.commerce.products.list.useQuery({ isBestseller: true });
  const { data: menProducts = [] } = trpc.commerce.products.list.useQuery({ gender: "men" });
  const { data: womenProducts = [] } = trpc.commerce.products.list.useQuery({ gender: "women" });
  const { data: blogPosts = [] } = trpc.commerce.blog.list.useQuery();

  const heroSlides = settings?.heroSlides?.filter(s => s.active) || DEFAULT_SLIDES;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* HERO */}
      <HeroBanner slides={heroSlides.length ? heroSlides : DEFAULT_SLIDES} />

      {/* SHOP MEN / SHOP WOMEN — dual image tiles */}
      <section className="grid grid-cols-1 md:grid-cols-2">
        {[
          {
            label: "SHOP MEN", sub: "Slim, Regular, Cargo & More", href: "/products?gender=men",
            img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=90&w=1600",
            side: "left"
          },
          {
            label: "SHOP WOMEN", sub: "High-Rise, Flare, Straight & More", href: "/products?gender=women",
            img: "https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&q=90&w=1600",
            side: "right"
          }
        ].map(tile => (
          <Link key={tile.label} href={tile.href}>
            <div className="relative overflow-hidden group cursor-pointer" style={{ height: 480 }}>
              <img src={tile.img} alt={tile.label}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                style={{ objectPosition: "center top" }} />
              <div style={{
                position: "absolute", inset: 0,
                background: tile.side === "left"
                  ? "linear-gradient(to right, rgba(0,0,0,0.7) 0%, transparent 70%)"
                  : "linear-gradient(to left, rgba(0,0,0,0.7) 0%, transparent 70%)"
              }} />
              <div className={`absolute inset-0 flex items-center ${tile.side === "right" ? "justify-end pr-12" : "justify-start pl-12"}`}>
                <div>
                  <p style={{ fontSize: "0.65rem", fontWeight: 900, letterSpacing: "0.3em", color: "#dc2626", textTransform: "uppercase", marginBottom: 8 }}>Amar Jeans</p>
                  <h2 style={{ fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 900, letterSpacing: "-0.03em", textTransform: "uppercase", color: "#fff", lineHeight: 0.9, marginBottom: 12 }}>
                    {tile.label}
                  </h2>
                  <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 24 }}>
                    {tile.sub}
                  </p>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", color: "#111",
                    fontWeight: 900, fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase",
                    padding: "12px 24px", transition: "all 0.3s"
                  }} className="group-hover:bg-primary group-hover:text-white">
                    Shop Now <ArrowRight style={{ width: 14, height: 14 }} />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* USP STRIP */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-b border-border">
        {[
          { icon: <Package className="w-6 h-6" />, title: "Shipped in 48 Hours", sub: "Fast pan-India dispatch from Ambernath" },
          { icon: <BadgePercent className="w-6 h-6" />, title: "5% Off Prepaid", sub: "Extra savings on prepaid orders" },
          { icon: <Factory className="w-6 h-6" />, title: "Factory Direct", sub: "No middlemen, maximum value for money" },
          { icon: <Award className="w-6 h-6" />, title: "Made in India", sub: "Proudly manufactured in Maharashtra" },
        ].map((p, i) => (
          <div key={i} className="flex items-center gap-4 p-7 border-b sm:border-b-0 lg:border-r border-border last:border-0 bg-muted/10 hover:bg-muted/30 transition-colors">
            <span className="text-primary shrink-0">{p.icon}</span>
            <div>
              <h4 className="font-black uppercase tracking-wide text-foreground text-sm">{p.title}</h4>
              <p className="text-[11px] font-bold text-muted-foreground mt-0.5 leading-relaxed">{p.sub}</p>
            </div>
          </div>
        ))}
      </section>

      {/* NEW IN RAIL */}
      <ProductRail title="New In" tag="Just Dropped" products={newProducts.slice(0, 8)} href="/products?isNew=true" />

      {/* BEST SELLERS RAIL */}
      <ProductRail title="Best Sellers" tag="Most Popular" products={bestProducts.slice(0, 8)} href="/products?isBestseller=true" />

      {/* OUR STORY BANNER */}
      <section className="border-b border-border">
        <div className="relative overflow-hidden" style={{ minHeight: 420 }}>
          <img src="https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&q=90&w=2400" alt="Amar Jeans Factory"
            className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.3 }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right,rgba(0,0,0,0.95) 0%,rgba(0,0,0,0.6) 60%,rgba(0,0,0,0.2) 100%)" }} />
          <div className="relative z-10 max-w-[1440px] mx-auto px-4 lg:px-8 py-20">
            <div className="max-w-2xl">
              <span className="inline-block text-primary text-xs font-black uppercase tracking-widest mb-4">The Amar Jeans Heritage</span>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-6 leading-[0.9]">
                Crafted for<br /><span className="text-primary">Strength.</span><br />Styled for Life.
              </h2>
              <p className="text-white/70 font-bold text-sm leading-relaxed mb-8 max-w-md uppercase tracking-wide">
                Founded with a mission to deliver premium heavy-gauge denim craftsmanship directly to denim enthusiasts without unnecessary markup. 30+ years, Ambernath, Maharashtra.
              </p>
              <Link href="/products">
                <button style={{
                  background: "#dc2626", color: "#fff", border: "none", cursor: "pointer",
                  fontWeight: 900, fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase",
                  padding: "16px 32px", display: "flex", alignItems: "center", gap: 10
                }}>
                  Explore Denim Collection <ArrowRight style={{ width: 16, height: 16 }} />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SHOP MEN RAIL */}
      <ProductRail title="Shop Men" tag="Men's Collection" products={menProducts.slice(0, 8)} href="/products?gender=men" />

      {/* SHOP BY CATEGORY */}
      <section className="py-16 border-b border-border bg-muted/5">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-primary mb-2 block">Browse Collections</span>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-foreground">Shop By Category</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {allCategories.map(cat => (
              <Link key={cat.id} href={`/products?cat=${cat.slug}`}>
                <div className="group cursor-pointer border border-border bg-background overflow-hidden hover:border-foreground transition-all duration-300" style={{ aspectRatio: "3/4" }}>
                  {cat.image && (
                    <div className="h-3/4 overflow-hidden bg-muted">
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="h-1/4 flex flex-col justify-center px-3 border-t border-border group-hover:bg-foreground transition-colors">
                    <span className="font-black uppercase tracking-wider text-xs text-foreground group-hover:text-background transition-colors leading-tight">{cat.name}</span>
                    <span className="text-[10px] font-bold text-muted-foreground group-hover:text-background/70 transition-colors mt-0.5">{cat.productCount || 0} products</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SHOP WOMEN RAIL */}
      <ProductRail title="Shop Women" tag="Women's Collection" products={womenProducts.slice(0, 8)} href="/products?gender=women" />

      {/* REVIEWS SLIDER */}
      {recentReviews.length > 0 && (
        <section className="py-16 border-b border-border bg-background">
          <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-primary mb-2">
                  <Star className="w-4 h-4 fill-primary" /> Verified Buyers
                </span>
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">What Customers Say</h2>
              </div>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-6 -mx-4 px-4 lg:mx-0 lg:px-0" style={{ scrollbarWidth: "none" }}>
              {recentReviews.slice(0, 8).map(r => (
                <div key={r._id} className="min-w-[280px] max-w-[320px] flex-shrink-0 bg-muted/20 border border-border p-6 flex flex-col justify-between hover:bg-muted/40 transition-colors">
                  <div>
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(r.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-primary text-primary" />)}
                    </div>
                    <p className="text-sm font-medium leading-relaxed mb-6">"{r.comment}"</p>
                  </div>
                  <div className="border-t border-border pt-4">
                    <p className="font-black uppercase tracking-widest text-xs text-foreground">{r.authorName}</p>
                    {r.product?.title && <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-wider truncate">{r.product.title}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BLOG / LATEST NEWS */}
      {blogPosts.length > 0 && (
        <section className="py-16 border-b border-border bg-muted/5">
          <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-primary mb-2 block">Denim Knowledge</span>
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">Latest from the Blog</h2>
              </div>
              <Link href="/blog">
                <button className="hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-foreground hover:text-primary transition-colors cursor-pointer border-none bg-transparent">
                  All Posts <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogPosts.slice(0, 3).map(post => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <div className="group cursor-pointer border border-border bg-background hover:border-foreground transition-all duration-300 overflow-hidden">
                    {post.coverImage && (
                      <div className="h-48 overflow-hidden bg-muted">
                        <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex gap-2 flex-wrap mb-3">
                        {post.tags?.slice(0, 2).map(t => (
                          <span key={t} className="text-[10px] font-black uppercase tracking-widest bg-muted text-muted-foreground px-2 py-0.5">{t}</span>
                        ))}
                      </div>
                      <h3 className="font-black uppercase tracking-tighter text-base leading-tight group-hover:text-primary transition-colors mb-2">{post.title}</h3>
                      <p className="text-xs text-muted-foreground font-medium leading-relaxed line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center gap-2 mt-4 text-xs font-black uppercase tracking-widest text-primary">
                        Read More <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
