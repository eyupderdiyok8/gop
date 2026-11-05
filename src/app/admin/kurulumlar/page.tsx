"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getSeoFileName } from "@/lib/slugify";
import { parseYouTube, toInstallationMedia, type InstallationRow } from "@/lib/installations/media";
import { ArrowDown, ArrowUp, Eye, EyeOff, Loader2, Play, Plus, Trash2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

type Row = InstallationRow & { display_order: number; is_active: boolean };

const BUCKET = "products";
const FOLDER = "kurulumlar";

async function fetchRows(): Promise<Row[] | null> {
  const { data, error } = await createClient()
    .from("installation_media")
    .select("id, kind, image_url, video_url, caption, display_order, is_active")
    .order("display_order")
    .order("created_at", { ascending: false });
  return error ? null : (data as Row[]);
}

/** Sitedeki sayfaları yeniler; hata olursa en geç 5 dakikada kendiliğinden yenilenir */
const refreshSite = () => fetch("/api/admin/kurulumlar/yenile", { method: "POST" }).catch(() => {});

export default function KurulumlarPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [missing, setMissing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoCaption, setVideoCaption] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const reload = () =>
    fetchRows().then((r) => {
      if (r) setRows(r);
      else setMissing(true);
      setLoading(false);
    });

  useEffect(() => {
    reload();
  }, []);

  const nextOrder = () => (rows.length ? Math.max(...rows.map((r) => r.display_order)) + 1 : 1);

  const afterChange = async () => {
    await reload();
    refreshSite();
  };

  const uploadPhotos = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    const supabase = createClient();
    let order = nextOrder();
    for (const file of Array.from(files)) {
      const path = `${FOLDER}/${getSeoFileName(file.name)}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, file);
      if (error) {
        alert(`"${file.name}" yüklenemedi: ${error.message}`);
        continue;
      }
      const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path);
      await supabase.from("installation_media").insert({ kind: "image", image_url: publicUrl, caption: "", display_order: order++ });
    }
    if (fileRef.current) fileRef.current.value = "";
    await afterChange();
    setBusy(false);
  };

  const addVideo = async () => {
    if (!parseYouTube(videoUrl)) {
      alert("Geçerli bir YouTube bağlantısı girin (youtube.com/watch, youtu.be ya da youtube.com/shorts).");
      return;
    }
    setBusy(true);
    const { error } = await createClient()
      .from("installation_media")
      .insert({ kind: "video", video_url: videoUrl.trim(), caption: videoCaption.trim(), display_order: nextOrder() });
    if (error) alert("Video eklenemedi: " + error.message);
    setVideoUrl("");
    setVideoCaption("");
    await afterChange();
    setBusy(false);
  };

  const update = async (id: string, values: Partial<Row>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...values } : r)));
    const { error } = await createClient().from("installation_media").update(values).eq("id", id);
    if (error) alert("Kaydedilemedi: " + error.message);
    refreshSite();
  };

  const move = async (index: number, dir: -1 | 1) => {
    const other = rows[index + dir];
    const row = rows[index];
    if (!other) return;
    setBusy(true);
    const supabase = createClient();
    // Sıra numaraları çakışabileceği için iki satır listedeki yerine göre yeniden numaralanır
    await Promise.all([
      supabase.from("installation_media").update({ display_order: index + dir + 1 }).eq("id", row.id),
      supabase.from("installation_media").update({ display_order: index + 1 }).eq("id", other.id),
    ]);
    await afterChange();
    setBusy(false);
  };

  const remove = async (row: Row) => {
    if (!confirm("Bu kaydı silmek istediğinize emin misiniz?")) return;
    setBusy(true);
    const supabase = createClient();
    await supabase.from("installation_media").delete().eq("id", row.id);
    // Panelden yüklenen fotoğraf depodan da silinir (sitenin kendi görselleri dokunulmaz)
    const marker = `/storage/v1/object/public/${BUCKET}/`;
    if (row.image_url?.includes(marker)) {
      await supabase.storage.from(BUCKET).remove([decodeURIComponent(row.image_url.split(marker)[1])]);
    }
    await afterChange();
    setBusy(false);
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-5xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-slate-900 mb-2">Kurulumlarımızdan</h1>
          <p className="text-slate-500 text-sm">
            Ana sayfa ve Hakkımızda&apos;daki kaydırmalı kurulum şeridi. İlk 3 kayıt ekranda görünür, diğerleri oklarla kaydırılır.
          </p>
        </div>
        {busy && <Loader2 className="w-5 h-5 text-brand-aqua animate-spin shrink-0" />}
      </div>

      {missing ? (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
          Bu sayfa için Supabase&apos;de <code>034_installation_media.sql</code> dosyasının çalıştırılması gerekiyor.
        </p>
      ) : (
        <>
          {/* Ekleme */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
              <h2 className="font-heading font-bold text-slate-900">Fotoğraf Ekle</h2>
              <p className="text-xs text-slate-500">Birden fazla fotoğraf seçebilirsiniz. Dikey (4:5) fotoğraflar en iyi görünür.</p>
              <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => uploadPhotos(e.target.files)} />
              <button
                type="button"
                disabled={busy}
                onClick={() => fileRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-6 text-sm font-medium text-slate-500 hover:border-brand-aqua/50 hover:text-brand-aqua disabled:opacity-50 transition"
              >
                <Upload className="w-4 h-4" /> Fotoğraf seç ve yükle
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
              <h2 className="font-heading font-bold text-slate-900">YouTube Videosu Ekle</h2>
              <input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/shorts/..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand-aqua/50"
              />
              <input
                value={videoCaption}
                onChange={(e) => setVideoCaption(e.target.value)}
                placeholder="Açıklama, örn: Sultangazi tezgah altı kurulum"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand-aqua/50"
              />
              <button
                type="button"
                disabled={busy || !videoUrl.trim()}
                onClick={addVideo}
                className="flex items-center gap-2 px-5 py-2.5 bg-brand-aqua disabled:opacity-50 text-white rounded-xl text-sm font-medium shadow-lg shadow-brand-aqua/20"
              >
                <Plus className="w-4 h-4" /> Videoyu Ekle
              </button>
            </div>
          </div>

          {/* Liste */}
          {loading ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="w-6 h-6 text-brand-aqua animate-spin" />
            </div>
          ) : rows.length === 0 ? (
            <p className="text-sm text-slate-500">Henüz kayıt yok. Kayıt eklenene kadar sitede örnek kurulum görselleri görünür.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {rows.map((row, i) => {
                const media = toInstallationMedia(row);
                return (
                  <div key={row.id} className={cn("bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm", !row.is_active && "opacity-50")}>
                    <div className="relative aspect-[4/5] bg-slate-100">
                      {media && <img src={media.thumb} alt={media.caption} className="h-full w-full object-cover" />}
                      {row.kind === "video" && (
                        <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[11px] font-medium text-white">
                          <Play className="w-3 h-3 fill-white" /> Video
                        </span>
                      )}
                      <span className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-bold text-slate-700">{i + 1}</span>
                    </div>
                    <div className="p-3 space-y-2">
                      <input
                        defaultValue={row.caption ?? ""}
                        onBlur={(e) => e.target.value !== (row.caption ?? "") && update(row.id, { caption: e.target.value })}
                        placeholder="Açıklama yazın"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-brand-aqua/50"
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                          <button type="button" disabled={busy || i === 0} onClick={() => move(i, -1)} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30" aria-label="Öne al">
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button type="button" disabled={busy || i === rows.length - 1} onClick={() => move(i, 1)} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30" aria-label="Geriye al">
                            <ArrowDown className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => update(row.id, { is_active: !row.is_active })}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                            aria-label={row.is_active ? "Sitede gizle" : "Sitede göster"}
                            title={row.is_active ? "Sitede gizle" : "Sitede göster"}
                          >
                            {row.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          <button type="button" disabled={busy} onClick={() => remove(row)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50" aria-label="Sil">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
