import { createBrowserClient } from "@supabase/ssr";

// Turbopack cache temizleme için eklenti
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn("SUPABASE ENV DEĞİŞKENLERİ BULUNAMADI! Lütfen .env.local dosyasını kaydedip Next.js'i yeniden başlatın.");
  }

  return createBrowserClient(url!, key!);
}
