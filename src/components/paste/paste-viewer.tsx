import type { PasteLanguage } from "@/lib/utils/paste";

interface PasteViewerProps {
  highlightedHtml: string;
  lineCount: number;
  language: PasteLanguage;
}

/** Read-only, syntax-highlighted display of a paste's content. Server
 * Component — the highlighting already happened server-side in
 * paste-highlight.ts. */
export function PasteViewer({ highlightedHtml, lineCount, language }: PasteViewerProps) {
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="flex rounded-lg border border-border bg-card font-mono text-sm">
      <div
        aria-hidden="true"
        className="shrink-0 border-r border-border py-3 pr-3 pl-4 text-right leading-6 text-muted-foreground/60 select-none"
      >
        {lineNumbers.map((n) => (
          <div key={n}>{n}</div>
        ))}
      </div>
      <div className="min-w-0 flex-1 overflow-x-auto py-3 pr-4 pl-3">
        <pre className="leading-6 whitespace-pre">
          {/* highlightedHtml comes from highlightPaste(), which HTML-escapes
              the paste's content before wrapping it in <span> tokens — see
              lib/server/paste-highlight.ts for why this is safe. This is the
              only dangerouslySetInnerHTML in the app. */}
          <code
            className={`hljs language-${language}`}
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        </pre>
      </div>
    </div>
  );
}
