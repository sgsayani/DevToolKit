"use client";

import { highlightCode, type ClientHighlightLanguage } from "@/lib/utils/client-highlight";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language: ClientHighlightLanguage;
  lineNumbers?: boolean;
  className?: string;
}

/** Read-only, syntax-highlighted display on the dark --editor surface —
 * the output half of a code tool (JSON Formatter's OUTPUT, a decoded JWT
 * payload, an AI-generated SQL/regex result). See
 * lib/utils/client-highlight.ts for why dangerouslySetInnerHTML here is
 * safe: highlight.js escapes the input before wrapping it in <span>s. */
export function CodeBlock({ code, language, lineNumbers = true, className }: CodeBlockProps) {
  const html = highlightCode(code, language);
  const lines = code.split("\n");

  return (
    <div className={cn("flex bg-editor font-mono text-sm", className)}>
      {lineNumbers && (
        <div
          aria-hidden="true"
          className="shrink-0 border-r border-editor-border py-2 pr-3 pl-4 text-right leading-6 text-editor-muted select-none"
        >
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
      )}
      <div className="min-w-0 flex-1 overflow-x-auto py-2 pr-4 pl-3">
        <pre className="leading-6 whitespace-pre">
          <code className="text-editor-foreground" dangerouslySetInnerHTML={{ __html: html }} />
        </pre>
      </div>
    </div>
  );
}
