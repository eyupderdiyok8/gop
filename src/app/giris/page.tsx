"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Droplets, 
  Lock, 
  Mail, 
  ArrowRight, 
  Loader2, 
  AlertCircle,
  ShieldCheck,
  Eye,
  EyeOff
} from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: loginError, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError("Geçersiz e-posta veya şifre.");
      setLoading(false);
      return;
    }

    // Role check (metadata'dan çekebiliriz)
    const role = data.user.user_metadata?.role;
    if (role === "admin") {
      router.push("/admin");
    } else {
      router.push("/musteri/panel");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1c26] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-dots opacity-10 pointer-events-none" />
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-aqua/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Brand */}
        <div className="text-center mb-0">
          <div className="inline-block animate-float">
            <img src="/logo.png" alt="SuArıtmaServis34" className="h-48 w-auto" />
          </div>
          <p className="text-white/40 text-sm mt-4">Müşteri paneline giriş yaparak cihazınızı takip edin.</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 lg:p-10 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-xs text-white/60 ml-1">E-POSTA ADRESİ</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="isim@örnek.com"
                  className="h-12 bg-white/5 border-white/10 rounded-2xl pl-12 text-white placeholder:text-white/20 focus:ring-brand-aqua/40 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <Label className="text-xs text-white/60">ŞİFRE</Label>
                <Link href="#" className="text-[11px] text-brand-aqua hover:underline transition-all">Şifremi Unuttum</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input 
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="h-12 bg-white/5 border-white/10 rounded-2xl pl-12 pr-12 text-white placeholder:text-white/20 focus:ring-brand-aqua/40 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-12 rounded-2xl gradient-teal text-white border-0 font-bold shadow-lg shadow-brand-aqua/20 transition-all"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>Giriş Yap <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-white/40 text-[10px] leading-relaxed">
              Hesabınız yok mu? Erişim için lütfen işletme ile iletişime geçin.
            </p>
          </div>
        </div>

        {/* Trust Footer */}
        <div className="mt-8 flex items-center justify-center gap-6 text-white/20">
          <div className="flex items-center gap-1.5 grayscale opacity-50">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-bold tracking-widest uppercase">Güvenli Bağlantı (SSL)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
