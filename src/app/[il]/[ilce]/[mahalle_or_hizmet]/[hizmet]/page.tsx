import { PageRenderer, generateDynamicMetadata } from "@/components/seo/PageRenderer";
import { getActiveLocations, getActiveServices } from "@/lib/seo/db";

export const dynamicParams = true;
export const revalidate = 86400;

export async function generateStaticParams() {
  const locations = await getActiveLocations();
  const services = await getActiveServices();
  
  const paramsList: { il: string; ilce: string; mahalle_or_hizmet: string; hizmet: string }[] = [];
  
  if (locations && locations.length > 0 && services && services.length > 0) {
    // Mahalle + Hizmet kombinasyonu
    locations.forEach((loc: any) => {
      if (loc.il && loc.ilce && loc.mahalle) {
        services.forEach((srv: any) => {
          if (srv.slug) {
            paramsList.push({ 
              il: loc.il, 
              ilce: loc.ilce, 
              mahalle_or_hizmet: loc.mahalle,
              hizmet: srv.slug
            });
          }
        });
      }
    });
    console.log(`[Build] Generated ${paramsList.length} depth-4 (mahalle+hizmet) routes.`);
  } else {
    console.warn("[Build] Missing locations or services for depth-4 static params.");
  }

  return paramsList;
}

export async function generateMetadata({ params }: { params: Promise<{ il: string; ilce: string; mahalle_or_hizmet: string; hizmet: string }> }) {
  return generateDynamicMetadata({ params });
}

export default async function Depth4Page({ params }: { params: Promise<{ il: string; ilce: string; mahalle_or_hizmet: string; hizmet: string }> }) {
  return <PageRenderer params={params} />;
}
