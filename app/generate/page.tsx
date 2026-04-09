"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Loader2, Lightbulb, ArrowRight, ChevronRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AKF_VOICE_PROFILE, CONTENT_MODES } from "@/lib/voice/akf-profile";
import { toast } from "sonner";

const HOOK_TYPE_COLORS: Record<string, string> = {
  curiosity: "border-blue-400/30 text-blue-400",
  contrarian: "border-orange-400/30 text-orange-400",
  list: "border-purple-400/30 text-purple-400",
  story: "border-green-400/30 text-green-400",
  question: "border-yellow-400/30 text-yellow-400",
  "bold-statement": "border-red-400/30 text-red-400",
};

const HOOK_TYPE_TO_NUDGE: Record<string, string> = {
  curiosity: "Curiosity Gap",
  contrarian: "Loss Aversion",
  list: "Choice Architecture",
  story: "Social Proof",
  question: "Curiosity Gap",
  "bold-statement": "Salience",
};

const NUDGE_COLORS: Record<string, string> = {
  "Curiosity Gap": "bg-teal-50 text-teal-700 border-teal-200",
  "Loss Aversion": "bg-red-50 text-red-700 border-red-200",
  "Choice Architecture": "bg-amber-50 text-amber-700 border-amber-200",
  "Social Proof": "bg-blue-50 text-blue-700 border-blue-200",
  "Salience": "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const ANGLE_LOADING_MSGS = [
  "Reading your topic seed...",
  "Finding the best angles for your pillar...",
  "Drafting 3 content premises...",
  "Almost there...",
];

const HOOK_LOADING_MSGS = [
  "Locking onto your angle...",
  "Writing 10 hook variants...",
  "Calibrating to AKF voice...",
  "Almost there...",
];

function LoadingMessages({ messages }: { messages: string[] }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => Math.min(i + 1, messages.length - 1)), 2200);
    return () => clearInterval(t);
  }, [messages.length]);
  return (
    <p className="text-sm text-muted-foreground transition-all duration-500">{messages[idx]}</p>
  );
}

function AngleSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 rounded-md border border-border bg-card animate-pulse">
          <div className="flex items-start gap-3">
            <div className="w-5 h-3 bg-muted rounded mt-1 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-muted rounded w-full" />
              <div className="h-3 bg-muted rounded w-4/5" />
              <div className="flex gap-2 mt-3">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-4 w-32 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function HookSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="p-3 rounded-md border border-border bg-card animate-pulse">
          <div className="flex items-start gap-3">
            <div className="flex-1 space-y-2">
              <div className="flex gap-2">
                <div className="h-4 w-16 bg-muted rounded" />
                <div className="h-4 w-20 bg-muted rounded" />
              </div>
              <div className="h-3 bg-muted rounded w-full" />
              <div className="h-3 bg-muted rounded w-3/4" />
            </div>
            <div className="h-7 w-20 bg-muted rounded shrink-0" />
          </div>
        </div>
      ))}
    </div>
  );
}

function GeneratePageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedPillarId, setSelectedPillarId] = useState(
    searchParams.get("pillarId") || ""
  );
  const [topic, setTopic] = useState(searchParams.get("topic") || "");
  const [selectedModeId, setSelectedModeId] = useState(searchParams.get("modeId") || "");

  // Step 1: angles
  const [loadingAngles, setLoadingAngles] = useState(false);
  const [angles, setAngles] = useState<Array<{ angle: string; rationale: string; recommendedFormat: string }>>([]);
  const [selectedAngle, setSelectedAngle] = useState<string>("");

  // Step 2: hooks
  const [loadingHooks, setLoadingHooks] = useState(false);
  const [hooks, setHooks] = useState<Array<{ type: string; hook: string }>>([]);
  const [selectedHook, setSelectedHook] = useState<string>("");
  const [hooksFallback, setHooksFallback] = useState(false);

  const pillars = AKF_VOICE_PROFILE.contentPillars;
  const selectedPillar = pillars.find((p) => p.id === selectedPillarId);
  const selectedMode = CONTENT_MODES.find((m) => m.id === selectedModeId);

  async function handleGenerateAngles() {
    if (!selectedPillarId || !topic.trim()) {
      toast.error("Pick a pillar and enter a topic first.");
      return;
    }
    setLoadingAngles(true);
    setAngles([]);
    setSelectedAngle("");
    setHooks([]);
    setSelectedHook("");

    try {
      const res = await fetch("/api/generate-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pillar: selectedPillar?.name, topic, contentMode: selectedMode }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setAngles(data.ideas || []);
      if (data.ideas?.[0]) setSelectedAngle(data.ideas[0].angle);
    } catch (err) {
      toast.error("Generation failed. Check your Gemini API key.");
      console.error(err);
    } finally {
      setLoadingAngles(false);
    }
  }

  async function handleGenerateHooks(angle: string) {
    setLoadingHooks(true);
    setHooks([]);
    setSelectedHook("");
    setHooksFallback(false);

    try {
      const res = await fetch("/api/generate-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pillar: selectedPillar?.name,
          topic,
          contentMode: selectedMode,
          angle,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Hook generation failed — Gemini is busy. Try again.");
        return;
      }
      setHooks(data.hooks || []);
      if (data._demo) setHooksFallback(true);
    } catch (err) {
      toast.error("Hook generation failed — Gemini is busy. Try again.");
      console.error(err);
    } finally {
      setLoadingHooks(false);
    }
  }

  function handleUseHook(hook: string) {
    const params = new URLSearchParams({
      hook,
      pillar: selectedPillar?.name || "",
      topic,
      modeId: selectedModeId,
      modeName: selectedMode?.name || "",
    });
    router.push(`/script?${params.toString()}`);
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Lightbulb size={16} className="text-gold" />
          <span className="text-xs text-muted-foreground uppercase tracking-widest">Idea Generator + Hook Writer</span>
        </div>
        <h1 className="font-serif text-4xl text-gold tracking-tight">Generate</h1>
        <p className="text-muted-foreground mt-1">
          Pick a content pillar, choose a content type, enter a topic seed, and get 10 hooks calibrated to your voice.
        </p>
      </div>

      {/* Controls */}
      <div className="space-y-6">
        {/* Pillar picker */}
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-widest block mb-2">
            Content Pillar
          </label>
          <div className="flex flex-wrap gap-2">
            {pillars.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPillarId(p.id)}
                className={`px-4 py-2 rounded-md text-sm border transition-all ${
                  selectedPillarId === p.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
          {selectedPillar && (
            <p className="text-xs text-muted-foreground mt-2">{selectedPillar.description}</p>
          )}
        </div>

        {/* Content mode picker */}
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-widest block mb-2">
            Content Type <span className="text-muted-foreground/50 normal-case tracking-normal">— what kind of post is this?</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {CONTENT_MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedModeId(m.id === selectedModeId ? "" : m.id)}
                className={`px-3 py-1.5 rounded-md text-sm border transition-all flex items-center gap-1.5 ${
                  selectedModeId === m.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                <span>{m.emoji}</span>
                <span>{m.name}</span>
              </button>
            ))}
          </div>
          {selectedMode && (
            <p className="text-xs text-muted-foreground mt-2 px-0.5">{selectedMode.description}</p>
          )}
        </div>

        {/* Topic */}
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-widest block mb-2">
            Topic Seed
          </label>
          <Textarea
            placeholder="e.g. Palm Jumeirah supply shortage, 350k AED entry investment, 15 years watching Dubai grow..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="bg-secondary border-border resize-none"
            rows={2}
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Button
            onClick={handleGenerateAngles}
            disabled={loadingAngles || !selectedPillarId || !topic.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
          >
            {loadingAngles ? <Loader2 size={15} className="animate-spin" /> : <Lightbulb size={15} />}
            {loadingAngles ? "Generating..." : "Generate Angles"}
          </Button>
          {angles.length > 0 && !loadingAngles && (
            <Button
              variant="outline"
              onClick={handleGenerateAngles}
              className="gap-2 border-border text-muted-foreground hover:text-foreground"
            >
              <RefreshCw size={14} /> Regenerate Angles
            </Button>
          )}
        </div>
      </div>

      {/* Step 1 Loading */}
      {loadingAngles && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground uppercase tracking-widest">Step 1 — Pick an angle</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="flex items-center gap-2 mb-3">
            <Loader2 size={13} className="animate-spin text-gold shrink-0" />
            <LoadingMessages messages={ANGLE_LOADING_MSGS} />
          </div>
          <AngleSkeleton />
        </div>
      )}

      {/* Step 1 Results — Angles */}
      {!loadingAngles && angles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground uppercase tracking-widest">
              Step 1 — Pick an angle
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="space-y-2">
            {angles.map((idea, i) => (
              <button
                key={i}
                onClick={() => setSelectedAngle(idea.angle)}
                className={`w-full text-left p-4 rounded-md border transition-all ${
                  selectedAngle === idea.angle
                    ? "border-primary bg-accent/50"
                    : "border-border hover:border-primary/40 bg-card"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-gold font-mono text-xs pt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-sm font-medium leading-snug">{idea.angle}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs border-border text-muted-foreground shrink-0">
                        {idea.recommendedFormat}
                      </Badge>
                      <span className="text-xs text-muted-foreground/70 italic">{idea.rationale}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Step 2 trigger */}
          {selectedAngle && (
            <div className="flex items-center gap-3 pt-1">
              <Button
                onClick={() => handleGenerateHooks(selectedAngle)}
                disabled={loadingHooks}
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              >
                {loadingHooks ? <Loader2 size={15} className="animate-spin" /> : <ChevronRight size={15} />}
                {loadingHooks ? "Writing hooks..." : "Write hooks for this angle"}
              </Button>
              {hooks.length > 0 && !loadingHooks && (
                <Button
                  variant="outline"
                  onClick={() => handleGenerateHooks(selectedAngle)}
                  className="gap-2 border-border text-muted-foreground hover:text-foreground"
                >
                  <RefreshCw size={14} /> Regenerate Hooks
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Step 2 Loading */}
      {loadingHooks && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground uppercase tracking-widest">Step 2 — Pick a hook</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="flex items-center gap-2 mb-3">
            <Loader2 size={13} className="animate-spin text-gold shrink-0" />
            <LoadingMessages messages={HOOK_LOADING_MSGS} />
          </div>
          <HookSkeleton />
        </div>
      )}

      {/* Step 2 Results — Hooks */}
      {!loadingHooks && hooks.length > 0 && (
        <div className="space-y-3">
          {hooksFallback && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-amber-50 border border-amber-200 text-xs text-amber-700">
              <RefreshCw size={12} className="shrink-0" />
              <span>Gemini is busy right now — showing backup hooks based on your angle. Click <strong>Regenerate Hooks</strong> to get AI-written ones when it&apos;s back.</span>
            </div>
          )}
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground uppercase tracking-widest">
              Step 2 — Pick a hook
            </span>
            <div className="h-px flex-1 bg-border" />
            <p className="text-xs text-muted-foreground">All hooks open the same angle, different entry</p>
          </div>
          <div className="space-y-2">
            {hooks.map((h, i) => (
              <Card
                key={i}
                className={`bg-card border-border/50 ${
                  selectedHook === h.hook ? "border-primary" : ""
                }`}
              >
                <CardContent className="pt-3 pb-3 flex items-start gap-3">
                  <div className="flex-1">
                    <div className="flex gap-1.5 flex-wrap mb-2">
                      <Badge
                        variant="outline"
                        className={`text-xs ${HOOK_TYPE_COLORS[h.type] || "border-border text-muted-foreground"}`}
                      >
                        {h.type}
                      </Badge>
                      {HOOK_TYPE_TO_NUDGE[h.type] && (
                        <Badge
                          variant="outline"
                          className={`text-xs border ${NUDGE_COLORS[HOOK_TYPE_TO_NUDGE[h.type]] || "border-border text-muted-foreground"}`}
                        >
                          {HOOK_TYPE_TO_NUDGE[h.type]}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed">{h.hook}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground gap-1"
                    onClick={() => handleUseHook(h.hook)}
                  >
                    Use this <ArrowRight size={12} />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedHook && (
            <div className="flex justify-end">
              <Button
                onClick={() => handleUseHook(selectedHook)}
                className="bg-primary text-primary-foreground gap-2"
              >
                Generate Full Script <ChevronRight size={15} />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function GeneratePage() {
  return (
    <Suspense>
      <GeneratePageInner />
    </Suspense>
  );
}
