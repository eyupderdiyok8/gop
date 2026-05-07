"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Wallet } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const GELIR_KATEGORILERI = [
  "Cihaz Satışı",
  "Servis Ücreti",
  "Filtre Değişimi",
  "Yedek Parça Satışı",
  "Montaj Ücreti",
  "Abonelik/Periyodik",
  "Diğer"
];

const GIDER_KATEGORILERI = [
  "Malzeme Alımı",
  "Yakıt",
  "Elektrik Faturası",
  "Kira",
  "Maaş / Prim",
  "Vergi / SGK",
  "Araç Bakım",
  "Ulaşım / Kargo",
  "Yemek",
  "Diğer"
];

export function FinansListesi({ modalOnly = false }: { modalOnly?: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [tur, setTur] = useState<"gelir" | "gider">("gelir");
  const [kategori, setKategori] = useState("");
  const [tutar, setTutar] = useState("");
  const [aciklama, setAciklama] = useState("");
  const [durum, setDurum] = useState<"odendi" | "bekliyor">("odendi");
  const [customers, setCustomers] = useState<any[]>([]);
  const [customerId, setCustomerId] = useState<string>("none");

  const supabase = createClient();

  const fetchCustomers = async () => {
    const { data } = await supabase.from("customers").select("id, ad").order("ad");
    setCustomers(data || []);
  };

  useEffect(() => {
    if (open) fetchCustomers();
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kategori) {
      alert("Lütfen bir kategori seçin");
      return;
    }
    setLoading(true);

    try {
      const { error } = await supabase.from("transactions").insert({
        tur,
        kategori,
        tutar: parseFloat(tutar),
        aciklama,
        durum,
        customer_id: customerId === "none" ? null : customerId,
        yapan_kullanici: "Admin"
      });

      if (error) throw error;

      setOpen(false);
      
      // Reset form
      setKategori("");
      setTutar("");
      setAciklama("");
      setCustomerId("none");
      
      router.refresh();
    } catch (err: any) {
      console.error(err.message);
      alert("Hata oluştu: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {modalOnly ? (
        <DialogTrigger render={<Button className="gradient-teal border-0 font-medium text-slate-900 hover:opacity-90 transition-opacity" />}>
          <Plus className="w-4 h-4 mr-1" /> Yeni Kasa Özeti
        </DialogTrigger>
      ) : (
        <DialogTrigger render={<Button variant="outline" size="sm" className="bg-brand-aqua/10 text-brand-aqua border-brand-aqua/20 hover:bg-brand-aqua/20" />}>
          <Wallet className="w-4 h-4 mr-2" /> İşlem Ekle
        </DialogTrigger>
      )}
      <DialogContent className="bg-white border-slate-200 text-slate-900 sm:max-w-[425px] shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-slate-900">Yeni Finansal İşlem Ekle</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-5 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-600">İşlem Türü</Label>
              <Select value={tur} onValueChange={(val: any) => { setTur(val); setKategori(""); }}>
                <SelectTrigger className="bg-white border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 text-slate-900">
                  <SelectItem value="gelir">Gelir (Kasa Giriş)</SelectItem>
                  <SelectItem value="gider">Gider (Kasa Çıkış)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-600">Durum</Label>
              <Select value={durum} onValueChange={(val: any) => setDurum(val)}>
                <SelectTrigger className="bg-white border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 text-slate-900">
                  <SelectItem value="odendi">Ödendi (Kasaya Girdi)</SelectItem>
                  {tur === "gelir" && (
                     <SelectItem value="bekliyor">Veresiye / Açık Hesap</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-600">Cari / Müşteri (Opsiyonel)</Label>
            <Select value={customerId} onValueChange={(val: any) => setCustomerId(val)}>
              <SelectTrigger className="bg-white border-slate-200">
                <SelectValue placeholder="Müşteri seçin..." />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200 text-slate-900">
                <SelectItem value="none">Seçilmedi (Genel İşlem)</SelectItem>
                {customers.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.ad}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-600">Kategori</Label>
            <Select required value={kategori} onValueChange={(val: any) => setKategori(val)}>
              <SelectTrigger className="bg-white border-slate-200">
                <SelectValue placeholder="Kategori seçin..." />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200 text-slate-900">
                {(tur === "gelir" ? GELIR_KATEGORILERI : GIDER_KATEGORILERI).map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-600">Tutar (TL)</Label>
            <Input 
              required
              type="number"
              step="0.01"
              placeholder="0.00"
              className="bg-white border-slate-200"
              value={tutar}
              onChange={(e: any) => setTutar(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-600">Açıklama (Opsiyonel)</Label>
            <Input 
              placeholder="Detaylı notlar..."
              className="bg-white border-slate-200 placeholder:text-slate-400"
              value={aciklama}
              onChange={(e: any) => setAciklama(e.target.value)}
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button 
              type="button" 
              variant="ghost" 
              className="hover:bg-slate-100 text-slate-500 hover:text-slate-900"
              onClick={() => setOpen(false)}
            >
              İptal
            </Button>
            <Button type="submit" disabled={loading} className="gradient-teal">
              Kaydet
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
