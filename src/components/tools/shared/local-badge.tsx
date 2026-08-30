import { ShieldCheck, Server, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

export type DataHandling = "local" | "server" | "ai";

const COPY: Record<DataHandling, { icon: typeof ShieldCheck; text: string }> = {
  local: { icon: ShieldCheck, text: "Processed locally in your browser" },
  server: { icon: Server, text: "Processed securely by DevKit" },
  ai: { icon: Cpu, text: "Sent to Google's Gemini API to generate a response" },
};

/** States which is accurate per tool via the registry's `dataHandling`
 * field — never shown unless it reflects what the tool actually does. */
export function DataHandlingBadge({
  mode = "local",
  className,
}: {
  mode?: DataHandling;
  className?: string;
}) {
  const { icon: Icon, text } = COPY[mode];
  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground",
        className,
      )}
    >
      <Icon className="size-3.5 shrink-0" />
      {text}
    </div>
  );
}
