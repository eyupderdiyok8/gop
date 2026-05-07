"use client";

import { useState } from "react";
import { ChevronDown, List } from "lucide-react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TOCProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TOCProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!headings || headings.length === 0) return null;

  // Most prominent headings or first few
  const MAX_VISIBLE = 5;
  const showButton = headings.length > MAX_VISIBLE;
  const visibleHeadings = isExpanded ? headings : headings.slice(0, MAX_VISIBLE);

  return (
    <div className="mb-12 bg-slate-50 border border-slate-100 rounded-3xl p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6 text-brand-navy">
        <div className="w-10 h-10 rounded-xl bg-brand-aqua/10 flex items-center justify-center text-brand-aqua">
          <List className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-heading font-bold m-0! p-0!">Bu Yazıda Neler Var?</h2>
      </div>

      <nav className="space-y-4">
        {visibleHeadings.map((heading, idx) => (
          <a
            key={idx}
            href={`#${heading.id}`}
            className={`block transition-all hover:text-brand-aqua group flex items-start gap-2 ${
              heading.level === 1 ? "font-bold text-brand-navy" : 
              heading.level === 2 ? "pl-4 text-slate-700 text-sm font-medium" : 
              "pl-8 text-slate-500 text-sm"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-aqua/40 mt-2 flex-shrink-0 group-hover:bg-brand-aqua transition-colors" />
            <span className="border-b border-transparent group-hover:border-brand-aqua/20">{heading.text}</span>
          </a>
        ))}
      </nav>

      {showButton && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-6 flex items-center gap-2 text-brand-aqua text-sm font-bold hover:gap-3 transition-all uppercase tracking-wider pl-1.5"
        >
          {isExpanded ? "Daha Az Gör" : `Tümünü Gör (${headings.length})`}
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
        </button>
      )}
    </div>
  );
}
