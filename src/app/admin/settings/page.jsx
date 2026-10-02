"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function AdminSettingsPage() {
  const utils = trpc.useUtils();
  const { data: settings, isLoading } = trpc.admin.getSettings.useQuery();
  
  const [formData, setFormData] = useState({
    storeName: "",
    supportEmail: "",
    supportPhone: "",
    storeAddress: "",
    instagramUrl: "",
    whatsappNumber: ""
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        storeName: settings.storeName || "AMAR JEANS",
        supportEmail: settings.supportEmail || "contact@amarjeans.com",
        supportPhone: settings.supportPhone || "+91 9834557990 / +91 8149987987",
        storeAddress: settings.storeAddress || "opp new fire brigade Chinchpada nalambi road amb (w)\nchnchpad rood new fire brigade opp titwala road ambernath w, Ambarnath 421501",
        instagramUrl: settings.instagramUrl || "https://www.instagram.com/amarjeans990/",
        whatsappNumber: settings.whatsappNumber || "919834557990"
      });
    }
  }, [settings]);

  const updateMutation = trpc.admin.updateSettings.useMutation({
    onSuccess: () => {
      toast.success("Store configuration updated successfully!");
      utils.admin.getSettings.invalidate();
      utils.commerce.settings.get.invalidate();
    },
    onError: (err) => toast.error(err.message)
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div style={{ padding: "64px 0", textAlign: "center", color: "#94a3b8", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>
        Loading global settings...
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 860, fontFamily: "'Outfit', sans-serif" }}>
      
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
              Global Store Settings
            </h1>
          </div>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Configure store contact channels, addresses, and social connections
          </p>
        </div>
      </div>

      {/* ── FORM CONTAINER ── */}
      <div style={{
        background: "#ffffff",
        border: "2px solid #000000",
        padding: "32px",
        boxShadow: "4px 4px 0px #000000"
      }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          
          <div>
            <label style={{ display: "block", fontSize: "0.65rem", fontWeight: 900, color: "#000000", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 6 }}>
              Store Brand Name *
            </label>
            <input
              type="text"
              value={formData.storeName}
              onChange={e => setFormData({ ...formData, storeName: e.target.value })}
              required
              style={{
                width: "100%",
                background: "#ffffff",
                border: "2px solid #000000",
                padding: "12px 16px",
                color: "#000000",
                fontWeight: 700,
                fontSize: "0.9rem",
                outline: "none",
                fontFamily: "'Outfit', sans-serif"
              }}
              onFocus={e => e.target.style.borderColor = "#dc2626"}
              onBlur={e => e.target.style.borderColor = "#000000"}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: "0.65rem", fontWeight: 900, color: "#000000", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 6 }}>
                Support Email *
              </label>
              <input
                type="email"
                value={formData.supportEmail}
                onChange={e => setFormData({ ...formData, supportEmail: e.target.value })}
                required
                style={{
                  width: "100%",
                  background: "#ffffff",
                  border: "2px solid #000000",
                  padding: "12px 16px",
                  color: "#000000",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  outline: "none",
                  fontFamily: "'Outfit', sans-serif"
                }}
                onFocus={e => e.target.style.borderColor = "#dc2626"}
                onBlur={e => e.target.style.borderColor = "#000000"}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.65rem", fontWeight: 900, color: "#000000", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 6 }}>
                Support Phone Numbers *
              </label>
              <input
                type="text"
                value={formData.supportPhone}
                onChange={e => setFormData({ ...formData, supportPhone: e.target.value })}
                required
                style={{
                  width: "100%",
                  background: "#ffffff",
                  border: "2px solid #000000",
                  padding: "12px 16px",
                  color: "#000000",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  outline: "none",
                  fontFamily: "'Outfit', sans-serif"
                }}
                onFocus={e => e.target.style.borderColor = "#dc2626"}
                onBlur={e => e.target.style.borderColor = "#000000"}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.65rem", fontWeight: 900, color: "#000000", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 6 }}>
              Store Showroom Address *
            </label>
            <textarea
              value={formData.storeAddress}
              onChange={e => setFormData({ ...formData, storeAddress: e.target.value })}
              rows={3}
              required
              style={{
                width: "100%",
                background: "#ffffff",
                border: "2px solid #000000",
                padding: "12px 16px",
                color: "#000000",
                fontWeight: 600,
                fontSize: "0.85rem",
                outline: "none",
                fontFamily: "'Outfit', sans-serif",
                resize: "vertical"
              }}
              onFocus={e => e.target.style.borderColor = "#dc2626"}
              onBlur={e => e.target.style.borderColor = "#000000"}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: "0.65rem", fontWeight: 900, color: "#000000", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 6 }}>
                Instagram Profile Link
              </label>
              <input
                type="url"
                value={formData.instagramUrl}
                onChange={e => setFormData({ ...formData, instagramUrl: e.target.value })}
                style={{
                  width: "100%",
                  background: "#ffffff",
                  border: "2px solid #000000",
                  padding: "12px 16px",
                  color: "#000000",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  outline: "none",
                  fontFamily: "'Outfit', sans-serif"
                }}
                onFocus={e => e.target.style.borderColor = "#dc2626"}
                onBlur={e => e.target.style.borderColor = "#000000"}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.65rem", fontWeight: 900, color: "#000000", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 6 }}>
                Direct WhatsApp Hotline *
              </label>
              <input
                type="text"
                value={formData.whatsappNumber}
                onChange={e => setFormData({ ...formData, whatsappNumber: e.target.value })}
                required
                style={{
                  width: "100%",
                  background: "#ffffff",
                  border: "2px solid #000000",
                  padding: "12px 16px",
                  color: "#000000",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  outline: "none",
                  fontFamily: "'Outfit', sans-serif"
                }}
                onFocus={e => e.target.style.borderColor = "#dc2626"}
                onBlur={e => e.target.style.borderColor = "#000000"}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 16, borderTop: "2px solid #000000" }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={updateMutation.isPending}
              style={{
                background: "#dc2626",
                color: "#ffffff",
                border: "2px solid #000000",
                padding: "14px 32px",
                fontWeight: 900,
                fontSize: "0.75rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "3px 3px 0px #000000"
              }}
            >
              <Save style={{ width: 16, height: 16 }} />
              {updateMutation.isPending ? "Saving..." : "Save Settings"}
            </motion.button>
          </div>

        </form>
      </div>

    </div>
  );
}
