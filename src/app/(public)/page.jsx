"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronRight, Zap, Star, Truck, Lock, MessageSquare, ShoppingBag } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useRef, useState, useEffect } from "react";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=90&w=2400",
  "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=90&w=2400",
  "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=90&w=2400",
];

const SLIDES = [
  { label: "PREMIUM DENIM", sub: "SLIM FIT COLLECTION" },
  { label: "URBAN CARGO",   sub: "TACTICAL 6-POCKET"  },
  { label: "REGULAR FIT",   sub: "EVERYDAY ESSENTIAL" },
];

const TICKER_WORDS = [
  "AMAR JEANS", "•", "PREMIUM DENIM", "•", "BULK ORDERS", "•",
  "DIRECT FACTORY", "•", "PAN-INDIA", "•", "SLIM FIT", "•",
  "CARGO JEANS", "•", "CUSTOM FIT", "•", "SINCE 1995", "•",
];

function HeroBanner() {
  const [slide, setSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imgY    = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const textY   = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    setLoaded(true);
    const t = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section ref={heroRef} style={{ position:"relative", height:"100vh", minHeight:640, width:"100%", overflow:"hidden", background:"#080808" }}>

      {/* BG IMAGE */}
      <AnimatePresence mode="wait">
        <motion.div key={slide}
          initial={{ opacity:0, scale:1.08 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.96 }}
          transition={{ duration:1.2, ease:[0.76,0,0.24,1] }}
          style={{ position:"absolute", inset:0, y:imgY }}>
          <img src={HERO_IMAGES[slide]} alt="Amar Jeans Hero"
            style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center", opacity:0.45 }} />
        </motion.div>
      </AnimatePresence>

      {/* OVERLAYS */}
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right,rgba(0,0,0,0.92) 0%,rgba(0,0,0,0.3) 55%,rgba(0,0,0,0.1) 100%)", zIndex:2 }} />
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,0.9) 0%,transparent 60%)", zIndex:3 }} />
      <motion.div animate={{ opacity:[0.12,0.22,0.12] }} transition={{ duration:4, repeat:Infinity, ease:"easeInOut" }}
        style={{ position:"absolute", left:0, top:"20%", width:"45%", height:"40%", background:"radial-gradient(ellipse at left center,rgba(220,38,38,0.3) 0%,transparent 70%)", zIndex:4, pointerEvents:"none" }} />

      {/* GRID LINES */}
      <div style={{ position:"absolute", inset:0, zIndex:4, opacity:0.05,
        backgroundImage:"linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)",
        backgroundSize:"80px 80px", pointerEvents:"none" }} />

      {/* SLIDE DOTS */}
      <div style={{ position:"absolute", right:28, top:"50%", transform:"translateY(-50%)", zIndex:20, display:"flex", flexDirection:"column", gap:10 }}>
        {SLIDES.map((_,i) => (
          <button key={i} onClick={() => setSlide(i)}
            style={{ width: i===slide ? 4:2, height: i===slide ? 40:20,
              background: i===slide ? "#dc2626":"rgba(255,255,255,0.3)",
              border:"none", cursor:"pointer", transition:"all 0.4s", borderRadius:2 }} />
        ))}
      </div>

      {/* MAIN TEXT */}
      <motion.div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", zIndex:15, y:textY, opacity }}>
        <div style={{ maxWidth:1440, margin:"0 auto", padding:"0 1.5rem", width:"100%" }}>
          <div style={{ maxWidth:860 }}>

            {/* EYEBROW */}
            <motion.div initial={{ opacity:0, x:-30 }} animate={loaded?{ opacity:1, x:0 }:{}} transition={{ duration:0.7, delay:0.1 }}
              style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
              <div style={{ width:32, height:2, background:"#dc2626" }} />
              <AnimatePresence mode="wait">
                <motion.span key={slide+"-sub"}
                  initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }} transition={{ duration:0.4 }}
                  style={{ color:"#dc2626", fontSize:"0.7rem", fontWeight:900, letterSpacing:"0.25em", textTransform:"uppercase" }}>
                  {SLIDES[slide].sub}
                </motion.span>
              </AnimatePresence>
            </motion.div>

            {/* AMAR */}
            <div style={{ overflow:"hidden", marginBottom:6 }}>
              <motion.div initial={{ y:"110%" }} animate={loaded?{ y:0 }:{}} transition={{ duration:0.9, delay:0.2, ease:[0.76,0,0.24,1] }}>
                <span style={{ display:"block", fontWeight:900, fontSize:"clamp(3.5rem,10vw,8.5rem)", lineHeight:0.85, letterSpacing:"-0.03em", textTransform:"uppercase", color:"#fff" }}>AMAR</span>
              </motion.div>
            </div>

            {/* JEANS */}
            <div style={{ overflow:"hidden", marginBottom:6 }}>
              <motion.div initial={{ y:"110%" }} animate={loaded?{ y:0 }:{}} transition={{ duration:0.9, delay:0.35, ease:[0.76,0,0.24,1] }}>
                <span style={{ display:"block", fontWeight:900, fontSize:"clamp(3.5rem,10vw,8.5rem)", lineHeight:0.85, letterSpacing:"-0.03em", textTransform:"uppercase", color:"#fff" }}>JEANS</span>
              </motion.div>
            </div>

            {/* SLIDE LABEL - RED */}
            <div style={{ overflow:"hidden", marginBottom:36 }}>
              <motion.div initial={{ y:"110%" }} animate={loaded?{ y:0 }:{}} transition={{ duration:1, delay:0.5, ease:[0.76,0,0.24,1] }}>
                <AnimatePresence mode="wait">
                  <motion.span key={slide+"-label"}
                    initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }} transition={{ duration:0.5 }}
                    style={{ display:"block", fontWeight:900, fontSize:"clamp(3.5rem,10vw,8.5rem)", lineHeight:0.85, letterSpacing:"-0.03em", textTransform:"uppercase", color:"#dc2626" }}>
                    {SLIDES[slide].label}
                  </motion.span>
                </AnimatePresence>
              </motion.div>
            </div>

            {/* TAGLINE */}
            <motion.div initial={{ opacity:0, y:20 }} animate={loaded?{ opacity:1, y:0 }:{}} transition={{ duration:0.8, delay:0.7 }}
              style={{ display:"flex", alignItems:"center", gap:20, marginBottom:44 }}>
              <div style={{ width:4, height:56, background:"#dc2626", flexShrink:0 }} />
              <p style={{ color:"rgba(255,255,255,0.7)", fontWeight:700, fontSize:"0.82rem", letterSpacing:"0.15em", textTransform:"uppercase", maxWidth:360, lineHeight:1.7 }}>
                Engineered for maximum fit, comfort &amp; durability. Direct manufacturer quality — no middlemen.
              </p>
            </motion.div>

            {/* CTA */}
            <motion.div initial={{ opacity:0, y:20 }} animate={loaded?{ opacity:1, y:0 }:{}} transition={{ duration:0.8, delay:0.88 }}
              style={{ display:"flex", flexWrap:"wrap", gap:16 }}>
              <Link href="/products">
                <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
                  style={{ display:"flex", alignItems:"center", gap:12, background:"#dc2626", color:"#fff",
                    fontWeight:900, fontSize:"0.75rem", letterSpacing:"0.2em", textTransform:"uppercase",
                    padding:"18px 36px", border:"none", cursor:"pointer" }}>
                  <ShoppingBag style={{ width:18, height:18 }} />
                  Explore Catalog
                  <ArrowRight style={{ width:18, height:18 }} />
                </motion.button>
              </Link>
              <Link href="/contact">
                <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
                  style={{ display:"flex", alignItems:"center", gap:10, background:"transparent", color:"#fff",
                    fontWeight:900, fontSize:"0.75rem", letterSpacing:"0.2em", textTransform:"uppercase",
                    padding:"16px 32px", border:"2px solid rgba(255,255,255,0.35)", cursor:"pointer" }}>
                  <MessageSquare style={{ width:16, height:16 }} />
                  Bulk Enquiry
                </motion.button>
              </Link>
            </motion.div>

          </div>
        </div>
      </motion.div>

      {/* FLOATING STATS (desktop only) */}
      <motion.div initial={{ opacity:0, x:40 }} animate={loaded?{ opacity:1, x:0 }:{}} transition={{ duration:0.9, delay:1.1 }}
        style={{ position:"absolute", right:72, top:"18%", zIndex:20 }}
        className="hidden lg:block">
        {[
          { val:"30+", lbl:"Years of Craft", color:"#dc2626", bg:"rgba(255,255,255,0.05)", border:"rgba(255,255,255,0.12)", dy:[0,-10,0], delay:0 },
          { val:"10K+", lbl:"Happy Customers", color:"#fff", bg:"rgba(220,38,38,0.15)", border:"rgba(220,38,38,0.3)", dy:[0,10,0], delay:0.5 },
          { val:"PAN", lbl:"India Shipping", color:"#dc2626", bg:"rgba(255,255,255,0.05)", border:"rgba(255,255,255,0.12)", dy:[0,-8,0], delay:1 },
        ].map((s,i) => (
          <motion.div key={i} animate={{ y:s.dy }} transition={{ duration:4+i, repeat:Infinity, ease:"easeInOut", delay:s.delay }}
            style={{ background:s.bg, backdropFilter:"blur(20px)", border:`1px solid ${s.border}`, padding:"20px 24px", marginBottom:14, minWidth:155 }}>
            <div style={{ fontSize:"2rem", fontWeight:900, color:s.color, lineHeight:1 }}>{s.val}</div>
            <div style={{ fontSize:"0.6rem", fontWeight:700, color:"rgba(255,255,255,0.5)", letterSpacing:"0.2em", textTransform:"uppercase", marginTop:4 }}>{s.lbl}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* PROGRESS BAR */}
      <div style={{ position:"absolute", bottom:32, left:0, right:0, zIndex:20, display:"flex" }}>
        {SLIDES.map((_,i) => (
          <div key={i} style={{ flex:1, height:3, background:"rgba(255,255,255,0.08)", position:"relative", overflow:"hidden" }}>
            {i === slide && (
              <motion.div key={slide} initial={{ scaleX:0 }} animate={{ scaleX:1 }}
                transition={{ duration:5, ease:"linear" }}
                style={{ position:"absolute", inset:0, background:"#dc2626", transformOrigin:"left" }} />
            )}
            {i < slide && <div style={{ position:"absolute", inset:0, background:"rgba(220,38,38,0.5)" }} />}
          </div>
        ))}
      </div>

      {/* RED TICKER */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, zIndex:19, background:"rgba(220,38,38,0.93)", padding:"9px 0", overflow:"hidden" }}>
        <motion.div animate={{ x:["0%","-50%"] }} transition={{ duration:18, repeat:Infinity, ease:"linear" }}
          style={{ display:"flex", gap:40, whiteSpace:"nowrap", width:"max-content" }}>
          {[...TICKER_WORDS,...TICKER_WORDS].map((w,i) => (
            <span key={i} style={{ fontSize:"0.62rem", fontWeight:900, letterSpacing:"0.25em", textTransform:"uppercase", color:"rgba(255,255,255,0.9)" }}>{w}</span>
          ))}
        </motion.div>
      </div>

      {/* LIVE DOT */}
      <motion.div initial={{ opacity:0 }} animate={loaded?{ opacity:1 }:{}} transition={{ delay:1.5, duration:1 }}
        style={{ position:"absolute", top:24, left:20, zIndex:20, display:"flex", alignItems:"center", gap:8 }}>
        <motion.div animate={{ scale:[1,1.5,1], opacity:[1,0.4,1] }} transition={{ duration:2, repeat:Infinity }}
          style={{ width:8, height:8, borderRadius:"50%", background:"#dc2626" }} />
        <span style={{ fontSize:"0.58rem", fontWeight:900, color:"rgba(255,255,255,0.45)", letterSpacing:"0.2em", textTransform:"uppercase" }}>
          Live — Ambernath, Maharashtra
        </span>
      </motion.div>

    </section>
  );
}

function ProductCarousel({ title, tag, items }) {
  return (
    <div className="py-12 border-b border-border">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            {tag && <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-primary mb-2"><Zap className="w-4 h-4 fill-primary" /> {tag}</span>}
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-foreground">{title}</h2>
          </div>
          <Link href="/products">
            <button className="hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-foreground hover:text-primary transition-colors cursor-pointer">
              See All <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-8 -mx-4 px-4 lg:mx-0 lg:px-0">
          {items.map((item,i) => (
            <Link key={i} href={item.handle ? `/products/${item.handle}` : "/products"}>
              <div className="w-[180px] min-w-[180px] md:w-[260px] md:min-w-[280px] group cursor-pointer">
                <div className="relative bg-muted mb-3 overflow-hidden border border-border" style={{ aspectRatio:"3/4" }}>
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  {item.badge && <div className="absolute top-0 left-0 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest px-2 py-1 z-10">{item.badge}</div>}
                  <div className="absolute bottom-0 left-0 right-0 bg-background/95 border-t border-border translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center py-3 font-bold uppercase tracking-widest text-[10px] z-20">View &amp; Enquire</div>
                </div>
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_,si) => <Star key={si} className="w-3 h-3 fill-primary text-primary" />)}
                  <span className="text-[10px] font-bold text-muted-foreground ml-1">(5.0)</span>
                </div>
                <h3 className="font-bold text-foreground text-xs uppercase tracking-tight leading-tight mb-1 group-hover:text-primary transition-colors truncate">{item.title}</h3>
                <div className="flex items-center gap-2">
                  <p className="text-foreground text-sm font-black">{item.price}</p>
                  {item.compareAtPrice && <p className="text-muted-foreground text-xs font-bold line-through">{item.compareAtPrice}</p>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { data: categories = [] } = trpc.commerce.categories.list.useQuery();
  const { data: recentReviews = [] } = trpc.commerce.reviews.listRecent.useQuery();
  const { data: dbProducts = [] } = trpc.commerce.products.list.useQuery();

  const trendingProducts = dbProducts.filter(p => p.isTrending);
  const base = trendingProducts.length > 0 ? trendingProducts : dbProducts;

  const mapProduct = (p, fallbackBadge) => {
    const amt = Number(p.priceRange.min.amount);
    const isSale = p.compareAtPrice > amt;
    const disc = isSale ? Math.round(((p.compareAtPrice - amt) / p.compareAtPrice) * 100) : 0;
    return {
      title: p.title,
      price: `Rs.${p.priceRange.min.amount}`,
      compareAtPrice: isSale ? `Rs.${p.compareAtPrice}` : null,
      img: p.images?.[0]?.url || "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop",
      badge: isSale ? `-${disc}%` : fallbackBadge,
      handle: p.handle
    };
  };

  const trending = base.map(p => mapProduct(p, p.isTrending ? "Trending" : "Popular"));
  const newArrivals = dbProducts.slice(-6).reverse().map(p => mapProduct(p, "Just Dropped"));

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      <HeroBanner />

      <section className="grid grid-cols-1 md:grid-cols-3 border-b border-border">
        {[
          { title:"Direct Factory Pricing", sub:"Premium heavy denim without middleman markup", icon:<Truck className="w-8 h-8" /> },
          { title:"Custom Fit & Bulk Orders", sub:"Personalized sizes & wholesale enquiries welcome", icon:<MessageSquare className="w-8 h-8" /> },
          { title:"Pan-India Shipping", sub:"Safe delivery across India with full tracking", icon:<Lock className="w-8 h-8" /> },
        ].map((p,i) => (
          <div key={i} className="flex items-center justify-center gap-4 p-8 border-b md:border-b-0 md:border-r border-border last:border-0 bg-muted/20">
            <span className="text-primary">{p.icon}</span>
            <div>
              <h4 className="font-black uppercase tracking-wider text-foreground">{p.title}</h4>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{p.sub}</p>
            </div>
          </div>
        ))}
      </section>

      {trending.length > 0 && <ProductCarousel title="Trending Denim Fits" tag="Bestsellers" items={trending} />}

      <section className="border-b border-border">
        <Link href="/products?cat=cargo-jeans">
          <div className="relative h-[380px] w-full overflow-hidden group cursor-pointer bg-foreground">
            <img src="https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=1600&auto=format&fit=crop" alt="Cargo Jeans"
              className="w-full h-full object-cover opacity-50 transition-transform duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 flex items-center justify-center text-center px-4">
              <div>
                <span className="inline-block bg-primary text-primary-foreground font-black uppercase tracking-widest px-4 py-2 mb-4 text-xs">Featured Collection</span>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-background mb-4">Urban Tactical Cargo Jeans</h2>
                <p className="text-lg text-background/90 font-bold uppercase tracking-widest mb-6">6-Pocket Heavy Reinforced Stitching</p>
                <button className="bg-background text-foreground font-black uppercase tracking-widest px-8 py-4 hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">Shop Cargo Collection</button>
              </div>
            </div>
          </div>
        </Link>
      </section>

      {newArrivals.length > 0 && <ProductCarousel title="Newest Additions" tag="Just Dropped" items={newArrivals} />}

      <section className="py-12 border-b border-border bg-muted/10">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-foreground mb-8">Shop By Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/products?cat=${cat.slug}`}>
                <div className="group cursor-pointer border border-border bg-background p-6 flex flex-col items-center justify-center text-center hover:bg-foreground transition-colors duration-300" style={{ aspectRatio:"16/9" }}>
                  <span className="font-black uppercase tracking-widest text-sm text-foreground group-hover:text-background transition-colors duration-300">{cat.name}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-background transition-colors duration-300" style={{ marginTop: 4 }}>Explore Products →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {recentReviews.length > 0 && (
        <section className="py-16 border-b border-border bg-background">
          <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-primary mb-2"><Star className="w-4 h-4 fill-primary" /> Verified Customer Feedback</span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-10">What Customers Say About AMAR JEANS</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recentReviews.slice(0,4).map((r) => (
                <div key={r._id} className="bg-muted/20 border border-border p-6 flex flex-col justify-between hover:bg-muted/40 transition-colors">
                  <div>
                    <div className="flex items-center gap-1 mb-4">{[...Array(r.rating)].map((_,i) => <Star key={i} className="w-4 h-4 fill-primary text-primary" />)}</div>
                    <p className="text-sm font-medium leading-relaxed mb-6">"{r.comment}"</p>
                  </div>
                  <div className="border-t border-border pt-4">
                    <p className="font-black uppercase tracking-widest text-xs text-foreground">{r.authorName}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
