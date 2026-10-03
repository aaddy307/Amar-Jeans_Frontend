"use client";

import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Search, Filter, ChevronLeft, ChevronRight, Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function AdminOrdersPage() {
  const utils = trpc.useUtils();
  const { data: orders = [], isLoading, isError, error, refetch } = trpc.admin.getOrders.useQuery(undefined, {
    retry: 1,
    retryDelay: 1500,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const updateStatusMutation = trpc.admin.updateOrderStatus.useMutation({
    onSuccess: () => {
      toast.success("Order status updated!");
      utils.admin.getOrders.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchLow = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm ||
                            order.orderNumber?.toLowerCase().includes(searchLow) ||
                            order.customerName?.toLowerCase().includes(searchLow) ||
                            order.customerEmail?.toLowerCase().includes(searchLow) ||
                            order.customerPhone?.toLowerCase().includes(searchLow);
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const matchesType = typeFilter === "all" || order.orderType === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [orders, searchTerm, statusFilter, typeFilter]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusStyle = (st) => {
    switch (st) {
      case "delivered": return { bg: "#dcfce7", border: "#16a34a", text: "#16a34a" };
      case "shipped": return { bg: "#cffafe", border: "#0891b2", text: "#0891b2" };
      case "confirmed": return { bg: "#dbeafe", border: "#2563eb", text: "#2563eb" };
      case "cancelled": return { bg: "#fee2e2", border: "#dc2626", text: "#dc2626" };
      default: return { bg: "#fef3c7", border: "#d97706", text: "#d97706" };
    }
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
              Customer Orders & Inquiries
            </h1>
          </div>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Real-time direct orders, enquiry status, and WhatsApp communications
          </p>
        </div>
      </div>

      {/* ── SEARCH & FILTERS ── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
        <div style={{ position: "relative", flex: 1, minWidth: 260 }}>
          <Search style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#94a3b8" }} />
          <input
            type="text"
            placeholder="Search by Order #, Name, Phone, Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              background: "#ffffff",
              border: "2px solid #000000",
              padding: "12px 16px 12px 44px",
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

        <div style={{ position: "relative", width: 200 }}>
          <Filter style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: "#94a3b8" }} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              width: "100%",
              background: "#ffffff",
              border: "2px solid #000000",
              padding: "12px 16px 12px 40px",
              color: "#000000",
              fontWeight: 700,
              fontSize: "0.8rem",
              outline: "none",
              cursor: "pointer",
              fontFamily: "'Outfit', sans-serif"
            }}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* ── ORDERS CARDS ── */}
      {isLoading ? (
        <div style={{ padding: "64px 0", textAlign: "center", color: "#94a3b8", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid #e2e8f0", borderTopColor: "#dc2626", animation: "spin 0.8s linear infinite" }} />
          Loading orders and customer inquiries…
          <span style={{ fontSize: "0.65rem", color: "#94a3b8" }}>Backend may be cold-starting, please wait ~15 seconds</span>
        </div>
      ) : isError ? (
        <div style={{ padding: "64px 24px", textAlign: "center", border: "2px solid #fca5a5", background: "#fff7f7" }}>
          <p style={{ fontSize: "0.9rem", fontWeight: 900, color: "#dc2626", textTransform: "uppercase", marginBottom: 8 }}>Failed to Load Orders</p>
          <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", marginBottom: 20 }}>
            {error?.message || "Cannot reach server. Check your connection or try again."}
          </p>
          <button
            onClick={() => refetch()}
            style={{ background: "#dc2626", color: "#ffffff", border: "none", padding: "10px 24px", fontWeight: 900, fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer" }}
          >
            Retry
          </button>
        </div>
      ) : paginatedOrders.length === 0 ? (
        <div style={{ padding: "64px 0", textAlign: "center", background: "#ffffff", border: "2px solid #000000", color: "#94a3b8", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>
          No orders or customer enquiries found.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {paginatedOrders.map(order => {
            const sc = getStatusStyle(order.status);
            const cleanPhone = order.customerPhone ? order.customerPhone.replace(/[^0-9]/g, '') : '';
            const waPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;

            return (
              <div
                key={order._id || order.id}
                style={{
                  background: "#ffffff",
                  border: "2px solid #000000",
                  padding: "22px 26px",
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  gap: 20,
                  boxShadow: "3px 3px 0px #000000"
                }}
              >
                <div style={{ flex: 1, minWidth: 280, display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <span style={{ fontSize: "1.1rem", fontWeight: 900, color: "#000000", letterSpacing: "-0.02em" }}>
                      {order.orderNumber}
                    </span>
                    <span style={{ background: "#fef2f2", border: "1px solid #dc2626", color: "#dc2626", fontSize: "0.6rem", fontWeight: 900, textTransform: "uppercase", padding: "2px 8px" }}>
                      {order.orderType || "Customer Enquiry"}
                    </span>
                    <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#64748b" }}>
                      <Clock style={{ width: 12, height: 12, display: "inline", marginRight: 4 }} />
                      {new Date(order.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10, fontSize: "0.8rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#000000", fontWeight: 800 }}>
                      <span style={{ color: "#64748b", fontWeight: 700 }}>Client:</span>
                      <span>{order.customerName || "Guest Customer"}</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#000000", fontWeight: 800 }}>
                      <Phone style={{ width: 14, height: 14, color: "#dc2626" }} />
                      <span>{order.customerPhone || "N/A"}</span>
                      {cleanPhone && (
                        <a
                          href={`https://wa.me/${waPhone}?text=Hi%20${encodeURIComponent(order.customerName || 'there')},%20regarding%20your%20Amar%20Jeans%20order%20${order.orderNumber}...`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ marginLeft: 6, background: "#dcfce7", border: "1px solid #16a34a", color: "#16a34a", padding: "2px 8px", fontSize: "0.6rem", fontWeight: 900, display: "inline-flex", alignItems: "center", gap: 4, textDecoration: "none" }}
                        >
                          <MessageCircle style={{ width: 11, height: 11 }} /> WhatsApp
                        </a>
                      )}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#000000", fontWeight: 800 }}>
                      <Mail style={{ width: 14, height: 14, color: "#dc2626" }} />
                      <span>{order.customerEmail || "N/A"}</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#000000", fontWeight: 800 }}>
                      <MapPin style={{ width: 14, height: 14, color: "#dc2626" }} />
                      <span style={{ fontSize: "0.75rem", color: "#334155" }}>
                        {order.shippingAddress ? `${order.shippingAddress}, ${order.city || ""} - ${order.pincode || ""}` : "In-store inquiry"}
                      </span>
                    </div>
                  </div>

                  {order.notes && (
                    <div style={{ background: "#f8fafc", borderLeft: "3px solid #dc2626", padding: "10px 14px", borderTop: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" }}>
                      <span style={{ display: "block", fontSize: "0.62rem", fontWeight: 900, color: "#dc2626", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 2 }}>
                        Customer Order Items & Requirements:
                      </span>
                      <p style={{ fontSize: "0.78rem", color: "#000000", fontWeight: 700, lineHeight: 1.5 }}>
                        {order.notes}
                      </p>
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "space-between", gap: 14, borderLeft: "2px solid #000000", paddingLeft: 20 }}>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ display: "block", fontSize: "0.62rem", fontWeight: 900, color: "#64748b", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                      Total Valuation
                    </span>
                    <span style={{ fontSize: "1.5rem", fontWeight: 900, color: "#000000" }}>
                      ₹{order.totalPrice || "0"}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: "0.65rem", fontWeight: 900, color: "#000000", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                      Status:
                    </span>
                    <select
                      value={order.status}
                      onChange={(e) => updateStatusMutation.mutate({ orderId: order._id || order.id, status: e.target.value })}
                      style={{
                        background: sc.bg,
                        border: `1px solid ${sc.border}`,
                        color: sc.text,
                        padding: "6px 12px",
                        fontSize: "0.72rem",
                        fontWeight: 900,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        outline: "none"
                      }}
                    >
                      <option value="pending">PENDING</option>
                      <option value="confirmed">CONFIRMED</option>
                      <option value="shipped">SHIPPED</option>
                      <option value="delivered">DELIVERED</option>
                      <option value="cancelled">CANCELLED</option>
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── PAGINATION ── */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16, marginTop: 12 }}>
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            style={{ background: "#ffffff", border: "2px solid #000000", color: "#000000", padding: "6px 10px", cursor: "pointer" }}
          >
            <ChevronLeft style={{ width: 16, height: 16 }} />
          </button>
          <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#000000", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            PAGE {currentPage} OF {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            style={{ background: "#ffffff", border: "2px solid #000000", color: "#000000", padding: "6px 10px", cursor: "pointer" }}
          >
            <ChevronRight style={{ width: 16, height: 16 }} />
          </button>
        </div>
      )}

    </div>
  );
}
