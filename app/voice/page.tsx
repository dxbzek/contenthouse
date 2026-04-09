import { AKF_VOICE_PROFILE } from "@/lib/voice/akf-profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Fingerprint, Target, ArrowRight, Users, MessageSquare, BookOpen, TrendingUp, ShieldCheck, Zap, Smartphone } from "lucide-react";

const PILLAR_COLORS: Record<string, string> = {
  "dubai-market-pulse": "border-l-rose-400 bg-rose-50/40",
  "investing-playbook": "border-l-violet-400 bg-violet-50/40",
  "founder-diary": "border-l-amber-400 bg-amber-50/40",
  "lifestyle-mindset": "border-l-teal-400 bg-teal-50/40",
  "client-wins": "border-l-sky-400 bg-sky-50/40",
};

const PILLAR_DOT: Record<string, string> = {
  "dubai-market-pulse": "bg-rose-400",
  "investing-playbook": "bg-violet-400",
  "founder-diary": "bg-amber-400",
  "lifestyle-mindset": "bg-teal-400",
  "client-wins": "bg-sky-400",
};

const TONE_ICONS = [ShieldCheck, TrendingUp, Zap, MessageSquare, Target, BookOpen];

const PLATFORM_COLORS: Record<string, string> = {
  instagram: "border-l-pink-400 bg-pink-50/40",
  linkedin: "border-l-blue-400 bg-blue-50/40",
  facebook: "border-l-indigo-400 bg-indigo-50/40",
  youtube: "border-l-red-400 bg-red-50/40",
};

const PLATFORM_LABELS: Record<string, string> = {
  instagram: "Instagram",
  linkedin: "LinkedIn",
  facebook: "Facebook",
  youtube: "YouTube",
};

export default function VoicePage() {
  const profile = AKF_VOICE_PROFILE;
  const seo = profile.platformSEO;

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Fingerprint size={15} className="text-gold" />
          <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Voice DNA</span>
        </div>
        <h1 className="font-display text-4xl font-bold text-foreground tracking-tight">
          Brand <span className="text-gold">Playbook</span>
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {profile.name} · {profile.handle} · {profile.company}
        </p>
      </div>

      {/* Content Goal Funnel */}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-3">Content Goals</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Card className="border-l-4 border-l-amber-400 shadow-sm">
            <CardContent className="pt-4 pb-4">
              <p className="text-xs uppercase tracking-widest text-amber-600 font-semibold mb-1">
                {profile.contentGoals.authority.label}
              </p>
              <p className="text-sm font-semibold text-foreground mb-1">{profile.contentGoals.authority.goal}</p>
              <p className="text-xs text-muted-foreground">{profile.contentGoals.authority.proof}</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-blue-400 shadow-sm">
            <CardContent className="pt-4 pb-4">
              <p className="text-xs uppercase tracking-widest text-blue-600 font-semibold mb-1">
                {profile.contentGoals.awareness.label}
              </p>
              <p className="text-sm font-semibold text-foreground mb-1">{profile.contentGoals.awareness.goal}</p>
              <p className="text-xs text-muted-foreground">{profile.contentGoals.awareness.proof}</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-emerald-400 shadow-sm">
            <CardContent className="pt-4 pb-4">
              <p className="text-xs uppercase tracking-widest text-emerald-600 font-semibold mb-1">
                {profile.contentGoals.conversion.label}
              </p>
              <p className="text-sm font-semibold text-foreground mb-1">{profile.contentGoals.conversion.goal}</p>
              <p className="text-xs text-muted-foreground">{profile.contentGoals.conversion.proof}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Who He Speaks To */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="bg-card shadow-sm border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users size={14} className="text-gold" /> Target Audience
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium mb-1">Primary</p>
              <p className="text-sm font-medium leading-snug">{profile.audiencePersona.primary}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium mb-1">Secondary</p>
              <p className="text-sm font-medium leading-snug">{profile.audiencePersona.secondary}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card shadow-sm border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target size={14} className="text-gold" /> What They Actually Want
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1.5">
              {profile.audiencePersona.aspirations.map((a) => (
                <li key={a} className="text-sm text-muted-foreground flex gap-2 items-start">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Pain Points */}
      <Card className="bg-amber-50/60 border-amber-100 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-gold">What Holds Them Back (Address This in Content)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {profile.audiencePersona.painPoints.map((p) => (
              <div key={p} className="flex gap-2 items-start">
                <span className="text-amber-500 text-xs mt-0.5 shrink-0">→</span>
                <p className="text-xs text-muted-foreground leading-snug">{p}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tone Attributes */}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-3">How He Sounds</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {profile.toneAttributes.map((attr, i) => {
            const Icon = TONE_ICONS[i] || MessageSquare;
            return (
              <Card key={attr.label} className="bg-card border-border shadow-sm">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={14} className="text-gold" />
                    <p className="text-sm font-semibold">{attr.label}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2 leading-snug">{attr.description}</p>
                  <p className="text-xs text-foreground italic border-l-2 border-gold/40 pl-2 leading-relaxed">
                    &ldquo;{attr.example}&rdquo;
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Content Pillars */}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-3">Content Pillars</p>
        <div className="space-y-3">
          {profile.contentPillars.map((pillar) => {
            const colorClass = PILLAR_COLORS[pillar.id] || "border-l-gold bg-amber-50/40";
            const dotClass = PILLAR_DOT[pillar.id] || "bg-gold";
            return (
              <Card key={pillar.id} className={`border-l-4 shadow-sm ${colorClass}`}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${dotClass}`} />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground mb-0.5">{pillar.name}</p>
                      <p className="text-xs text-muted-foreground mb-2 leading-snug">{pillar.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {pillar.exampleTopics.map((topic) => (
                          <span
                            key={topic}
                            className="text-xs bg-white/80 border border-border text-muted-foreground px-2 py-0.5 rounded"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Vocabulary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="bg-card shadow-sm border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-emerald-600">Use These</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              {profile.vocabulary.preferred.map((term) => (
                <Badge key={term} variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 text-xs">
                  {term}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card shadow-sm border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-red-500">Never Use</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              {profile.vocabulary.avoided.map((term) => (
                <Badge key={term} variant="outline" className="border-red-200 bg-red-50 text-red-600 text-xs">
                  {term}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversion CTAs */}
      <Card className="border-gold/30 bg-amber-50/50 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2 text-gold">
            <ArrowRight size={14} /> Conversion CTAs That Actually Work
          </CardTitle>
          <p className="text-xs text-muted-foreground">Use these to drive action — never &ldquo;swipe up&rdquo; or &ldquo;click here&rdquo;</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {profile.conversionCTAs.map((cta, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="text-gold text-xs font-mono mt-0.5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <p className="text-sm text-foreground">&ldquo;{cta}&rdquo;</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Platform SEO Strategy */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Smartphone size={14} className="text-gold" />
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Platform SEO Strategy</p>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Each platform has a different algorithm. These rules are baked into every generated caption.
        </p>
        <div className="space-y-3">
          {(["instagram", "linkedin", "facebook", "youtube"] as const).map((platform) => {
            const data = seo[platform];
            const colorClass = PLATFORM_COLORS[platform] || "border-l-border bg-card";
            const label = PLATFORM_LABELS[platform];
            const hashtagTiers = "hashtagTiers" in data ? data.hashtagTiers : null;
            const bestPostTimes = "bestPostTimes" in data ? data.bestPostTimes : null;
            const proTip = "proTip" in data ? data.proTip : null;

            return (
              <Card key={platform} className={`border-l-4 shadow-sm ${colorClass}`}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <p className="text-sm font-semibold">{label}</p>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{data.goal}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="bg-white/80 border border-border rounded px-3 py-2">
                          <p className="text-xs font-medium text-foreground mb-0.5">Caption rule</p>
                          <p className="text-xs text-muted-foreground leading-snug">{data.captionRule}</p>
                        </div>
                        {hashtagTiers && (
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-foreground">Hashtag tiers</p>
                            <div className="flex flex-wrap gap-1">
                              {hashtagTiers.niche?.map((h) => (
                                <span key={h} className="text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 px-1.5 py-0.5 rounded font-mono">
                                  #{h}
                                </span>
                              ))}
                              {hashtagTiers.broad?.map((h) => (
                                <span key={h} className="text-xs bg-muted border border-border text-muted-foreground px-1.5 py-0.5 rounded font-mono">
                                  #{h}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {bestPostTimes && (
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium">Best times:</span> {bestPostTimes}
                          </p>
                        )}
                        {proTip && (
                          <p className="text-xs text-gold bg-amber-50/60 border border-amber-100 rounded px-2 py-1 leading-snug">
                            <span className="font-semibold">Pro tip:</span> {proTip}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Signature Patterns */}
      <Card className="bg-card shadow-sm border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <BookOpen size={14} className="text-gold" /> Signature Content Patterns
          </CardTitle>
          <p className="text-xs text-muted-foreground">Recurring structures that make his content recognisable</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {profile.signaturePatterns.map((pattern, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="text-gold text-xs mt-0.5 shrink-0">→</span>
                <p className="text-sm text-muted-foreground leading-snug">{pattern}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sample Posts */}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-3">Real Voice Examples</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {profile.samplePosts.map((post, i) => (
            <Card key={i} className="bg-card border-border border-l-2 border-l-gold/40 shadow-sm">
              <CardContent className="py-3 px-4">
                <p className="text-xs text-muted-foreground italic leading-relaxed">&ldquo;{post}&rdquo;</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
