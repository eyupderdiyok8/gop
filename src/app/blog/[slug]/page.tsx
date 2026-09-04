import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowLeft, ArrowRight, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { ShareButton } from "@/components/public/blog/ShareButton";

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  
  const { data: blog } = await supabase
    .from("blogs")
    .select("title, seo_title, seo_description, excerpt, featured_image, published_at, updated_at")
    .eq("slug", slug)
    .single();

  if (!blog) return { title: "Yazı Bulunamadı" };

  return {
    title: blog.seo_title || `${blog.title} | SuArıtmaServis34 Blog`,
    description: blog.seo_description || blog.excerpt,
    openGraph: {
      type: "article",
      title: blog.seo_title || blog.title,
      description: blog.seo_description || blog.excerpt,
      images: blog.featured_image ? [{ url: blog.featured_image }] : [],
      publishedTime: blog.published_at,
      modifiedTime: blog.updated_at,
    },
    alternates: {
      canonical: `/blog/${slug}`,
    },
  };
}

import { TableOfContents } from "@/components/public/blog/TableOfContents";

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: blog } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!blog || !blog.is_published) notFound();

  const { data: recentBlogs } = await supabase
    .from("blogs")
    .select("slug, title, featured_image, published_at, category")
    .eq("is_published", true)
    .neq("slug", slug)
    .order("published_at", { ascending: false })
    .limit(4);

  // Extract headings and inject IDs
  const headings: { id: string; text: string; level: number }[] = [];
  const contentWithIds = blog.content.replace(/<h([1-3])([^>]*)>(.*?)<\/h\1>/gi, (match: string, level: string, attrs: string, text: string) => {
    // Clean text and generate ID
    const cleanText = text.replace(/<[^>]*>/g, "").trim();
    if (!cleanText) return match;
    
    const id = cleanText
      .toLowerCase()
      .trim()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    
    // Add to list, ensuring unique IDs per article
    const finalId = headings.some(h => h.id === id) ? `${id}-${headings.length}` : id;
    if (parseInt(level) <= 2) {
      headings.push({ id: finalId, text: cleanText, level: parseInt(level) });
    }
    
    return `<h${level}${attrs} id="${finalId}">${text}</h${level}>`;
  });

  // Article Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "image": blog.featured_image,
    "mainEntityOfPage": `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.suaritmaservis34.com"}/blog/${slug}`,
    "datePublished": blog.published_at,
    "dateModified": blog.updated_at,
    "author": {
      "@type": "Organization",
      "name": "SuArıtmaServis34 Sultangazi",
      "url": process.env.NEXT_PUBLIC_SITE_URL || "https://www.suaritmaservis34.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "SuArıtmaServis34",
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.suaritmaservis34.com"}/logo.png`
      }
    },
    "articleSection": blog.category,
    "inLanguage": "tr-TR",
    "description": blog.excerpt,
  };

  return (
    <article className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Article Hero - Dark & Focused */}
      <section className="relative pt-32 pb-40 px-4 bg-brand-navy overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-aqua/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative max-w-4xl mx-auto text-center sm:text-left">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-brand-aqua-light text-sm font-medium hover:translate-x--1 transition-transform mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Tüm Yazılara Dön
          </Link>
          
          <Badge className="block w-fit mx-auto sm:mx-0 mb-6 bg-white/10 text-white border-white/20 px-3 py-1">
            {blog.category}
          </Badge>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-white leading-tight mb-8">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 text-white/50 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-aqua" />
              <span>{format(new Date(blog.published_at), "d MMMM yyyy", { locale: tr })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-aqua" />
              <span>5 dk okuma süresi</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content Area - White Sheet Overlay */}
      <section className="px-4 -mt-24 pb-24 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-8 lg:gap-10 items-start">
          <div className="min-w-0" data-blog-content>
          <div className="bg-white rounded-xl shadow-2xl shadow-brand-navy/5 border border-white overflow-hidden">
            {blog.featured_image && (
              <div className="aspect-video md:aspect-[16/7] w-full overflow-hidden relative">
                <Image 
                  src={blog.featured_image} 
                  alt={blog.title} 
                  fill
                  sizes="(max-width: 768px) 100vw, 900px"
                  loading="lazy"
                  className="object-cover"
                />
              </div>
            )}

            <div className="p-8 sm:p-12 lg:p-16 pt-10 sm:pt-14 lg:pt-20">
              {/* Table of Contents */}
              <TableOfContents headings={headings} />

              <div 
                className="prose prose-slate prose-lg max-w-none 
                  prose-headings:font-heading prose-headings:font-bold prose-headings:text-brand-navy
                  prose-h2:text-3xl prose-h2:mt-12 
                  prose-p:text-slate-600 prose-p:leading-relaxed
                  prose-strong:text-brand-navy
                  prose-img:rounded-2xl prose-img:shadow-lg prose-a:text-brand-aqua hover:prose-a:text-brand-aqua-dark transition-colors"
                dangerouslySetInnerHTML={{ __html: contentWithIds }}
              />

              {/* Author Info */}
              <div className="mt-20 pt-10 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full gradient-teal flex items-center justify-center shadow-inner">
                    <Image src="/logo-icon.png" width={28} height={28} className="shadow-sm" alt="SuArıtmaServis34" />
                  </div>
                  <div>
                    <p className="text-brand-navy font-bold text-lg">SuArıtmaServis34 Uzman Ekibi</p>
                    <p className="text-slate-400 text-xs uppercase tracking-widest font-medium">İçerik Editörü & Su Teknolojileri Uzmanı</p>
                  </div>
                </div>
                <ShareButton title={blog.title} />
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
             <Button asChild variant="outline" className="rounded-full border-slate-200 text-slate-500 hover:bg-white hover:text-brand-navy transition-all">
                <Link href="/blog">Diğer Yazıları Keşfet</Link>
             </Button>
          </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28" aria-label="Blog yan menüsü">
            <section className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4 mb-5">
                <h2 className="text-xl font-heading font-bold text-brand-navy">Son Yazılar</h2>
                <Link
                  href="/blog"
                  className="text-xs font-semibold text-brand-aqua-dark hover:text-brand-navy transition-colors"
                >
                  Tümü
                </Link>
              </div>

              <div className="divide-y divide-slate-100">
                {(recentBlogs || []).map((recentBlog) => (
                  <Link
                    key={recentBlog.slug}
                    href={`/blog/${recentBlog.slug}`}
                    className="group flex gap-3 py-4 first:pt-0 last:pb-0"
                  >
                    {recentBlog.featured_image ? (
                      <div className="relative w-20 h-16 shrink-0 overflow-hidden rounded-md bg-slate-100">
                        <Image
                          src={recentBlog.featured_image}
                          alt=""
                          fill
                          sizes="80px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    ) : null}
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-sm font-semibold leading-snug text-brand-navy group-hover:text-brand-aqua-dark transition-colors">
                        {recentBlog.title}
                      </p>
                      <p className="mt-2 text-xs text-slate-400">
                        {format(new Date(recentBlog.published_at), "d MMM yyyy", { locale: tr })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <section className="relative min-h-[360px] overflow-hidden rounded-lg bg-brand-navy text-white shadow-lg">
              <Image
                src="/images/su-aritma-servis34.webp"
                alt="Sultangazi su arıtma servisi"
                fill
                sizes="(max-width: 1024px) 100vw, 320px"
                className="object-cover opacity-35"
              />
              <div className="absolute inset-0 bg-brand-navy/70" />
              <div className="relative flex min-h-[360px] flex-col justify-end p-6">
                <div className="mb-auto inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold">
                  <MapPin className="h-3.5 w-3.5" />
                  Sultangazi merkezli servis
                </div>
                <h2 className="text-2xl font-heading font-bold leading-tight">
                  Cihazınız için servis mi gerekiyor?
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white/75">
                  Sultangazi ve İstanbul Avrupa Yakası için montaj, bakım ve filtre değişimi talebi oluşturun.
                </p>
                <Button asChild className="mt-6 w-full bg-brand-aqua text-brand-navy hover:bg-white">
                  <Link href="/iletisim" className="flex items-center justify-center gap-2">
                    <Phone className="h-4 w-4" /> Servis Talebi Oluştur
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </section>
          </aside>
        </div>
      </section>
    </article>
  );
}
