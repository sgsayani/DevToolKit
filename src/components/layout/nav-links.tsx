"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clock, Star } from "lucide-react";
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
      className={cn(
        "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
        active
          ? "bg-accent font-medium text-accent-foreground"
          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
      )}
    >
      <tool.icon className="size-4 shrink-0" />
      {tool.name}
    </Link>
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
    <nav className="flex flex-col gap-6">
      {favoriteTools.length > 0 && (
        <div className="flex flex-col gap-1">
          <h3 className="flex items-center gap-1 px-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            <Star className="size-3" />
            Favorites
          </h3>
          {favoriteTools.map((tool) => (
            <NavToolLink
              key={tool.slug}
              tool={tool}
              active={pathname === `/tools/${tool.slug}`}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}

      {recentTools.length > 0 && (
        <div className="flex flex-col gap-1">
          <h3 className="flex items-center gap-1 px-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            <Clock className="size-3" />
            Recent
          </h3>
          {recentTools.map((tool) => (
            <NavToolLink
              key={tool.slug}
              tool={tool}
              active={pathname === `/tools/${tool.slug}`}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}

      {categoryList.map((category) => {
        const categoryTools = getToolsByCategory(category.id);
        return (
          <div key={category.id} className="flex flex-col gap-1">
            <h3 className="px-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {category.label}
            </h3>
            {categoryTools.map((tool) => (
              <NavToolLink
                key={tool.slug}
                tool={tool}
                active={pathname === `/tools/${tool.slug}`}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        );
      })}
    </nav>
  );
}
