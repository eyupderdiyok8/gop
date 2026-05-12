import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getSeoFileName } from "@/lib/slugify";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    
    // Check if user is authenticated and is an admin
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
    }

    const fileName = getSeoFileName(file.name);
    const filePath = `blog/${fileName}`;

    // Upload to 'blog_images' bucket
    const { data, error } = await supabase.storage
      .from("blog_images")
      .upload(filePath, file);

    if (error) {
      console.error("Storage upload error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from("blog_images")
      .getPublicUrl(filePath);

    return NextResponse.json({ url: publicUrl });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
