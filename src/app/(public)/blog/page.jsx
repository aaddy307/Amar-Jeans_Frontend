"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { trpc } from "@/lib/trpc";
import { Calendar, Tag, ArrowRight } from "lucide-react";

export default function BlogPage() {
  const { data: posts = [], isLoading } = trpc.commerce.blog.list.useQuery();

  return (
    <div className="min-h-screen bg-background pt-8 pb-20 px-4">
      <div className="max-w-[1440px] mx-auto">

        {/* Header */}
        <motion.div className="mb-12 border-b border-border pb-10" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-xs font-black uppercase tracking-widest text-primary block mb-3">Amar Jeans Editorial</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-foreground leading-none">
            Denim<br /><span className="text-primary">Guides</span>
          </h1>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-4 max-w-lg">
            Tips, trends, care guides and everything denim from the Amar Jeans team.
          </p>
        </motion.div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-muted/20 border border-border h-80 animate-pulse" />
            ))}
          </div>
        )}

        {/* Posts grid */}
        {!isLoading && posts.length === 0 && (
          <div className="text-center py-20 border border-border bg-muted/10">
            <h2 className="text-2xl font-black uppercase tracking-tighter">No Posts Yet</h2>
            <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest mt-2">Check back soon for denim guides and tips.</p>
          </div>
        )}

        {!isLoading && posts.length > 0 && (
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden" animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}>
            {posts.map(post => (
              <motion.div key={post.id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <Link href={`/blog/${post.slug}`}>
                  <div className="group cursor-pointer border border-border bg-background hover:border-foreground transition-all duration-300 overflow-hidden h-full flex flex-col">
                    {post.coverImage && (
                      <div className="h-52 overflow-hidden bg-muted">
                        <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      {/* Tags */}
                      <div className="flex gap-2 flex-wrap mb-4">
                        {post.tags?.slice(0, 3).map(t => (
                          <span key={t} className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest bg-muted text-muted-foreground px-2.5 py-1">
                            <Tag className="w-2.5 h-2.5" />{t}
                          </span>
                        ))}
                      </div>
                      <h2 className="font-black uppercase tracking-tighter text-xl leading-tight text-foreground group-hover:text-primary transition-colors mb-3">{post.title}</h2>
                      <p className="text-sm text-muted-foreground font-medium leading-relaxed flex-1">{post.excerpt}</p>
                      <div className="mt-5 pt-5 border-t border-border flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </div>
                        <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-primary">
                          Read <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
