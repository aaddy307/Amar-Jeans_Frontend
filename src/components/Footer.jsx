"use client";

import Link from "next/link";
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useState } from "react";

export default function Footer() {
  const { data: settings } = trpc.commerce.settings.get.useQuery();
  const subscribeMutation = trpc.commerce.newsletter.subscribe.useMutation({
    onSuccess: (data) => { toast.success(data.message); setEmail(""); setPhone(""); },
    onError: (err) => toast.error(err.message)
  });
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <footer style={{ background: "#0a0a0a", color: "#fff", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      {/* Newsletter Strip */}
      <div style={{ background: "linear-gradient(90deg, #dc2626 0%, #991b1b 100%)", padding: "40px 24px" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
          <div>
            <p style={{ fontSize: "0.65rem", fontWeight: 900, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", marginBottom: 6 }}>
              Amar Jeans Insider
            </p>
            <h3 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.03em", lineHeight: 1, color: "#fff" }}>
              JOIN THE CLUB
            </h3>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(255,255,255,0.75)", marginTop: 6, letterSpacing: "0.06em" }}>
              Get early access to drops, exclusive offers & bulk deals
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Your email address"
              style={{
                background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)",
                color: "#fff", padding: "12px 16px", fontSize: "0.8rem", fontWeight: 700,
                outline: "none", minWidth: 220, backdropFilter: "blur(8px)"
              }}
            />
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="Phone (optional)"
              style={{
                background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)",
                color: "#fff", padding: "12px 16px", fontSize: "0.8rem", fontWeight: 700,
                outline: "none", minWidth: 160, backdropFilter: "blur(8px)"
              }}
            />
            <button
              onClick={() => { if (email) subscribeMutation.mutate({ email, phone }); else toast.error("Enter your email"); }}
              disabled={subscribeMutation.isPending}
              style={{
                background: "#fff", color: "#dc2626", border: "none", cursor: "pointer",
                fontWeight: 900, fontSize: "0.72rem", letterSpacing: "0.2em", textTransform: "uppercase",
                padding: "12px 24px", display: "flex", alignItems: "center", gap: 8,
                transition: "all 0.2s", whiteSpace: "nowrap"
              }}
            >
              {subscribeMutation.isPending ? "Subscribing..." : (<>Subscribe <ArrowRight style={{ width: 14, height: 14 }} /></>)}
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "64px 24px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 48 }}>

          {/* Brand Column */}
          <div style={{ gridColumn: "span 1" }}>
            <Link href="/">
              <img src="/image.png" alt="AMAR JEANS" style={{ height: 44, objectFit: "contain", marginBottom: 20, filter: "brightness(0) invert(1)", cursor: "pointer" }} />
            </Link>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, lineHeight: 1.8, color: "rgba(255,255,255,0.55)", letterSpacing: "0.04em", maxWidth: 260, marginBottom: 20 }}>
              Factory-direct premium denim from Ambernath, Maharashtra. Since 1995, delivering craftsmanship without middlemen.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              {[
                { icon: <Instagram style={{ width: 16, height: 16 }} />, href: settings?.instagramUrl || "https://www.instagram.com/amarjeans990/" },
                { icon: <Facebook style={{ width: 16, height: 16 }} />, href: "#" },
                { icon: <Twitter style={{ width: 16, height: 16 }} />, href: "#" },
              ].map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noreferrer"
                  style={{
                    width: 36, height: 36, border: "1px solid rgba(255,255,255,0.12)", display: "flex",
                    alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.5)",
                    transition: "all 0.2s", textDecoration: "none"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#dc2626"; e.currentTarget.style.color = "#dc2626"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 style={{ fontSize: "0.72rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.25em", color: "#fff", marginBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 12 }}>
              Shop Denim
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "All Products", href: "/products" },
                { label: "Men's Jeans", href: "/products?gender=men" },
                { label: "Women's Jeans", href: "/products?gender=women" },
                { label: "New Arrivals", href: "/products?isNew=true" },
                { label: "Bestsellers", href: "/products?isBestseller=true" },
                { label: "Slim Fit", href: "/products?cat=slim-fit-jeans" },
                { label: "Cargo Jeans", href: "/products?cat=cargo-jeans" },
                { label: "Denim Jackets", href: "/products?cat=denim-jackets" },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.5)", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info Column */}
          <div>
            <h4 style={{ fontSize: "0.72rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.25em", color: "#fff", marginBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 12 }}>
              Information
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Contact & Enquiry", href: "/contact" },
                { label: "Bulk Orders", href: "/contact" },
                { label: "Blog & Guides", href: "/blog" },
                { label: "View Cart", href: "/cart" },
                { label: "Admin Login", href: "/signin" },
              ].map(l => (
                <li key={l.label}>
                  <Link href={l.href} style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.5)", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 style={{ fontSize: "0.72rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.25em", color: "#fff", marginBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 12 }}>
              Contact Us
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <MapPin style={{ width: 14, height: 14, color: "#dc2626", flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, letterSpacing: "0.04em" }}>
                  {settings?.storeAddress || "opp new fire brigade, Chinchpada, Ambernath (W), 421501"}
                </p>
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <Phone style={{ width: 14, height: 14, color: "#dc2626", flexShrink: 0 }} />
                <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.04em" }}>
                  {settings?.supportPhone || "+91 9834557990 / +91 8149987987"}
                </p>
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <Mail style={{ width: 14, height: 14, color: "#dc2626", flexShrink: 0 }} />
                <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.04em" }}>
                  {settings?.supportEmail || "contact@amarjeans.com"}
                </p>
              </div>
            </div>

            {/* Trust badges */}
            <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {["Factory Direct", "Since 1995", "Pan-India Ship", "Bulk Welcome"].map(b => (
                <div key={b} style={{
                  border: "1px solid rgba(220,38,38,0.2)", padding: "8px 10px",
                  background: "rgba(220,38,38,0.05)"
                }}>
                  <p style={{ fontSize: "0.58rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)", margin: 0 }}>{b}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "20px 24px" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <p style={{ fontSize: "0.62rem", fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.15em" }}>
            © {new Date().getFullYear()} AMAR JEANS. All Rights Reserved. Factory-direct from Ambernath, Maharashtra.
          </p>
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacy Policy", "Terms of Service", "Shipping Policy"].map(t => (
              <span key={t} style={{ fontSize: "0.62rem", fontWeight: 700, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.1em", cursor: "default" }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
