"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { categoryList } from "@/lib/tools/categories";
import { getToolBySlug, tools, type ToolDefinition } from "@/lib/tools/registry";
import { useRecentTools } from "@/hooks/use-recent-tools";
import { cn } from "@/lib/utils";

// A fixed, curated set — DevKit has no usage analytics to derive a real
// "most popular" list from, so this is an editorial pick of the tools a
// developer reaches for most often, shown until Recently Used has enough
// history to be more useful than this.
const POPULAR_SLUGS = [
  "json-formatter",
  "api-client",
  "diff-checker",
  "jwt-debugger",
  "uuid-generator",
  "hash-generator",
  "sql-formatter",
  "password-generator",
];

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function ToolCard({ tool }: { tool: ToolDefinition }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className={cn(
        "group flex flex-col gap-1.5 rounded-lg border border-border bg-card p-4 shadow-xs transition-[border-color,box-shadow,transform]",
        "hover:border-primary/30 hover:shadow-sm motion-safe:hover:-translate-y-0.5",
      )}
    >
      <div className="flex items-center gap-2">
        <tool.icon className="size-4 shrink-0 text-muted-foreground group-hover:text-primary" />
        <span className="truncate text-sm font-medium">{tool.name}</span>
      </div>
      <p className="line-clamp-2 text-xs text-muted-foreground">{tool.description}</p>
    </Link>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const { recent } = useRecentTools();

  const recentTools = recent.map(getToolBySlug).filter((t): t is ToolDefinition => !!t).slice(0, 6);
  const popularTools = POPULAR_SLUGS.map(getToolBySlug).filter((t): t is ToolDefinition => !!t);

  const filteredTools = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tools;
    return tools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.keywords.some((keyword) => keyword.includes(q)),
    );
  }, [query]);

  const isSearching = query.trim() !== "";

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">
          {greeting()}. Welcome to DevKit.
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Everyday tools for building, debugging, and shipping software — every tool runs locally,
          nothing you paste in ever leaves your browser unless a tool says otherwise.
        </p>
        <div className="relative max-w-md">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools..."
            className="pl-9"
            aria-label="Search tools"
          />
        </div>
      </div>

      {isSearching ? (
        filteredTools.length === 0 ? (
          <p className="text-sm text-muted-foreground">No tools match &ldquo;{query}&rdquo;.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        )
      ) : (
        <div className="flex flex-col gap-8">
          {recentTools.length > 0 && (
            <div className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold">Recently Used</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {recentTools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold">Popular Tools</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {popularTools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </div>

          {categoryList.map((category) => {
            const categoryTools = tools.filter((tool) => tool.category === category.id);
            if (categoryTools.length === 0) return null;
            return (
              <div key={category.id} className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <category.icon className="size-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold">{category.label}</h2>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {categoryTools.map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
