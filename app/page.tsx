import Link from "next/link";
import { Fingerprint, Lightbulb, CalendarDays, Search, TrendingUp, Users, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const tiles = [
  {
    href: "/voice",
    icon: Fingerprint,
    title: "Voice DNA",
    description: "The personal brand voice profile — the foundation of every AI output.",
    badge: "Foundation",
    badgeVariant: "outline" as const,
  },
  {
    href: "/generate",
    icon: Lightbulb,
    title: "Idea Generator",
    description: "Generate pillar-aligned content ideas and 10 hook variants in your voice.",
    badge: "Start here",
    badgeVariant: "default" as const,
  },
  {
    href: "/calendar",
    icon: CalendarDays,
    title: "Content Calendar",
    description: "Plan and schedule content across the week. Track status from idea to posted.",
    badge: "Planning",
    badgeVariant: "outline" as const,
  },
  {
    href: "/intel",
    icon: Search,
    title: "Market Intel",
    description: "Trending hooks and format insights from top Dubai real estate creators.",
    badge: "Research",
    badgeVariant: "outline" as const,
  },
];

const stats = [
  { label: "Content Pillars", value: "6", icon: FileText },
  { label: "Competitor Accounts", value: "8", icon: Users },
  { label: "Trending Formats", value: "6", icon: TrendingUp },
];

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="pt-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
            Dubai Real Estate · Personal Brand
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <h1 className="font-display text-5xl font-bold text-foreground mb-2 tracking-tight">
          Content <span className="text-gold">House</span>
        </h1>
        <p className="text-muted-foreground text-base max-w-xl leading-relaxed">
          AI-powered content guidance for Dubai real estate personal brands. Generate ideas, plan your calendar, and stay ahead of the market.
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="bg-card border-border shadow-sm">
            <CardContent className="pt-4 pb-4 flex items-center gap-3">
              <div className="p-2 rounded-md bg-accent">
                <Icon size={15} className="text-gold" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gold font-display">{value}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tiles */}
      <div>
        <h2 className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tiles.map(({ href, icon: Icon, title, description, badge, badgeVariant }) => (
            <Link key={href} href={href}>
              <Card className="h-full bg-card border-border shadow-sm hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="p-2 rounded-md bg-accent group-hover:bg-primary/10 transition-colors">
                      <Icon size={17} className="text-gold" />
                    </div>
                    <Badge
                      variant={badgeVariant}
                      className={
                        badgeVariant === "default"
                          ? "bg-primary text-primary-foreground text-xs"
                          : "border-border text-muted-foreground text-xs"
                      }
                    >
                      {badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-semibold mt-2">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">{description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Demo flow hint */}
      <Card className="border-primary/20 bg-accent/50 shadow-sm">
        <CardContent className="pt-4 pb-4">
          <p className="text-sm text-muted-foreground">
            <span className="text-gold font-semibold">Demo flow:</span>{" "}
            Voice DNA &rarr; Intel (pick a trending format) &rarr; Generator (ideas + hooks) &rarr; Script (multi-platform copy) &rarr; Calendar
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
