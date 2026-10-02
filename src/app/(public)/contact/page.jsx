"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function ContactPage() {
  const { data: settings } = trpc.commerce.settings.get.useQuery();
  const createEnquiry = trpc.commerce.orders.create.useMutation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Enquiry",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      await createEnquiry.mutateAsync({
        orderType: "enquiry",
        customerName: form.name,
        customerEmail: form.email,
        customerPhone: form.phone,
        totalPrice: "0",
        notes: `[Subject: ${form.subject}] ${form.message}`,
        items: []
      });

      setSubmitted(true);
      toast.success("Enquiry submitted successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to submit enquiry.");
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-primary mb-2 block">
            Get In Touch
          </span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-foreground mb-4">
            Contact & Bulk Enquiry
          </h1>
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs md:text-sm">
            Have questions about custom sizing, wholesale bulk orders, or dealership? Drop us a message.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Store Info */}
          <div className="space-y-8">
            <div className="border border-border p-8 bg-muted/10 space-y-6">
              <h2 className="text-2xl font-black uppercase tracking-tighter text-foreground">
                AMAR JEANS Flagship Store
              </h2>
              
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-primary shrink-0 mt-1" />
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-foreground mb-1">Store Address</h4>
                  <p className="text-muted-foreground text-xs font-bold leading-relaxed whitespace-pre-line">
                    {settings?.storeAddress || "opp new fire brigade Chinchpada nalambi road amb (w)\nchnchpad rood new fire brigade opp titwala road ambernath w, Ambarnath 421501"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-primary shrink-0 mt-1" />
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-foreground mb-1">Phone / WhatsApp</h4>
                  <p className="text-muted-foreground text-xs font-bold leading-relaxed">
                    {settings?.supportPhone || "+91 9834557990 / +91 8149987987"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-primary shrink-0 mt-1" />
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-foreground mb-1">Support Email</h4>
                  <p className="text-muted-foreground text-xs font-bold leading-relaxed">
                    {settings?.supportEmail || "contact@amarjeans.com"}
                  </p>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="border border-border p-8 bg-foreground text-background">
              <h3 className="text-lg font-black uppercase tracking-widest mb-4 text-primary">Store Hours</h3>
              <p className="text-xs font-bold uppercase tracking-widest text-background/80 mb-2">Monday - Sunday: 10:00 AM - 9:30 PM</p>
              <p className="text-xs font-bold uppercase tracking-widest text-background/60">Open 7 days a week for walk-ins & enquiries.</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="border border-border p-8 bg-background">
            {submitted ? (
              <div className="py-16 text-center space-y-4">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
                <h3 className="text-3xl font-black uppercase tracking-tighter text-foreground">Enquiry Received!</h3>
                <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest max-w-md mx-auto">
                  Thank you for reaching out to AMAR JEANS. Our team will review your inquiry and get back to you within 24 hours.
                </p>
                <button 
                  onClick={() => setSubmitted(false)} 
                  className="mt-6 bg-foreground text-background px-6 py-3 font-black uppercase tracking-widest text-xs hover:bg-primary transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-2xl font-black uppercase tracking-tighter text-foreground mb-4">
                  Send Direct Enquiry
                </h2>

                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-foreground block mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-background border border-border px-4 py-3 font-bold text-sm outline-none focus:border-foreground"
                    placeholder="Full name"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-foreground block mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-background border border-border px-4 py-3 font-bold text-sm outline-none focus:border-foreground"
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-foreground block mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full bg-background border border-border px-4 py-3 font-bold text-sm outline-none focus:border-foreground"
                      placeholder="+91 9876543210"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-foreground block mb-2">
                    Enquiry Type
                  </label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full bg-background border border-border px-4 py-3 font-bold text-sm outline-none focus:border-foreground cursor-pointer"
                  >
                    <option value="General Enquiry">General Product Enquiry</option>
                    <option value="Wholesale Bulk Order">Wholesale / Bulk Order</option>
                    <option value="Custom Size Request">Custom Fit & Sizing Request</option>
                    <option value="Dealership">Franchise & Dealership Enquiry</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-foreground block mb-2">
                    Message / Requirements *
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-background border border-border px-4 py-3 font-bold text-sm outline-none focus:border-foreground resize-y"
                    rows={5}
                    placeholder="Describe your query or order quantity requirements..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={createEnquiry.isPending}
                  className="w-full bg-foreground text-background font-black uppercase tracking-widest py-4 hover:bg-primary transition-colors text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" /> {createEnquiry.isPending ? "Submitting..." : "Submit Enquiry"}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
