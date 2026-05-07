import { createClient } from "@supabase/supabase-js";

// Build zamanı çağrılacağı için Admin Key gerekebilir ya da RLS izin verdiyse anon key yeterli.
// anon key veriyoruz çünkü 'loc_public' tablosuna 'aktif = true' erişimi verdik.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  if (process.env.NODE_ENV === 'production') {
    console.error("CRITICAL: Supabase environment variables are missing! Static generation will fail.");
  }
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

export async function getActiveLocations() {
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq("aktif", true);

  if (error) {
    console.error("Error fetching locations:", error);
    return [];
  }
  return data;
}

export async function getActiveServices() {
  const { data, error } = await supabase
    .from("services")
    .select("*");

  if (error) {
    console.error("Error fetching services:", error);
    return [];
  }
  return data;
}

export async function getLocationBySlug(slug: string) {
  const { data } = await supabase
    .from("locations")
    .select("*")
    .eq("slug", slug)
    .single();
  return data;
}

export async function getServiceBySlug(slug: string) {
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .single();
  return data;
}

export async function getNearbyNeighborhoods(ilce: string, currentSlug: string) {
  const { data } = await supabase
    .from("locations")
    .select("*")
    .eq("ilce", ilce)
    .not("mahalle", "is", null)
    .neq("slug", currentSlug)
    .eq("aktif", true)
    .limit(50);
  return data;
}

// Bu fonksiyon ile lokasyon ve servis bazlı özel SEO başlığı/içeriği (pages tablosu) çekiyoruz.
export async function getCustomPage(locationId: string, serviceId?: string) {
  let query = supabase.from("pages").select("*").eq("location_id", locationId).eq("yayinda", true);
  
  if (serviceId) {
    query = query.eq("service_id", serviceId);
  } else {
    query = query.is("service_id", null);
  }

  const { data } = await query.maybeSingle(); // Eğer özel sayfa yoksa null döner
  return data;
}

// İl bazında komşu ilçeleri çeker (ilçe sayfasında "Diğer İlçeler" bölümü için)
export async function getNearbyDistricts(il: string, currentIlce: string) {
  const { data } = await supabase
    .from("locations")
    .select("*")
    .eq("il", il)
    .is("mahalle", null)
    .neq("ilce", currentIlce)
    .neq("slug", "istanbul") // Ana ili hariç tut
    .eq("aktif", true)
    .limit(50);
  return data ?? [];
}
