import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("appointment_blocks")
    .select("*")
    .order("blocked_date", { ascending: true })
    .order("blocked_time", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ blocks: data });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { blocked_date, blocked_time, reason } = body;

  if (!blocked_date) {
    return NextResponse.json({ error: "Tarih zorunludur" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("appointment_blocks")
    .insert({
      blocked_date,
      // Eğer saat 'null' gönderilmişse tüm günü kapatmak içindir
      blocked_time: blocked_time || null,
      reason: reason || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, block: data });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id zorunludur" }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("appointment_blocks")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
