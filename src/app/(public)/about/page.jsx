"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Award, Layers, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Hero Section */}
        <div className="relative bg-foreground text-background p-8 md:p-16 mb-16 overflow-hidden">
          <div className="max-w-3xl relative z-10">
            <span className="text-xs font-black uppercase tracking-widest text-primary mb-3 block">
              The AMAR JEANS Heritage
            </span>
            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-6 leading-none">
              Crafted For Strength. <br />
              <span className="text-primary">Styled For Life.</span>
            </h1>
            <p className="text-background/80 font-bold uppercase tracking-widest text-xs md:text-sm leading-relaxed mb-8">
              Founded with a mission to deliver premium heavy-gauge denim craftsmanship directly to denim enthusiasts without unnecessary markup.
            </p>
            <Link href="/products">
              <button className="bg-primary text-primary-foreground font-black uppercase tracking-widest px-8 py-4 hover:bg-white hover:text-foreground transition-colors text-xs flex items-center gap-2 cursor-pointer">
                Explore Denim Collection <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="border border-border p-8 bg-muted/10">
            <ShieldCheck className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-black uppercase tracking-tighter text-foreground mb-2">
              100% Organic Denim
            </h3>
            <p className="text-muted-foreground text-xs font-bold leading-relaxed">
              We source high-density ring-spun organic cotton threads to weave durable, stretchable denim fabric that retains its shape wash after wash.
            </p>
          </div>

          <div className="border border-border p-8 bg-muted/10">
            <Award className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-black uppercase tracking-tighter text-foreground mb-2">
              Precision Fit Ergonomics
            </h3>
            <p className="text-muted-foreground text-xs font-bold leading-relaxed">
              Tailored around Asian body structures for peak comfort around thighs, knees, and waistline.
            </p>
          </div>

          <div className="border border-border p-8 bg-muted/10">
            <Layers className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-black uppercase tracking-tighter text-foreground mb-2">
              Reinforced Stitching
            </h3>
            <p className="text-muted-foreground text-xs font-bold leading-relaxed">
              Heavy copper hardware rivets and double-line stitching at stress points ensure your jeans last for years.
            </p>
          </div>
        </div>

        {/* Store Story */}
        <div className="border border-border p-8 md:p-12 bg-background grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-foreground mb-4">
              Direct Manufacturer Quality
            </h2>
            <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-6">
              Located in Ambarnath, AMAR JEANS brings factory-direct denim manufacturing straight to your doorstep. We specialize in custom-fit sizing, tactical cargo jeans, slim-fit stretch denim, and classic straight fits.
            </p>
            <div className="flex gap-4">
              <Link href="/contact">
                <button className="bg-foreground text-background px-6 py-3 font-black uppercase tracking-widest text-xs hover:bg-primary transition-colors cursor-pointer">
                  Contact Store
                </button>
              </Link>
            </div>
          </div>
          <div className="aspect-4/3 bg-muted border border-border overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop" 
              alt="Denim Craftsmanship" 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>

      </div>
    </div>
  );
}
