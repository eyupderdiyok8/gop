import { MetadataRoute } from 'next';
import { getActiveLocations, getActiveServices } from '@/lib/seo/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.suaritmaservis34.com';

  const locations = await getActiveLocations();
  const services = await getActiveServices();

  const entries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/iletisim`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/hizmetler`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/urunler`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gizlilik-politikasi`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    }
  ];

  // Fetch blogs & products to include them
  const supabase = await (await import('@/lib/supabase/server')).createClient();
  
  const [{ data: blogs }, { data: products }] = await Promise.all([
    supabase.from('blogs').select('slug, published_at').eq('is_published', true),
    supabase.from('products').select('slug, updated_at').eq('is_active', true),
  ]);

  if (blogs) {
    (blogs as { slug: string; published_at: string }[]).forEach(blog => {
      entries.push({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastModified: new Date(blog.published_at),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    });
  }

  if (products) {
    (products as { slug: string; updated_at: string | null }[]).forEach(product => {
      entries.push({
        url: `${baseUrl}/urunler/${product.slug}`,
        lastModified: new Date(product.updated_at || Date.now()),
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    });
  }

  if (!locations || locations.length === 0) return entries;

  // Iller (e.g. /istanbul)
  const ilSet = new Set<string>();
  locations.forEach((loc: any) => ilSet.add(loc.il));
  ilSet.forEach(il => {
    entries.push({
      url: `${baseUrl}/${il}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
    });
  });

  // Ilceler (e.g. /istanbul/gaziosmanpasa)
  const ilceMap = new Map<string, any>();
  locations.forEach((loc: any) => {
    const key = `${loc.il}/${loc.ilce}`;
    if (!ilceMap.has(key)) ilceMap.set(key, { il: loc.il, ilce: loc.ilce });
  });
  
  ilceMap.forEach((val, key) => {
    entries.push({
      url: `${baseUrl}/${key}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    });
    
    // Ilce + Hizmet (e.g. /istanbul/gaziosmanpasa/su-aritma-servisi)
    services.forEach((srv: any) => {
      entries.push({
        url: `${baseUrl}/${key}/${srv.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    });
  });

  // Mahalleler (e.g. /istanbul/gaziosmanpasa/sarigol)
  locations.forEach((loc: any) => {
    if (loc.mahalle) {
      entries.push({
        url: `${baseUrl}/${loc.il}/${loc.ilce}/${loc.mahalle}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      });

      // Mahalle + Hizmet (e.g. /istanbul/gaziosmanpasa/sarigol/filtre-degisimi)
      services.forEach((srv: any) => {
        entries.push({
          url: `${baseUrl}/${loc.il}/${loc.ilce}/${loc.mahalle}/${srv.slug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.5,
        });
      });
    }
  });

  return entries;
}
