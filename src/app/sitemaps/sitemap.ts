import { MetadataRoute } from 'next';
import { getActiveLocations, getActiveServices } from '@/lib/seo/db';
import { isIndexablePage } from '@/lib/seo/indexPolicy';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.suaritmaservis34.com';

// Search Console'da indeks durumunu türe göre izleyebilmek için sitemap'ler ayrı dosyalara bölünür:
// /sitemaps/sitemap/<id>.xml. Hepsi /sitemap.xml (src/app/sitemap.xml/route.ts) index'inde listelenir.
// Yeni bir id eklenirse src/app/sitemap.xml/route.ts içindeki listeye de eklenmeli.
const SITEMAP_IDS = ['sayfalar', 'blog', 'urunler', 'bolgeler'];

export async function generateSitemaps() {
  return SITEMAP_IDS.map((id) => ({ id }));
}

export default async function sitemap(props: { id: Promise<string> }): Promise<MetadataRoute.Sitemap> {
  const id = await props.id;

  if (id === 'sayfalar') return staticEntries();
  if (id === 'blog') return blogEntries();
  if (id === 'urunler') return productEntries();
  if (id === 'bolgeler') return locationEntries();
  return [];
}

function staticEntries(): MetadataRoute.Sitemap {
  return [
    { url: baseUrl, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/hizmetler`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/urunler`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/blog`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/iletisim`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/gizlilik-politikasi`, changeFrequency: 'yearly', priority: 0.3 },
  ];
}

async function blogEntries(): Promise<MetadataRoute.Sitemap> {
  const supabase = await (await import('@/lib/supabase/server')).createClient();
  const { data: blogs } = await supabase
    .from('blogs')
    .select('slug, published_at, updated_at, featured_image')
    .eq('is_published', true);

  return ((blogs as any[]) || []).map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: new Date(blog.updated_at || blog.published_at),
    changeFrequency: 'monthly',
    priority: 0.7,
    images: blog.featured_image ? [blog.featured_image] : undefined,
  }));
}

async function productEntries(): Promise<MetadataRoute.Sitemap> {
  const supabase = await (await import('@/lib/supabase/server')).createClient();
  const { data: products } = await supabase
    .from('products')
    .select('slug, updated_at, main_image, gallery')
    .eq('is_active', true);

  return ((products as any[]) || []).map((product) => {
    const productImages: string[] = [];
    if (product.main_image) productImages.push(product.main_image);
    if (product.gallery && Array.isArray(product.gallery)) {
      productImages.push(...product.gallery);
    }

    return {
      url: `${baseUrl}/urunler/${product.slug}`,
      lastModified: product.updated_at ? new Date(product.updated_at) : undefined,
      changeFrequency: 'monthly',
      priority: 0.8,
      images: productImages.length > 0 ? productImages : undefined,
    };
  });
}

// Sadece indekslenebilir bölge sayfaları: il, ilçe, ilçe × ana hizmet ve mahalle.
// Mahalle × hizmet ve düşük talepli hizmet kombinasyonları noindex olduğu için burada yer almaz.
async function locationEntries(): Promise<MetadataRoute.Sitemap> {
  const [locations, services] = await Promise.all([getActiveLocations(), getActiveServices()]);
  if (!locations || locations.length === 0) return [];

  const entries: MetadataRoute.Sitemap = [];
  const lastModified = (loc: any) => new Date(loc.updated_at || loc.created_at);

  // İl ve ilçe kayıtları (mahalle alanı boş olanlar), ardından mahalleler
  const sorted = [...locations].sort((a: any, b: any) => Number(!!a.mahalle) - Number(!!b.mahalle));

  sorted.forEach((loc: any) => {
    entries.push({
      url: `${baseUrl}/${loc.slug}`,
      lastModified: lastModified(loc),
      changeFrequency: 'monthly',
      priority: loc.mahalle ? 0.6 : loc.ilce ? 0.9 : 1.0,
    });

    services.forEach((srv: any) => {
      if (!srv.slug || !isIndexablePage(loc, srv.slug)) return;
      entries.push({
        url: `${baseUrl}/${loc.slug}/${srv.slug}`,
        lastModified: lastModified(loc),
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    });
  });

  return entries;
}
