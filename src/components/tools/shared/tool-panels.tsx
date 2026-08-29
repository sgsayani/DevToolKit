import { type ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/** Labeled panel used inside a two-pane tool layout. */
export function ToolPanel({
  title,
  htmlFor,
  action,
  children,
  className,
}: {
  title: string;
  htmlFor?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between">
        <Label
          htmlFor={htmlFor}
          className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
        >
          {title}
        </Label>
        {action}
      </div>
      {children}
    </div>
  );
}

/** Two-column grid that stacks to one column below md. */
export function ToolPanelGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>;
}

/** Row of action buttons — the [Action] [Copy] [Clear] bar. */
export function ToolActionBar({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-2">{children}</div>;
}

/** Monospace error panel, sized to match a text output panel. */
export function ToolErrorPanel({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[320px] rounded-lg border border-destructive/30 bg-destructive/5 p-3 font-mono text-sm whitespace-pre-wrap text-destructive">
      {children}
    </div>
  );
}
