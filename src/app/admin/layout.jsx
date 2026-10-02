"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { 
  BarChart3, 
  ShoppingBag, 
  Activity, 
  Settings, 
  Shield, 
  Tags, 
  PackagePlus, 
  LogOut, 
  MessageSquare, 
  ExternalLink,
  ChevronRight, 
  Zap, 
  Menu, 
  X, 
  Store,
  User as UserIcon
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const navGroups = [
  {
    title: "Overview",
    items: [
      { href: "/admin", icon: BarChart3, label: "Dashboard" },
    ]
  },
  {
    title: "Catalog & Sales",
    items: [
      { href: "/admin/products",   icon: PackagePlus,  label: "Products" },
      { href: "/admin/categories", icon: Tags,         label: "Categories" },
      { href: "/admin/orders",     icon: ShoppingBag,  label: "Orders & Enquiries" },
      { href: "/admin/reviews",    icon: MessageSquare,label: "Reviews" },
    ]
  },
  {
    title: "Configuration",
    items: [
      { href: "/admin/settings", icon: Settings, label: "Store Settings" },
      { href: "/admin/logs",     icon: Activity, label: "Audit Logs" },
    ]
  }
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: user, isLoading } = trpc.auth.me.useQuery();
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => { 
      toast.success("Signed out successfully"); 
      router.push("/signin"); 
    }
  });

  /* ── Loading ── */
  if (isLoading) return (
    <div style={{ minHeight: "100vh", background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        style={{ width: 44, height: 44, border: "3px solid #e4e4e7", borderTopColor: "#dc2626", borderRadius: "50%" }} />
    </div>
  );

  /* ── Not admin ── */
  if (!user || user.role !== "admin") return (
    <div style={{ minHeight: "100vh", background: "#ffffff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, fontFamily: "'Outfit', sans-serif" }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: "center", maxWidth: 440 }}>
        <div style={{ width: 68, height: 68, background: "#fef2f2", border: "2px solid #dc2626", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <Shield style={{ width: 32, height: 32, color: "#dc2626" }} />
        </div>
        <h2 style={{ fontSize: "2rem", fontWeight: 900, color: "#000000", textTransform: "uppercase", letterSpacing: "-0.03em", marginBottom: 8 }}>
          Restricted Area
        </h2>
        <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#71717a", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 28 }}>
          Administrator privileges required to access this console
        </p>
        <Link href="/signin">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            style={{ width: "100%", background: "#dc2626", color: "#ffffff", fontWeight: 900, fontSize: "0.8rem", letterSpacing: "0.2em", textTransform: "uppercase", padding: "16px 32px", border: "2px solid #dc2626", cursor: "pointer" }}>
            Authenticate at Sign In
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );

  // Find active item name for breadcrumb/topbar
  let currentLabel = "Dashboard";
  for (const group of navGroups) {
    const found = group.items.find(item => item.href === pathname);
    if (found) {
      currentLabel = found.label;
      break;
    }
  }

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "A";

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f8fafc", fontFamily: "'Outfit', sans-serif", overflow: "hidden" }}>

      {/* ── MOBILE TOGGLE BUTTON ── */}
      <button 
        onClick={() => setMobileOpen(!mobileOpen)}
        style={{ display: "none", position: "fixed", top: 14, right: 16, zIndex: 100, background: "#000000", border: "1px solid #dc2626", cursor: "pointer", padding: 8, color: "#ffffff" }}
        className="lg-hidden-toggle"
      >
        {mobileOpen ? <X style={{ width: 20, height: 20 }} /> : <Menu style={{ width: 20, height: 20 }} />}
      </button>

      {/* ── SYSTEMATIC SIDEBAR ── */}
      <aside
        style={{
          position: "relative",
          zIndex: 20,
          width: 280,
          minWidth: 280,
          background: "#ffffff",
          borderRight: "2px solid #000000",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          boxSizing: "border-box"
        }}
      >
        {/* Top Branding Section */}
        <div style={{ padding: "20px 24px", borderBottom: "2px solid #000000", background: "#ffffff" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 4, height: 28, background: "#dc2626" }} />
              <div>
                <span style={{ fontSize: "1.25rem", fontWeight: 900, color: "#000000", letterSpacing: "-0.03em", textTransform: "uppercase", display: "block", lineHeight: 1 }}>
                  AMAR JEANS
                </span>
                <span style={{ fontSize: "0.58rem", fontWeight: 800, color: "#dc2626", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                  ADMIN CONTROL PANEL
                </span>
              </div>
            </div>

            <span style={{ background: "#000000", color: "#ffffff", fontSize: "0.55rem", fontWeight: 900, padding: "3px 7px", letterSpacing: "0.15em", textTransform: "uppercase" }}>
              v2.0
            </span>
          </div>

          {/* User Account Card */}
          <div style={{
            background: "#f8fafc",
            border: "1.5px solid #000000",
            padding: "10px 12px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            boxShadow: "2px 2px 0px #000000"
          }}>
            <div style={{
              width: 34,
              height: 34,
              background: "#000000",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: "0.85rem",
              flexShrink: 0
            }}>
              {userInitial}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <p style={{ fontSize: "0.78rem", fontWeight: 900, color: "#000000", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textTransform: "uppercase" }}>
                  {user.name}
                </p>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} title="Live" />
              </div>
              <p style={{ fontSize: "0.62rem", fontWeight: 600, color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Section (Grouped Systematically) */}
        <nav style={{ flex: 1, overflowY: "auto", padding: "16px 16px", display: "flex", flexDirection: "column", gap: 18 }}>
          {navGroups.map((group, gIdx) => (
            <div key={gIdx}>
              <p style={{
                fontSize: "0.6rem",
                fontWeight: 900,
                color: "#94a3b8",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                padding: "0 8px",
                marginBottom: 6
              }}>
                {group.title}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {group.items.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px 12px",
                          cursor: "pointer",
                          background: isActive ? "#000000" : "transparent",
                          color: isActive ? "#ffffff" : "#0f172a",
                          border: isActive ? "1.5px solid #000000" : "1.5px solid transparent",
                          borderLeft: isActive ? "4px solid #dc2626" : "1.5px solid transparent",
                          boxShadow: isActive ? "2px 2px 0px rgba(0,0,0,0.15)" : "none",
                          transition: "all 0.15s"
                        }}
                        onMouseEnter={e => {
                          if (!isActive) {
                            e.currentTarget.style.background = "#f1f5f9";
                            e.currentTarget.style.borderColor = "#e2e8f0";
                          }
                        }}
                        onMouseLeave={e => {
                          if (!isActive) {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.borderColor = "transparent";
                          }
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <link.icon style={{
                            width: 17,
                            height: 17,
                            color: isActive ? "#dc2626" : "#64748b",
                            flexShrink: 0
                          }} />
                          <span style={{
                            fontSize: "0.8rem",
                            fontWeight: isActive ? 900 : 800,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em"
                          }}>
                            {link.label}
                          </span>
                        </div>

                        {isActive && (
                          <ChevronRight style={{ width: 14, height: 14, color: "#dc2626" }} />
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer Actions (Storefront & Signout side by side or cleanly stacked) */}
        <div style={{
          padding: "16px",
          borderTop: "2px solid #000000",
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          gap: 8
        }}>
          {/* Storefront Button */}
          <Link href="/" target="_blank">
            <button
              type="button"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "9px 12px",
                background: "#f8fafc",
                border: "1.5px solid #000000",
                cursor: "pointer",
                color: "#000000",
                fontWeight: 900,
                fontSize: "0.72rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                transition: "all 0.15s"
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#000000"; e.currentTarget.style.color = "#ffffff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.color = "#000000"; }}
            >
              <Store style={{ width: 14, height: 14 }} /> View Storefront <ExternalLink style={{ width: 12, height: 12 }} />
            </button>
          </Link>

          {/* Sign Out Button */}
          <button
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "9px 12px",
              background: "#fef2f2",
              border: "1.5px solid #dc2626",
              cursor: "pointer",
              color: "#dc2626",
              fontWeight: 900,
              fontSize: "0.72rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              transition: "all 0.15s"
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#dc2626"; e.currentTarget.style.color = "#ffffff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.color = "#dc2626"; }}
          >
            <LogOut style={{ width: 14, height: 14 }} />
            {logoutMutation.isPending ? "Signing Out..." : "Sign Out"}
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#f8fafc" }}>

        {/* Top Header Bar */}
        <div style={{
          height: 60,
          background: "#ffffff",
          borderBottom: "2px solid #000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px",
          flexShrink: 0
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 4, height: 18, background: "#dc2626" }} />
            <span style={{ fontSize: "0.9rem", fontWeight: 900, color: "#000000", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              {currentLabel}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#f1f5f9", padding: "4px 10px", border: "1px solid #000000" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
              <span style={{ fontSize: "0.62rem", fontWeight: 900, color: "#000000", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                ONLINE
              </span>
            </div>
            <div style={{ width: 1, height: 20, background: "#e2e8f0" }} />
            <span style={{ fontSize: "0.75rem", fontWeight: 900, color: "#000000", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {user.name}
            </span>
          </div>
        </div>

        {/* Page Content */}
        <main style={{ flex: 1, overflowY: "auto", padding: "32px 32px" }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .lg-hidden-toggle { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
