"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { ExternalLink, Loader2, Save, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TiptapEditor } from "@/components/admin/blog/TiptapEditor";
import { saveRegionPage } from "@/app/admin/bolge-icerikleri/actions";

interface PageContent {
  h1: string;
  title: string;
  meta_description: string;
  ozel_icerik: string;
  yayinda: boolean;
}

export interface RegionPageRow {
  key: string;
  locationId: string;
  serviceId: string | null;
  path: string;
  label: string;
  ilce: string;
  level: string;
  page: PageContent | null;
}

const EMPTY: PageContent = { h1: "", title: "", meta_description: "", ozel_icerik: "", yayinda: true };

export function RegionContentClient({ rows }: { rows: RegionPageRow[] }) {
  const [query, setQuery] = useState("");
  const [ilce, setIlce] = useState("");
  const [onlyEmpty, setOnlyEmpty] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [form, setForm] = useState<PageContent>(EMPTY);
  const [saved, setSaved] = useState<Record<string, PageContent>>({});
  const [isPending, startTransition] = useTransition();

  const ilceler = useMemo(() => Array.from(new Set(rows.map((r) => r.ilce))), [rows]);
  const contentOf = (row: RegionPageRow) => saved[row.key] ?? row.page;
  const filledCount = rows.filter((r) => contentOf(r)?.ozel_icerik).length;

  const filtered = rows.filter((r) => {
    if (ilce && r.ilce !== ilce) return false;
    if (onlyEmpty && contentOf(r)?.ozel_icerik) return false;
    const q = query.trim().toLocaleLowerCase("tr");
    return !q || r.label.toLocaleLowerCase("tr").includes(q) || r.path.includes(q);
  });

  const selected = rows.find((r) => r.key === selectedKey) || null;

  const select = (row: RegionPageRow) => {
    setSelectedKey(row.key);
    setForm({ ...EMPTY, ...(contentOf(row) || {}) });
  };

  const save = () => {
    if (!selected) return;
    startTransition(async () => {
      const result = await saveRegionPage({
        locationId: selected.locationId,
        serviceId: selected.serviceId,
        path: selected.path,
        ...form,
      });
      if (result.ok) {
        setSaved((prev) => ({ ...prev, [selected.key]: form }));
        toast.success("Bölge içeriği kaydedildi.");
      } else {
        toast.error(result.error || "Kaydedilemedi.");
      }
    });
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-4">
        <div className="flex flex-col gap-3 mb-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Mahalle, ilçe veya hizmet ara"
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={ilce}
              onChange={(e) => setIlce(e.target.value)}
              className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm"
            >
              <option value="">Tüm ilçeler</option>
              {ilceler.map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <Switch checked={onlyEmpty} onCheckedChange={setOnlyEmpty} /> Sadece içeriği olmayanlar
            </label>
          </div>
          <p className="text-xs text-slate-500">
            {rows.length} sayfanın {filledCount} tanesinde özel içerik var.
          </p>
        </div>

        <ul className="divide-y divide-slate-100 max-h-[70vh] overflow-y-auto">
          {filtered.map((row) => {
            const hasContent = !!contentOf(row)?.ozel_icerik;
            return (
              <li key={row.key}>
                <button
                  type="button"
                  onClick={() => select(row)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 hover:bg-slate-50 ${selectedKey === row.key ? "bg-brand-aqua/10" : ""}`}
                >
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${hasContent ? "bg-emerald-500" : "bg-slate-300"}`} />
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-medium text-slate-900 truncate">{row.label}</span>
                    <span className="block text-xs text-slate-500 truncate">{row.path}</span>
                  </span>
                  <span className="text-[11px] text-slate-500 flex-shrink-0">{row.level}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6">
        {!selected ? (
          <p className="text-slate-500 text-sm">Düzenlemek için soldan bir bölge sayfası seçin.</p>
        ) : (
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-heading font-bold text-lg text-slate-900">{selected.label}</h2>
                <a
                  href={selected.path}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-brand-aqua inline-flex items-center gap-1 hover:underline"
                >
                  {selected.path} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <Switch checked={form.yayinda} onCheckedChange={(v) => setForm({ ...form, yayinda: v })} /> Yayında
              </label>
            </div>

            <div className="space-y-2">
              <Label>Sayfa başlığı (H1)</Label>
              <Input value={form.h1} onChange={(e) => setForm({ ...form, h1: e.target.value })} placeholder={selected.label} />
            </div>
            <div className="space-y-2">
              <Label>SEO başlığı (title)</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Boş bırakılırsa otomatik oluşturulur" />
              <p className="text-xs text-slate-400">{form.title.length}/60 karakter</p>
            </div>
            <div className="space-y-2">
              <Label>Meta açıklama</Label>
              <Textarea
                value={form.meta_description}
                onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
                rows={3}
                placeholder="Arama sonuçlarında görünen açıklama"
              />
              <p className="text-xs text-slate-400">{form.meta_description.length}/160 karakter</p>
            </div>
            <div className="space-y-2">
              <Label>Bölgeye özel içerik</Label>
              <p className="text-xs text-slate-500">
                Örnek: bu bölgede yapılan montaj ve servis işleri, müşteri yorumları, ortalama varış süresi,
                bölgedeki bina tipleri ve su basıncı gözlemleri. En az 150-200 kelime önerilir.
              </p>
              <TiptapEditor
                key={selected.key}
                content={form.ozel_icerik}
                onChange={(html) => setForm((prev) => ({ ...prev, ozel_icerik: html }))}
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={save} disabled={isPending} className="bg-brand-aqua hover:bg-brand-aqua/90 text-slate-900">
                {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Kaydet
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
