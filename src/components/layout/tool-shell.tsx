"use client";

import { type ReactNode } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocalBadge } from "@/components/tools/shared/local-badge";
import { useFavorites } from "@/hooks/use-favorites";
import { cn } from "@/lib/utils";

interface ToolShellProps {
  slug: string;
  title: string;
  description: string;
  children: ReactNode;
  /** Defaults to true, matching every existing tool. Set false for tools
   * whose content is sent to a server (e.g. Code Share) so the "Processed
   * locally" badge isn't shown where it wouldn't be accurate. */
  localProcessing?: boolean;
}

export function ToolShell({
  slug,
  title,
  description,
  children,
  localProcessing = true,
}: ToolShellProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(slug);

  return (
    <div className="flex max-w-5xl flex-col gap-6">
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
            aria-pressed={favorited}
            onClick={() => toggleFavorite(slug)}
            className="mt-0.5 shrink-0"
          >
            <Star className={cn("size-4", favorited && "fill-foreground text-foreground")} />
          </Button>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        {localProcessing && <LocalBadge className="sm:mt-1" />}
      </div>
      {children}
    </div>
  );
}
