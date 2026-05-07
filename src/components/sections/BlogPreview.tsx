import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

const categoryColors: Record<string, string> = {
  "Su Kalitesi": "bg-blue-400/10 text-blue-400 border-blue-400/20",
  "Teknoloji": "bg-violet-400/10 text-violet-400 border-violet-400/20",
  "Bakım": "bg-amber-400/10 text-amber-400 border-amber-400/20",
  "Sağlık": "bg-green-400/10 text-green-400 border-green-400/20",
  "Yerel": "bg-brand-aqua/10 text-brand-aqua border-brand-aqua/20",
};

export async function BlogPreview() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blogs")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(3);

  if (!posts || posts.length === 0) return null;

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-brand-navy relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-brand-aqua font-semibold text-sm uppercase tracking-widest mb-3">
              Blog
            </p>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white">
              Bilgi Köşesi
            </h2>
            <p className="text-white/60 mt-3 max-w-md leading-relaxed">
              Su kalitesi, arıtma teknolojileri ve bakım ipuçları hakkında güncel bilgiler.
            </p>
          </div>
          <Link 
            href="/blog" 
            className="self-start sm:self-auto inline-flex items-center gap-2 bg-white !text-black hover:bg-white/90 font-bold rounded-2xl px-8 py-3 shadow-xl transition-all duration-300"
          >
            Tüm Yazılar
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div
              key={post.slug}
              className="group rounded-[2.5rem] border border-white/10 bg-brand-navy-light/50 overflow-hidden hover:shadow-2xl hover:border-brand-aqua/30 transition-all duration-500 flex flex-col"
            >
              <div className="h-1.5 bg-white/5 group-hover:bg-brand-aqua transition-all duration-500" />
              {post.featured_image && (
                <div className="h-52 overflow-hidden border-b border-white/5 relative">
                  <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f1c26] to-transparent opacity-40" />
                </div>
              )}
              <div className="p-8 flex flex-col flex-1">
                <Badge
                  variant="outline"
                  className={`w-fit mb-4 text-[10px] font-bold uppercase tracking-wider ${categoryColors[post.category] || 'bg-white/5 text-white/50 border-white/10'}`}
                >
                  {post.category}
                </Badge>
                <h3 className="font-heading font-bold text-white text-xl leading-tight mb-4 group-hover:text-brand-aqua transition-colors flex-1">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="text-white/60 text-sm leading-relaxed mb-6 line-clamp-2 italic">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-[10px] text-white/60 pt-6 border-t border-white/10 mt-auto font-bold uppercase tracking-[0.1em]">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    {format(new Date(post.published_at), "d MMMM yyyy", { locale: tr })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    5 DK OKUMA
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
