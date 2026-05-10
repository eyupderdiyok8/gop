"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  FileText, 
  Eye, 
  Edit, 
  Trash2, 
  Globe, 
  EyeOff,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { useRouter } from "next/navigation";

interface Props {
  initialBlogs: any[];
}

export function BlogListClient({ initialBlogs }: Props) {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`"${title}" başlıklı yazıyı silmek istediğinizden emin misiniz?`)) return;

    setDeletingId(id);
    try {
      const { error } = await supabase
        .from("blogs")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setBlogs(blogs.filter((blog) => blog.id !== id));
      router.refresh();
    } catch (err: any) {
      alert("Hata: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50/50 text-slate-400 font-medium uppercase text-[10px] tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-6 py-4">Kapak</th>
              <th className="px-6 py-4">Başlık / Kategori</th>
              <th className="px-6 py-4">Durum / Tarih</th>
              <th className="px-6 py-4 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {blogs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">
                  Henüz hiç blog yazısı eklenmemiş.
                </td>
              </tr>
            ) : (
              blogs.map((blog: any) => (
                <tr key={blog.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    {blog.featured_image ? (
                      <img 
                        src={blog.featured_image} 
                        alt={blog.title} 
                        className="w-12 h-12 rounded-lg object-cover ring-1 ring-slate-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300">
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
                        <Badge variant="outline" className="text-[10px] py-0 bg-slate-50 text-slate-600 border-slate-200">
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
                        <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
                          <Globe className="w-3 h-3" /> YAYINDA
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                          <EyeOff className="w-3 h-3" /> TASLAK
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 font-medium">
                        {format(new Date(blog.created_at), "d MMMM yyyy", { locale: tr })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                        <Link href={`/blog/${blog.slug}`} target="_blank">
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button asChild size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-brand-aqua hover:bg-brand-aqua/10 rounded-lg transition-colors">
                        <Link href={`/admin/blog/${blog.id}`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        onClick={() => handleDelete(blog.id, blog.title)}
                        disabled={deletingId === blog.id}
                      >
                        {deletingId === blog.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
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
  );
}
