"use client";

import { trpc } from "@/lib/trpc";
import { Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function AdminReviewsPage() {
  const utils = trpc.useUtils();
  const { data: reviews = [], isLoading } = trpc.admin.getRecentReviews.useQuery();

  const deleteReviewMutation = trpc.admin.deleteReview.useMutation({
    onSuccess: () => {
      toast.success("Customer review deleted");
      utils.admin.getRecentReviews.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

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
              Customer Reviews & Feedback
            </h1>
          </div>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Total {reviews.length} Verified Reviews Recorded
          </p>
        </div>
      </div>

      {isLoading ? (
        <div style={{ padding: "64px 0", textAlign: "center", color: "#94a3b8", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>
          Loading customer reviews...
        </div>
      ) : reviews.length === 0 ? (
        <div style={{ padding: "64px 0", textAlign: "center", background: "#ffffff", border: "2px solid #000000", color: "#94a3b8", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>
          No customer reviews submitted yet.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 20 }}>
          {reviews.map((review) => (
            <div
              key={review._id}
              style={{
                background: "#ffffff",
                border: "2px solid #000000",
                padding: "22px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 14,
                boxShadow: "3px 3px 0px #000000"
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div>
                    <h4 style={{ fontSize: "0.95rem", fontWeight: 900, color: "#000000", textTransform: "uppercase" }}>
                      {review.authorName}
                    </h4>
                    <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#64748b" }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: 2 }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        style={{
                          width: 14,
                          height: 14,
                          color: star <= review.rating ? "#d97706" : "#e2e8f0",
                          fill: star <= review.rating ? "#d97706" : "none"
                        }}
                      />
                    ))}
                  </div>
                </div>

                <p style={{ fontSize: "0.82rem", color: "#334155", fontWeight: 600, lineHeight: 1.6, fontStyle: "italic", marginBottom: 12 }}>
                  "{review.comment}"
                </p>

                {review.product && (
                  <div style={{ background: "#fef2f2", border: "1px solid #fecaca", padding: "4px 8px", width: "fit-content" }}>
                    <span style={{ fontSize: "0.62rem", fontWeight: 900, color: "#dc2626", textTransform: "uppercase" }}>
                      Item: {review.product.title}
                    </span>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "1px solid #e2e8f0" }}>
                <button
                  onClick={() => {
                    if (confirm("Delete this review?")) deleteReviewMutation.mutate({ reviewId: review._id });
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
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
