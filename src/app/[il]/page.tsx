import { PageRenderer, generateDynamicMetadata } from "@/components/seo/PageRenderer";
import { getActiveLocations } from "@/lib/seo/db";

export const dynamicParams = true;
export const revalidate = 86400;

export async function generateStaticParams() {
  const locations = await getActiveLocations();
  const provinces = new Set<string>();
  
  if (locations && locations.length > 0) {
    locations.forEach((loc: any) => {
      if (loc.il) provinces.add(loc.il);
    });
    console.log(`[Build] Generated ${provinces.size} province routes.`);
  } else {
    console.warn("[Build] No locations found for province static params.");
  }
  
  return Array.from(provinces).map(il => ({ il }));
}

export async function generateMetadata({ params }: { params: Promise<{ il: string }> }) {
  return generateDynamicMetadata({ params });
}

export default async function ProvincePage({ params }: { params: Promise<{ il: string }> }) {
  return <PageRenderer params={params} />;
}
