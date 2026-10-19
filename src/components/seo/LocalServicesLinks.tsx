import { Wrench, ArrowRight } from "lucide-react";
import Link from "next/link";

export interface ServiceLink {
  href: string;
  label: string;
  description?: string;
}

export function LocalServicesLinks({
  links,
  title,
}: {
  links: ServiceLink[];
  title: string;
}) {
  if (!links || links.length === 0) return null;

  return (
    <section className="py-12 bg-background px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-heading font-bold text-xl text-brand-navy mb-6">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex flex-col gap-2 p-5 rounded-2xl bg-muted/40 border border-border hover:border-brand-aqua hover:bg-brand-aqua/5 transition-colors"
            >
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                <Wrench className="w-4 h-4 text-brand-aqua flex-shrink-0" />
                {link.label}
                <ArrowRight className="w-3.5 h-3.5 ml-auto text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </span>
              {link.description && (
                <span className="text-sm text-muted-foreground leading-relaxed">{link.description}</span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
