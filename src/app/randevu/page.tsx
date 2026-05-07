import { redirect } from "next/navigation";

// Randevu formu artık ana sayfaya taşındı (Hero bölümü)
export default function RandevuPage() {
  redirect("/#randevu");
}
