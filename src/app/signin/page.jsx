"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, Shield, Zap, Lock } from "lucide-react";
import { toast } from "sonner";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const utils = trpc.useUtils();
  const loginMutation = trpc.localAuth.login.useMutation({
    onSuccess: (data) => {
      utils.auth.me.setData(undefined, data.user);
      toast.success("Welcome back, Admin!");
      router.push(data.user?.role === "admin" ? "/admin" : "/");
    },
    onError: (err) => {
      setError(err.message || "Invalid credentials");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate({ email, password });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#ffffff", display: "flex", alignItems: "stretch", position: "relative", overflow: "hidden", fontFamily: "'Outfit', sans-serif" }}>

      {/* ── SUBTLE GEOMETRIC GRID BACKGROUND ── */}
      <div style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        backgroundImage: "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }} />

      {/* ── ACCENT RED CORNER GLOW ── */}
      <div style={{
        position: "absolute",
        top: "-10%",
        right: "-5%",
        width: "500px",
        height: "500px",
        background: "radial-gradient(circle, rgba(220,38,38,0.08) 0%, transparent 70%)",
        pointerEvents: "none"
      }} />

      {/* ── LEFT EDITORIAL HERO PANEL ── */}
      <div style={{ display: "none", flex: 1, position: "relative", zIndex: 2, borderRight: "2px solid #000000", background: "#fafafa" }} className="hidden lg:flex flex-col justify-between p-16">
        
        {/* Brand Header */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={mounted ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{ width: 6, height: 36, background: "#dc2626" }} />
            <span style={{ fontSize: "1.6rem", fontWeight: 900, color: "#000000", letterSpacing: "-0.03em", textTransform: "uppercase" }}>
              AMAR JEANS
            </span>
          </div>
          <span style={{ fontSize: "0.68rem", fontWeight: 900, color: "#dc2626", letterSpacing: "0.25em", textTransform: "uppercase" }}>
            ADMINISTRATIVE COMMAND PORTAL
          </span>
        </motion.div>

        {/* Big Editorial Frame */}
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={mounted ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.8, delay: 0.2 }}
          style={{ position: "relative", flex: 1, margin: "40px 0", border: "2px solid #000000", overflow: "hidden", background: "#000" }}>
          <img
            src="https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=900"
            alt="AMAR JEANS DENIM"
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)" }} />
          
          <div style={{ position: "absolute", top: 20, left: 20, background: "#dc2626", color: "#ffffff", padding: "4px 12px", fontSize: "0.62rem", fontWeight: 900, letterSpacing: "0.2em", textTransform: "uppercase" }}>
            EST. 1994 · PREMIUM DENIM
          </div>

          {/* Stats Bar */}
          <div style={{ position: "absolute", bottom: 24, left: 24, right: 24 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              {[
                { val: "30+", lbl: "Years Legacy" },
                { val: "100%", lbl: "Authentic" },
                { val: "24/7", lbl: "Live Ops" }
              ].map((s, i) => (
                <div key={i} style={{ background: "#ffffff", border: "2px solid #000000", padding: "12px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#dc2626", lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: "0.58rem", fontWeight: 800, color: "#000000", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 4 }}>{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div initial={{ opacity: 0 }} animate={mounted ? { opacity: 1 } : {}} transition={{ delay: 0.4 }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 800, color: "#52525b", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Secured Admin Console · Authorized Personnel Only
          </p>
        </motion.div>
      </div>

      {/* ── RIGHT SIGNIN FORM PANEL ── */}
      <div style={{ width: "100%", maxWidth: 540, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 32px", position: "relative", zIndex: 2 }} className="lg:max-w-none lg:w-1/2">
        <div style={{ width: "100%", maxWidth: 420 }}>
          
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -16 }} animate={mounted ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} style={{ marginBottom: 36 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#000000", color: "#ffffff", padding: "6px 14px", marginBottom: 20 }}>
              <Lock style={{ width: 14, height: 14, color: "#dc2626" }} />
              <span style={{ fontSize: "0.65rem", fontWeight: 900, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                Admin Portal Login
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(2.4rem, 5vw, 3.2rem)", fontWeight: 900, color: "#000000", textTransform: "uppercase", letterSpacing: "-0.04em", lineHeight: 0.95, marginBottom: 8 }}>
              SIGN IN <span style={{ color: "#dc2626" }}>.</span>
            </h1>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#71717a", letterSpacing: "0.15em", textTransform: "uppercase" }}>
              Enter administrator credentials to proceed
            </p>
          </motion.div>

          {/* Form */}
          <motion.div animate={isShaking ? { x: [-10, 10, -10, 10, -5, 5, 0], transition: { duration: 0.5 } } : {}}>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              
              {/* Email */}
              <div>
                <label style={{ display: "block", fontSize: "0.65rem", fontWeight: 900, color: "#000000", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>
                  Admin Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="admin@amarjeans.com"
                  style={{
                    width: "100%",
                    background: "#ffffff",
                    border: "2px solid #000000",
                    padding: "16px 18px",
                    color: "#000000",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    outline: "none",
                    fontFamily: "'Outfit', sans-serif",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s"
                  }}
                  onFocus={e => e.target.style.borderColor = "#dc2626"}
                  onBlur={e => e.target.style.borderColor = "#000000"}
                />
              </div>

              {/* Password */}
              <div>
                <label style={{ display: "block", fontSize: "0.65rem", fontWeight: 900, color: "#000000", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    style={{
                      width: "100%",
                      background: "#ffffff",
                      border: "2px solid #000000",
                      padding: "16px 50px 16px 18px",
                      color: "#000000",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      outline: "none",
                      fontFamily: "'Outfit', sans-serif",
                      boxSizing: "border-box",
                      transition: "border-color 0.2s"
                    }}
                    onFocus={e => e.target.style.borderColor = "#dc2626"}
                    onBlur={e => e.target.style.borderColor = "#000000"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: 16,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#71717a",
                      display: "flex"
                    }}
                  >
                    {showPassword ? <EyeOff style={{ width: 18, height: 18 }} /> : <Eye style={{ width: 18, height: 18 }} />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                    style={{ background: "rgba(220,38,38,0.1)", border: "1px solid #dc2626", borderLeft: "4px solid #dc2626", padding: "12px 16px", fontSize: "0.72rem", fontWeight: 800, color: "#dc2626", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    ⚠ {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loginMutation.isPending}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: "100%",
                  background: loginMutation.isPending ? "#71717a" : "#dc2626",
                  color: "#ffffff",
                  fontWeight: 900,
                  fontSize: "0.82rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  padding: "18px 28px",
                  border: "2px solid #dc2626",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  marginTop: 6,
                  fontFamily: "'Outfit', sans-serif",
                  boxShadow: "0 6px 20px rgba(220,38,38,0.25)"
                }}
              >
                {loginMutation.isPending ? "Authenticating..." : (
                  <>Access Admin Portal <ArrowRight style={{ width: 18, height: 18 }} /></>
                )}
              </motion.button>

            </form>
          </motion.div>

          {/* Quick Details */}
          <div style={{ marginTop: 36, paddingTop: 24, borderTop: "1px solid #e4e4e7", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.65rem", fontWeight: 800, color: "#71717a", letterSpacing: "0.15em", textTransform: "uppercase" }}>
              Amar Jeans Private Portal
            </span>
            <span style={{ fontSize: "0.65rem", fontWeight: 900, color: "#dc2626", letterSpacing: "0.1em" }}>
              v2.0 LIVE
            </span>
          </div>

        </div>
      </div>

    </div>
  );
}
