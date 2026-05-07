import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { 
  Plus, 
  FileText, 
  Eye, 
  Edit, 
  Trash2, 
  Globe, 
  EyeOff 
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export const dynamic = "force-dynamic";

export default async function BlogListPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  const { data: blogs } = await supabase
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-slate-900">Blog Yazıları</h1>
          <p className="text-slate-500 text-sm mt-1">
            İçeriklerinizi yönetin ve SEO uyumlu yazılar paylaşın.
          </p>
        </div>
        <Button asChild className="gradient-teal">
          <Link href="/admin/blog/yeni">
            <Plus className="w-4 h-4 mr-2" /> Yeni Yazı Ekle
          </Link>
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white text-slate-400 font-medium uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-4">Kapak</th>
                <th className="px-6 py-4">Başlık / Kategori</th>
                <th className="px-6 py-4">Durum / Tarih</th>
                <th className="px-6 py-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!blogs || blogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">
                    Henüz hiç blog yazısı eklenmemiş.
                  </td>
                </tr>
              ) : (
                blogs.map((blog: any) => (
                  <tr key={blog.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      {blog.featured_image ? (
                        <img 
                          src={blog.featured_image} 
                          alt={blog.title} 
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center text-slate-900/20">
                          <FileText className="w-5 h-5" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-900 group-hover:text-brand-aqua transition-colors">
                          {blog.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-[10px] py-0 bg-white text-slate-700">
                            {blog.category}
                          </Badge>
                          <span className="text-[10px] text-slate-400 truncate max-w-[150px]">
                            /{blog.slug}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        {blog.is_published ? (
                          <span className="flex items-center gap-1.5 text-brand-aqua text-xs font-medium">
                            <Globe className="w-3 h-3" /> Yayında
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                            <EyeOff className="w-3 h-3" /> Taslak
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400">
                          {format(new Date(blog.created_at), "d MMMM yyyy", { locale: tr })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button asChild size="icon-sm" variant="ghost" className="text-slate-400 hover:text-slate-900 hover:bg-white">
                          <Link href={`/blog/${blog.slug}`} target="_blank">
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button asChild size="icon-sm" variant="ghost" className="text-slate-400 hover:text-brand-aqua hover:bg-brand-aqua/10">
                          <Link href={`/admin/blog/${blog.id}`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button size="icon-sm" variant="ghost" className="text-slate-400 hover:text-red-400 hover:bg-red-500/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
