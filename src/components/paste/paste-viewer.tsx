import { EditorPanel } from "@/components/tools/shared/editor-panel";
import { languageLabel, type PasteLanguage } from "@/lib/utils/paste";

interface PasteViewerProps {
  highlightedHtml: string;
  lineCount: number;
  language: PasteLanguage;
}

/** Read-only, syntax-highlighted display of a paste's content, on the same
 * dark --editor surface every other code tool uses. Server Component — the
 * highlighting already happened server-side in paste-highlight.ts. */
export function PasteViewer({ highlightedHtml, lineCount, language }: PasteViewerProps) {
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <EditorPanel label={languageLabel(language)}>
      <div className="flex font-mono text-sm">
        <div
          aria-hidden="true"
          className="shrink-0 border-r border-editor-border py-3 pr-3 pl-4 text-right leading-6 text-editor-muted select-none"
        >
          {lineNumbers.map((n) => (
            <div key={n}>{n}</div>
          ))}
        </div>
        <div className="min-w-0 flex-1 overflow-x-auto py-3 pr-4 pl-3">
          <pre className="leading-6 whitespace-pre">
            {/* highlightedHtml comes from highlightPaste(), which HTML-escapes
                the paste's content before wrapping it in <span> tokens — see
                lib/server/paste-highlight.ts for why this is safe. This is
                one of two deliberate dangerouslySetInnerHTML uses in the app
                (the other is CodeBlock, the client-side equivalent). */}
            <code
              className={`hljs language-${language}`}
              dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            />
          </pre>
        </div>
      </div>
    </EditorPanel>
  );
}
