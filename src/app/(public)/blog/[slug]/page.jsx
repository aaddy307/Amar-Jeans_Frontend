"use client";

import { use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { trpc } from "@/lib/trpc";
import { ChevronLeft, Calendar, User, Tag } from "lucide-react";

export default function BlogPostPage({ params }) {
  const { slug } = use(params);
  const { data: post, isLoading } = trpc.commerce.blog.bySlug.useQuery({ slug });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="h-8 bg-muted animate-pulse mb-4 w-2/3" />
          <div className="h-96 bg-muted animate-pulse mb-6" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-4 bg-muted animate-pulse" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">Post Not Found</h1>
          <Link href="/blog">
            <button className="text-primary font-bold uppercase tracking-widest hover:underline cursor-pointer bg-transparent border-none">
              ← Back to Blog
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-8 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <Link href="/blog">
          <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-none mb-8">
            <ChevronLeft className="w-4 h-4" /> Back to Blog
          </button>
        </Link>

        {/* Cover */}
        {post.coverImage && (
          <motion.div className="w-full h-64 md:h-80 overflow-hidden bg-muted mb-8 border border-border"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          </motion.div>
        )}

        {/* Tags */}
        <div className="flex gap-2 flex-wrap mb-5">
          {post.tags?.map(t => (
            <span key={t} className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest bg-muted text-muted-foreground px-2.5 py-1">
              <Tag className="w-2.5 h-2.5" />{t}
            </span>
          ))}
        </div>

        {/* Title */}
        <motion.h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground leading-[0.9] mb-4"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          {post.title}
        </motion.h1>

        {/* Meta */}
        <div className="flex items-center gap-6 text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-8 pb-8 border-b border-border">
          <div className="flex items-center gap-1.5"><User className="w-3 h-3" />{post.author || "Amar Jeans Team"}</div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            {new Date(post.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </div>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="prose prose-neutral max-w-none text-sm leading-relaxed"
          style={{ color: "var(--muted-foreground)" }}
          dangerouslySetInnerHTML={{ __html: post.content || `<p>${post.excerpt}</p>` }}
        />

        {/* CTA */}
        <div className="mt-16 border-t border-border pt-10">
          <div className="bg-muted/20 border border-border p-8 text-center">
            <p className="text-xs font-black uppercase tracking-widest text-primary mb-3">Amar Jeans</p>
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-3">Ready to Shop?</h3>
            <p className="text-sm font-bold text-muted-foreground mb-6 uppercase tracking-wide">
              Factory-direct premium denim. No middlemen, maximum quality.
            </p>
            <Link href="/products">
              <button className="bg-foreground text-background font-black uppercase tracking-widest text-xs px-8 py-3.5 hover:bg-primary transition-colors cursor-pointer border-none">
                Shop All Denim
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
