"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface RegionPageInput {
  locationId: string;
  serviceId: string | null;
  path: string;
  h1: string;
  title: string;
  meta_description: string;
  ozel_icerik: string;
  yayinda: boolean;
}

// Bölge sayfası için pages tablosundaki özel içeriği kaydeder ve ilgili sayfanın önbelleğini yeniler.
export async function saveRegionPage(input: RegionPageInput): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.role !== "admin") {
    return { ok: false, error: "Bu işlem için yönetici girişi gerekli." };
  }

  const payload = {
    location_id: input.locationId,
    service_id: input.serviceId,
    h1: input.h1.trim() || null,
    title: input.title.trim() || null,
    meta_description: input.meta_description.trim() || null,
    ozel_icerik: input.ozel_icerik.trim() && input.ozel_icerik !== "<p></p>" ? input.ozel_icerik : null,
    yayinda: input.yayinda,
  };

  let query = supabase.from("pages").select("id").eq("location_id", input.locationId);
  query = input.serviceId ? query.eq("service_id", input.serviceId) : query.is("service_id", null);
  const { data: existing, error: findError } = await query.maybeSingle();
  if (findError) return { ok: false, error: findError.message };

  const { error } = existing
    ? await supabase.from("pages").update(payload).eq("id", existing.id)
    : await supabase.from("pages").insert(payload);
  if (error) return { ok: false, error: error.message };

  if (input.path.startsWith("/istanbul")) revalidatePath(input.path);
  revalidatePath("/admin/bolge-icerikleri");
  return { ok: true };
}
