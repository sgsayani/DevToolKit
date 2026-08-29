"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { useRecentTools } from "@/hooks/use-recent-tools";

/**
 * Slug → component map, kept deliberately separate from `registry.ts` (the
 * metadata used by the sidebar/palette/homepage on every page).
 *
 * This has to be a Client Component with `ssr: false` on every entry, not
 * just a plain dynamic-import map: the dynamic route selects a component by
 * a runtime string (`toolComponents[slug]`), and Next's Server Component
 * bundler can't statically narrow a computed-key lookup to "only this one
 * chunk" — without `ssr: false` it conservatively bundles *all* 31 tools'
 * JS (React Flow included) into every tool page's initial load, which is
 * exactly the problem this file exists to avoid. `ssr: false` is only
 * permitted from a Client Component, hence the directive above — the
 * tradeoff is that each tool's body renders client-side only (the page's
 * title/description via ToolShell stays server-rendered either way).
 */
const loading = () => (
  <div className="flex min-h-[200px] items-center justify-center text-sm text-muted-foreground">
    Loading tool…
  </div>
);

export const toolComponents: Record<string, ComponentType> = {
  "json-formatter": dynamic(
    () => import("@/components/tools/json/json-formatter").then((m) => m.JsonFormatterTool),
    { ssr: false, loading },
  ),
  "json-validator": dynamic(
    () => import("@/components/tools/json/json-validator").then((m) => m.JsonValidatorTool),
    { ssr: false, loading },
  ),
  "json-minifier": dynamic(
    () => import("@/components/tools/json/json-minifier").then((m) => m.JsonMinifierTool),
    { ssr: false, loading },
  ),
  "base64-encoder": dynamic(
    () => import("@/components/tools/encoding/base64-encoder").then((m) => m.Base64EncoderTool),
    { ssr: false, loading },
  ),
  "base64-decoder": dynamic(
    () => import("@/components/tools/encoding/base64-decoder").then((m) => m.Base64DecoderTool),
    { ssr: false, loading },
  ),
  "url-encoder": dynamic(
    () => import("@/components/tools/encoding/url-encoder").then((m) => m.UrlEncoderTool),
    { ssr: false, loading },
  ),
  "url-decoder": dynamic(
    () => import("@/components/tools/encoding/url-decoder").then((m) => m.UrlDecoderTool),
    { ssr: false, loading },
  ),
  "uuid-generator": dynamic(
    () => import("@/components/tools/generators/uuid-generator").then((m) => m.UuidGeneratorTool),
    { ssr: false, loading },
  ),
  "password-generator": dynamic(
    () =>
      import("@/components/tools/generators/password-generator").then(
        (m) => m.PasswordGeneratorTool,
      ),
    { ssr: false, loading },
  ),
  "url-parser": dynamic(
    () => import("@/components/tools/web/url-parser").then((m) => m.UrlParserTool),
    { ssr: false, loading },
  ),
  "http-status-explorer": dynamic(
    () =>
      import("@/components/tools/web/http-status-explorer").then((m) => m.HttpStatusExplorerTool),
    { ssr: false, loading },
  ),
  "jwt-debugger": dynamic(
    () => import("@/components/tools/debugging/jwt-debugger").then((m) => m.JwtDebuggerTool),
    { ssr: false, loading },
  ),
  "regex-tester": dynamic(
    () => import("@/components/tools/debugging/regex-tester").then((m) => m.RegexTesterTool),
    { ssr: false, loading },
  ),
  "diff-checker": dynamic(
    () => import("@/components/tools/debugging/diff-checker").then((m) => m.DiffCheckerTool),
    { ssr: false, loading },
  ),
  "timestamp-converter": dynamic(
    () =>
      import("@/components/tools/debugging/timestamp-converter").then(
        (m) => m.TimestampConverterTool,
      ),
    { ssr: false, loading },
  ),
  "hash-generator": dynamic(
    () => import("@/components/tools/debugging/hash-generator").then((m) => m.HashGeneratorTool),
    { ssr: false, loading },
  ),
  "api-client": dynamic(
    () => import("@/components/tools/api-client/api-client-tool").then((m) => m.ApiClientTool),
    { ssr: false, loading },
  ),
  "log-analyzer": dynamic(
    () => import("@/components/tools/debugging/log-analyzer").then((m) => m.LogAnalyzerTool),
    { ssr: false, loading },
  ),
  "sql-formatter": dynamic(
    () => import("@/components/tools/database/sql-formatter").then((m) => m.SqlFormatterTool),
    { ssr: false, loading },
  ),
  "json-csv-converter": dynamic(
    () =>
      import("@/components/tools/conversion/json-csv-converter").then(
        (m) => m.JsonCsvConverterTool,
      ),
    { ssr: false, loading },
  ),
  "json-yaml-converter": dynamic(
    () =>
      import("@/components/tools/conversion/json-yaml-converter").then(
        (m) => m.JsonYamlConverterTool,
      ),
    { ssr: false, loading },
  ),
  "xml-to-json": dynamic(
    () => import("@/components/tools/conversion/xml-to-json").then((m) => m.XmlToJsonTool),
    { ssr: false, loading },
  ),
  "api-docs-generator": dynamic(
    () =>
      import("@/components/tools/api-docs/api-docs-generator-tool").then(
        (m) => m.ApiDocsGeneratorTool,
      ),
    { ssr: false, loading },
  ),
  "mock-api-generator": dynamic(
    () =>
      import("@/components/tools/mock-api/mock-api-generator-tool").then(
        (m) => m.MockApiGeneratorTool,
      ),
    { ssr: false, loading },
  ),
  "schema-visualizer": dynamic(
    () =>
      import("@/components/tools/schema-visualizer/schema-visualizer-tool").then(
        (m) => m.SchemaVisualizerTool,
      ),
    { ssr: false, loading },
  ),
  "system-design": dynamic(
    () =>
      import("@/components/tools/system-design/system-design-tool").then(
        (m) => m.SystemDesignTool,
      ),
    { ssr: false, loading },
  ),
  "error-explainer": dynamic(
    () => import("@/components/tools/ai/error-explainer-tool").then((m) => m.ErrorExplainerTool),
    { ssr: false, loading },
  ),
  "code-explainer": dynamic(
    () => import("@/components/tools/ai/code-explainer-tool").then((m) => m.CodeExplainerTool),
    { ssr: false, loading },
  ),
  "git-command-generator": dynamic(
    () => import("@/components/tools/ai/git-command-tool").then((m) => m.GitCommandTool),
    { ssr: false, loading },
  ),
  "sql-generator": dynamic(
    () => import("@/components/tools/ai/sql-generator-tool").then((m) => m.SqlGeneratorTool),
    { ssr: false, loading },
  ),
  "regex-generator": dynamic(
    () => import("@/components/tools/ai/regex-generator-tool").then((m) => m.RegexGeneratorTool),
    { ssr: false, loading },
  ),
};

export function ToolComponentLoader({ slug }: { slug: string }) {
  const { recordVisit } = useRecentTools();

  useEffect(() => {
    recordVisit(slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- recordVisit is stable (useCallback with no deps); re-running only on slug change is intended.
  }, [slug]);

  const Component = toolComponents[slug];
  if (!Component) return null;
  return <Component />;
}
