"use client";

// Uses highlight.js's bare core + only the language modules DevKit actually
// needs, instead of the ~190-language default bundle — each tool that pulls
// this in is already its own code-split chunk (see lib/tools/tool-components.tsx),
// so keeping this import light matters for that chunk's size specifically.
import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";
import sql from "highlight.js/lib/languages/sql";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";

hljs.registerLanguage("json", json);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);

export type ClientHighlightLanguage = "json" | "sql" | "javascript" | "typescript" | "text";

export function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Same contract as the server-side highlightPaste() in lib/server/paste-highlight.ts:
 * highlight.js escapes the input itself before wrapping it in <span> tokens,
 * so the result is safe to render with dangerouslySetInnerHTML — it can
 * only ever be marked-up text, never a live element from tool output. */
export function highlightCode(code: string, language: ClientHighlightLanguage): string {
  if (language === "text") return escapeHtml(code);
  try {
    return hljs.highlight(code, { language, ignoreIllegals: true }).value;
  } catch {
    return escapeHtml(code);
  }
}
