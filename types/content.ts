export type Platform = "instagram_reel" | "instagram_caption" | "linkedin" | "youtube_short" | "facebook";
export type ContentStatus = "idea" | "draft" | "scheduled" | "posted";
export type ContentFormat = "Reel" | "Carousel" | "LinkedIn" | "YouTube Short" | "Facebook";

export interface ContentIdea {
  angle: string;
  rationale: string;
  recommendedFormat: ContentFormat;
}

export interface HookVariant {
  type: "curiosity" | "contrarian" | "list" | "story" | "question" | "bold-statement";
  hook: string;
}

export interface IdeaGenerationResult {
  ideas: ContentIdea[];
  hooks: HookVariant[];
  selectedIdea: ContentIdea;
}

export interface PlatformScript {
  platform: Platform;
  label: string;
  content: string;
}

export interface GeneratedScript {
  hook: string;
  pillar: string;
  topic: string;
  platforms: {
    instagram_reel: string;
    instagram_caption: string;
    hashtags: string[];
    linkedin: string;
    youtube_short: string;
    facebook: string;
  };
}

export interface CalendarScripts {
  instagram_reel?: string;
  instagram_caption?: string;
  hashtags?: string[];
  linkedin?: string;
  youtube_short?: string;
  facebook?: string;
}

export interface CalendarItem {
  id: string;
  pillar: string;
  pillar_id?: string;
  topic: string;
  hook: string;
  platform: ContentFormat;
  body?: string;
  scripts?: CalendarScripts;
  status: ContentStatus;
  scheduled_for: string; // ISO date string YYYY-MM-DD (matches Supabase column)
  created_at: string;
}
