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
  type LucideIcon,
} from "lucide-react";
import type { ComponentType } from "react";
import type { CategoryId } from "@/lib/tools/categories";

import { JsonFormatterTool } from "@/components/tools/json/json-formatter";
import { JsonValidatorTool } from "@/components/tools/json/json-validator";
import { JsonMinifierTool } from "@/components/tools/json/json-minifier";
import { Base64EncoderTool } from "@/components/tools/encoding/base64-encoder";
import { Base64DecoderTool } from "@/components/tools/encoding/base64-decoder";
import { UrlEncoderTool } from "@/components/tools/encoding/url-encoder";
import { UrlDecoderTool } from "@/components/tools/encoding/url-decoder";
import { UuidGeneratorTool } from "@/components/tools/generators/uuid-generator";
import { PasswordGeneratorTool } from "@/components/tools/generators/password-generator";
import { UrlParserTool } from "@/components/tools/web/url-parser";
import { HttpStatusExplorerTool } from "@/components/tools/web/http-status-explorer";
import { JwtDebuggerTool } from "@/components/tools/debugging/jwt-debugger";
import { RegexTesterTool } from "@/components/tools/debugging/regex-tester";
import { DiffCheckerTool } from "@/components/tools/debugging/diff-checker";
import { TimestampConverterTool } from "@/components/tools/debugging/timestamp-converter";
import { HashGeneratorTool } from "@/components/tools/debugging/hash-generator";

export interface ToolDefinition {
  slug: string;
  name: string;
  description: string;
  category: CategoryId;
  keywords: string[];
  icon: LucideIcon;
  component: ComponentType;
}

/**
 * Single source of truth for every tool. The dynamic route, sidebar,
 * command palette, and homepage all read from this list — adding a tool
 * means writing its logic + component, then adding one entry here.
 */
export const tools: ToolDefinition[] = [
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    description: "Pretty-print JSON with configurable indentation.",
    category: "json",
    keywords: ["json", "format", "pretty", "indent", "beautify"],
    icon: AlignLeft,
    component: JsonFormatterTool,
  },
  {
    slug: "json-validator",
    name: "JSON Validator",
    description: "Check whether JSON is valid and locate the error.",
    category: "json",
    keywords: ["json", "validate", "lint", "syntax", "error"],
    icon: CheckCircle2,
    component: JsonValidatorTool,
  },
  {
    slug: "json-minifier",
    name: "JSON Minifier",
    description: "Strip whitespace from JSON to reduce its size.",
    category: "json",
    keywords: ["json", "minify", "compress", "compact"],
    icon: Minimize2,
    component: JsonMinifierTool,
  },
  {
    slug: "base64-encoder",
    name: "Base64 Encoder",
    description: "Encode text to Base64.",
    category: "encoding",
    keywords: ["base64", "encode"],
    icon: Lock,
    component: Base64EncoderTool,
  },
  {
    slug: "base64-decoder",
    name: "Base64 Decoder",
    description: "Decode Base64 back to text.",
    category: "encoding",
    keywords: ["base64", "decode"],
    icon: LockOpen,
    component: Base64DecoderTool,
  },
  {
    slug: "url-encoder",
    name: "URL Encoder",
    description: "Percent-encode text for safe use in a URL.",
    category: "encoding",
    keywords: ["url", "encode", "percent", "uri"],
    icon: Link,
    component: UrlEncoderTool,
  },
  {
    slug: "url-decoder",
    name: "URL Decoder",
    description: "Decode percent-encoded URL text.",
    category: "encoding",
    keywords: ["url", "decode", "percent", "uri"],
    icon: Unlink,
    component: UrlDecoderTool,
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    description: "Generate one or more RFC 4122 v4 UUIDs.",
    category: "generators",
    keywords: ["uuid", "guid", "generate", "id"],
    icon: Fingerprint,
    component: UuidGeneratorTool,
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    description: "Generate secure random passwords.",
    category: "generators",
    keywords: ["password", "generate", "secure", "random"],
    icon: KeyRound,
    component: PasswordGeneratorTool,
  },
  {
    slug: "url-parser",
    name: "URL Parser",
    description: "Break a URL into its protocol, host, path, and query parameters.",
    category: "web",
    keywords: ["url", "parse", "query", "params", "hostname"],
    icon: Search,
    component: UrlParserTool,
  },
  {
    slug: "http-status-explorer",
    name: "HTTP Status Explorer",
    description: "Look up the meaning and common cause of an HTTP status code.",
    category: "web",
    keywords: ["http", "status", "code", "error"],
    icon: ListChecks,
    component: HttpStatusExplorerTool,
  },
  {
    slug: "jwt-debugger",
    name: "JWT Debugger",
    description: "Decode a JWT's header and payload — does not verify the signature.",
    category: "debugging",
    keywords: ["jwt", "token", "decode", "claims", "auth"],
    icon: ShieldAlert,
    component: JwtDebuggerTool,
  },
  {
    slug: "regex-tester",
    name: "Regex Tester",
    description: "Test a regular expression against text with match highlighting.",
    category: "debugging",
    keywords: ["regex", "regexp", "pattern", "test", "match"],
    icon: Regex,
    component: RegexTesterTool,
  },
  {
    slug: "diff-checker",
    name: "Diff Checker",
    description: "Compare two blocks of text and highlight line differences.",
    category: "debugging",
    keywords: ["diff", "compare", "difference", "changes"],
    icon: GitCompare,
    component: DiffCheckerTool,
  },
  {
    slug: "timestamp-converter",
    name: "Timestamp Converter",
    description: "Convert between Unix timestamps and human-readable dates.",
    category: "debugging",
    keywords: ["timestamp", "unix", "epoch", "date", "time"],
    icon: Clock,
    component: TimestampConverterTool,
  },
  {
    slug: "hash-generator",
    name: "Hash Generator",
    description: "Generate a SHA-256, SHA-384, or SHA-512 hash of text.",
    category: "debugging",
    keywords: ["hash", "sha256", "sha384", "sha512", "checksum"],
    icon: Hash,
    component: HashGeneratorTool,
  },
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function getToolsByCategory(category: CategoryId): ToolDefinition[] {
  return tools.filter((tool) => tool.category === category);
}
