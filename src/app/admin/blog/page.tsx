import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BlogListClient } from "@/components/admin/blog/BlogListClient";

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
        <Button asChild className="bg-brand-aqua hover:bg-brand-aqua/90 text-slate-900 shadow-lg shadow-brand-aqua/20">
          <Link href="/admin/blog/yeni" className="flex items-center">
            <Plus className="w-4 h-4 mr-2" /> Yeni Yazı Ekle
          </Link>
        </Button>
      </div>

      <BlogListClient initialBlogs={blogs || []} />
    </div>
  );
}
