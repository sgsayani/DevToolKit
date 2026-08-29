"use client";

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
import { getToolsByCategory } from "@/lib/tools/registry";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();

  function handleSelect(slug: string) {
    onOpenChange(false);
    router.push(`/tools/${slug}`);
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search tools"
      description="Jump to any DevKit tool"
    >
      <CommandInput placeholder="Search tools..." />
      <CommandList>
        <CommandEmpty>No tools found.</CommandEmpty>
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
