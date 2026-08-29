import { type ReactNode } from "react";
import { LocalBadge } from "@/components/tools/shared/local-badge";

interface ToolShellProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function ToolShell({ title, description, children }: ToolShellProps) {
  return (
    <div className="flex max-w-5xl flex-col gap-6">
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <LocalBadge className="sm:mt-1" />
      </div>
      {children}
    </div>
  );
}
