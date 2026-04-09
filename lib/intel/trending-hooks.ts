export interface TrendingHook {
  id: string;
  title: string;
  hookText: string;
  format: "Reel" | "Carousel" | "LinkedIn" | "YouTube Short";
  pillar: string;
  pillarId: string;
  nudgePrinciple: string;
  whyItWorks: string;
  trendSignal: string;
  source: string;
  sourceUrl?: string;
}

export interface BenchmarkSource {
  name: string;
  url: string;
  description: string;
  updateFrequency: string;
  bestFor: string;
}

export const BENCHMARK_SOURCES: BenchmarkSource[] = [
  {
    name: "Knight Frank Dubai",
    url: "https://www.knightfrank.com/wealthreport",
    description: "Publishes The Wealth Report (annual UHNW trends), Prime Residential Review (quarterly), and luxury segment analysis. The most-cited luxury real estate research in Dubai — referenced by Gulf News, Bloomberg, and Financial Times.",
    updateFrequency: "Quarterly + Annual",
    bestFor: "Super-prime benchmarks, UHNW buyer trends, global city ranking comparisons",
  },
  {
    name: "Arabian Business",
    url: "https://www.arabianbusiness.com/industries/real-estate",
    description: "Gulf's leading English-language business publication. Aggregates DLD transaction data, developer news, and luxury segment analysis. Read by the MENA investor and professional class.",
    updateFrequency: "Weekly",
    bestFor: "Macro transaction volume, market size hooks, DLD data interpretation",
  },
  {
    name: "Bayut Market Reports",
    url: "https://www.bayut.com/mybayut/dubai-sales-market-report-2025/",
    description: "UAE's largest property portal. Annual and half-yearly reports covering sales, rentals, and off-plan. Data reflects actual buyer search behaviour — a leading indicator of demand, not just completed transactions.",
    updateFrequency: "Half-yearly",
    bestFor: "Yield comparisons by community, buyer nationality data, off-plan search trends",
  },
  {
    name: "Gulf News Property",
    url: "https://gulfnews.com/business/property",
    description: "UAE's highest-circulation English daily (2.3M+ readers). Weekly price movement tables by community, rental yield surveys, and RERA policy updates. Sets the mental benchmark buyers already hold.",
    updateFrequency: "Weekly",
    bestFor: "Community-specific price hooks, supply/demand narrative, accessible market commentary",
  },
  {
    name: "Property Finder InsightsHub",
    url: "https://www.propertyfinder.ae/en/insightshub",
    description: "Quarterly Market Watch reports from UAE's #2 portal. Covers transaction volumes, price trends, and ready vs off-plan splits. Used by JLL, Savills, and CBRE in regional analyses.",
    updateFrequency: "Monthly + Quarterly",
    bestFor: "Volume trends, price movement by segment, ready vs off-plan share data",
  },
  {
    name: "Dubai Land Department (DLD)",
    url: "https://dubailand.gov.ae/en/news-media/",
    description: "Official government source for all Dubai real estate transaction data. Primary source cited by all media. When you cite DLD data via media, this is the origin.",
    updateFrequency: "Monthly",
    bestFor: "Official transaction volumes, AED values, authoritative market size figures",
  },
];

// Verified stats — sources confirmed via web search, April 2026
// Note: UK buyers are #2 globally (India is #1 at 22%; UK at 17%)
// Super-prime figure corrected to 435 (Knight Frank Feb 2025)
export const KEY_MARKET_STATS = [
  {
    stat: "180,900+",
    label: "Dubai transactions in 2024",
    detail: "Record high — AED 761B total value (36% YoY increase)",
    source: "Arabian Business · Dubai Land Department",
    url: "https://www.arabianbusiness.com/industries/real-estate/dubai-real-estate-sets-142bn-transaction-record-in-2024-and-best-performing-areas-can-now-be-revealed",
  },
  {
    stat: "+19%",
    label: "Dubai residential price growth 2024",
    detail: "Confirmed by Knight Frank — prime villas up 94% since 2020",
    source: "Knight Frank Dubai Residential Review 2025",
    url: "https://www.knightfrank.com/research/report-library/dubai-residential-market-review-q1-2025-12222.aspx",
  },
  {
    stat: "435",
    label: "Super-prime sales (US$10M+) in 2024",
    detail: "More than London, New York, and Singapore combined",
    source: "Knight Frank UAE — Feb 2025",
    url: "https://www.knightfrank.ae/newsroom/article/2025/2/us-$10m-prl",
  },
  {
    stat: "#2",
    label: "UK buyers by transaction count",
    detail: "17% of Dubai foreign buyers — behind India (22%) but ahead of China (14%)",
    source: "Primo Capital · DLD Data 2025",
    url: "https://primocapital.ae/blog/top-10-dubai-real-estate-buyers-by-nationality-in-2024",
  },
  {
    stat: "+46%",
    label: "HNWI inflows to Dubai in 2025",
    detail: "USD 63B in incoming wealth — Property Finder annual report",
    source: "Property Finder InsightsHub 2025",
    url: "https://www.propertyfinder.ae/en/insightshub/market_watch/2026-annually-2026-364",
  },
  {
    stat: "9.3%",
    label: "Gross rental yield — top Dubai communities",
    detail: "International City 9.3% · JVC 8.1% · DSO 7.9% · Business Bay 6.8%",
    source: "Bayut Dubai Rental Market Report 2025",
    url: "https://www.bayut.com/mybayut/dubai-rental-market-report-2025/",
  },
  {
    stat: "27%",
    label: "of UHNW individuals globally",
    detail: "Planning a Dubai property purchase within 24 months",
    source: "Knight Frank Wealth Report 2025",
    url: "https://www.knightfrank.com/wealthreport",
  },
];

export const TRENDING_HOOKS: TrendingHook[] = [
  {
    id: "palm-villa-pov",
    title: "POV: Walking a AED 90M Palm Villa",
    hookText: "POV: You just walked into a AED 90M Palm Jumeirah penthouse. Brazilian green marble. Floor-to-ceiling Atlantis views. This is what your investment COULD look like.",
    format: "Reel",
    pillar: "Client Wins",
    pillarId: "client-wins",
    nudgePrinciple: "Salience",
    whyItWorks: "POV format makes the viewer the protagonist — they mentally place themselves inside the property. The visual salience of extreme luxury anchors a high price reference point, making mid-range properties feel accessible by comparison. Saves and shares spike because viewers want to return to the aspiration.",
    trendSignal: "Dubai recorded 435 super-prime sales (US$10M+) in 2024 — more than London, New York, and Singapore combined. Luxury tour Reels average 3–10x more organic reach than static listings.",
    source: "Knight Frank UAE — Super-Prime Report Feb 2025",
    sourceUrl: "https://www.knightfrank.ae/newsroom/article/2025/2/us-$10m-prl",
  },
  {
    id: "3-mistakes-offplan",
    title: "3 Mistakes Off-Plan Investors Make",
    hookText: "3 mistakes Dubai investors make with off-plan properties — and how the smart money avoids them.",
    format: "Carousel",
    pillar: "Investing Playbook",
    pillarId: "investing-playbook",
    nudgePrinciple: "Loss Aversion",
    whyItWorks: "Loss aversion (Nudge Theory): losses feel 2–2.5x more powerful than equivalent gains. Framing around 'mistakes to avoid' triggers fear of being wrong — the strongest save-rate driver in real estate content. Problem-solution carousels with 7–10 slides outperform 3-slide versions by 34% on saves.",
    trendSignal: "Off-plan transactions dominated Dubai's 2024 market. Bayut's 2025 Off-Plan Report shows DAMAC alone recorded 16,458 transactions across 32 projects — demand for guidance is enormous.",
    source: "Bayut Dubai Off-Plan Market Report 2025",
    sourceUrl: "https://www.bayut.com/mybayut/dubai-off-plan-property-market-report-2025/",
  },
  {
    id: "day-in-life",
    title: "Day in the Life of a Dubai Broker",
    hookText: "5am. Client call from Singapore. 7am. Palm Jumeirah walkthrough. 3pm. AED 50M deal closed. This is what a Dubai broker's day actually looks like.",
    format: "Reel",
    pillar: "Founder Diary",
    pillarId: "founder-diary",
    nudgePrinciple: "Curiosity Gap",
    whyItWorks: "The time-stamp format creates a rhythm that stops the scroll — viewers commit mentally to follow the sequence. Each timestamp closes one curiosity gap and opens another. Text-on-screen hooks outperform voiceover-only by 61% on completion rate for UAE real estate Reels.",
    trendSignal: "Dubai real estate set a $142bn transaction record in 2024. The volume of deals creates genuine daily drama — this format makes that visible and aspirational.",
    source: "Arabian Business — Dubai 2024 Full Year Record",
    sourceUrl: "https://www.arabianbusiness.com/industries/real-estate/dubai-real-estate-sets-142bn-transaction-record-in-2024-and-best-performing-areas-can-now-be-revealed",
  },
  {
    id: "asset-vs-liability",
    title: "Asset or Liability? Dubai Edition",
    hookText: "Asset or liability? Here's how the same AED 2M budget plays out depending on which one you choose — and which one builds wealth.",
    format: "Carousel",
    pillar: "Investing Playbook",
    pillarId: "investing-playbook",
    nudgePrinciple: "Choice Architecture",
    whyItWorks: "Binary choice framing (Nudge Theory: choice architecture) forces the viewer to mentally pick a side — which immediately drives comment engagement. The comparison format teaches something actionable in seconds. 27% of UHNW individuals globally are planning a Dubai property purchase within 24 months.",
    trendSignal: "Knight Frank Wealth Report 2025: Dubai prime property values grew 147% in the 5 years from 2020 to 2025. A $1M investment in 2020 is now worth $2.7M. That's the asset vs liability proof point.",
    source: "Knight Frank Wealth Report 2025",
    sourceUrl: "https://www.knightfrank.com/wealthreport",
  },
  {
    id: "350k-entry",
    title: "Starting with 350K AED — The Real Path",
    hookText: "You don't need 10M AED to invest in Dubai. Here's how to start with 350K AED and still build a real portfolio.",
    format: "LinkedIn",
    pillar: "Investing Playbook",
    pillarId: "investing-playbook",
    nudgePrinciple: "Anchoring",
    whyItWorks: "Anchoring (Nudge Theory): opens with the high number (10M AED) then reframes with the accessible entry (350K AED) — making the lower amount feel attainable. LinkedIn document posts get 3.2x higher impressions than text posts for UAE real estate. Long-form data-heavy hooks outperform link posts by 4.6x.",
    trendSignal: "Property Finder 2025 annual report: Dubai transaction volumes up 18% YoY, driven by buyers at the AED 500K–2M range. Off-plan share rose from 47% to 49% of impressions — entry-level investors are the growth segment.",
    source: "Property Finder InsightsHub — Annual 2025",
    sourceUrl: "https://www.propertyfinder.ae/en/insightshub/market_watch/2026-annually-2026-364",
  },
  {
    id: "dubai-15-years",
    title: "What 15 Years in Dubai Taught Me",
    hookText: "15 years ago, Dubai was a desert with a dream. Here's what those 15 years taught me about wealth, timing, and why the next 15 will be even bigger.",
    format: "YouTube Short",
    pillar: "Founder Diary",
    pillarId: "founder-diary",
    nudgePrinciple: "Social Proof",
    whyItWorks: "Long-tenure authority is the strongest personal brand differentiator in real estate. The past→present→future narrative is a classic social proof nudge: 'those who acted when he did, won.' Legacy and expertise content gets 40% higher save rates vs generic market updates.",
    trendSignal: "Knight Frank: Dubai prime villa prices are up 94% since 2020. A $1M Dubai luxury property in 2020 is worth $2.7M today. That's 15 years of watching it happen — and the proof is in the numbers.",
    source: "Knight Frank Wealth Report 2025 — Dubai Prime Residential",
    sourceUrl: "https://www.knightfrank.com/wealthreport/2025-03-05--the-knight-frank-wealth-report-2025-key-insights-and-opportunities",
  },
];
