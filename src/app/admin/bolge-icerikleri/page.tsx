import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatLocationName } from "@/lib/seo/locationNames";
import { formatTechnicalText } from "@/lib/products/formatTechnicalText";
import { isIndexablePage } from "@/lib/seo/indexPolicy";
import { RegionContentClient, type RegionPageRow } from "@/components/admin/seo/RegionContentClient";

export const dynamic = "force-dynamic";

export default async function RegionContentPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  const [{ data: locations }, { data: services }, { data: pages }] = await Promise.all([
    supabase.from("locations").select("id, il, ilce, mahalle, slug").eq("aktif", true).order("slug"),
    supabase.from("services").select("id, slug, ad"),
    supabase.from("pages").select("*"),
  ]);

  const pageByKey = new Map<string, any>();
  (pages || []).forEach((p: any) => pageByKey.set(`${p.location_id}:${p.service_id ?? ""}`, p));

  // Sadece indekslenen bölge sayfaları listelenir (il, ilçe, ilçe × ana hizmet, mahalle).
  const rows: RegionPageRow[] = [];
  (locations || []).forEach((loc: any) => {
    const locName = loc.mahalle
      ? `${formatLocationName(loc.mahalle)} Mahallesi`
      : formatLocationName(loc.ilce || loc.il);
    const targets = [null, ...(services || []).filter((s: any) => isIndexablePage(loc, s.slug))];

    targets.forEach((srv: any) => {
      const page = pageByKey.get(`${loc.id}:${srv?.id ?? ""}`);
      rows.push({
        key: `${loc.id}:${srv?.id ?? ""}`,
        locationId: loc.id,
        serviceId: srv?.id ?? null,
        path: `/${loc.slug}${srv ? `/${srv.slug}` : ""}`,
        label: srv ? `${locName} ${formatTechnicalText(srv.ad)}` : locName,
        ilce: loc.ilce ? formatLocationName(loc.ilce) : "İl",
        level: loc.mahalle ? "Mahalle" : srv ? "İlçe × Hizmet" : loc.ilce ? "İlçe" : "İl",
        page: page
          ? {
              h1: page.h1 || "",
              title: page.title || "",
              meta_description: page.meta_description || "",
              ozel_icerik: page.ozel_icerik || "",
              yayinda: page.yayinda,
            }
          : null,
      });
    });
  });

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-slate-900">Bölge Sayfası İçerikleri</h1>
        <p className="text-slate-500 text-sm mt-1 max-w-3xl">
          Google&apos;a indekslenen bölge sayfalarına özel başlık, açıklama ve içerik ekleyin. O bölgede yapılan
          işler, müşteri yorumları, servis süresi ve yerel bilgiler sayfanın şablon metinden ayrışmasını ve
          dizine eklenmesini kolaylaştırır.
        </p>
      </div>
      <RegionContentClient rows={rows} />
    </div>
  );
}
