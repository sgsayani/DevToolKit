"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { categoryList } from "@/lib/tools/categories";
import { getToolBySlug, getToolsByCategory, type ToolDefinition } from "@/lib/tools/registry";
import { useFavorites } from "@/hooks/use-favorites";
import { useRecentTools } from "@/hooks/use-recent-tools";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { favorites } = useFavorites();
  const { recent } = useRecentTools();

  function handleSelect(slug: string) {
    onOpenChange(false);
    setSearch("");
    router.push(`/tools/${slug}`);
  }

  // Favorites/Recent only make sense as a shortcut when the user hasn't
  // typed anything yet — once searching, fall back to the full category
  // list so a tool never appears twice in the same result set.
  const showShortcuts = search.trim() === "";
  const favoriteTools = favorites.map(getToolBySlug).filter((t): t is ToolDefinition => !!t);
  const recentTools = recent.map(getToolBySlug).filter((t): t is ToolDefinition => !!t);

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search tools"
      description="Jump to any DevKit tool"
    >
      <CommandInput placeholder="Search tools..." value={search} onValueChange={setSearch} />
      <CommandList>
        <CommandEmpty>No tools found.</CommandEmpty>

        {showShortcuts && favoriteTools.length > 0 && (
          <CommandGroup heading="Favorites">
            {favoriteTools.map((tool) => (
              <CommandItem
                key={tool.slug}
                value={`favorite ${tool.name}`}
                onSelect={() => handleSelect(tool.slug)}
              >
                <tool.icon className="size-4" />
                {tool.name}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {showShortcuts && recentTools.length > 0 && (
          <CommandGroup heading="Recent">
            {recentTools.map((tool) => (
              <CommandItem
                key={tool.slug}
                value={`recent ${tool.name}`}
                onSelect={() => handleSelect(tool.slug)}
              >
                <tool.icon className="size-4" />
                {tool.name}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {categoryList.map((category) => {
          const categoryTools = getToolsByCategory(category.id);
          if (categoryTools.length === 0) return null;
          return (
            <CommandGroup key={category.id} heading={category.label}>
              {categoryTools.map((tool) => (
                <CommandItem
                  key={tool.slug}
                  value={`${tool.name} ${tool.keywords.join(" ")}`}
                  onSelect={() => handleSelect(tool.slug)}
                >
                  <tool.icon className="size-4" />
                  {tool.name}
                </CommandItem>
              ))}
            </CommandGroup>
          );
        })}
      </CommandList>
    </CommandDialog>
  );
}
