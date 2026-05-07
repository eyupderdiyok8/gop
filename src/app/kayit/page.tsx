import { redirect } from "next/navigation";

export default function RegisterPage() {
  // Kayıt işlemi artık sadece Admin panelinden yapılabilir.
  redirect("/giris");
}
