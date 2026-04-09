import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("content_items")
    .select("*")
    .order("scheduled_for", { ascending: true });

  if (error) {
    // Table might not exist yet — return empty array with a setup hint
    console.warn("calendar-items GET error:", error.message);
    return NextResponse.json([]);
  }
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, error } = await supabase
    .from("content_items")
    .insert([body])
    .select()
    .single();

  if (error) {
    console.error("calendar-items POST error:", error.message);
    return NextResponse.json({ error: error.message, hint: "Run setup-db.sql in Supabase SQL editor" }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const { id, ...updates } = await req.json();
  const { data, error } = await supabase
    .from("content_items")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const { error } = await supabase.from("content_items").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
