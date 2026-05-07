import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export const metadata: Metadata = {
  title: "Blog – Su Arıtma Rehberi | SuArıtmaServis34 Gaziosmanpaşa",
  description:
    "Gaziosmanpaşa su kalitesi, filtre bakımı, RO sistemleri ve su arıtma teknolojileri hakkında uzman bilgisi.",
};

const categoryColors: Record<string, string> = {
  "Su Kalitesi": "bg-blue-50 text-blue-600 border-blue-100",
  "Teknoloji": "bg-violet-50 text-violet-600 border-violet-100",
  "Bakım": "bg-amber-50 text-amber-600 border-amber-100",
  "Sağlık": "bg-brand-aqua/10 text-brand-aqua border-brand-aqua",
  "Rehber": "bg-slate-100 text-slate-600 border-slate-200",
  "Yerel": "bg-brand-aqua/10 text-brand-aqua border-brand-aqua",
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const supabase = await createClient();
  
  const { data: blogs } = await supabase
    .from("blogs")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (!blogs || blogs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <p className="text-white/40 italic">Henüz bir yazı paylaşılmadı.</p>
      </div>
    );
  }

  const featured = blogs[0];
  const rest = blogs.slice(1);
  const categories = [...new Set(blogs.map((p) => p.category))];

  return (
    <>
      <section className="relative gradient-hero pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-white/10 text-white border-white/20 px-4 py-1.5 text-xs tracking-wide">
            ✦ Uzman İçerikler
          </Badge>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-white mb-5">Blog</h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-xl mx-auto">
            Su kalitesi, arıtma teknolojileri, bakım rehberleri ve Gaziosmanpaşa–İstanbul bölgesine
            özel içerikler.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-12">
            <span className="px-4 py-1.5 rounded-full bg-brand-navy text-white text-xs font-medium shadow-md shadow-brand-navy/10">
              Tümü
            </span>
            {categories.map((cat) => (
              <span
                key={cat}
                className="px-4 py-1.5 rounded-full border border-slate-200 bg-white text-xs font-medium text-slate-500 hover:border-brand-aqua/40 hover:text-brand-aqua cursor-pointer transition-colors shadow-sm"
              >
                {cat}
              </span>
            ))}
          </div>

          <div className="mb-12 rounded-3xl border border-slate-100 overflow-hidden bg-white hover:shadow-2xl hover:shadow-brand-navy/5 transition-all duration-300 group">
            <div className="h-2 gradient-teal" />
            <div className="p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-brand-aqua text-white border-0 text-xs">Yeni</Badge>
                  <Badge variant="outline" className={`text-xs ${categoryColors[featured.category] || 'bg-slate-50 text-slate-600'}`}>
                    {featured.category}
                  </Badge>
                </div>
                <h2 className="font-heading font-bold text-2xl lg:text-3xl text-brand-navy mb-3 group-hover:text-brand-aqua transition-colors">
                  <Link href={`/blog/${featured.slug}`}>{featured.title}</Link>
                </h2>
                <p className="text-slate-600 leading-relaxed mb-5 line-clamp-2">{featured.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{format(new Date(featured.published_at), "d MMMM yyyy", { locale: tr })}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />5 dk okuma</span>
                </div>
              </div>
              <div className="flex justify-end order-first lg:order-last">
                 {featured.featured_image && (
                   <div className="relative w-full aspect-video lg:aspect-square">
                     <div className="absolute -inset-2 bg-gradient-to-r from-brand-aqua/20 to-blue-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                     <img 
                      src={featured.featured_image} 
                      alt={featured.title} 
                      className="relative w-full h-full object-cover rounded-2xl border border-slate-100 shadow-lg"
                     />
                   </div>
                 )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rest.map((post) => (
              <article
                key={post.slug}
                className="group rounded-2xl border border-slate-200 bg-white overflow-hidden hover:shadow-2xl hover:shadow-brand-navy/5 hover:border-brand-aqua/20 transition-all duration-500 flex flex-col"
              >
                <div className="h-1.5 bg-slate-100 group-hover:gradient-teal transition-all duration-500" />
                {post.featured_image && (
                  <div className="h-52 overflow-hidden border-b border-slate-50">
                    <img src={post.featured_image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                )}
                <div className="p-7 flex flex-col flex-1">
                  <Badge
                    variant="outline"
                    className={`w-fit mb-4 text-[10px] font-bold uppercase tracking-wider ${categoryColors[post.category] || 'bg-slate-50 text-slate-500'}`}
                  >
                    {post.category}
                  </Badge>
                  <h3 className="font-heading font-bold text-brand-navy text-xl leading-snug mb-3 group-hover:text-brand-aqua transition-colors flex-1">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-5 border-t border-slate-50 mt-auto">
                    <span className="flex items-center gap-1.5 font-medium"><Calendar className="w-3.5 h-3.5" />{format(new Date(post.published_at), "d MMMM yyyy", { locale: tr })}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />5 dk okuma</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
