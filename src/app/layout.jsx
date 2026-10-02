import "./globals.css";
import { Providers } from "./providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ShellWrapper from "@/components/ShellWrapper";

export const metadata = {
  title: "AMAR JEANS | Premium Denim & Urban Fashion",
  description: "Explore high-quality slim fit jeans, regular denim, cargo jeans, and denim jackets from AMAR JEANS.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--background)", color: "var(--foreground)", WebkitFontSmoothing: "antialiased" }}>
        <Providers>
          <ShellWrapper
            header={<Header />}
            footer={<Footer />}
            whatsapp={<WhatsAppButton />}
          >
            {children}
          </ShellWrapper>
        </Providers>
      </body>
    </html>
  );
}
