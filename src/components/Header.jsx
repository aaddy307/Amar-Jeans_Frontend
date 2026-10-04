"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { trpc } from "@/lib/trpc";
import { ShoppingBag, Menu, X, Search, Heart, Users } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import AnnouncementBar from "./AnnouncementBar";
import CartDrawer from "./CartDrawer";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/contact", label: "Contact" }
];

const MEGA_MENU_ITEMS = [
  { label: "Men's Jeans", href: "/products?gender=men", sub: "All Men's" },
  { label: "Women's Jeans", href: "/products?gender=women", sub: "All Women's" },
  { label: "New Arrivals", href: "/products?isNew=true", sub: "Just Dropped" },
  { label: "Bestsellers", href: "/products?isBestseller=true", sub: "Top Picks" },
  { label: "Bulk Enquiry", href: "/contact", sub: "Wholesale & Custom" },
];

export default function Header() {
  const { itemCount } = useCart();
  const { data: categories = [] } = trpc.commerce.categories.list.useQuery();
  const { data: dbProducts = [] } = trpc.commerce.products.list.useQuery();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const suggestions = searchQuery.trim()
    ? dbProducts.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.productType && p.productType.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowSuggestions(false);
    }
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 bg-background border-b transition-all duration-300 ${scrolled ? "border-border shadow-sm" : "border-border"}`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Announcement Bar */}
        <AnnouncementBar />

        {/* Main Header Row */}
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-2.5 flex items-center justify-between gap-4 md:gap-6">
          {/* Logo */}
          <Link href="/">
            <motion.div className="cursor-pointer select-none flex items-center" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <img src="/image.png" alt="AMAR JEANS" className="h-10 sm:h-12 md:h-14 w-auto object-contain shrink-0" />
            </motion.div>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl relative">
            <form onSubmit={handleSearch} className="w-full flex relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Search for denim, jackets, cargo jeans..."
                style={{ fontSize: "0.875rem", padding: "10px 16px" }}
                className="w-full bg-muted/30 border-2 border-border text-foreground rounded-none outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground font-medium"
              />
              <button type="submit" className="absolute right-0 top-0 bottom-0 px-4 bg-foreground text-background hover:bg-primary transition-colors flex items-center justify-center">
                <Search className="w-5 h-5" />
              </button>
            </form>

            {/* Suggestions */}
            <AnimatePresence>
              {showSuggestions && searchQuery.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-background border border-border shadow-xl z-50 max-h-96 overflow-y-auto"
                >
                  {suggestions.length > 0 ? (
                    <div className="flex flex-col">
                      {suggestions.map(p => (
                        <div key={p.id} onClick={() => { router.push(`/products/${p.handle}`); setSearchQuery(""); setShowSuggestions(false); }}
                          className="flex items-center gap-4 p-3 hover:bg-muted cursor-pointer transition-colors border-b border-border last:border-0">
                          <div className="w-12 h-16 bg-muted shrink-0 overflow-hidden">
                            {p.images?.[0]?.url && <img src={p.images[0].url} alt={p.title} className="w-full h-full object-cover" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold uppercase tracking-widest text-foreground line-clamp-1">{p.title}</p>
                            <p className="text-xs text-muted-foreground font-bold mt-1">₹{p.priceRange?.min?.amount}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm font-bold uppercase tracking-widest text-muted-foreground">
                      No results for "{searchQuery}"
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Wishlist */}
            <Link href="/wishlist">
              <motion.div className="hidden sm:flex flex-col items-center gap-0.5 text-foreground hover:text-primary transition-colors cursor-pointer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Heart className="w-5 h-5 stroke-[1.5]" />
                <span style={{ fontSize: "0.6rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }} className="hidden lg:block">Wishlist</span>
              </motion.div>
            </Link>

            {/* Cart icon → opens drawer */}
            <motion.div
              onClick={() => setCartOpen(true)}
              className="relative flex flex-col items-center gap-0.5 text-foreground hover:text-primary transition-colors cursor-pointer"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      key="badge"
                      initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      style={{
                        position: "absolute", top: -6, right: -8,
                        background: "var(--primary)", color: "#fff",
                        fontSize: "0.6rem", fontWeight: 900, width: 18, height: 18,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        border: "2px solid var(--background)"
                      }}
                    >
                      {itemCount > 9 ? "9+" : itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <span style={{ fontSize: "0.65rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }} className="hidden lg:block">Cart</span>
            </motion.div>

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-1 text-foreground hover:text-primary transition-colors bg-transparent border-none cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Bottom Navigation Row */}
        <div className="relative hidden md:block border-t border-border bg-background" onMouseLeave={() => setShowMegaMenu(false)}>
          <div style={{ display: "flex", height: 48, alignItems: "center", justifyContent: "center", padding: "0 2rem", maxWidth: 1440, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 36, flexShrink: 0 }}>
              {navLinks.map(link => (
                <Link key={link.href} href={link.href}>
                  <span style={{
                    fontSize: "0.78rem", fontWeight: pathname === link.href ? 900 : 700,
                    textTransform: "uppercase", letterSpacing: "0.18em", cursor: "pointer", whiteSpace: "nowrap",
                    color: pathname === link.href ? "var(--primary)" : "var(--muted-foreground)",
                    transition: "color 0.2s"
                  }}
                    onMouseEnter={e => { if (pathname !== link.href) e.currentTarget.style.color = "var(--foreground)"; }}
                    onMouseLeave={e => { if (pathname !== link.href) e.currentTarget.style.color = "var(--muted-foreground)"; }}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}

              {/* Mega-menu trigger items */}
              {MEGA_MENU_ITEMS.map(item => (
                <Link key={item.href} href={item.href}>
                  <span
                    onMouseEnter={() => setShowMegaMenu(true)}
                    style={{
                      fontSize: "0.78rem", fontWeight: 700,
                      textTransform: "uppercase", letterSpacing: "0.18em",
                      cursor: "pointer", whiteSpace: "nowrap",
                      color: "var(--muted-foreground)", transition: "color 0.2s"
                    }}
                    onMouseOver={e => e.currentTarget.style.color = "var(--foreground)"}
                    onMouseOut={e => e.currentTarget.style.color = "var(--muted-foreground)"}
                  >
                    {item.label}
                  </span>
                </Link>
              ))}

              {categories.length > 0 && <div style={{ width: 1, height: 18, background: "var(--border)", flexShrink: 0 }} />}
            </div>

            <div className="flex items-center pl-4 h-full">
              <Link href="/products?cat=all">
                <span onMouseEnter={() => setShowMegaMenu(true)}
                  className="text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors text-foreground hover:text-primary whitespace-nowrap flex items-center h-full">
                  ALL COLLECTIONS
                </span>
              </Link>
            </div>
          </div>

          {/* Mega Menu Dropdown */}
          <AnimatePresence>
            {showMegaMenu && categories.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute left-0 right-0 top-full bg-background/98 backdrop-blur-md border-b border-border shadow-2xl z-40 overflow-hidden border-t"
              >
                <div className="max-w-[1440px] mx-auto py-8 px-8">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Explore Our Denim Collections</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                    {categories.map(cat => (
                      <Link key={cat.id} href={`/products?cat=${cat.slug}`}>
                        <motion.div
                          onClick={() => setShowMegaMenu(false)}
                          className="group cursor-pointer overflow-hidden border border-border bg-muted/30 hover:border-foreground transition-all duration-300"
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {cat.image && (
                            <div className="h-24 overflow-hidden">
                              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                          )}
                          <div className="px-3 py-2">
                            <p className="text-xs font-black uppercase tracking-widest leading-tight">{cat.name}</p>
                            {cat.productCount !== undefined && (
                              <p className="text-[10px] font-bold text-muted-foreground mt-0.5">{cat.productCount} products</p>
                            )}
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden border-t border-border p-3 bg-background relative z-50">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Search products..."
              className="w-full bg-muted/30 border border-border text-foreground px-4 py-2.5 outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground text-sm"
            />
            <button type="submit" className="absolute right-0 top-0 bottom-0 px-4 bg-foreground text-background flex items-center justify-center">
              <Search className="w-4 h-4" />
            </button>
          </form>
          <AnimatePresence>
            {showSuggestions && searchQuery.trim() && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute top-full left-0 right-0 mt-1 mx-3 bg-background border border-border shadow-xl z-50 max-h-80 overflow-y-auto"
              >
                {suggestions.length > 0 ? (
                  <div className="flex flex-col">
                    {suggestions.map(p => (
                      <div key={p.id} onClick={() => { router.push(`/products/${p.handle}`); setSearchQuery(""); setShowSuggestions(false); }}
                        className="flex items-center gap-3 p-3 hover:bg-muted cursor-pointer transition-colors border-b border-border last:border-0">
                        <div className="w-10 h-14 bg-muted shrink-0 overflow-hidden">
                          {p.images?.[0]?.url && <img src={p.images[0].url} alt={p.title} className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold uppercase tracking-widest text-foreground line-clamp-1">{p.title}</p>
                          <p className="text-[10px] text-muted-foreground font-bold mt-1">₹{p.priceRange?.min?.amount}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">No results found</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-background overflow-hidden absolute top-full left-0 right-0 z-40 border-t border-border"
            >
              <nav className="flex flex-col">
                <div className="p-6 border-b border-border space-y-4">
                  {[...navLinks, ...MEGA_MENU_ITEMS].map(link => (
                    <Link key={link.href + link.label} href={link.href} onClick={() => setMobileOpen(false)}>
                      <span className={`block text-xl font-black uppercase tracking-tighter ${pathname === link.href ? "text-primary" : "text-foreground"}`}>
                        {link.label}
                      </span>
                    </Link>
                  ))}
                  <div className="pt-4 border-t border-border">
                    <p className="text-xs font-black uppercase tracking-widest text-primary mb-3">Shop by Category</p>
                    {categories.map(cat => (
                      <Link key={cat.id} href={`/products?cat=${cat.slug}`} onClick={() => setMobileOpen(false)}>
                        <span className="block text-base font-bold uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors mb-2">
                          {cat.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Spacer for fixed header (announcement bar + main header + nav bar) */}
      <div className="h-[155px] md:h-[175px] bg-background" />

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
