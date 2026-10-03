"use client";

import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { ShoppingBag, IndianRupee, Users, Package, ArrowUpRight, TrendingUp, Zap, Clock } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const { data: stats, isLoading, isError, error, refetch } = trpc.admin.getDashboard.useQuery(undefined, {
    retry: 1,
    retryDelay: 1500,
  });

  if (isLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ height: 40, width: 240, background: "#e2e8f0", borderRadius: 2, animation: "pulse 1.5s ease-in-out infinite" }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ height: 130, background: "#f1f5f9", border: "2px solid #e2e8f0", animation: "pulse 1.5s ease-in-out infinite" }} />
          ))}
        </div>
        <p style={{ textAlign: "center", fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 8 }}>
          Connecting to server — this may take ~15 seconds if backend is cold-starting…
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ textAlign: "center", padding: "80px 24px", border: "2px solid #fca5a5", background: "#fff7f7" }}>
        <p style={{ fontSize: "1rem", fontWeight: 900, color: "#dc2626", textTransform: "uppercase", letterSpacing: "-0.01em", marginBottom: 8 }}>Failed to Load Dashboard</p>
        <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", marginBottom: 24 }}>
          {error?.message || "Cannot reach server. Your session may have expired or the backend is offline."}
        </p>
        <button
          onClick={() => refetch()}
          style={{ background: "#dc2626", color: "#ffffff", border: "none", padding: "12px 28px", fontWeight: 900, fontSize: "0.78rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}
        >
          Retry
        </button>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Orders & Enquiries",
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      color: "#dc2626",
      sub: "+12% this week"
    },
    {
      title: "Estimated Revenue",
      value: stats?.totalRevenue ? `₹${stats.totalRevenue.toLocaleString()}` : "₹0",
      icon: IndianRupee,
      color: "#000000",
      sub: "Verified valuations"
    },
    {
      title: "Registered Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "#000000",
      sub: "Active accounts"
    },
    {
      title: "Catalog Products",
      value: stats?.totalProducts || 0,
      icon: Package,
      color: "#dc2626",
      sub: "Active in stock"
    }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, fontFamily: "'Outfit', sans-serif" }}>

      {/* ── TOP HERO BANNER ── */}
      <div style={{
        background: "#ffffff",
        border: "2px solid #000000",
        padding: "26px 30px",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 20,
        boxShadow: "4px 4px 0px #000000"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ background: "#dc2626", color: "#ffffff", padding: "2px 8px", fontSize: "0.62rem", fontWeight: 900, letterSpacing: "0.2em", textTransform: "uppercase" }}>
              LIVE METRICS
            </span>
            <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#64748b", letterSpacing: "0.15em", textTransform: "uppercase" }}>
              Executive Overview
            </span>
          </div>
          <h1 style={{ fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)", fontWeight: 900, color: "#000000", textTransform: "uppercase", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            AMAR JEANS Command Center
          </h1>
          <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 4 }}>
            Monitor real-time customer leads, catalog items, and order volume
          </p>
        </div>

        <Link href="/admin/products">
          <motion.button whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
            style={{ background: "#dc2626", color: "#ffffff", border: "2px solid #000000", padding: "14px 26px", fontWeight: 900, fontSize: "0.75rem", letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "2px 2px 0px #000000" }}>
            + Add Product <ArrowUpRight style={{ width: 16, height: 16 }} />
          </motion.button>
        </Link>
      </div>

      {/* ── METRICS GRID ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
        {statCards.map((c, i) => (
          <div
            key={i}
            style={{
              background: "#ffffff",
              border: "2px solid #000000",
              borderTop: `4px solid ${c.color === "#dc2626" ? "#dc2626" : "#000000"}`,
              padding: "22px 24px",
              boxShadow: "3px 3px 0px #000000"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ fontSize: "0.68rem", fontWeight: 900, color: "#64748b", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                {c.title}
              </span>
              <div style={{ width: 34, height: 34, background: c.color === "#dc2626" ? "#fef2f2" : "#f1f5f9", border: "1px solid #000000", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <c.icon style={{ width: 16, height: 16, color: c.color }} />
              </div>
            </div>

            <div style={{ fontSize: "2.2rem", fontWeight: 900, color: c.color === "#dc2626" ? "#dc2626" : "#000000", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 8 }}>
              {c.value}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.65rem", fontWeight: 800, color: "#64748b", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              <TrendingUp style={{ width: 12, height: 12, color: "#dc2626" }} />
              <span>{c.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── RECENT ORDERS / ENQUIRIES TABLE ── */}
      <div style={{
        background: "#ffffff",
        border: "2px solid #000000",
        padding: "26px",
        boxShadow: "4px 4px 0px #000000"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, borderBottom: "2px solid #000000", paddingBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 4, height: 22, background: "#dc2626" }} />
            <div>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 900, color: "#000000", textTransform: "uppercase", letterSpacing: "-0.02em" }}>
                Recent Customer Orders & Inquiries
              </h2>
              <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#64748b", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                Direct customer leads & purchases
              </span>
            </div>
          </div>

          <Link href="/admin/orders">
            <button style={{ background: "#ffffff", border: "1px solid #000000", color: "#000000", fontWeight: 900, fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", padding: "8px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              View All <ArrowUpRight style={{ width: 14, height: 14, color: "#dc2626" }} />
            </button>
          </Link>
        </div>

        {stats?.recentOrders?.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#94a3b8" }}>
            <Clock style={{ width: 32, height: 32, color: "#cbd5e1", margin: "0 auto 10px" }} />
            <p style={{ fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase" }}>
              No recent customer inquiries recorded yet
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #000000", fontSize: "0.65rem", fontWeight: 900, color: "#000000", letterSpacing: "0.2em", textTransform: "uppercase", background: "#f8fafc" }}>
                  <th style={{ padding: "12px 16px" }}>Order Ref</th>
                  <th style={{ padding: "12px 16px" }}>Type</th>
                  <th style={{ padding: "12px 16px" }}>Customer</th>
                  <th style={{ padding: "12px 16px" }}>Phone</th>
                  <th style={{ padding: "12px 16px" }}>Valuation</th>
                  <th style={{ padding: "12px 16px", textAlign: "right" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentOrders?.map((order, idx) => {
                  const isDelivered = order.status === "delivered";
                  const isConfirmed = order.status === "confirmed";
                  const isCancelled = order.status === "cancelled";
                  const statusBg = isDelivered ? "#dcfce7" : isConfirmed ? "#dbeafe" : isCancelled ? "#fee2e2" : "#fef3c7";
                  const statusText = isDelivered ? "#16a34a" : isConfirmed ? "#2563eb" : isCancelled ? "#dc2626" : "#d97706";

                  return (
                    <tr key={order.id || order._id || idx}
                      style={{ borderBottom: "1px solid #e2e8f0", fontSize: "0.8rem", fontWeight: 700, color: "#0f172a" }}>
                      <td style={{ padding: "14px 16px", fontWeight: 900, color: "#dc2626" }}>
                        {order.orderNumber}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ background: "#f1f5f9", border: "1px solid #cbd5e1", color: "#000000", fontSize: "0.6rem", fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", padding: "3px 8px" }}>
                          {order.orderType || "Enquiry"}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", fontWeight: 900 }}>
                        {order.customerName || "Guest Client"}
                      </td>
                      <td style={{ padding: "14px 16px", color: "#475569" }}>
                        {order.customerPhone || "—"}
                      </td>
                      <td style={{ padding: "14px 16px", fontWeight: 900, color: "#000000" }}>
                        ₹{order.totalPrice || "0"}
                      </td>
                      <td style={{ padding: "14px 16px", textAlign: "right" }}>
                        <span style={{
                          background: statusBg,
                          border: `1px solid ${statusText}40`,
                          color: statusText,
                          fontSize: "0.62rem",
                          fontWeight: 900,
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                          padding: "4px 10px"
                        }}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
