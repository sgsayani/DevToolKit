import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EditorPanelProps {
  /** Left-aligned label — a section name ("INPUT"), a language ("javascript"),
   * or a filename. Monospace, matching the editor content below it. */
  label: string;
  /** Right-aligned toolbar controls — small icon buttons (Copy, Format…). */
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Wraps a Textarea (variant="code") or CodeBlock in a bordered dark editor
 * panel with a toolbar strip — the "developer editor" surface used across
 * DevKit's code/data tools. The toolbar renders one shade lighter than the
 * editor body (--editor-toolbar vs --editor) for its own layer of depth. */
export function EditorPanel({ label, actions, children, className }: EditorPanelProps) {
  return (
    <div className={cn("flex flex-col overflow-hidden rounded-lg border border-editor-border", className)}>
      <div className="flex items-center justify-between gap-2 bg-editor-toolbar px-3 py-1.5">
        <span className="font-mono text-xs tracking-wide text-editor-muted">{label}</span>
        {actions && <div className="flex items-center gap-1">{actions}</div>}
      </div>
      {children}
    </div>
  );
}
