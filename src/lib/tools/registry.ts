import {
  AlignLeft,
  CheckCircle2,
  Minimize2,
  Lock,
  LockOpen,
  Link,
  Unlink,
  Fingerprint,
  KeyRound,
  Search,
  ListChecks,
  ShieldAlert,
  Regex,
  GitCompare,
  Clock,
  Hash,
  Send,
  Database,
  ScrollText,
  Table,
  FileCode2,
  FileJson,
  BookOpen,
  Webhook,
  Network,
  Waypoints,
  AlertCircle,
  FileCode,
  GitBranch,
  SquareCode,
  Files,
  type LucideIcon,
} from "lucide-react";
import type { CategoryId } from "@/lib/tools/categories";

export interface ToolDefinition {
  slug: string;
  name: string;
  description: string;
  category: CategoryId;
  keywords: string[];
  icon: LucideIcon;
  /** Defaults to "local" for every tool that doesn't say otherwise. Set
   * "server" for tools whose content goes to DevKit's own server (a proxy,
   * a stored mock, a stored paste) or "ai" for tools that send content to
   * an external AI provider — ToolShell uses this to show the accurate
   * trust badge. Never set to something that doesn't match reality. */
  dataHandling?: "local" | "server" | "ai";
}

/**
 * Single source of truth for every tool's metadata. Deliberately holds NO
 * component references — the sidebar, command palette, and homepage all
 * import this file to list tools, and if it also carried (even
 * next/dynamic-wrapped) component references, those modules would be
 * reachable from every page's shared bundle, defeating per-tool code
 * splitting. The actual components are wired up separately in
 * `tool-components.ts`, imported only by the dynamic tool route.
 */
export const tools: ToolDefinition[] = [
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    description: "Pretty-print JSON with configurable indentation.",
    category: "debug",
    keywords: ["json", "format", "pretty", "indent", "beautify"],
    icon: AlignLeft,
  },
  {
    slug: "json-validator",
    name: "JSON Validator",
    description: "Check whether JSON is valid and locate the error.",
    category: "debug",
    keywords: ["json", "validate", "lint", "syntax", "error"],
    icon: CheckCircle2,
  },
  {
    slug: "json-minifier",
    name: "JSON Minifier",
    description: "Strip whitespace from JSON to reduce its size.",
    category: "debug",
    keywords: ["json", "minify", "compress", "compact"],
    icon: Minimize2,
  },
  {
    slug: "base64-encoder",
    name: "Base64 Encoder",
    description: "Encode text to Base64.",
    category: "data",
    keywords: ["base64", "encode"],
    icon: Lock,
  },
  {
    slug: "base64-decoder",
    name: "Base64 Decoder",
    description: "Decode Base64 back to text.",
    category: "data",
    keywords: ["base64", "decode"],
    icon: LockOpen,
  },
  {
    slug: "url-encoder",
    name: "URL Encoder",
    description: "Percent-encode text for safe use in a URL.",
    category: "data",
    keywords: ["url", "encode", "percent", "uri"],
    icon: Link,
  },
  {
    slug: "url-decoder",
    name: "URL Decoder",
    description: "Decode percent-encoded URL text.",
    category: "data",
    keywords: ["url", "decode", "percent", "uri"],
    icon: Unlink,
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    description: "Generate one or more RFC 4122 v4 UUIDs.",
    category: "generators",
    keywords: ["uuid", "guid", "generate", "id"],
    icon: Fingerprint,
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    description: "Generate secure random passwords.",
    category: "generators",
    keywords: ["password", "generate", "secure", "random"],
    icon: KeyRound,
  },
  {
    slug: "url-parser",
    name: "URL Parser",
    description: "Break a URL into its protocol, host, path, and query parameters.",
    category: "data",
    keywords: ["url", "parse", "query", "params", "hostname"],
    icon: Search,
  },
  {
    slug: "http-status-explorer",
    name: "HTTP Status Explorer",
    description: "Look up the meaning and common cause of an HTTP status code.",
    category: "generators",
    keywords: ["http", "status", "code", "error"],
    icon: ListChecks,
  },
  {
    slug: "jwt-debugger",
    name: "JWT Debugger",
    description: "Decode a JWT's header and payload — does not verify the signature.",
    category: "debug",
    keywords: ["jwt", "token", "decode", "claims", "auth"],
    icon: ShieldAlert,
  },
  {
    slug: "regex-tester",
    name: "Regex Tester",
    description: "Test a regular expression against text with match highlighting.",
    category: "debug",
    keywords: ["regex", "regexp", "pattern", "test", "match"],
    icon: Regex,
  },
  {
    slug: "diff-checker",
    name: "Diff Checker",
    description: "Compare two blocks of text and highlight line differences.",
    category: "debug",
    keywords: ["diff", "compare", "difference", "changes"],
    icon: GitCompare,
  },
  {
    slug: "timestamp-converter",
    name: "Timestamp Converter",
    description: "Convert between Unix timestamps and human-readable dates.",
    category: "debug",
    keywords: ["timestamp", "unix", "epoch", "date", "time"],
    icon: Clock,
  },
  {
    slug: "hash-generator",
    name: "Hash Generator",
    description: "Generate a SHA-256, SHA-384, or SHA-512 hash of text.",
    category: "debug",
    keywords: ["hash", "sha256", "sha384", "sha512", "checksum"],
    icon: Hash,
  },
  {
    slug: "api-client",
    name: "API Client",
    description: "Send GET/POST/PUT/PATCH/DELETE requests and inspect the response.",
    category: "api",
    keywords: ["api", "http", "request", "rest", "postman", "client"],
    icon: Send,
    dataHandling: "server",
  },
  {
    slug: "log-analyzer",
    name: "Log Analyzer",
    description: "Paste or upload logs to summarize errors, warnings, and common patterns.",
    category: "debug",
    keywords: ["log", "logs", "analyze", "errors", "warnings"],
    icon: ScrollText,
  },
  {
    slug: "sql-formatter",
    name: "SQL Formatter",
    description: "Format common SQL with sensible indentation.",
    category: "data",
    keywords: ["sql", "format", "query", "database"],
    icon: Database,
  },
  {
    slug: "json-csv-converter",
    name: "JSON ↔ CSV",
    description: "Convert between JSON and CSV.",
    category: "data",
    keywords: ["json", "csv", "convert", "spreadsheet"],
    icon: Table,
  },
  {
    slug: "json-yaml-converter",
    name: "JSON ↔ YAML",
    description: "Convert between JSON and YAML.",
    category: "data",
    keywords: ["json", "yaml", "yml", "convert"],
    icon: FileCode2,
  },
  {
    slug: "xml-to-json",
    name: "XML → JSON",
    description: "Parse and convert XML to JSON.",
    category: "data",
    keywords: ["xml", "json", "convert", "parse"],
    icon: FileJson,
  },
  {
    slug: "api-docs-generator",
    name: "API Documentation Generator",
    description: "Describe endpoints and export clean Markdown, HTML, or OpenAPI docs.",
    category: "api",
    keywords: ["api", "docs", "documentation", "openapi", "swagger", "markdown"],
    icon: BookOpen,
  },
  {
    slug: "mock-api-generator",
    name: "Mock API Generator",
    description: "Define a JSON schema and publish a live mock endpoint to test against.",
    category: "api",
    keywords: ["mock", "api", "fake", "stub", "test data"],
    icon: Webhook,
    dataHandling: "server",
  },
  {
    slug: "schema-visualizer",
    name: "Database Schema Visualizer",
    description: "Define tables and relationships as an interactive ER diagram.",
    category: "visualize",
    keywords: ["schema", "database", "er diagram", "tables", "relationships", "foreign key"],
    icon: Network,
  },
  {
    slug: "system-design",
    name: "System Design Diagram",
    description: "Build an architecture diagram from common system components.",
    category: "visualize",
    keywords: ["system design", "architecture", "diagram", "microservices"],
    icon: Waypoints,
  },
  {
    slug: "error-explainer",
    name: "Error Explainer",
    description: "Paste an error or stack trace to get a plain-language explanation and fixes.",
    category: "ai",
    keywords: ["ai", "error", "stack trace", "explain", "debug"],
    icon: AlertCircle,
    dataHandling: "ai",
  },
  {
    slug: "code-explainer",
    name: "Code Explainer",
    description: "Paste code to get a summary, walkthrough, and potential issues.",
    category: "ai",
    keywords: ["ai", "code", "explain", "review"],
    icon: FileCode,
    dataHandling: "ai",
  },
  {
    slug: "git-command-generator",
    name: "Git Command Generator",
    description: "Describe what you want to do and get the exact git command.",
    category: "generators",
    keywords: ["ai", "git", "command", "version control"],
    icon: GitBranch,
    dataHandling: "ai",
  },
  {
    slug: "sql-generator",
    name: "SQL Generator (AI)",
    description: "Describe a query in plain English and get SQL to review — never executed.",
    category: "ai",
    keywords: ["ai", "sql", "query", "generate"],
    icon: Database,
    dataHandling: "ai",
  },
  {
    slug: "regex-generator",
    name: "Regex Generator (AI)",
    description: "Describe a pattern in plain English and get a regular expression.",
    category: "ai",
    keywords: ["ai", "regex", "pattern", "generate"],
    icon: Regex,
    dataHandling: "ai",
  },
  {
    slug: "code-share",
    name: "Code Share",
    description: "Create a paste and share code or text via a unique link.",
    category: "share",
    keywords: ["paste", "share", "snippet", "gist", "code share", "new paste"],
    icon: SquareCode,
    dataHandling: "server",
  },
  {
    slug: "my-pastes",
    name: "My Pastes",
    description: "View, edit, and delete the pastes you've created.",
    category: "share",
    keywords: ["paste", "my pastes", "share", "history"],
    icon: Files,
    dataHandling: "server",
  },
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function getToolsByCategory(category: CategoryId): ToolDefinition[] {
  return tools.filter((tool) => tool.category === category);
}
