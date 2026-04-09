// Competitor data last verified: April 2026
// Follower counts confirmed via web search where marked ✓
// Entries marked "~approx" are estimated — verify manually before presenting

export interface Competitor {
  name: string;
  handle: string;
  platform: string;
  profileUrl: string;
  followers: string;
  followersVerified: boolean;   // true = confirmed via web search
  niche: string;
  strengths: string;
  contentFormats: string[];
  whatToLearn: string;
  source: string;
}

export const COMPETITORS: Competitor[] = [
  {
    name: "Sarah Aboutaleb",
    handle: "@sarah.aboutaleb",
    platform: "Instagram",
    profileUrl: "https://www.instagram.com/sarah.aboutaleb/",
    followers: "182K",
    followersVerified: true,
    niche: "Dubai Luxury Real Estate — Founder, Studio by Sara Real Estate",
    strengths: "8+ years Dubai experience, multilingual (Arabic/English/French/Italian), investment-focused Reels, IPS Fluencer 2025",
    contentFormats: ["Reels", "Property Tours", "Investment Tips"],
    whatToLearn: "Consistent educational Reels that position her as an authority, not just an agent — strong conversion from content to DM",
    source: "Verified: instagram.com/sarah.aboutaleb · Grynow UAE influencer research",
  },
  {
    name: "Farooq Syed",
    handle: "@farooq_syd",
    platform: "Instagram + YouTube",
    profileUrl: "https://www.instagram.com/farooq_syd/",
    followers: "~272K",
    followersVerified: true,
    niche: "Dubai Real Estate + Lifestyle — CEO of Springfield UAE (AED 3B+ annual sales)",
    strengths: "Extremely high energy, approachable tone — balances AED 3B CEO credibility with accessible personality content",
    contentFormats: ["Lifestyle Reels", "Smart tech", "Property Tours", "Market Commentary"],
    whatToLearn: "How a CEO personal brand can feel both aspirational and relatable — content makes real estate exciting without hard selling",
    source: "Verified: instagram.com/farooq_syd · farooqsyed.com · Grynow UAE influencer research",
  },
  {
    name: "Steven Leckie",
    handle: "@steven_leckie",
    platform: "Instagram",
    profileUrl: "https://www.instagram.com/steven_leckie/",
    followers: "~23.6K",
    followersVerified: true,
    niche: "Off-Plan Investment Dubai — Associate Director at haus & haus",
    strengths: "Won Top Off-Plan Agent + 'Agents Agent' 2024 — credibility through peer recognition, not just follower count",
    contentFormats: ["Investment breakdowns", "Market analysis Reels", "Off-plan guides"],
    whatToLearn: "Proof that niche authority (off-plan specialist for overseas investors) outperforms a generalist brand — smaller audience, higher conversion",
    source: "Verified: instagram.com/steven_leckie · stevenleckie.com · Grynow UAE influencer research",
  },
  {
    name: "Alessia Sheglova",
    handle: "@alessia_sheglova",
    platform: "Instagram",
    profileUrl: "https://www.instagram.com/alessia_sheglova/",
    followers: "~200K approx",
    followersVerified: false,
    niche: "Luxury Dubai Real Estate (CEO of Dacha Real Estate)",
    strengths: "CEO personal branding done right — authority + lifestyle in one feed",
    contentFormats: ["Property showcases", "CEO lifestyle", "Dubai luxury"],
    whatToLearn: "How a CEO personal brand can outperform a company brand on social — verify her current follower count before citing",
    source: "Unverified estimate — check instagram.com/alessia_sheglova for current count",
  },
  {
    name: "Bayut UAE",
    handle: "@bayutuae",
    platform: "Instagram",
    profileUrl: "https://www.instagram.com/bayutuae/",
    followers: "128K",
    followersVerified: true,
    niche: "UAE Real Estate Portal — benchmark for platform-level content strategy",
    strengths: "Data-led content, market reports, area guides — sets the benchmark that individual agents should humanise",
    contentFormats: ["Market data", "Area guides", "Lifestyle"],
    whatToLearn: "What the platform publishes = what buyers are already searching. Use Bayut data but add Abdul's 15-year lived perspective to differentiate",
    source: "Verified: instagram.com/bayutuae (128K followers, April 2026)",
  },
  {
    name: "Luxury Dubai Broker",
    handle: "@luxurydubaibroker",
    platform: "Instagram + YouTube",
    profileUrl: "https://www.instagram.com/luxurydubaibroker/",
    followers: "~approx",
    followersVerified: false,
    niche: "Ultra-luxury Dubai deals — aspirational anchoring strategy",
    strengths: "Uses extreme price points (AED 100M+) as engagement hooks — creates aspirational content accessible to all budget tiers",
    contentFormats: ["Ultra-luxury tours", "Investment angles"],
    whatToLearn: "How to use extreme luxury listings as scroll-stoppers even for non-luxury buyers — verify current follower count before citing",
    source: "Unverified — check instagram.com/luxurydubaibroker for current data",
  },
  {
    name: "ERE Homes DXB",
    handle: "@erehomesdxb",
    platform: "Instagram + LinkedIn",
    profileUrl: "https://www.instagram.com/erehomesdxb/",
    followers: "Company page",
    followersVerified: false,
    niche: "ERE Homes brand page — gap analysis for personal vs company brand split",
    strengths: "Professional listings and market content — but lacks the personality and authority of Abdul's personal brand",
    contentFormats: ["Property listings", "Market updates"],
    whatToLearn: "Gap analysis: what the brand page posts vs what Abdul's personal brand should do differently. Personal brands consistently outperform company pages in RE.",
    source: "Public Instagram and LinkedIn company profile · erehomes.ae",
  },
  {
    name: "Slater Young",
    handle: "@thatguyslater",
    platform: "YouTube + Instagram",
    profileUrl: "https://www.instagram.com/thatguyslater/",
    followers: "2M+ Instagram · ~200K+ YouTube",
    followersVerified: true,
    niche: "Real Estate + Construction (Philippines) — education-first personal brand",
    strengths: "Teach-first, sell-later model at massive scale — built 2M+ IG following before monetising heavily through real estate projects",
    contentFormats: ["YouTube long-form", "Reels", "Construction education", "Financial education"],
    whatToLearn: "The education-first model that AKF is replicating in Dubai — Slater proves it works at scale. Study how he structures 'value first' content that subtly markets without pitching.",
    source: "Verified: instagram.com/thatguyslater (2M+ IG) · Feedspot PH RE channels 2026",
  },
];
