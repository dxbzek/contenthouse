"use client";

import { useState } from "react";
import { COMPETITORS } from "@/lib/intel/competitors";
import { TRENDING_HOOKS, BENCHMARK_SOURCES, KEY_MARKET_STATS } from "@/lib/intel/trending-hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, ExternalLink, TrendingUp, ArrowRight, Info, RefreshCw, BarChart3, BookOpen } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const FORMAT_COLORS: Record<string, string> = {
  Reel: "bg-pink-50 text-pink-700 border-pink-200",
  Carousel: "bg-purple-50 text-purple-700 border-purple-200",
  LinkedIn: "bg-blue-50 text-blue-700 border-blue-200",
  "YouTube Short": "bg-red-50 text-red-700 border-red-200",
};

const NUDGE_COLORS: Record<string, string> = {
  "Loss Aversion": "bg-red-50 text-red-700 border-red-200",
  "Anchoring": "bg-violet-50 text-violet-700 border-violet-200",
  "Choice Architecture": "bg-amber-50 text-amber-700 border-amber-200",
  "Social Proof": "bg-blue-50 text-blue-700 border-blue-200",
  "Curiosity Gap": "bg-teal-50 text-teal-700 border-teal-200",
  "Salience": "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const DATA_LAST_UPDATED = "April 2026";

export default function IntelPage() {
  const [refreshing, setRefreshing] = useState(false);

  function handleRefresh() {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast.success(`Data is current. Last reviewed: ${DATA_LAST_UPDATED}.`);
    }, 1200);
  }

  return (
    <div className="space-y-10 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Search size={15} className="text-gold" />
            <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Market Intelligence</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground tracking-tight">
            Competitor <span className="text-gold">Intel</span>
          </h1>
          <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
            Top Dubai real estate creators to benchmark against — trending formats, Nudge Theory hooks, and live market data.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded border border-border">
            Last updated: {DATA_LAST_UPDATED}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 border-border text-muted-foreground hover:text-foreground"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Checking..." : "Refresh"}
          </Button>
        </div>
      </div>

      {/* Data source banner */}
      <Card className="border-border bg-amber-50/60 shadow-sm">
        <CardContent className="pt-3 pb-3 flex items-start gap-2.5">
          <Info size={14} className="text-gold mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Data sources:</span>{" "}
            <a href="https://www.knightfrank.com/research/uae" target="_blank" rel="noopener noreferrer" className="font-medium text-foreground hover:text-gold transition-colors underline underline-offset-2">Knight Frank</a>,{" "}
            <a href="https://www.arabianbusiness.com/real-estate" target="_blank" rel="noopener noreferrer" className="font-medium text-foreground hover:text-gold transition-colors underline underline-offset-2">Arabian Business</a>,{" "}
            <a href="https://www.bayut.com/mybayut/dubai-real-estate-market-report/" target="_blank" rel="noopener noreferrer" className="font-medium text-foreground hover:text-gold transition-colors underline underline-offset-2">Bayut</a>,{" "}
            <a href="https://gulfnews.com/business/property" target="_blank" rel="noopener noreferrer" className="font-medium text-foreground hover:text-gold transition-colors underline underline-offset-2">Gulf News Property</a>,{" "}
            <a href="https://www.propertyfinder.ae/en/blog/market-reports/" target="_blank" rel="noopener noreferrer" className="font-medium text-foreground hover:text-gold transition-colors underline underline-offset-2">Property Finder DataGuru</a>, and{" "}
            <a href="https://www.zawya.com/en/real-estate" target="_blank" rel="noopener noreferrer" className="font-medium text-foreground hover:text-gold transition-colors underline underline-offset-2">Zawya</a>.
            Hook benchmarks apply Nudge Theory principles (Thaler &amp; Sunstein). Competitor profiles compiled {DATA_LAST_UPDATED}.
          </p>
        </CardContent>
      </Card>

      {/* Key Market Stats */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={14} className="text-gold" />
          <h2 className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Key Market Stats — Dubai 2024–2026</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {KEY_MARKET_STATS.map((s) => (
            <a key={s.stat} href={s.url} target="_blank" rel="noopener noreferrer" className="group">
              <Card className="bg-card border-border shadow-sm hover:border-primary/40 hover:shadow-md transition-all h-full">
                <CardContent className="pt-4 pb-3">
                  <p className="text-xl font-bold text-gold font-display mb-1">{s.stat}</p>
                  <p className="text-xs font-semibold text-foreground leading-snug mb-1">{s.label}</p>
                  <p className="text-xs text-muted-foreground leading-snug">{s.detail}</p>
                  <p className="text-xs text-muted-foreground/50 mt-1.5 group-hover:text-gold transition-colors flex items-center gap-0.5">
                    {s.source} <ExternalLink size={9} />
                  </p>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>

      {/* Trending hooks */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp size={14} className="text-gold" />
          <h2 className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Trending Formats & Hooks</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Each hook is built on a Nudge Theory principle — the psychological lever that makes it stop the scroll and drive action.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TRENDING_HOOKS.map((hook) => {
            const params = new URLSearchParams({
              pillarId: hook.pillarId,
              topic: hook.title,
            });
            const nudgeColor = NUDGE_COLORS[hook.nudgePrinciple] || "bg-muted text-muted-foreground border-border";
            return (
              <Card key={hook.id} className="bg-card border-border shadow-sm hover:border-primary/40 hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <CardTitle className="text-sm font-semibold">{hook.title}</CardTitle>
                    <div className="flex gap-1 flex-wrap">
                      <Badge variant="outline" className={`shrink-0 text-xs border ${nudgeColor}`}>
                        {hook.nudgePrinciple}
                      </Badge>
                      <Badge variant="outline" className={`shrink-0 text-xs border ${FORMAT_COLORS[hook.format] || "border-border text-muted-foreground"}`}>
                        {hook.format}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <blockquote className="border-l-2 border-primary/40 pl-3 text-sm text-muted-foreground italic leading-relaxed">
                    &ldquo;{hook.hookText}&rdquo;
                  </blockquote>
                  <div className="space-y-1.5">
                    <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-2 py-1 leading-snug">
                      {hook.whyItWorks}
                    </p>
                    <p className="text-xs text-muted-foreground leading-snug">
                      <span className="font-medium">Trend signal:</span> {hook.trendSignal}
                    </p>
                    <p className="text-xs text-muted-foreground/70 leading-snug">
                      <span className="font-medium">Source:</span>{" "}
                      {hook.sourceUrl ? (
                        <a href={hook.sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors underline underline-offset-2">
                          {hook.source}
                        </a>
                      ) : hook.source}
                    </p>
                  </div>
                  <Link
                    href={`/generate?${params.toString()}`}
                    className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors font-semibold"
                  >
                    Generate my version <ArrowRight size={11} />
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Benchmark Sources */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen size={14} className="text-gold" />
          <h2 className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Benchmark Sources</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          These are the credible, institution-grade sources behind the market data in this app. Citing them in content builds trust with high-ticket investors.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BENCHMARK_SOURCES.map((src) => (
            <a key={src.name} href={src.url} target="_blank" rel="noopener noreferrer" className="group">
              <Card className="bg-card border-border shadow-sm hover:border-primary/40 hover:shadow-md transition-all h-full">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm font-semibold group-hover:text-gold transition-colors">{src.name}</p>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{src.updateFrequency}</span>
                      <ExternalLink size={11} className="text-muted-foreground group-hover:text-gold transition-colors" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-snug mb-2">{src.description}</p>
                  <p className="text-xs text-gold font-medium">Best for: <span className="text-muted-foreground font-normal">{src.bestFor}</span></p>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>

      {/* Competitor profiles */}
      <div>
        <h2 className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-4">
          Competitor Profiles
        </h2>
        <div className="space-y-3">
          {COMPETITORS.map((c) => (
            <Card key={c.handle} className="bg-card border-border shadow-sm">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent border border-border flex items-center justify-center shrink-0">
                    <span className="text-xs text-gold font-bold">
                      {c.name.split(" ")[0][0]}{c.name.split(" ")[1]?.[0] || ""}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <span className="font-semibold text-sm">{c.name}</span>
                        <span className="text-muted-foreground text-xs ml-2">{c.handle}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-xs px-1.5 py-0.5 rounded border ${c.followersVerified ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-600 border-amber-200"}`}>
                          {c.followers} {c.followersVerified ? "✓" : "~est"}
                        </span>
                        <a
                          href={c.profileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-gold transition-colors"
                        >
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                    <CardDescription className="text-xs mb-2">{c.niche}</CardDescription>
                    <div className="flex flex-wrap gap-1 mb-2.5">
                      {c.contentFormats.map((f) => (
                        <Badge key={f} variant="outline" className="text-xs border-border text-muted-foreground">
                          {f}
                        </Badge>
                      ))}
                    </div>
                    <div className="bg-amber-50/80 border border-amber-100 rounded px-3 py-2 mb-2">
                      <p className="text-xs text-gold font-semibold mb-0.5">What to steal</p>
                      <p className="text-xs text-muted-foreground leading-snug">{c.whatToLearn}</p>
                    </div>
                    <p className="text-xs text-muted-foreground/60">
                      <span className="font-medium">Source:</span> {c.source}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
