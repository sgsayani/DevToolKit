"use client";

import { useState, type ReactNode } from "react";
import { TopNav } from "@/components/layout/top-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { CommandPalette } from "@/components/layout/command-palette";
import { Footer } from "@/components/layout/footer";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";

export function AppShell({ children }: { children: ReactNode }) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useKeyboardShortcut("k", () => setPaletteOpen((open) => !open), { mod: true });

  return (
    <div className="flex min-h-screen flex-col">
      <TopNav
        onSearchClick={() => setPaletteOpen(true)}
        onMenuClick={() => setMobileNavOpen(true)}
      />
      <div className="flex flex-1">
        <Sidebar className="sticky top-14 hidden h-[calc(100vh-3.5rem)] md:block" />
        <main className="min-w-0 flex-1 overflow-x-hidden px-4 py-6 sm:px-6 md:px-8 md:py-8">
          {children}
        </main>
      </div>
      <Footer />
      <MobileNav open={mobileNavOpen} onOpenChange={setMobileNavOpen} />
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}
