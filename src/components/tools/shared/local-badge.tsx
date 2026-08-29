import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function LocalBadge({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-xs text-muted-foreground",
        className,
      )}
    >
      <ShieldCheck className="size-3.5" />
      Processed locally in your browser
    </div>
  );
}
