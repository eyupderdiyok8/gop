import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { CustomerDetailClient } from "@/components/admin/musteriler/CustomerDetailClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("customers").select("ad").eq("id", id).single();
  return { title: data?.ad ?? "Müşteri Detayı" };
}

export default async function CustomerDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const [
    { data: customer },
    { data: devices },
    { data: appointments },
    { data: notes },
  ] = await Promise.all([
    supabase.from("customers").select("*").eq("id", id).single(),
    supabase
      .from("devices")
      .select("*, service_records(*), filter_plans(*)")
      .eq("customer_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("appointments")
      .select("*")
      .eq("customer_id", id)
      .order("randevu_tarihi", { ascending: false })
      .limit(10),
    supabase
      .from("customer_notes")
      .select("*")
      .eq("customer_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (!customer) notFound();

  return (
    <CustomerDetailClient
      customer={customer}
      devices={devices ?? []}
      appointments={appointments ?? []}
      notes={notes ?? []}
    />
  );
}
