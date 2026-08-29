import { AlertTriangle } from "lucide-react";

export function AiNotConfiguredNotice() {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-amber-600/30 bg-amber-600/5 p-3 text-sm">
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-700 dark:text-amber-400" />
      <div>
        <p className="font-medium text-amber-800 dark:text-amber-400">AI features aren&rsquo;t configured yet</p>
        <p className="mt-1 text-muted-foreground">
          Add a <code className="font-mono">GEMINI_API_KEY</code> to your{" "}
          <code className="font-mono">.env.local</code> file (see{" "}
          <code className="font-mono">.env.example</code>) and restart the server to enable this tool.
        </p>
      </div>
    </div>
  );
}
