import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BlogForm } from "@/components/admin/blog/BlogForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  const { data: blog } = await supabase
    .from("blogs")
    .select("*")
    .eq("id", id)
    .single();

  if (!blog) notFound();

  return <BlogForm initialData={blog} />;
}
