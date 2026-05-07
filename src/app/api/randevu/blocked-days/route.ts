import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];
  
  const { data, error } = await supabase
    .from("appointment_blocks")
    .select("blocked_date")
    .is("blocked_time", null)
    .gte("blocked_date", today);

  if (error) {
    return NextResponse.json({ blockedDays: [] });
  }

  const blockedDays = data?.map((d: any) => d.blocked_date) || [];
  return NextResponse.json({ blockedDays });
}
