import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { fallbackInstallations, toInstallationMedia, type InstallationMedia, type InstallationRow } from "./media";

async function fetchInstallations(): Promise<InstallationMedia[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return fallbackInstallations;
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { data, error } = await supabase
    .from("installation_media")
    .select("id, kind, image_url, video_url, caption")
    .eq("is_active", true)
    .order("display_order")
    .order("created_at", { ascending: false });
  if (error || !data?.length) return fallbackInstallations;
  const media = (data as InstallationRow[]).map(toInstallationMedia).filter((m): m is InstallationMedia => m !== null);
  return media.length ? media : fallbackInstallations;
}

/** 5 dakikada bir yenilenir; panelden kaydedince sayfalar ayrıca hemen yenilenir */
export const getInstallations = unstable_cache(fetchInstallations, ["installation-media"], { revalidate: 300, tags: ["installation-media"] });
