import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { AKF_VOICE_PROFILE } from "./voice/akf-profile";
import type { ContentMode } from "./voice/akf-profile";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Retry helper — handles 503 overload spikes with exponential backoff
async function withRetry<T>(fn: () => Promise<T>, retries = 5, baseDelayMs = 3000): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      const isRetryable =
        msg.includes("503") ||
        msg.includes("overloaded") ||
        msg.includes("UNAVAILABLE") ||
        msg.includes("high demand");
      if (!isRetryable || i === retries - 1) throw err;
      const delay = baseDelayMs * Math.pow(1.5, i); // 3s, 4.5s, 6.75s, 10s, 15s
      console.log(`Gemini 503 — retrying in ${Math.round(delay / 1000)}s (attempt ${i + 1}/${retries})`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error("Max retries exceeded");
}

function getVoiceSystemPrompt(): string {
  const profile = AKF_VOICE_PROFILE;
  return `You are a world-class content strategist generating content EXCLUSIVELY for ${profile.name} (${profile.handle}), founder of ERE Homes, Dubai's leading luxury real estate agency.

VOICE DNA:
${profile.persona}

TONE ATTRIBUTES:
${profile.toneAttributes.map((a, i) => `${i + 1}. ${a.label}: ${a.description}\n   Example: "${a.example}"`).join("\n")}

PREFERRED VOCABULARY: ${profile.vocabulary.preferred.join(", ")}
NEVER USE: ${profile.vocabulary.avoided.join("; ")}

SIGNATURE PATTERNS:
${profile.signaturePatterns.map((p, i) => `${i + 1}. ${p}`).join("\n")}

SAMPLE POSTS (match this energy and sentence rhythm):
${profile.samplePosts.map((p) => `• "${p}"`).join("\n")}

AUDIENCE: ${profile.audiencePersona.primary}

NATURALISATION RULES — sound like Abdul, not an AI:
- NEVER use: "As a result", "In conclusion", "It's important to note", "Let's dive in", "In the world of", "Delve into", "Navigating", "Landscape", "Game-changer", "Leverage" (as a verb)
- Use short punchy sentences. Fragments are fine for emphasis. Like this.
- Numbers conversational: "AED 4 billion" not "AED 4,000,000,000"
- The company is ERE Homes. NEVER write "AKF Homes" in generated content.
- Sound like a trusted friend who happens to know the Dubai property market inside out — not a marketing brochure.

SCRIPT FORMAT — ABSOLUTE PROHIBITIONS:
- NEVER label script sections: no "BEAT 1", "BEAT 2", "BEAT 3", no "HOOK:", no "CTA:"
- NEVER write shot directions: no "[SHOT:", no "[CUT TO:", no "[B-ROLL:"
- NEVER write scripts longer than 150 words — Reels target 30-45 seconds when spoken aloud
- NEVER use passive voice: "it can be seen", "it is worth noting", "it is important to"
- NEVER open a Reel with "Are you looking for..." or "Have you ever wondered..."
- NEVER use numbered frameworks: no "First truth... Second truth...", no "3 reasons why...", no "Truth #1:", no "Point 1, Point 2, Point 3" — these are AI structures, not how Abdul talks
- NEVER use vague motivational phrases: "You can watch. Or you can act.", "The time is now.", "Don't miss out.", "What are you waiting for?" — these are sales clichés, not Abdul's voice
- The instagram_reel field contains ONLY the spoken words, with line breaks between distinct thoughts

NO INVENTED STATISTICS — this is the most important rule:
- NEVER invent specific percentages, growth figures, or market statistics
- Examples of what is BANNED: "140% capital growth", "prices up 23%", "12-15% growth", "7.8% yield on this specific property"
- ONLY use numbers that Abdul explicitly wrote in the hook or topic seed
- If no number was provided, describe the direction in plain language: "values have been climbing for years" not "values are up 14%"
- If you invent a statistic and it turns out to be wrong, it will embarrass Abdul publicly. This is a hard rule with no exceptions.

PLAIN ENGLISH RULE — use simpler words, not inline definitions:
The goal is language a smart person who has never bought property can follow easily. The way to achieve this is NOT to add dictionary definitions after every term using dashes. That sounds like a textbook. The way to achieve this is to choose words that don't need explaining in the first place.

WRONG approach (do not do this):
"Off-plan options – properties still under construction – offer a strategic entry point."
"Ready properties – those you can move into today – are scarce."
"Capital growth – the increase in the property's value – has been significant."

RIGHT approach (do this instead):
"Some people are buying apartments before the building is even finished. Lower price in. More upside when it's done."
"Properties you can move into today are running out on the Palm."
"The value has been climbing. My clients who bought in 2018 have seen their properties more than double."

The rule: if a word needs a definition in brackets or after a dash, replace that word with a simpler one. Never use em-dashes to define terms.

ALSO BANNED — phrases that sound like a financial report:
- "appreciating assets" → say "property that goes up in value"
- "capital growth" → say "the value went up" or just give the numbers
- "strategic entry point" → say "a good time to buy"
- "investment portfolio" → say "what you own" or "your investments"
- "prime location" → name the actual place
- "wealth building" → say "building wealth" or just describe the outcome

WHAT GOOD AKF SCRIPTS SOUND LIKE — match this register exactly:
"350K AED. That's what it takes to start in Dubai real estate. Not 10 million. 350K — a studio apartment that pays its own costs through rental income."
"A client flew in from Manchester. Said 'I thought this was for billionaires.' He bought a studio in JVC three days later."
"2010. Downtown Dubai. Burj Khalifa just opened. More cranes than people. I bought my first unit for 400K. That same apartment is 1.8M today."
"Someone told me Dubai real estate is too expensive. [pause] A studio in JVC earns more in rent each year than a buy-to-let in some parts of Manchester costs to run."

Short sentences. Real numbers. Plain language. Never abstract. Always specific.

CONTENT RULES:
- Sound like AKF, not an AI
- Always use AED denomination for Dubai property amounts
- Be direct, numbers-first, challenger-minded
- Never use generic real estate clichés`;
}

export async function generateAngles(pillar: string, topic: string, contentMode?: ContentMode) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          ideas: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                angle: { type: SchemaType.STRING },
                rationale: { type: SchemaType.STRING },
                recommendedFormat: { type: SchemaType.STRING },
              },
              required: ["angle", "rationale", "recommendedFormat"],
            },
          },
        },
        required: ["ideas"],
      },
    },
    systemInstruction: getVoiceSystemPrompt(),
  });

  const modeBlock = contentMode
    ? `
CONTENT MODE: ${contentMode.name}
GOAL: ${contentMode.description}
HOW TO WRITE IT: ${contentMode.scriptStyle}
TONE: ${contentMode.toneNote}

REFERENCE EXAMPLES — angles must match this register exactly:
${contentMode.goodExamples.map((e, i) => `${i + 1}. "${e}"`).join("\n")}

All 3 angles must feel like they belong to the same voice as the examples above.`
    : "";

  const prompt = `Generate 3 distinct content angles for the "${pillar}" pillar on the topic: "${topic}".

ANGLE FORMAT RULES (critical):
- angle: Write this as the actual premise of the video — what Abdul would say or do, not a description of what the video achieves. Write it like a short logline: "The moment a client was ready to sign a AED 2M deal and couldn't remember his online banking password." NOT: "Highlight the amusing side of investor eagerness in Dubai."
- rationale: Maximum 10 words. Why this angle works. No corporate language.
- recommendedFormat: One of: Instagram Reel, Instagram Carousel, LinkedIn Post, YouTube Short
- NEVER invent statistics or percentages — only use numbers Abdul provided in the topic seed${modeBlock}`;

  return withRetry(() =>
    model.generateContent(prompt).then((r) => JSON.parse(r.response.text()))
  );
}

export async function generateHooksForAngle(angle: string, pillar: string, topic: string, contentMode?: ContentMode) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          hooks: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                type: { type: SchemaType.STRING },
                hook: { type: SchemaType.STRING },
              },
              required: ["type", "hook"],
            },
          },
        },
        required: ["hooks"],
      },
    },
    systemInstruction: getVoiceSystemPrompt(),
  });

  const modeBlock = contentMode
    ? `
CONTENT MODE: ${contentMode.name}
OPENING STYLE: ${contentMode.openingPattern}
TONE: ${contentMode.toneNote}

REFERENCE EXAMPLES — hooks must match this register exactly:
${contentMode.goodExamples.map((e, i) => `${i + 1}. "${e}"`).join("\n")}`
    : "";

  const prompt = `Write 10 hook variants for an Instagram Reel / LinkedIn post about this specific angle:

ANGLE (this is the video's premise — every hook must open THIS story, not a different one):
"${angle}"

Context: Pillar: ${pillar} | Topic: ${topic}

Return exactly 10 hooks: 2 curiosity, 2 contrarian, 2 list, 2 story, 1 question, 1 bold-statement

HOOK FORMAT RULES:
- Under 25 words. In AKF's voice. Ready to speak aloud as the opening line.
- Every hook must be a different way to START the same video — same story, different entry point.
- No AI phrases. Plain English.
- Write the actual words Abdul would say, not a description of what the hook does.
- NEVER invent statistics or percentages — only use numbers already in the angle or topic seed
- No numbered structures: "3 reasons why...", "First truth..." are banned
- No financial report language: "appreciating assets", "strategic entry point", "investment portfolio"${modeBlock}`;

  return withRetry(() =>
    model.generateContent(prompt).then((r) => JSON.parse(r.response.text()))
  );
}

export async function generateScript(hook: string, pillar: string, topic: string, contentMode?: ContentMode) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          instagram_reel: { type: SchemaType.STRING },
          instagram_caption: { type: SchemaType.STRING },
          hashtags: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
          linkedin: { type: SchemaType.STRING },
          youtube_short: { type: SchemaType.STRING },
          facebook: { type: SchemaType.STRING },
        },
        required: ["instagram_reel", "instagram_caption", "hashtags", "linkedin", "youtube_short", "facebook"],
      },
    },
    systemInstruction: getVoiceSystemPrompt(),
  });

  const modeInject = contentMode
    ? `\nTONE FOR THIS PIECE: ${contentMode.toneNote}\nSimple language — choose words that don't need explaining. No em-dash definitions. No invented statistics.`
    : `\nSimple language — choose words that don't need explaining. No em-dash definitions. No invented statistics.`;

  const reelModeBlock = contentMode
    ? `
MODE: ${contentMode.name}
${contentMode.scriptStyle}
OPENING: ${contentMode.openingPattern}
TONE: ${contentMode.toneNote}

REFERENCE — write in this exact register, applied to the given hook and topic:
${contentMode.goodExamples.map((e) => `"${e}"`).join("\n\n")}`
    : `Open with the exact hook line as given. 2-3 punchy points. Use the numbers Abdul provided — never invent new ones. Simple words throughout. One direct question at the end.`;

  const prompt = `Create a full multi-platform content package using this hook:
"${hook}"
Pillar: ${pillar} | Topic: ${topic}

Generate exactly these 6 outputs:

1. instagram_reel
TARGET: 30-45 seconds when spoken aloud. 100-150 words MAXIMUM — count them before outputting.

Write ONLY the spoken words. No beat labels. No shot directions. No annotations of any kind. Just what Abdul says, with line breaks between distinct thoughts.

FORMAT:
- Short sentences. Fragments are encouraged — they create rhythm.
- Numbers spoken naturally: "350K AED" not "AED 350,000"
- One direct question or CTA at the very end
- SIMPLE WORDS: choose language that doesn't need explaining. If a word needs a definition, use a simpler word instead. No em-dash definitions.
${reelModeBlock}

2. instagram_caption
150-200 words. SEO CRITICAL: The first 3 lines (before Instagram's 'More' cutoff) MUST naturally include high-intent search keywords such as 'Dubai real estate', 'invest in Dubai', or 'Dubai property investment'. Hook as the very first line. 3-4 short paragraphs. End with a direct engagement question. AKF's voice throughout.${modeInject}

3. hashtags
Exactly 12-15 tags, no # symbol. Follow this tier structure:
- 5 niche tags: DubaiRealEstate2026, DubaiPropertyInvestment, EREHomes, DubaiLuxuryHomes, OffPlanDubai
- 5 mid-range tags: DubaiRealEstate, InvestInDubai, DubaiProperty, LuxuryRealEstate, DubaiInvestment
- 3-5 broad tags: RealEstate, Investment, WealthBuilding (add 1-2 topic-specific tags based on content)

4. linkedin
250-350 words. IMPORTANT: Start with a keyword-rich first sentence containing 'Dubai real estate' or 'Dubai property'. DO NOT include any hyperlinks in the post body — they suppress LinkedIn reach by up to 80%. Add a note at the bottom: "(Link in first comment)". Analytical storytelling. Real AED numbers. Short paragraphs. 3-5 relevant hashtags at the very end.${modeInject}

5. youtube_short
At the very top, include: [TITLE: keyword-rich YouTube SEO title for this topic]
Then: 30-45 second spoken script. Hook in the first 2 seconds. 2 punchy points, each explained in plain language. Subscribe CTA in final 3 seconds.${modeInject}

6. facebook
120-150 words. Conversational, warm, personal — like talking to someone who already knows you. 1-2 hashtags only. End with a question that makes people want to share or tag someone.${modeInject}`;

  return withRetry(() =>
    model.generateContent(prompt).then((r) => JSON.parse(r.response.text()))
  );
}
