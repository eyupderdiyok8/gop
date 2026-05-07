"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Calendar, Clock, Trash2, ShieldAlert } from "lucide-react";

type Block = {
  id: string;
  blocked_date: string;
  blocked_time: string | null;
  reason: string | null;
};

export default function SaatIslemleriPage() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isFullDay, setIsFullDay] = useState(false);
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  const loadBlocks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/randevu-blocks");
      const data = await res.json();
      if (data.blocks) setBlocks(data.blocks);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlocks();
  }, []);

  const handleBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return alert("Lütfen tarih seçin");
    if (!isFullDay && !time) return alert("Lütfen saat seçin veya komple günü kapatı işaretleyin");

    setSaving(true);
    try {
      const res = await fetch("/api/admin/randevu-blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blocked_date: date,
          blocked_time: isFullDay ? null : time + ":00",
          reason: reason || null,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Bilinmeyen Hata");
      }

      await loadBlocks();
      setDate("");
      setTime("");
      setIsFullDay(false);
      setReason("");
      alert("Başarıyla bloke edildi!");
    } catch (err: any) {
      alert("Hata: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu saati/günü tekrar randevuya açmak istediğinize emin misiniz?")) return;

    try {
      await fetch(`/api/admin/randevu-blocks?id=${id}`, { method: "DELETE" });
      setBlocks(blocks.filter((b) => b.id !== id));
    } catch (err) {
      alert("Silinirken hata oluştu!");
    }
  };

  const slots = [
    "00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00",
    "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
    "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"
  ];

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Çalışma Saatleri & Kapanışlar</h1>
        <p className="text-gray-500">Müsait olmadığınız veya randevu almak istemediğiniz saatleri / günleri buradan kapatabilirsiniz.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Form */}
        <div className="md:col-span-1 bg-white p-6 border rounded-xl shadow-sm h-fit">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Yeni Kapatma Ekle</h2>
          <form onSubmit={handleBlock} className="space-y-4">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tarih Seçin</label>
              <input 
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full border p-2 rounded focus:ring-primary focus:border-primary"
              />
            </div>

            <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded border">
              <input 
                type="checkbox" 
                id="fullDay"
                checked={isFullDay}
                onChange={e => setIsFullDay(e.target.checked)}
                className="rounded text-primary focus:ring-primary"
              />
              <label htmlFor="fullDay" className="text-sm font-medium cursor-pointer flex-1">Komple Günü Kapat</label>
            </div>

            {!isFullDay && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Saat Seçin</label>
                <select 
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  required={!isFullDay}
                  className="w-full border p-2 rounded focus:ring-primary focus:border-primary"
                >
                  <option value="">-- Saat Seç --</option>
                  {slots.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sebep / Not (İsteğe bağlı)</label>
              <input 
                type="text" 
                placeholder="Örn: Hasta, İzinli, Eğitim..."
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full border p-2 rounded focus:ring-primary focus:border-primary"
              />
            </div>

            <button 
              type="submit" 
              disabled={saving}
              className="w-full bg-red-600 hover:bg-red-700 text-slate-900 font-medium py-2 rounded transition-colors disabled:opacity-50"
            >
              {saving ? "Kaydediliyor..." : "Engelle / Kapat"}
            </button>
          </form>
        </div>

        {/* List */}
        <div className="md:col-span-2">
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 bg-gray-50 border-b font-semibold flex items-center justify-between">
              <span>Kapalı Tarih ve Saatler</span>
              <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600">{blocks.length} Kayıt</span>
            </div>
            
            {loading ? (
              <div className="p-4 md:p-8 text-center text-gray-500">Yükleniyor...</div>
            ) : blocks.length === 0 ? (
              <div className="p-4 md:p-8 text-center text-gray-500">
                <ShieldAlert className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                Henüz kapatılmış bir saat veya gün bulunmuyor.
              </div>
            ) : (
              <ul className="divide-y">
                {blocks.map(b => (
                  <li key={b.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                    <div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="font-medium text-gray-900">
                          {format(new Date(b.blocked_date), "dd MMMM yyyy", { locale: tr })}
                        </span>
                        
                        {b.blocked_time ? (
                          <span className="flex items-center text-sm font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                            <Clock className="w-3 h-3 mr-1" />
                            {b.blocked_time.substring(0, 5)}
                          </span>
                        ) : (
                          <span className="text-sm font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                            KAPALI (Tüm Gün)
                          </span>
                        )}
                      </div>
                      {b.reason && (
                        <p className="text-sm text-gray-500 mt-1 ml-6">&quot;{b.reason}&quot;</p>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => handleDelete(b.id)}
                      className="p-2 hover:bg-red-50 rounded text-red-500 transition-colors"
                      title="Kaldır ve Randevuya Aç"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
