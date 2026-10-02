"use client";

import { usePathname } from "next/navigation";

// Routes where Header, Footer and WhatsApp button should NOT appear
const ADMIN_ROUTES = ["/admin", "/signin"];

function isAdminRoute(pathname) {
  return ADMIN_ROUTES.some(route => pathname === route || pathname.startsWith(route + "/"));
}

export default function ShellWrapper({ children, header, footer, whatsapp }) {
  const pathname = usePathname();
  const hideShell = isAdminRoute(pathname);

  if (hideShell) {
    // Admin / Login: render page content only, full-screen, no chrome
    return (
      <div style={{ minHeight: "100vh", width: "100%", flex: 1 }}>
        {children}
      </div>
    );
  }

  // Public pages: full header + main + footer + WhatsApp
  return (
    <>
      {header}
      <main style={{ flex: 1 }}>
        {children}
      </main>
      {footer}
      {whatsapp}
    </>
  );
}
