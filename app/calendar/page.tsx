"use client";

import { useState, useEffect, useCallback } from "react";
import { CalendarDays, Plus, Loader2, ChevronLeft, ChevronRight, LayoutGrid, Rows3, Copy, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Link from "next/link";
import type { CalendarItem, ContentStatus } from "@/types/content";

const STATUS_STYLES: Record<ContentStatus, { badge: string; label: string }> = {
  idea: { badge: "bg-amber-50 text-amber-700 border-amber-200", label: "Idea" },
  draft: { badge: "bg-blue-50 text-blue-700 border-blue-200", label: "Draft" },
  scheduled: { badge: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Scheduled" },
  posted: { badge: "bg-gray-50 text-gray-500 border-gray-200", label: "Posted" },
};

const PILLAR_COLORS: Record<string, string> = {
  "dubai-market-pulse": "border-l-rose-400",
  "investing-playbook": "border-l-violet-400",
  "founder-diary": "border-l-amber-400",
  "lifestyle-mindset": "border-l-teal-400",
  "client-wins": "border-l-sky-400",
};

// Forward and backward status cycles
const STATUS_CYCLE_FWD: Record<ContentStatus, ContentStatus> = {
  idea: "draft",
  draft: "scheduled",
  scheduled: "posted",
  posted: "idea",
};

const STATUS_CYCLE_BACK: Record<ContentStatus, ContentStatus> = {
  idea: "posted",
  draft: "idea",
  scheduled: "draft",
  posted: "scheduled",
};

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// ── Week helpers ──────────────────────────────────────────
function getMondayOfWeek(offset = 0): Date {
  const today = new Date();
  const day = today.getDay();
  const diff = (day === 0 ? -6 : 1 - day) + offset * 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function getWeekDates(monday: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function formatWeekRange(dates: Date[]): string {
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const from = dates[0].toLocaleDateString("en-US", opts);
  const to = dates[6].toLocaleDateString("en-US", { ...opts, year: "numeric" });
  return `${from} – ${to}`;
}

// ── Month helpers ─────────────────────────────────────────
function getMonthInfo(offset: number): { year: number; month: number } {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() + offset);
  return { year: d.getFullYear(), month: d.getMonth() };
}

function getMonthViewDates(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDow = firstDay.getDay();
  const daysBeforeStart = startDow === 0 ? 6 : startDow - 1;
  const start = new Date(firstDay);
  start.setDate(firstDay.getDate() - daysBeforeStart);
  const endDow = lastDay.getDay();
  const daysAfterEnd = endDow === 0 ? 0 : 7 - endDow;
  const end = new Date(lastDay);
  end.setDate(lastDay.getDate() + daysAfterEnd);
  const dates: Date[] = [];
  const cur = new Date(start);
  while (cur <= end) {
    dates.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

function formatDateStr(d: Date): string {
  return d.toISOString().split("T")[0];
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <Button size="sm" variant="ghost" onClick={copy} className="text-muted-foreground hover:text-foreground gap-1 h-7 px-2">
      {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
      <span className="text-xs">{copied ? "Copied" : "Copy"}</span>
    </Button>
  );
}

export default function CalendarPage() {
  const [items, setItems] = useState<CalendarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<CalendarItem | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);

  // View mode
  const [viewMode, setViewMode] = useState<"week" | "month">("week");
  const [weekOffset, setWeekOffset] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);

  // Week view state
  const monday = getMondayOfWeek(weekOffset);
  const weekDates = getWeekDates(monday);
  const todayStr = formatDateStr(new Date());

  // Month view state
  const { year: mYear, month: mMonth } = getMonthInfo(monthOffset);
  const monthDates = getMonthViewDates(mYear, mMonth);

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch("/api/calendar-items");
      if (res.ok) setItems(await res.json());
    } catch {
      toast.error("Failed to load calendar.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  async function cycleStatus(item: CalendarItem, direction: "fwd" | "back" = "fwd", e?: React.MouseEvent) {
    e?.stopPropagation();
    const newStatus = direction === "fwd" ? STATUS_CYCLE_FWD[item.status] : STATUS_CYCLE_BACK[item.status];
    const res = await fetch("/api/calendar-items", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, status: newStatus }),
    });
    if (res.ok) {
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: newStatus } : i)));
      if (selectedItem?.id === item.id) setSelectedItem({ ...item, status: newStatus });
      if (direction === "back") toast.success(`Moved back to ${STATUS_STYLES[newStatus].label}`);
    }
  }

  async function handleDrop(date: string) {
    if (!dragging) return;
    const res = await fetch("/api/calendar-items", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: dragging, scheduled_for: date }),
    });
    if (res.ok) {
      setItems((prev) => prev.map((i) => (i.id === dragging ? { ...i, scheduled_for: date } : i)));
      toast.success("Rescheduled");
    }
    setDragging(null);
  }

  async function deleteItem(id: string) {
    const res = await fetch("/api/calendar-items", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      setSelectedItem(null);
      toast.success("Deleted.");
    }
  }

  const itemsForDate = (date: Date) =>
    items.filter((i) => i.scheduled_for === formatDateStr(date));

  // Stats for visible period
  const visibleItems = viewMode === "week"
    ? weekDates.flatMap(itemsForDate)
    : monthDates.flatMap(itemsForDate);

  const statusCounts = visibleItems.reduce((acc, i) => {
    acc[i.status] = (acc[i.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Navigation label
  const navLabel = viewMode === "week"
    ? formatWeekRange(weekDates)
    : `${MONTH_NAMES[mMonth]} ${mYear}`;

  function navBack() {
    if (viewMode === "week") setWeekOffset((w) => w - 1);
    else setMonthOffset((m) => m - 1);
  }
  function navFwd() {
    if (viewMode === "week") setWeekOffset((w) => w + 1);
    else setMonthOffset((m) => m + 1);
  }
  function navToday() {
    setWeekOffset(0);
    setMonthOffset(0);
  }
  const isAtToday = viewMode === "week" ? weekOffset !== 0 : monthOffset !== 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CalendarDays size={15} className="text-gold" />
            <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Content Calendar</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground tracking-tight">
            {viewMode === "week" ? "Weekly" : "Monthly"} <span className="text-gold">Planner</span>
          </h1>
        </div>
        <Link href="/generate">
          <Button size="sm" className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm">
            <Plus size={14} /> New Content
          </Button>
        </Link>
      </div>

      {/* Controls row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Navigation */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-border" onClick={navBack}>
            <ChevronLeft size={14} />
          </Button>
          <span className="text-sm font-medium text-foreground min-w-48 text-center">{navLabel}</span>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-border" onClick={navFwd}>
            <ChevronRight size={14} />
          </Button>
          {isAtToday && (
            <Button variant="ghost" size="sm" onClick={navToday} className="text-xs text-muted-foreground">
              Today
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Weekly stats */}
          <div className="flex items-center gap-2 flex-wrap">
            {visibleItems.length === 0 ? (
              <span className="text-xs text-muted-foreground">No items</span>
            ) : (
              (["scheduled", "draft", "idea", "posted"] as ContentStatus[]).map((s) =>
                statusCounts[s] ? (
                  <span key={s} className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_STYLES[s].badge}`}>
                    {statusCounts[s]} {s}
                  </span>
                ) : null
              )
            )}
          </div>

          {/* View toggle */}
          <div className="flex items-center border border-border rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode("week")}
              className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium transition-colors ${
                viewMode === "week" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <Rows3 size={12} /> Week
            </button>
            <button
              onClick={() => setViewMode("month")}
              className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium transition-colors ${
                viewMode === "month" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <LayoutGrid size={12} /> Month
            </button>
          </div>
        </div>
      </div>

      {/* Status legend */}
      <div className="flex gap-3 flex-wrap items-center">
        {(["idea", "draft", "scheduled", "posted"] as ContentStatus[]).map((s) => (
          <div key={s} className="flex items-center gap-1.5">
            <span className={`text-xs px-2 py-0.5 rounded border ${STATUS_STYLES[s].badge}`}>
              {STATUS_STYLES[s].label}
            </span>
          </div>
        ))}
        <span className="text-xs text-muted-foreground ml-1">
          · Click status to advance &middot; Drag to reschedule &middot; Open card to go back
        </span>
      </div>

      {/* Calendar grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={22} className="animate-spin text-gold" />
        </div>
      ) : viewMode === "week" ? (
        // ── WEEK VIEW ────────────────────────────────────────────
        <div className="grid grid-cols-7 gap-2">
          {/* Day headers */}
          {weekDates.map((date, i) => {
            const isToday = formatDateStr(date) === todayStr;
            return (
              <div key={formatDateStr(date)} className="text-center">
                <p className={`text-xs font-medium mb-0.5 ${isToday ? "text-gold" : "text-muted-foreground"}`}>
                  {DAY_LABELS[i]}
                </p>
                <p className={`text-sm font-semibold ${isToday ? "text-gold" : "text-foreground"}`}>
                  {date.getDate()}
                </p>
              </div>
            );
          })}

          {/* Day columns */}
          {weekDates.map((date) => {
            const dateStr = formatDateStr(date);
            const isToday = dateStr === todayStr;
            const dayItems = itemsForDate(date);
            return (
              <div
                key={dateStr}
                className={`min-h-64 rounded-lg border-2 p-2 space-y-2 transition-all ${
                  isToday ? "border-primary/40 bg-amber-50/30" : "border-border bg-card hover:border-border/80"
                } ${dragging ? "hover:border-primary/60 hover:bg-primary/5" : ""}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(dateStr)}
              >
                {dayItems.map((item) => {
                  const pillarColor = PILLAR_COLORS[item.pillar_id || ""] || "border-l-gold";
                  const statusStyle = STATUS_STYLES[item.status];
                  return (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={() => setDragging(item.id)}
                      onDragEnd={() => setDragging(null)}
                      onClick={() => setSelectedItem(item)}
                      className="cursor-pointer"
                    >
                      <Card className={`bg-white border border-border shadow-sm hover:shadow-md transition-all border-l-4 ${pillarColor}`}>
                        <CardContent className="p-2.5 space-y-1.5">
                          <p className="text-xs font-semibold text-gold uppercase tracking-wide truncate">
                            {item.pillar}
                          </p>
                          <p className="text-xs text-foreground leading-snug line-clamp-2">{item.hook}</p>
                          <div className="flex items-center gap-1 flex-wrap pt-0.5">
                            <span className="text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                              {item.platform}
                            </span>
                            <button
                              onClick={(e) => cycleStatus(item, "fwd", e)}
                              className={`text-xs px-1.5 py-0.5 rounded border hover:opacity-80 transition-opacity ${statusStyle.badge}`}
                            >
                              {statusStyle.label}
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
                {dayItems.length === 0 && (
                  <Link href="/generate">
                    <div className="h-full min-h-48 flex flex-col items-center justify-center gap-1.5 text-muted-foreground/40 hover:text-primary/40 transition-colors group">
                      <Plus size={16} className="group-hover:scale-110 transition-transform" />
                      <span className="text-xs">Add</span>
                    </div>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        // ── MONTH VIEW ───────────────────────────────────────────
        <div>
          {/* Month day headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAY_LABELS.map((d) => (
              <div key={d} className="text-center py-1">
                <p className="text-xs font-medium text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
          {/* Month grid */}
          <div className="grid grid-cols-7 gap-1">
            {monthDates.map((date) => {
              const dateStr = formatDateStr(date);
              const isToday = dateStr === todayStr;
              const isCurrentMonth = date.getMonth() === mMonth;
              const dayItems = itemsForDate(date);
              return (
                <div
                  key={dateStr}
                  className={`min-h-24 rounded-lg border p-1.5 transition-all ${
                    isToday
                      ? "border-primary/50 bg-amber-50/40"
                      : isCurrentMonth
                      ? "border-border bg-card"
                      : "border-border/40 bg-muted/20"
                  } ${dragging ? "hover:border-primary/50 hover:bg-primary/5" : ""}`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(dateStr)}
                >
                  <p className={`text-xs font-semibold mb-1 ${
                    isToday ? "text-gold" : isCurrentMonth ? "text-foreground" : "text-muted-foreground/50"
                  }`}>
                    {date.getDate()}
                  </p>
                  <div className="space-y-0.5">
                    {dayItems.slice(0, 3).map((item) => {
                      const pillarColor = PILLAR_COLORS[item.pillar_id || ""] || "border-l-gold";
                      return (
                        <div
                          key={item.id}
                          draggable
                          onDragStart={() => setDragging(item.id)}
                          onDragEnd={() => setDragging(null)}
                          onClick={() => setSelectedItem(item)}
                          className={`cursor-pointer border-l-2 pl-1 py-0.5 rounded-sm bg-white/80 hover:bg-white transition-colors ${pillarColor}`}
                        >
                          <p className="text-xs text-foreground leading-none truncate">{item.hook}</p>
                        </div>
                      );
                    })}
                    {dayItems.length > 3 && (
                      <p className="text-xs text-muted-foreground pl-1">+{dayItems.length - 3} more</p>
                    )}
                    {dayItems.length === 0 && isCurrentMonth && (
                      <Link href="/generate">
                        <div className="flex items-center justify-center h-8 text-muted-foreground/30 hover:text-primary/30 transition-colors">
                          <Plus size={12} />
                        </div>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">Click any + to generate your first piece of content.</p>
        </div>
      )}

      {/* Item detail dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="bg-white border-border max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-gold font-display font-semibold">
              {selectedItem?.pillar}
            </DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Hook</p>
                <p className="text-sm font-medium leading-relaxed">{selectedItem.hook}</p>
              </div>
              {selectedItem.scripts ? (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-2">Content</p>
                  <Tabs defaultValue="reel">
                    <TabsList className="bg-secondary h-8 mb-2">
                      <TabsTrigger value="reel" className="text-xs px-2.5 h-6">Reel</TabsTrigger>
                      <TabsTrigger value="caption" className="text-xs px-2.5 h-6">Caption</TabsTrigger>
                      <TabsTrigger value="linkedin" className="text-xs px-2.5 h-6">LinkedIn</TabsTrigger>
                      <TabsTrigger value="yt" className="text-xs px-2.5 h-6">YouTube</TabsTrigger>
                      <TabsTrigger value="fb" className="text-xs px-2.5 h-6">Facebook</TabsTrigger>
                    </TabsList>
                    <TabsContent value="reel">
                      <div className="relative bg-secondary/50 rounded-md p-3">
                        <div className="absolute top-2 right-2"><CopyButton text={selectedItem.scripts.instagram_reel || ""} /></div>
                        <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-sans leading-relaxed max-h-48 overflow-y-auto pr-14">
                          {selectedItem.scripts.instagram_reel}
                        </pre>
                      </div>
                    </TabsContent>
                    <TabsContent value="caption">
                      <div className="relative bg-secondary/50 rounded-md p-3">
                        <div className="absolute top-2 right-2">
                          <CopyButton text={(selectedItem.scripts.instagram_caption || "") + (selectedItem.scripts.hashtags ? "\n\n" + selectedItem.scripts.hashtags.map(h => `#${h}`).join(" ") : "")} />
                        </div>
                        <p className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto pr-14">
                          {selectedItem.scripts.instagram_caption}
                        </p>
                        {selectedItem.scripts.hashtags && (
                          <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-border">
                            {selectedItem.scripts.hashtags.map((tag) => (
                              <span key={tag} className="text-xs text-primary border border-border rounded px-1.5 py-0.5">#{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    <TabsContent value="linkedin">
                      <div className="relative bg-secondary/50 rounded-md p-3">
                        <div className="absolute top-2 right-2"><CopyButton text={selectedItem.scripts.linkedin || ""} /></div>
                        <p className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto pr-14">
                          {selectedItem.scripts.linkedin}
                        </p>
                      </div>
                    </TabsContent>
                    <TabsContent value="yt">
                      <div className="relative bg-secondary/50 rounded-md p-3">
                        <div className="absolute top-2 right-2"><CopyButton text={selectedItem.scripts.youtube_short || ""} /></div>
                        <p className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto pr-14">
                          {selectedItem.scripts.youtube_short}
                        </p>
                      </div>
                    </TabsContent>
                    <TabsContent value="fb">
                      <div className="relative bg-secondary/50 rounded-md p-3">
                        <div className="absolute top-2 right-2"><CopyButton text={selectedItem.scripts.facebook || ""} /></div>
                        <p className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto pr-14">
                          {selectedItem.scripts.facebook}
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              ) : selectedItem.body && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Caption</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                    {selectedItem.body}
                  </p>
                </div>
              )}
              <div className="pt-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-2">Platform</p>
                <Badge variant="outline" className="border-border text-muted-foreground text-xs">
                  {selectedItem.platform}
                </Badge>
              </div>

              {/* Status controls */}
              <div className="space-y-2 pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground font-medium">Status</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => cycleStatus(selectedItem, "back")}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded border border-border text-muted-foreground hover:bg-muted transition-colors"
                  >
                    ← Go back
                  </button>
                  <span className={`text-xs px-3 py-1.5 rounded border font-medium ${STATUS_STYLES[selectedItem.status].badge}`}>
                    {STATUS_STYLES[selectedItem.status].label}
                  </span>
                  <button
                    onClick={() => cycleStatus(selectedItem, "fwd")}
                    className={`text-xs px-3 py-1.5 rounded border hover:opacity-80 transition-opacity ${STATUS_STYLES[STATUS_CYCLE_FWD[selectedItem.status]].badge}`}
                  >
                    → {STATUS_STYLES[STATUS_CYCLE_FWD[selectedItem.status]].label}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground/60">
                  Accidentally advanced? Use &ldquo;← Go back&rdquo; to undo.
                </p>
              </div>

              <div className="flex justify-end pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-200 text-red-500 hover:bg-red-50 text-xs"
                  onClick={() => deleteItem(selectedItem.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
