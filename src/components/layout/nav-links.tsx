"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { categoryList } from "@/lib/tools/categories";
import { getToolsByCategory } from "@/lib/tools/registry";
import { cn } from "@/lib/utils";

/** Category → tool link list, shared by the desktop sidebar and mobile sheet nav. */
export function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-6">
      {categoryList.map((category) => {
        const categoryTools = getToolsByCategory(category.id);
        return (
          <div key={category.id} className="flex flex-col gap-1">
            <h3 className="px-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {category.label}
            </h3>
            {categoryTools.map((tool) => {
              const href = `/tools/${tool.slug}`;
              const active = pathname === href;
              return (
                <Link
                  key={tool.slug}
                  href={href}
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
            })}
          </div>
        );
      })}
    </nav>
  );
}
