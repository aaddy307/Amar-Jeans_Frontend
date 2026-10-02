"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Plus, Trash2, Layers } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function AdminCategoriesPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState("");

  const utils = trpc.useUtils();
  const { data: categories = [], isLoading } = trpc.commerce.categories.list.useQuery();

  const createCategoryMutation = trpc.admin.createCategory.useMutation({
    onSuccess: () => {
      toast.success("Category created successfully!");
      setName("");
      setSlug("");
      setImage("");
      utils.commerce.categories.list.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteCategoryMutation = trpc.admin.deleteCategory.useMutation({
    onSuccess: () => {
      toast.success("Category removed");
      utils.commerce.categories.list.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !slug) return;
    createCategoryMutation.mutate({ name, slug: slug.toLowerCase(), image: image || undefined });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, fontFamily: "'Outfit', sans-serif" }}>
      
      {/* ── HEADER ── */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        paddingBottom: 20,
        borderBottom: "2px solid #000000"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <div style={{ width: 4, height: 24, background: "#dc2626" }} />
            <h1 style={{ fontSize: "1.8rem", fontWeight: 900, color: "#000000", textTransform: "uppercase", letterSpacing: "-0.03em" }}>
              Denim Collections & Categories
            </h1>
          </div>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Organize catalog lines, fits, and special drops
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
        
        {/* ── CREATE FORM PANEL ── */}
        <div style={{
          background: "#ffffff",
          border: "2px solid #000000",
          padding: "26px",
          height: "fit-content",
          boxShadow: "4px 4px 0px #000000"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, borderBottom: "2px solid #000000", paddingBottom: 12 }}>
            <Plus style={{ width: 18, height: 18, color: "#dc2626" }} />
            <h2 style={{ fontSize: "1.1rem", fontWeight: 900, color: "#000000", textTransform: "uppercase", letterSpacing: "-0.02em" }}>
              New Category Line
            </h2>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: "0.65rem", fontWeight: 900, color: "#000000", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 6 }}>
                Category Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!slug) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                }}
                placeholder="e.g. Slim Fit Jeans"
                required
                style={{
                  width: "100%",
                  background: "#ffffff",
                  border: "2px solid #000000",
                  padding: "12px 16px",
                  color: "#000000",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  outline: "none",
                  fontFamily: "'Outfit', sans-serif"
                }}
                onFocus={e => e.target.style.borderColor = "#dc2626"}
                onBlur={e => e.target.style.borderColor = "#000000"}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.65rem", fontWeight: 900, color: "#000000", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 6 }}>
                Slug (URL Identifier) *
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="slim-fit-jeans"
                required
                style={{
                  width: "100%",
                  background: "#ffffff",
                  border: "2px solid #000000",
                  padding: "12px 16px",
                  color: "#000000",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  outline: "none",
                  fontFamily: "'Outfit', sans-serif"
                }}
                onFocus={e => e.target.style.borderColor = "#dc2626"}
                onBlur={e => e.target.style.borderColor = "#000000"}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.65rem", fontWeight: 900, color: "#000000", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 6 }}>
                Cover Image URL (Optional)
              </label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                style={{
                  width: "100%",
                  background: "#ffffff",
                  border: "2px solid #000000",
                  padding: "12px 16px",
                  color: "#000000",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  outline: "none",
                  fontFamily: "'Outfit', sans-serif"
                }}
                onFocus={e => e.target.style.borderColor = "#dc2626"}
                onBlur={e => e.target.style.borderColor = "#000000"}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={createCategoryMutation.isPending}
              style={{
                background: "#dc2626",
                color: "#ffffff",
                border: "2px solid #000000",
                padding: "14px 20px",
                fontWeight: 900,
                fontSize: "0.75rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                cursor: "pointer",
                marginTop: 6,
                boxShadow: "3px 3px 0px #000000"
              }}
            >
              {createCategoryMutation.isPending ? "Saving..." : "Create Category"}
            </motion.button>
          </form>
        </div>

        {/* ── EXISTING CATEGORIES ── */}
        <div style={{
          background: "#ffffff",
          border: "2px solid #000000",
          boxShadow: "4px 4px 0px #000000",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            borderBottom: "2px solid #000000",
            background: "#f8fafc",
            fontSize: "0.65rem",
            fontWeight: 900,
            color: "#000000",
            letterSpacing: "0.2em",
            textTransform: "uppercase"
          }}>
            <span>Active Categories ({categories.length})</span>
            <span>Controls</span>
          </div>

          {isLoading ? (
            <div style={{ padding: "48px 0", textAlign: "center", color: "#94a3b8", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>
              Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <div style={{ padding: "48px 0", textAlign: "center", color: "#94a3b8", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>
              No categories configured yet.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {categories.map((cat, idx) => (
                <div
                  key={cat.id || cat._id || idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 20px",
                    borderBottom: "1px solid #e2e8f0"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 42, height: 42, background: "#f1f5f9", border: "1px solid #000000", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {cat.image ? (
                        <img src={cat.image} alt={cat.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <Layers style={{ width: 18, height: 18, color: "#94a3b8" }} />
                      )}
                    </div>
                    <div>
                      <h4 style={{ fontSize: "0.9rem", fontWeight: 900, color: "#000000", textTransform: "uppercase" }}>
                        {cat.name}
                      </h4>
                      <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#dc2626", letterSpacing: "0.1em" }}>
                        /{cat.slug}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(`Delete category line "${cat.name}"?`)) deleteCategoryMutation.mutate({ categoryId: cat.id || cat._id });
                    }}
                    style={{
                      background: "#fee2e2",
                      border: "1px solid #dc2626",
                      color: "#dc2626",
                      padding: "6px 12px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: "0.65rem",
                      fontWeight: 900,
                      textTransform: "uppercase"
                    }}
                  >
                    <Trash2 style={{ width: 13, height: 13 }} /> Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
