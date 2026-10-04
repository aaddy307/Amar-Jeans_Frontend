export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://amarjeans.com";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/signin"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
