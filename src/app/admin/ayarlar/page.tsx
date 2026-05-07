"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Technician } from "@/lib/types";
import { Plus, Trash2, Edit2, Loader2, Save, X } from "lucide-react";

export default function AyarlarPage() {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [settings, setSettings] = useState<{ [key: string]: any }>({
    carboy_price: 180,
    maintenance_price: 1500,
  });
  const [loading, setLoading] = useState(true);
  const [updatingSettings, setUpdatingSettings] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [newName, setNewName] = useState("");

  const fetchData = async () => {
    setLoading(true);
    const supabase = createClient();
    
    // Fetch Technicians
    const { data: techData } = await supabase.from("technicians").select("*").order("created_at", { ascending: true });
    setTechnicians(techData ?? []);

    // Fetch Settings
    const { data: settingsData } = await supabase.from("site_settings").select("*");
    if (settingsData) {
      const settingsObj = { ...settings };
      settingsData.forEach(s => {
        settingsObj[s.key] = s.value;
      });
      setSettings(settingsObj);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateSetting = async (key: string, value: number) => {
    if (isNaN(value)) return;
    setUpdatingSettings(true);
    const supabase = createClient();
    const { error } = await supabase.from("site_settings").upsert({ 
      key, 
      value,
      updated_at: new Date().toISOString() 
    }, { onConflict: "key" });
    
    if (error) {
      alert("Ayar güncellenirken hata oluştu!");
    } else {
      setSettings(prev => ({ ...prev, [key]: value }));
    }
    setUpdatingSettings(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const supabase = createClient();
    await supabase.from("technicians").insert({ ad_soyad: newName.trim(), aktif: true });
    setNewName("");
    fetchData();
  };

  const handleDelete = async (id: string, ad: string) => {
    if (!confirm(`"${ad}" adlı teknisyeni silmek istediğinizden emin misiniz?`)) return;
    const supabase = createClient();
    await supabase.from("technicians").delete().eq("id", id);
    fetchData();
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    const supabase = createClient();
    await supabase.from("technicians").update({ ad_soyad: editName.trim() }).eq("id", id);
    setEditingId(null);
    fetchData();
  };

  const toggleAktif = async (id: string, current: boolean) => {
    const supabase = createClient();
    await supabase.from("technicians").update({ aktif: !current }).eq("id", id);
    fetchData();
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-heading font-bold text-slate-900 mb-2">Ayarlar & Tanımlamalar</h1>
        <p className="text-slate-500 text-sm">Sistemdeki genel tanımlamaları ve çalışanları yönetin.</p>
      </div>

      {/* GENEL AYARLAR BÖLÜMÜ */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-heading font-bold text-slate-900">Hesaplayıcı Ayarları</h2>
            <p className="text-xs text-slate-500 mt-1">Web ve Mobil uygulamadaki damacana hesaplayıcı değerleri</p>
          </div>
          {updatingSettings && <Loader2 className="w-4 h-4 text-brand-aqua animate-spin" />}
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase">Damacana Fiyatı (19L)</label>
            <div className="relative">
              <input 
                type="number" 
                value={settings.carboy_price} 
                onChange={(e) => setSettings(prev => ({...prev, carboy_price: e.target.value}))}
                onBlur={(e) => handleUpdateSetting('carboy_price', Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-brand-aqua/50"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₺</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase">Yıllık Bakım Tahmini</label>
            <div className="relative">
              <input 
                type="number" 
                value={settings.maintenance_price} 
                onChange={(e) => setSettings(prev => ({...prev, maintenance_price: e.target.value}))}
                onBlur={(e) => handleUpdateSetting('maintenance_price', Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-brand-aqua/50"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₺</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-heading font-bold text-slate-900">Teknisyen Yönetimi</h2>
          <p className="text-xs text-slate-500 mt-1">Formlarda seçilebilir teknisyen listesi</p>
        </div>

        <div className="p-6">
          <form onSubmit={handleAdd} className="flex gap-3 mb-6">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Yeni Teknisyen Adı..."
              className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-aqua/50 focus:ring-1 focus:ring-brand-aqua/20 transition"
            />
            <button
              type="submit"
              disabled={!newName.trim()}
              className="px-5 py-2.5 bg-brand-aqua hover:bg-brand-aqua disabled:opacity-50 text-white rounded-xl text-sm font-medium transition flex items-center gap-2 shadow-lg shadow-brand-aqua/20"
            >
              <Plus className="w-4 h-4" /> Ekle
            </button>
          </form>

          {loading ? (
            <div className="py-8 flex justify-center">
              <Loader2 className="w-6 h-6 text-brand-aqua animate-spin" />
            </div>
          ) : (
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {technicians.length === 0 && (
                <div className="p-6 text-center text-slate-400 text-sm">Kayıtlı teknisyen yok.</div>
              )}
              {technicians.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-4 hover:bg-white/3 transition">
                  {editingId === t.id ? (
                    <div className="flex-1 flex items-center gap-3">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:border-brand-aqua/50 w-full max-w-xs"
                        autoFocus
                      />
                      <button onClick={() => handleUpdate(t.id)} className="text-brand-aqua hover:text-brand-aqua p-1">
                        <Save className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-slate-700 p-1">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center gap-4">
                      <p className="text-sm font-medium text-slate-900">{t.ad_soyad}</p>
                      <button
                        onClick={() => toggleAktif(t.id, t.aktif)}
                        className={`text-xs px-2.5 py-1 rounded-full border transition font-medium ${
                          t.aktif 
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                            : "bg-slate-50 text-slate-400 border-slate-200"
                        }`}
                      >
                        {t.aktif ? "Aktif" : "Pasif"}
                      </button>
                    </div>
                  )}

                  {editingId !== t.id && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => { setEditingId(t.id); setEditName(t.ad_soyad); }}
                        className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id, t.ad_soyad)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
