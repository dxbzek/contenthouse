"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Copy, Check, CalendarPlus, Scroll, CheckCircle2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CONTENT_MODES } from "@/lib/voice/akf-profile";
import { toast } from "sonner";

const SCRIPT_LOADING_MSGS = [
  "Reading your hook...",
  "Writing the Reel script...",
  "Drafting Instagram caption...",
  "Writing LinkedIn post...",
  "Building YouTube Short...",
  "Finishing Facebook post...",
  "Polishing the copy...",
  "Almost there...",
];

function ScriptLoadingState() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => Math.min(i + 1, SCRIPT_LOADING_MSGS.length - 1)), 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 py-4">
        <Loader2 size={16} className="animate-spin text-gold shrink-0" />
        <p className="text-sm text-muted-foreground transition-all duration-500">{SCRIPT_LOADING_MSGS[idx]}</p>
      </div>
      {/* Skeleton tabs */}
      <div className="space-y-3">
        <div className="flex gap-1">
          {["Reel Script", "IG Caption", "LinkedIn", "YouTube", "Facebook"].map((tab) => (
            <div key={tab} className="h-8 px-3 bg-muted animate-pulse rounded text-xs flex items-center text-transparent">{tab}</div>
          ))}
        </div>
        <div className="p-4 rounded-md border border-border bg-card animate-pulse space-y-2">
          <div className="h-3 bg-muted rounded w-1/4 mb-4" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`h-3 bg-muted rounded ${i === 3 ? "w-3/5" : i === 5 ? "w-4/5" : "w-full"}`} />
          ))}
          <div className="pt-3">
            <div className="h-3 bg-muted rounded w-full" />
            <div className="h-3 bg-muted rounded w-2/3 mt-2" />
          </div>
        </div>
      </div>
    </div>
  );
}

const PLATFORM_CHECKLISTS: Record<string, { item: string; note?: string }[]> = {
  reel: [
    { item: "Add location tag", note: "Dubai, UAE or specific area (Palm Jumeirah, Downtown Dubai)" },
    { item: "Paste hashtags in first comment", note: "Keeps caption clean; algorithm still indexes them" },
    { item: "Reply to every comment in the first 30 minutes", note: "Early engagement signals trigger wider distribution" },
  ],
  caption: [
    { item: "Add location tag", note: "Dubai, UAE or specific area (Palm Jumeirah, Downtown Dubai)" },
    { item: "Paste hashtags in first comment", note: "Keeps caption clean; algorithm still indexes them" },
    { item: "Reply to every comment in the first 30 minutes", note: "Early engagement signals trigger wider distribution" },
  ],
  linkedin: [
    { item: "Post your link as the FIRST COMMENT immediately after publishing", note: "Links in the post body suppress reach by up to 80%" },
    { item: "Reply to all comments within 1 hour", note: "LinkedIn heavily weights early engagement for distribution" },
    { item: "Don't edit the post in the first 10 minutes", note: "Edits within 10 min reset the distribution clock" },
  ],
  yt: [
    { item: "Set the video title to the [TITLE: ...] line at the top of the script" },
    { item: "Add location in description: Dubai, UAE" },
    { item: "Pin a comment with your contact link immediately after upload" },
  ],
  fb: [
    { item: "Share any links in comments, not the post body", note: "Facebook suppresses posts with external links" },
    { item: "Tag 1–2 relevant people if appropriate" },
    { item: "Boost as paid post after 2 hours if organic reach is low" },
  ],
};

interface GeneratedScript {
  instagram_reel: string;
  instagram_caption: string;
  hashtags: string[];
  linkedin: string;
  youtube_short: string;
  facebook: string;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <Button size="sm" variant="ghost" onClick={copy} className="text-muted-foreground hover:text-foreground gap-1">
      {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}

function BeforeYouPost({ tabKey }: { tabKey: string }) {
  const items = PLATFORM_CHECKLISTS[tabKey];
  if (!items) return null;
  return (
    <Card className="border-amber-100 bg-amber-50/60 shadow-sm">
      <CardHeader className="pb-2 pt-3">
        <CardTitle className="text-xs text-gold uppercase tracking-widest">Before You Post</CardTitle>
      </CardHeader>
      <CardContent className="pb-3 space-y-1.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <CheckCircle2 size={13} className="text-gold mt-0.5 shrink-0" />
            <p className="text-xs text-foreground leading-snug">
              {item.item}
              {item.note && <span className="text-muted-foreground"> — {item.note}</span>}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ScriptPageInner() {
  const searchParams = useSearchParams();
  const hook = searchParams.get("hook") || "";
  const pillar = searchParams.get("pillar") || "";
  const topic = searchParams.get("topic") || "";
  const modeId = searchParams.get("modeId") || "";
  const modeName = searchParams.get("modeName") || "";
  const contentMode = CONTENT_MODES.find((m) => m.id === modeId);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedScript | null>(null);
  const [resultIsDemo, setResultIsDemo] = useState(false);
  const [savedToCalendar, setSavedToCalendar] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    if (hook && pillar && topic) {
      generate();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function generate() {
    setLoading(true);
    setSavedToCalendar(false);
    setResultIsDemo(false);
    try {
      const res = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hook, pillar, topic, contentMode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Script generation failed.");
      setResult(data);
      if (data._demo) setResultIsDemo(true);
    } catch (err) {
      toast.error("Script generation failed. Check your Gemini API key.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function saveToCalendar() {
    if (!result) return;

    const newItem = {
      pillar,
      pillar_id: pillar.toLowerCase().replace(/\s+/g, "-"),
      topic,
      hook,
      platform: "Reel",
      body: result.instagram_caption,
      scripts: {
        instagram_reel: result.instagram_reel,
        instagram_caption: result.instagram_caption,
        hashtags: result.hashtags,
        linkedin: result.linkedin,
        youtube_short: result.youtube_short,
        facebook: result.facebook,
      },
      status: "draft",
      scheduled_for: scheduledDate,
    };

    const res = await fetch("/api/calendar-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    });

    if (res.ok) {
      setSavedToCalendar(true);
      setShowDatePicker(false);
      toast.success("Added to calendar!");
    } else {
      toast.error("Failed to save to calendar.");
    }
  }

  if (!hook) {
    return (
      <div className="max-w-4xl">
        <div className="text-center py-20">
          <p className="text-muted-foreground">No hook selected. Go to the Generator first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Scroll size={16} className="text-gold" />
          <span className="text-xs text-muted-foreground uppercase tracking-widest">Script & Caption Generator</span>
        </div>
        <h1 className="font-serif text-4xl text-gold tracking-tight">Content Package</h1>
      </div>

      {/* Hook summary */}
      <Card className="border-primary/30 bg-accent/20">
        <CardContent className="pt-4 pb-4 space-y-1">
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className="border-border text-muted-foreground text-xs">{pillar}</Badge>
            <Badge variant="outline" className="border-border text-muted-foreground text-xs">{topic}</Badge>
            {modeName && (
              <Badge variant="outline" className="border-amber-400/40 text-amber-500 text-xs">
                {contentMode?.emoji} {modeName}
              </Badge>
            )}
          </div>
          <p className="text-sm font-medium mt-2">&ldquo;{hook}&rdquo;</p>
        </CardContent>
      </Card>

      {/* Loading */}
      {loading && <ScriptLoadingState />}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-4">
          {resultIsDemo && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-amber-50 border border-amber-200 text-xs text-amber-700">
              <RefreshCw size={12} className="shrink-0" />
              <span>Gemini is busy — showing a sample script so you can see the format. Click <strong>Regenerate Script</strong> to get your actual content when it&apos;s back.</span>
            </div>
          )}
          <Tabs defaultValue="reel">
            <div className="flex items-center justify-between mb-2">
              <TabsList className="bg-secondary">
                <TabsTrigger value="reel">Reel Script</TabsTrigger>
                <TabsTrigger value="caption">IG Caption</TabsTrigger>
                <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
                <TabsTrigger value="yt">YouTube Short</TabsTrigger>
                <TabsTrigger value="fb">Facebook</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="reel" className="space-y-3">
              <Card className="bg-card border-border/50">
                <CardHeader className="pb-2 flex-row items-center justify-between">
                  <CardTitle className="text-sm text-gold">Instagram Reel Script</CardTitle>
                  <CopyButton text={result.instagram_reel} />
                </CardHeader>
                <CardContent>
                  <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-sans leading-relaxed">
                    {result.instagram_reel}
                  </pre>
                </CardContent>
              </Card>
              <BeforeYouPost tabKey="reel" />
            </TabsContent>

            <TabsContent value="caption" className="space-y-3">
              <Card className="bg-card border-border/50">
                <CardHeader className="pb-2 flex-row items-center justify-between">
                  <CardTitle className="text-sm text-gold">Instagram Caption</CardTitle>
                  <CopyButton text={result.instagram_caption + "\n\n" + result.hashtags.map(h => `#${h}`).join(" ")} />
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {result.instagram_caption}
                  </p>
                  <div className="border-t border-border pt-3">
                    <p className="text-xs text-muted-foreground mb-2">Hashtags</p>
                    <div className="flex flex-wrap gap-1">
                      {result.hashtags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs border-border text-primary">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <BeforeYouPost tabKey="caption" />
            </TabsContent>

            <TabsContent value="linkedin" className="space-y-3">
              <Card className="bg-card border-border/50">
                <CardHeader className="pb-2 flex-row items-center justify-between">
                  <CardTitle className="text-sm text-gold">LinkedIn Post</CardTitle>
                  <CopyButton text={result.linkedin} />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {result.linkedin}
                  </p>
                </CardContent>
              </Card>
              <BeforeYouPost tabKey="linkedin" />
            </TabsContent>

            <TabsContent value="yt" className="space-y-3">
              <Card className="bg-card border-border/50">
                <CardHeader className="pb-2 flex-row items-center justify-between">
                  <CardTitle className="text-sm text-gold">YouTube Short Script</CardTitle>
                  <CopyButton text={result.youtube_short} />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {result.youtube_short}
                  </p>
                </CardContent>
              </Card>
              <BeforeYouPost tabKey="yt" />
            </TabsContent>

            <TabsContent value="fb" className="space-y-3">
              <Card className="bg-card border-border/50">
                <CardHeader className="pb-2 flex-row items-center justify-between">
                  <CardTitle className="text-sm text-gold">Facebook Post</CardTitle>
                  <CopyButton text={result.facebook} />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {result.facebook}
                  </p>
                </CardContent>
              </Card>
              <BeforeYouPost tabKey="fb" />
            </TabsContent>
          </Tabs>

          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              onClick={generate}
              className="gap-2 border-border text-muted-foreground hover:text-foreground"
            >
              <RefreshCw size={14} /> Regenerate Script
            </Button>
            <Button
              onClick={() => setShowDatePicker(true)}
              disabled={savedToCalendar}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <CalendarPlus size={15} />
              {savedToCalendar ? <><Check size={13} /> Added</> : "Add to Calendar"}
            </Button>
          </div>
        </div>
      )}

      {/* Date picker dialog */}
      <Dialog open={showDatePicker} onOpenChange={setShowDatePicker}>
        <DialogContent className="bg-white border-border max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-foreground">Schedule this content</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-1">
            <p className="text-sm text-muted-foreground">Pick the date you want to publish this piece.</p>
            <input
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowDatePicker(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={saveToCalendar}
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
              >
                <CalendarPlus size={14} /> Save to Calendar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function ScriptPage() {
  return (
    <Suspense>
      <ScriptPageInner />
    </Suspense>
  );
}
