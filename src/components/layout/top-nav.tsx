"use client";

import Link from "next/link";
import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

interface TopNavProps {
  onSearchClick: () => void;
  onMenuClick: () => void;
}

export function TopNav({ onSearchClick, onMenuClick }: TopNavProps) {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-background px-4 sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        aria-label="Open menu"
        onClick={onMenuClick}
      >
        <Menu className="size-5" />
      </Button>

      <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
        <span className="flex size-6 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
          D
        </span>
        DevKit
      </Link>

      <div className="flex-1" />

      <button
        type="button"
        onClick={onSearchClick}
        className="hidden items-center gap-2 rounded-lg border border-input bg-transparent px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted sm:flex"
      >
        <Search className="size-3.5" />
        Search tools...
        <kbd className="ml-6 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.7rem]">
          ⌘K
        </kbd>
      </button>

      <Button
        variant="ghost"
        size="icon"
        className="sm:hidden"
        aria-label="Search tools"
        onClick={onSearchClick}
      >
        <Search className="size-4" />
      </Button>

      <ThemeToggle />
    </header>
  );
}
