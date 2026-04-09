// High-quality pre-generated AKF-voiced responses for demo fallback
// These activate when Gemini is unavailable (503/quota) during the interview

export const DEMO_IDEAS_RESPONSE = {
  ideas: [
    {
      angle: "The Palm Jumeirah villa shortage is a once-in-a-decade wealth transfer moment — here's who's winning and who's watching from the sideline.",
      rationale: "Scarcity + urgency framing positions AKF as the person who sees what others don't. Triggers FOMO without being pushy.",
      recommendedFormat: "LinkedIn long-form",
    },
    {
      angle: "I've watched Palm Jumeirah double in value over 8 years. The supply gap tells me the next 3 years will be even bigger — here's the data.",
      rationale: "AKF's 15-year authority + data-backed prediction. Credibility before the ask.",
      recommendedFormat: "Carousel",
    },
    {
      angle: "Everyone's looking at Downtown Dubai. Smart money quietly moved to Palm. The villa supply shortage explains exactly why.",
      rationale: "Contrarian reframe that repositions AKF as ahead of the crowd — a signature brand signal.",
      recommendedFormat: "Reel",
    },
  ],
  hooks: [
    {
      type: "curiosity",
      hook: "Palm Jumeirah villa supply hasn't recovered since 2022. Here's what that silence is actually saying to investors.",
    },
    {
      type: "curiosity",
      hook: "Why are the smartest Dubai investors buying Palm villas they can't rent yet? The answer is in the supply numbers.",
    },
    {
      type: "contrarian",
      hook: "Everyone's looking at Downtown Dubai for ROI. They're looking in the wrong place.",
    },
    {
      type: "contrarian",
      hook: "Palm Jumeirah doesn't need more hype. It needs a supply gap reality check — and this is it.",
    },
    {
      type: "list",
      hook: "3 signs Palm Jumeirah villa supply won't recover for years — and what smart investors are doing right now.",
    },
    {
      type: "list",
      hook: "The Palm villa shortage explained in 4 data points that the mainstream real estate content won't show you.",
    },
    {
      type: "story",
      hook: "A client asked me last week: 'AKF, is it too late to buy on the Palm?' Here's exactly what I told him.",
    },
    {
      type: "story",
      hook: "I've been watching Palm Jumeirah's supply data for 15 years. The current shortage is unlike anything I've tracked before.",
    },
    {
      type: "question",
      hook: "Dubai villas: demand exploding, supply years behind. Are you still waiting — or have you moved?",
    },
    {
      type: "bold-statement",
      hook: "Palm Jumeirah villa supply is tightening. The investors who act in the next 12 months will look like geniuses in 2028.",
    },
  ],
};

// Fallback hooks generated from the actual angle when Gemini is unavailable.
// These are templated but use the real angle text so they stay on-topic.
export function generateFallbackHooks(angle: string): { hooks: Array<{ type: string; hook: string }>; _demo: true } {
  // Extract a short opening phrase from the angle for use in hooks (first ~60 chars)
  const preview = angle.length > 60 ? angle.substring(0, angle.lastIndexOf(" ", 60)) + "..." : angle;

  return {
    _demo: true,
    hooks: [
      { type: "curiosity", hook: `${preview} Most people never hear the full story. Here it is.` },
      { type: "curiosity", hook: `I've been sitting on this story for a while. Time to share it.` },
      { type: "contrarian", hook: `Everyone has an opinion on Dubai. Very few have actually been here long enough to see this happen.` },
      { type: "contrarian", hook: `The people who said this couldn't happen in Dubai weren't watching closely enough. I was.` },
      { type: "list", hook: `Three things I learned from this. None of them are obvious.` },
      { type: "list", hook: `What this taught me about Dubai real estate — and what most people get wrong.` },
      { type: "story", hook: `${preview}` },
      { type: "story", hook: `15 years in Dubai. This moment still stands out.` },
      { type: "question", hook: `Would you have made the same call? Genuinely asking.` },
      { type: "bold-statement", hook: `Dubai doesn't reward hesitation. This is proof.` },
    ],
  };
}

export const DEMO_SCRIPT_RESPONSE = {
  instagram_reel: `Palm Jumeirah villas. There are fewer of them available to buy now than at any point since 2022.

At the same time, the number of people looking to buy has gone up.

When there's less available and more people competing — fewer properties, more buyers — prices move upward. That's not a prediction. That's how markets work.

15 years tracking this market. The gap between what's available and what people want right now is unlike anything I've seen before.

My question for you: are you looking at this market from the outside, or are you in it?

Comment below. I read every one.`,

  instagram_caption: `Palm Jumeirah villa supply is tightening. The investors acting right now will look like geniuses in 2028.

I've been tracking this Dubai real estate market for 15 years. Post-2022, Palm villa supply never recovered — while demand is hitting levels I've not seen since the early growth years of Dubai.

Here's what the data tells me:
→ AED 15–25M villas are being absorbed faster than listed
→ Off-plan options on the Palm are limited and disappearing
→ The rental yield story is strengthening with each passing quarter

This isn't hype. This is supply maths. And supply maths doesn't lie.

The smart money hasn't been waiting for prices to drop — they've been reading the same data I'm reading.

My question for you: are you investing in knowledge about the Dubai market, or just watching prices go up from the sidelines?

Comment below. I read every one.`,

  hashtags: [
    "DubaiRealEstate2026", "DubaiPropertyInvestment", "EREHomes", "DubaiLuxuryHomes", "OffPlanDubai",
    "DubaiRealEstate", "InvestInDubai", "DubaiProperty", "LuxuryRealEstate", "DubaiInvestment",
    "RealEstate", "Investment", "WealthBuilding", "PalmJumeirah", "DubaiVillas",
  ],

  linkedin: `Dubai real estate, 15 years on the ground. The Palm Jumeirah villa supply story is one I've not seen before.

Let me share the data — and what I think it means for investors paying attention.

**The supply picture**
Villa supply on the Palm has not meaningfully recovered since 2022. Off-plan launches are limited. Secondary market listings are moving faster than we've tracked in years.

**The demand picture**
Inbound investor interest from Europe, Asia, and the subcontinent is at record levels. The Dubai golden visa programme and zero capital gains tax continues to attract capital that's leaving other markets.

**The maths**
When demand outpaces supply at this rate, price appreciation is the natural outcome. We're already seeing AED 15–25M villas absorb quickly — and that bracket historically leads broader market movement.

**What smart investors are doing**
They're not waiting for a correction that supply maths doesn't support. They're positioning now — in both secondary and the limited off-plan product available.

I'm not in the business of creating panic. I am in the business of sharing 15 years of Dubai market context with people who want to make informed decisions.

The window exists. Windows close.

Drop a message below or DM me directly — details in bio.

(Link in first comment)

#DubaiRealEstate #PalmJumeirah #PropertyInvestment #DubaiMarket #RealEstate`,

  youtube_short: `[TITLE: Palm Jumeirah Villa Shortage Explained — Dubai Property Investment 2026]

"Palm Jumeirah villa supply hasn't recovered since 2022. Demand is at record highs. Here's what that means for your investment.

Point 1: The supply-demand gap is real. I've been tracking this market for 15 years and the current maths are unlike anything I've seen.

Point 2: AED 15 to 25 million villas are moving faster than they're being listed. That's not hype — that's data.

The investors who move in the next 12 months will look back and call this the window they didn't miss.

Subscribe for weekly Dubai market insights — straight from someone who's been on the ground here since the beginning."`,

  facebook: `Palm Jumeirah villa supply is at historic lows — and demand is breaking records. 🏝️

As someone who's watched Dubai real estate for 15 years, I can tell you this: the current supply maths is unlike anything I've tracked.

AED 15–25M villas are being absorbed faster than they're listed. Off-plan options on the Palm are limited. And the rental yield story just keeps improving.

This isn't about hype. It's about understanding what the data is telling us — and positioning accordingly.

Are you tracking the Palm Jumeirah market? What's your read on where prices go from here? Drop your thoughts below.`,
};
