"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Clock, LayoutDashboard, Star } from "lucide-react";
import { categoryList } from "@/lib/tools/categories";
import { getToolBySlug, getToolsByCategory, type ToolDefinition } from "@/lib/tools/registry";
import { useFavorites } from "@/hooks/use-favorites";
import { useRecentTools } from "@/hooks/use-recent-tools";
import { cn } from "@/lib/utils";

function NavToolLink({
  tool,
  active,
  onNavigate,
}: {
  tool: ToolDefinition;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-2 rounded-md border-l-2 py-1.5 pr-2 pl-[calc(0.5rem-2px)] text-sm transition-colors",
        active
          ? "border-primary bg-sidebar-accent font-medium text-sidebar-accent-foreground"
          : "border-transparent text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground",
      )}
    >
      <tool.icon className="size-4 shrink-0" />
      <span className="truncate">{tool.name}</span>
    </Link>
  );
}

/** Section heading that's also a <details> toggle — categories collapse,
 * but default open so the sidebar behaves exactly as before until someone
 * chooses to tidy it up. Persists open/closed across tool navigation since
 * the sidebar stays mounted across route changes (it lives in the shell). */
function NavSection({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <details open className="group/section flex flex-col gap-1">
      <summary className="flex cursor-pointer list-none items-center gap-1 rounded-md px-2 py-1 text-xs font-medium tracking-wide text-muted-foreground uppercase select-none hover:text-foreground [&::-webkit-details-marker]:hidden">
        <ChevronRight className="size-3 shrink-0 transition-transform group-open/section:rotate-90" />
        {Icon && <Icon className="size-3 shrink-0" />}
        {label}
      </summary>
      <div className="flex flex-col gap-1 pt-0.5">{children}</div>
    </details>
  );
}

/** Sub-heading used inside Workspace for Favorites/Recent — smaller than a
 * top-level NavSection, not independently collapsible. */
function NavSubheading({
  label,
  icon: Icon,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="mt-2 flex items-center gap-1 px-2 text-[0.7rem] font-medium tracking-wide text-muted-foreground/70 uppercase">
      <Icon className="size-3" />
      {label}
    </div>
  );
}

/** Category → tool link list, shared by the desktop sidebar and mobile sheet nav. */
export function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { favorites } = useFavorites();
  const { recent } = useRecentTools();

  const favoriteTools = favorites.map(getToolBySlug).filter((t): t is ToolDefinition => !!t);
  const recentTools = recent.map(getToolBySlug).filter((t): t is ToolDefinition => !!t);

  return (
    <nav className="flex flex-col gap-4">
      <NavSection label="Workspace">
        <Link
          href="/"
          onClick={onNavigate}
          aria-current={pathname === "/" ? "page" : undefined}
          className={cn(
            "flex items-center gap-2 rounded-md border-l-2 py-1.5 pr-2 pl-[calc(0.5rem-2px)] text-sm transition-colors",
            pathname === "/"
              ? "border-primary bg-sidebar-accent font-medium text-sidebar-accent-foreground"
              : "border-transparent text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground",
          )}
        >
          <LayoutDashboard className="size-4 shrink-0" />
          Dashboard
        </Link>

        {favoriteTools.length > 0 && (
          <>
            <NavSubheading label="Favorites" icon={Star} />
            {favoriteTools.map((tool) => (
              <NavToolLink
                key={tool.slug}
                tool={tool}
                active={pathname === `/tools/${tool.slug}`}
                onNavigate={onNavigate}
              />
            ))}
          </>
        )}

        {recentTools.length > 0 && (
          <>
            <NavSubheading label="Recent" icon={Clock} />
            {recentTools.map((tool) => (
              <NavToolLink
                key={tool.slug}
                tool={tool}
                active={pathname === `/tools/${tool.slug}`}
                onNavigate={onNavigate}
              />
            ))}
          </>
        )}
      </NavSection>

      {categoryList.map((category) => {
        const categoryTools = getToolsByCategory(category.id);
        return (
          <NavSection key={category.id} label={category.label} icon={category.icon}>
            {categoryTools.map((tool) => (
              <NavToolLink
                key={tool.slug}
                tool={tool}
                active={pathname === `/tools/${tool.slug}`}
                onNavigate={onNavigate}
              />
            ))}
          </NavSection>
        );
      })}
    </nav>
  );
}
