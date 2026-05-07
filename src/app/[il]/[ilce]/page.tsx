import { PageRenderer, generateDynamicMetadata } from "@/components/seo/PageRenderer";
import { getActiveLocations } from "@/lib/seo/db";

export const dynamicParams = true;
export const revalidate = 86400;

export async function generateStaticParams() {
  const locations = await getActiveLocations();
  const pairs = new Map<string, { il: string, ilce: string }>();

  if (locations && locations.length > 0) {
    locations.forEach((loc: any) => {
      if (loc.il && loc.ilce) {
        const key = `${loc.il}-${loc.ilce}`;
        if (!pairs.has(key)) {
          pairs.set(key, { il: loc.il, ilce: loc.ilce });
        }
      }
    });
    console.log(`[Build] Generated ${pairs.size} district (ilce) routes.`);
  } else {
    console.warn("[Build] No locations found for ilce static params.");
  }

  return Array.from(pairs.values());
}

export async function generateMetadata({ params }: { params: Promise<{ il: string; ilce: string }> }) {
  return generateDynamicMetadata({ params });
}

export default async function IlcePage({ params }: { params: Promise<{ il: string; ilce: string }> }) {
  return <PageRenderer params={params} />;
}
