import hljs from "highlight.js";
import type { PasteLanguage } from "@/lib/utils/paste";

const HLJS_LANGUAGE: Record<PasteLanguage, string | null> = {
  javascript: "javascript",
  typescript: "typescript",
  python: "python",
  java: "java",
  cpp: "cpp",
  c: "c",
  go: "go",
  rust: "rust",
  html: "xml",
  css: "css",
  json: "json",
  sql: "sql",
  bash: "bash",
  plaintext: null,
  other: null,
};

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Returns highlight.js's marked-up HTML for a paste's content. highlight.js
 * escapes the input itself before wrapping tokens in <span> tags, so this
 * can only ever produce marked-up TEXT — never a live element from pasted
 * content — which is what makes it safe to render with
 * dangerouslySetInnerHTML at the one call site that does (PasteViewer).
 * "Plain Text"/"Other" skip highlighting and go through the same manual
 * escaping directly, so nothing ever reaches the page unescaped.
 */
export function highlightPaste(content: string, language: PasteLanguage): string {
  const hljsLanguage = HLJS_LANGUAGE[language];
  if (!hljsLanguage) return escapeHtml(content);
  try {
    return hljs.highlight(content, { language: hljsLanguage, ignoreIllegals: true }).value;
  } catch {
    return escapeHtml(content);
  }
}
