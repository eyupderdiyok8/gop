import type { Metadata } from "next";

// Giriş sayfası arama sonuçlarında görünmesin
export const metadata: Metadata = {
  title: "Giriş",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
