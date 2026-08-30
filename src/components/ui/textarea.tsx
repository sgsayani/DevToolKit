import * as React from "react"

import { cn } from "@/lib/utils"

interface TextareaProps extends React.ComponentProps<"textarea"> {
  /** "code" renders the textarea as a dark developer-editor surface (for
   * JSON/SQL/regex/diff/paste content) instead of the default light form
   * field — same component, same behavior, just a different skin. */
  variant?: "default" | "code"
}

function Textarea({ className, variant = "default", ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // field-sizing-content grows the textarea to fit pasted content,
        // which is nice for normal-sized input but unbounded for a large
        // paste (e.g. a big log file) — cap it with its own scrollbar
        // instead of letting it push the rest of the page far down.
        // Callers needing a different cap can still override via className.
        "flex field-sizing-content max-h-[480px] min-h-16 w-full overflow-y-auto rounded-lg px-2.5 py-2 text-base transition-colors outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        variant === "default" &&
          "border border-input bg-card placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:bg-input/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        variant === "code" &&
          "border border-editor-border bg-editor font-mono text-editor-foreground caret-editor-foreground placeholder:text-editor-muted focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/30 disabled:bg-editor/60 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/30",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
