import { NavLinks } from "@/components/layout/nav-links";
import { cn } from "@/lib/utils";

export function Sidebar({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        "w-60 shrink-0 overflow-y-auto border-r border-sidebar-border bg-sidebar p-3 text-sidebar-foreground",
        className,
      )}
    >
      <NavLinks />
    </aside>
  );
}
