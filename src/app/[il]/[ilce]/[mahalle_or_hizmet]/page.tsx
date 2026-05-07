import { PageRenderer, generateDynamicMetadata } from "@/components/seo/PageRenderer";
import { getActiveLocations, getActiveServices } from "@/lib/seo/db";

export const dynamicParams = true;
export const revalidate = 86400;

export async function generateStaticParams() {
  const locations = await getActiveLocations();
  const services = await getActiveServices();
  
  const paramsList: { il: string; ilce: string; mahalle_or_hizmet: string }[] = [];
  
  if (locations && locations.length > 0) {
    // 1. Olasılık: [mahalle] 
    locations.forEach((loc: any) => {
      if (loc.il && loc.ilce && loc.mahalle) {
        paramsList.push({ il: loc.il, ilce: loc.ilce, mahalle_or_hizmet: loc.mahalle });
      }
    });

    // 2. Olasılık: [hizmet] (İlçe + Hizmet kombinasyonu)
    const uniqueIlces = new Map<string, any>();
    locations.forEach((loc: any) => {
      if (loc.il && loc.ilce) {
        const key = `${loc.il}-${loc.ilce}`;
        if (!uniqueIlces.has(key)) uniqueIlces.set(key, loc);
      }
    });

    if (services && services.length > 0) {
      uniqueIlces.forEach((loc) => {
        services.forEach((srv: any) => {
          if (srv.slug) {
            paramsList.push({ il: loc.il, ilce: loc.ilce, mahalle_or_hizmet: srv.slug });
          }
        });
      });
    }

    console.log(`[Build] Generated ${paramsList.length} depth-3 (mahalle/hizmet) routes.`);
  } else {
    console.warn("[Build] No locations found for depth-3 static params.");
  }

  return paramsList;
}

export async function generateMetadata({ params }: { params: Promise<{ il: string; ilce: string; mahalle_or_hizmet: string }> }) {
  return generateDynamicMetadata({ params });
}

export default async function Depth3Page({ params }: { params: Promise<{ il: string; ilce: string; mahalle_or_hizmet: string }> }) {
  return <PageRenderer params={params} />;
}
