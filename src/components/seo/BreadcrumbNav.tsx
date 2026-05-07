import Link from "next/link";
import Script from "next/script";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbNav({ items }: { items: BreadcrumbItem[] }) {
  if (!items || items.length === 0) return null;

  // Generate JSON-LD
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Ana Sayfa",
        "item": process.env.NEXT_PUBLIC_SITE_URL || "https://www.suaritmaservis34.com"
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.name,
        "item": `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.suaritmaservis34.com"}${item.url}`
      }))
    ]
  };

  return (
    <nav className="bg-muted/30 border-b border-border py-3 px-4 sm:px-6 lg:px-8 overflow-x-auto whitespace-nowrap">
      <Script
        id={`breadcrumb-schema-${Math.random().toString(36).substring(7)}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-brand-aqua transition-colors flex items-center justify-center">
          <Home className="w-4 h-4" />
        </Link>
        
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <div key={item.url} className="flex items-center gap-2">
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
              {isLast ? (
                <span className="font-medium text-foreground capitalize" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link href={item.url} className="hover:text-brand-aqua transition-colors capitalize">
                  {item.name}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
