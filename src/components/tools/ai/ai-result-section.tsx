import type { ReactNode } from "react";
import { CopyButton } from "@/components/tools/shared/copy-button";

interface AiResultSectionProps {
  title: string;
  copyValue: string;
  children: ReactNode;
}

export function AiResultSection({ title, copyValue, children }: AiResultSectionProps) {
  return (
    <div className="flex flex-col gap-1.5 rounded-lg border border-border p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{title}</span>
        <CopyButton value={copyValue} />
      </div>
      {children}
    </div>
  );
}
