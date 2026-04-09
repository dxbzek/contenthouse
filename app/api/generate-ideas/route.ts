import { NextRequest, NextResponse } from "next/server";
import { generateAngles, generateHooksForAngle } from "@/lib/gemini";
import { DEMO_IDEAS_RESPONSE, generateFallbackHooks } from "@/lib/demo-data";

export async function POST(req: NextRequest) {
  const { pillar, topic, contentMode, angle } = await req.json();

  if (!pillar || !topic) {
    return NextResponse.json({ error: "pillar and topic are required" }, { status: 400 });
  }

  // Hooks for a specific angle
  if (angle) {
    try {
      const result = await generateHooksForAngle(angle, pillar, topic, contentMode);
      return NextResponse.json(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("generate-hooks error:", msg);
      // Fall back to templated hooks based on the actual angle so content stays relevant
      if (msg.includes("503") || msg.includes("overloaded") || msg.includes("high demand") || msg.includes("Max retries")) {
        console.log("Using fallback hooks for angle");
        return NextResponse.json(generateFallbackHooks(angle));
      }
      return NextResponse.json({ error: "Hook generation failed. " + msg.substring(0, 100) }, { status: 500 });
    }
  }

  // Angle generation — fall back to demo on Gemini overload
  try {
    const result = await generateAngles(pillar, topic, contentMode);
    return NextResponse.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("generate-angles error:", msg);

    if (msg.includes("503") || msg.includes("overloaded") || msg.includes("high demand") || msg.includes("Max retries")) {
      console.log("Using demo fallback for angles");
      return NextResponse.json({ ideas: DEMO_IDEAS_RESPONSE.ideas, _demo: true });
    }

    return NextResponse.json({ error: "Generation failed. " + msg.substring(0, 100) }, { status: 500 });
  }
}
