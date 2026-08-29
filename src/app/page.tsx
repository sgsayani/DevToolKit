"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { categoryList } from "@/lib/tools/categories";
import { tools } from "@/lib/tools/registry";

export default function Home() {
  const [query, setQuery] = useState("");

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

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">
          Developer tools, right in your browser
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Fast, practical utilities for everyday development work. Every tool runs locally —
          nothing you paste in ever leaves your browser.
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

      {filteredTools.length === 0 ? (
        <p className="text-sm text-muted-foreground">No tools match &ldquo;{query}&rdquo;.</p>
      ) : (
        <div className="flex flex-col gap-8">
          {categoryList.map((category) => {
            const categoryTools = filteredTools.filter((tool) => tool.category === category.id);
            if (categoryTools.length === 0) return null;
            return (
              <div key={category.id} className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <category.icon className="size-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold">{category.label}</h2>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {categoryTools.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={`/tools/${tool.slug}`}
                      className="group flex flex-col gap-1.5 rounded-lg border border-border p-4 transition-colors hover:border-foreground/20 hover:bg-muted/40"
                    >
                      <div className="flex items-center gap-2">
                        <tool.icon className="size-4 text-muted-foreground group-hover:text-foreground" />
                        <span className="text-sm font-medium">{tool.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{tool.description}</p>
                    </Link>
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
