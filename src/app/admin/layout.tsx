import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminRealtimeNotifier } from "@/components/admin/AdminRealtimeNotifier";
import { Toaster } from "sonner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Admin Panel | SuArıtmaServis34",
    template: "%s | Admin Panel",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      {/* Sidebar & Mobile Topbar */}
      <AdminSidebar />
 
      {/* İçerik */}
      <main className="flex-1 min-w-0 overflow-x-hidden">
        <Toaster position="top-right" expand={false} richColors theme="light" />
        <AdminRealtimeNotifier />
        {children}
      </main>
    </div>
  );
}
