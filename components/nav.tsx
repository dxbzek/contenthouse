"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Fingerprint, Lightbulb, CalendarDays, Search } from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/voice", label: "Voice DNA", icon: Fingerprint },
  { href: "/generate", label: "Generator", icon: Lightbulb },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/intel", label: "Intel", icon: Search },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xs tracking-tight">CH</span>
          </div>
          <span className="font-display text-base font-semibold text-foreground hidden sm:block tracking-tight">
            Content House
          </span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-0.5">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all",
                pathname === href
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <Icon size={14} />
              <span className="hidden md:inline">{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
