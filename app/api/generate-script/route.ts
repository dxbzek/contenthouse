import { NextRequest, NextResponse } from "next/server";
import { generateScript } from "@/lib/gemini";
import { DEMO_SCRIPT_RESPONSE } from "@/lib/demo-data";

const RETRYABLE = (msg: string) =>
  msg.includes("503") ||
  msg.includes("overloaded") ||
  msg.includes("high demand") ||
  msg.includes("Max retries") ||
  msg.includes("UNAVAILABLE") ||
  msg.includes("fetch") ||
  msg.includes("network") ||
  msg.includes("timeout") ||
  msg.includes("500");

export async function POST(req: NextRequest) {
  try {
    const { hook, pillar, topic, contentMode } = await req.json();

    if (!hook || !pillar || !topic) {
      return NextResponse.json({ error: "hook, pillar, and topic are required" }, { status: 400 });
    }

    const result = await generateScript(hook, pillar, topic, contentMode);
    return NextResponse.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("generate-script error:", msg);

    // Fall back to demo on any Gemini/network failure — always show content, never a dead page
    if (RETRYABLE(msg)) {
      console.log("Using demo fallback for script");
      return NextResponse.json({ ...DEMO_SCRIPT_RESPONSE, _demo: true });
    }

    return NextResponse.json({ error: "Generation failed. " + msg.substring(0, 100) }, { status: 500 });
  }
}
