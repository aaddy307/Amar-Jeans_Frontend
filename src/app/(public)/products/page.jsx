"use client";

import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { ChevronRight, Filter, X, SlidersHorizontal, ShoppingBag, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import ProductCard from "@/components/ProductCard";

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeCategoryParam = searchParams.get("cat") || "all";
  const activeGenderParam = searchParams.get("gender") || "all";
  const activeSearchParam = searchParams.get("search") || "";

  const { data: products = [], isLoading: isLoadingProducts } = trpc.commerce.products.list.useQuery();
  const { data: categories = [], isLoading: isLoadingCategories } = trpc.commerce.categories.list.useQuery();

  const [selectedGender, setSelectedGender] = useState(activeGenderParam);
  const [selectedCategory, setSelectedCategory] = useState(activeCategoryParam);
  const [selectedFit, setSelectedFit] = useState("all");
  const [selectedSize, setSelectedSize] = useState("all");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sortBy, setSortBy] = useState("Recommended");
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const productsPerPage = 12;

  // Filter options
  const fits = ["Slim Fit", "Regular Fit", "Cargo Fit", "Relaxed Fit", "Straight Fit"];
  const sizes = ["28", "30", "32", "34", "36", "38"];

  const filteredProducts = products.filter(p => {
    // Search filter
    const searchLow = activeSearchParam.toLowerCase();
    const matchesSearch = !activeSearchParam ||
      p.title.toLowerCase().includes(searchLow) ||
      (p.description && p.description.toLowerCase().includes(searchLow)) ||
      (p.brand && p.brand.toLowerCase().includes(searchLow));

    // Category filter
    const catLow = selectedCategory.toLowerCase();
    const matchesCategory = selectedCategory === "all" ||
      (p.category && (p.category.slug === catLow || p.category.name?.toLowerCase() === catLow)) ||
      (p.productType && p.productType.toLowerCase().replace(/[^a-z0-9]/g, "") === catLow.replace(/[^a-z0-9]/g, "")) ||
      (p.tags && p.tags.some(t => t.toLowerCase().replace(/[^a-z0-9]/g, "") === catLow.replace(/[^a-z0-9]/g, "")));

    // Gender filter
    const matchesGender = selectedGender === "all" ||
      p.gender?.toLowerCase() === selectedGender.toLowerCase() ||
      p.gender?.toLowerCase() === "unisex";

    // Fit filter
    const matchesFit = selectedFit === "all" ||
      p.fit?.toLowerCase() === selectedFit.toLowerCase();

    // Size filter
    const matchesSize = selectedSize === "all" ||
      (p.sizes && p.sizes.includes(selectedSize));

    // Price filter
    const price = Number(p.priceRange?.min?.amount || p.price || 0);
    const matchesPrice = price <= maxPrice;

    return matchesSearch && matchesCategory && matchesGender && matchesFit && matchesSize && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = Number(a.priceRange?.min?.amount || a.price || 0);
    const priceB = Number(b.priceRange?.min?.amount || b.price || 0);
    switch (sortBy) {
      case "Newest":
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      case "Price (Low-High)":
        return priceA - priceB;
      case "Price (High-Low)":
        return priceB - priceA;
      case "Bestsellers":
        return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
      case "Recommended":
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedGender("all");
    setSelectedFit("all");
    setSelectedSize("all");
    setMaxPrice(5000);
    router.push("/products");
  };

  const hasActiveFilters = selectedCategory !== "all" || selectedGender !== "all" || selectedFit !== "all" || selectedSize !== "all" || maxPrice < 5000 || activeSearchParam;

  return (
    <div className="min-h-screen bg-background pt-4 pb-16">

      {/* Breadcrumb Header */}
      <div className="border-b border-border bg-muted/20">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">{selectedCategory === "all" ? "Catalog" : selectedCategory}</span>
          </div>
          <div className="text-xs font-bold uppercase tracking-widest text-foreground">
            {sortedProducts.length} <span className="text-muted-foreground">Products</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 mt-6">

        {/* Title + Sort + Mobile Filter Button */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-6 border-b border-border">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-primary mb-1 block">Amar Jeans Collection</span>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-foreground">
              {selectedCategory === "all" ? (selectedGender === "all" ? "All Denim" : `${selectedGender}'s Denim`) : selectedCategory}
            </h1>
          </div>

          <div className="flex items-center gap-3 self-end">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 border border-border px-4 py-2 text-xs font-black uppercase tracking-widest text-foreground hover:border-primary transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-primary" /> Filters
            </button>

            <div className="flex items-center gap-2 border border-border px-3 py-2 text-xs font-black uppercase tracking-widest">
              <span className="text-muted-foreground">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none outline-none font-black text-foreground cursor-pointer"
              >
                <option value="Recommended">Recommended</option>
                <option value="Newest">Newest Arrivals</option>
                <option value="Bestsellers">Bestsellers</option>
                <option value="Price (Low-High)">Price: Low to High</option>
                <option value="Price (High-Low)">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-muted/30 border border-border">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mr-1">Active Filters:</span>
            {selectedCategory !== "all" && (
              <span className="inline-flex items-center gap-1.5 bg-foreground text-background text-[10px] font-black uppercase tracking-widest px-2.5 py-1">
                Cat: {selectedCategory}
                <X className="w-3 h-3 cursor-pointer hover:text-primary" onClick={() => setSelectedCategory("all")} />
              </span>
            )}
            {selectedGender !== "all" && (
              <span className="inline-flex items-center gap-1.5 bg-foreground text-background text-[10px] font-black uppercase tracking-widest px-2.5 py-1">
                Gender: {selectedGender}
                <X className="w-3 h-3 cursor-pointer hover:text-primary" onClick={() => setSelectedGender("all")} />
              </span>
            )}
            {selectedFit !== "all" && (
              <span className="inline-flex items-center gap-1.5 bg-foreground text-background text-[10px] font-black uppercase tracking-widest px-2.5 py-1">
                Fit: {selectedFit}
                <X className="w-3 h-3 cursor-pointer hover:text-primary" onClick={() => setSelectedFit("all")} />
              </span>
            )}
            {selectedSize !== "all" && (
              <span className="inline-flex items-center gap-1.5 bg-foreground text-background text-[10px] font-black uppercase tracking-widest px-2.5 py-1">
                Size: {selectedSize}
                <X className="w-3 h-3 cursor-pointer hover:text-primary" onClick={() => setSelectedSize("all")} />
              </span>
            )}
            {maxPrice < 5000 && (
              <span className="inline-flex items-center gap-1.5 bg-foreground text-background text-[10px] font-black uppercase tracking-widest px-2.5 py-1">
                Max ₹{maxPrice}
                <X className="w-3 h-3 cursor-pointer hover:text-primary" onClick={() => setMaxPrice(5000)} />
              </span>
            )}
            {activeSearchParam && (
              <span className="inline-flex items-center gap-1.5 bg-foreground text-background text-[10px] font-black uppercase tracking-widest px-2.5 py-1">
                Search: "{activeSearchParam}"
                <X className="w-3 h-3 cursor-pointer hover:text-primary" onClick={() => router.push("/products")} />
              </span>
            )}
            <button
              onClick={resetFilters}
              className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline ml-auto flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Clear All
            </button>
          </div>
        )}

        {/* Layout Grid: Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-6 self-start sticky top-24 pr-4">

            {/* Gender */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-foreground mb-3 pb-2 border-b border-border">Gender</h3>
              <div className="space-y-2">
                {["all", "men", "women"].map(g => (
                  <label key={g} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="gender"
                      checked={selectedGender === g}
                      onChange={() => setSelectedGender(g)}
                      className="accent-primary cursor-pointer"
                    />
                    <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${selectedGender === g ? "text-primary font-black" : "text-muted-foreground group-hover:text-foreground"}`}>
                      {g === "all" ? "All Genders" : g}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-foreground mb-3 pb-2 border-b border-border">Category</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === "all"}
                    onChange={() => setSelectedCategory("all")}
                    className="accent-primary cursor-pointer"
                  />
                  <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${selectedCategory === "all" ? "text-primary font-black" : "text-muted-foreground group-hover:text-foreground"}`}>
                    All Categories
                  </span>
                </label>
                {categories.map(cat => (
                  <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === cat.slug}
                      onChange={() => setSelectedCategory(cat.slug)}
                      className="accent-primary cursor-pointer"
                    />
                    <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${selectedCategory === cat.slug ? "text-primary font-black" : "text-muted-foreground group-hover:text-foreground"}`}>
                      {cat.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Fit */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-foreground mb-3 pb-2 border-b border-border">Fit</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="fit"
                    checked={selectedFit === "all"}
                    onChange={() => setSelectedFit("all")}
                    className="accent-primary cursor-pointer"
                  />
                  <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${selectedFit === "all" ? "text-primary font-black" : "text-muted-foreground group-hover:text-foreground"}`}>
                    All Fits
                  </span>
                </label>
                {fits.map(f => (
                  <label key={f} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="fit"
                      checked={selectedFit === f}
                      onChange={() => setSelectedFit(f)}
                      className="accent-primary cursor-pointer"
                    />
                    <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${selectedFit === f ? "text-primary font-black" : "text-muted-foreground group-hover:text-foreground"}`}>
                      {f}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-foreground mb-3 pb-2 border-b border-border">Waist Size</h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setSelectedSize("all")}
                  className={`py-1.5 text-xs font-black uppercase border transition-colors cursor-pointer ${selectedSize === "all" ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:border-foreground"}`}
                >
                  ALL
                </button>
                {sizes.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`py-1.5 text-xs font-black uppercase border transition-colors cursor-pointer ${selectedSize === s ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:border-foreground"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Price */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Max Price</h3>
                <span className="text-xs font-black text-primary">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="500"
                max="5000"
                step="100"
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-bold text-muted-foreground mt-1">
                <span>₹500</span>
                <span>₹5,000</span>
              </div>
            </div>
          </aside>

          {/* Product Grid (3 cols on desktop) */}
          <div className="lg:col-span-3">
            {isLoadingProducts || isLoadingCategories ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-muted/40 aspect-3/4 animate-pulse border border-border" />
                ))}
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="bg-muted/10 border border-border py-24 text-center flex flex-col items-center justify-center p-6">
                <ShoppingBag className="w-14 h-14 text-muted-foreground mb-4 stroke-1" />
                <h3 className="text-2xl font-black text-foreground mb-2 uppercase tracking-tighter">No Denim Matches Found</h3>
                <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-6">Try clearing your filters or selecting a different fit.</p>
                <button
                  onClick={resetFilters}
                  className="bg-foreground text-background px-6 py-3 font-black uppercase tracking-widest text-xs hover:bg-primary transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                  initial="hidden"
                  animate="visible"
                  variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                >
                  {paginatedProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12 pt-8 border-t border-border">
                    {[...Array(totalPages)].map((_, idx) => {
                      const pageNum = idx + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 text-xs font-black uppercase transition-colors cursor-pointer border ${currentPage === pageNum ? "bg-foreground text-background border-foreground" : "border-border hover:border-foreground text-foreground"}`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden flex justify-end"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-xs bg-background h-full overflow-y-auto p-6 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-primary" />
                    <h2 className="text-sm font-black uppercase tracking-widest">Filter Denim</h2>
                  </div>
                  <button onClick={() => setMobileFilterOpen(false)} className="cursor-pointer p-1">
                    <X className="w-5 h-5 text-foreground" />
                  </button>
                </div>

                {/* Gender */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-foreground mb-2">Gender</h3>
                  <div className="flex gap-2">
                    {["all", "men", "women"].map(g => (
                      <button
                        key={g}
                        onClick={() => setSelectedGender(g)}
                        className={`flex-1 py-2 text-[10px] font-black uppercase border cursor-pointer ${selectedGender === g ? "bg-foreground text-background border-foreground" : "border-border"}`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fit */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-foreground mb-2">Fit</h3>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => setSelectedFit("all")}
                      className={`w-full text-left px-3 py-2 text-xs font-bold uppercase border cursor-pointer ${selectedFit === "all" ? "bg-primary text-white border-primary" : "border-border"}`}
                    >
                      All Fits
                    </button>
                    {fits.map(f => (
                      <button
                        key={f}
                        onClick={() => setSelectedFit(f)}
                        className={`w-full text-left px-3 py-2 text-xs font-bold uppercase border cursor-pointer ${selectedFit === f ? "bg-primary text-white border-primary" : "border-border"}`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-foreground mb-2">Size</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setSelectedSize("all")}
                      className={`py-2 text-xs font-black uppercase border cursor-pointer ${selectedSize === "all" ? "bg-foreground text-background" : "border-border"}`}
                    >
                      ALL
                    </button>
                    {sizes.map(s => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`py-2 text-xs font-black uppercase border cursor-pointer ${selectedSize === s ? "bg-foreground text-background" : "border-border"}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border flex gap-3">
                <button
                  onClick={resetFilters}
                  className="flex-1 py-3 text-xs font-black uppercase border border-border hover:border-foreground"
                >
                  Reset
                </button>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex-1 py-3 text-xs font-black uppercase bg-primary text-white"
                >
                  Apply ({sortedProducts.length})
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center font-black uppercase">Loading Catalog...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
