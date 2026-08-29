import type { HttpMethod } from "@/lib/utils/api-client";

export interface ParamDef {
  id: string;
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export interface ResponseDef {
  id: string;
  status: number;
  description: string;
  example: string;
}

export interface RequestBodyDef {
  contentType: string;
  example: string;
}

export interface ApiEndpointDef {
  id: string;
  method: HttpMethod;
  path: string;
  summary: string;
  description: string;
  pathParams: ParamDef[];
  queryParams: ParamDef[];
  headers: ParamDef[];
  requestBody: RequestBodyDef | null;
  responses: ResponseDef[];
}

export function createEmptyEndpoint(): ApiEndpointDef {
  return {
    id: crypto.randomUUID(),
    method: "GET",
    path: "/",
    summary: "",
    description: "",
    pathParams: [],
    queryParams: [],
    headers: [],
    requestBody: null,
    responses: [],
  };
}

export function createEmptyParam(): ParamDef {
  return { id: crypto.randomUUID(), name: "", type: "string", required: false, description: "" };
}

export function createEmptyResponse(): ResponseDef {
  return { id: crypto.randomUUID(), status: 200, description: "", example: "" };
}

// --- Markdown ---

function paramsTableMd(params: ParamDef[]): string {
  if (params.length === 0) return "";
  const header = "| Name | Type | Required | Description |\n| --- | --- | --- | --- |\n";
  const rows = params
    .map((p) => `| \`${p.name || "—"}\` | ${p.type || "string"} | ${p.required ? "Yes" : "No"} | ${p.description || "—"} |`)
    .join("\n");
  return `${header}${rows}\n`;
}

export function toMarkdown(endpoints: ApiEndpointDef[]): string {
  if (endpoints.length === 0) return "# API Documentation\n\nNo endpoints defined yet.\n";

  const parts: string[] = ["# API Documentation\n"];
  for (const ep of endpoints) {
    parts.push(`## ${ep.method} \`${ep.path || "/"}\`\n`);
    if (ep.summary) parts.push(`${ep.summary}\n`);
    if (ep.description) parts.push(`${ep.description}\n`);
    if (ep.pathParams.length) parts.push(`**Path parameters**\n\n${paramsTableMd(ep.pathParams)}`);
    if (ep.queryParams.length) parts.push(`**Query parameters**\n\n${paramsTableMd(ep.queryParams)}`);
    if (ep.headers.length) parts.push(`**Headers**\n\n${paramsTableMd(ep.headers)}`);
    if (ep.requestBody) {
      parts.push(`**Request body** (\`${ep.requestBody.contentType}\`)\n`);
      if (ep.requestBody.example) parts.push(`\`\`\`json\n${ep.requestBody.example}\n\`\`\`\n`);
    }
    if (ep.responses.length) {
      parts.push("**Responses**\n");
      for (const r of ep.responses) {
        parts.push(`- \`${r.status}\` — ${r.description || "—"}`);
        if (r.example) parts.push(`\n\`\`\`json\n${r.example}\n\`\`\`\n`);
      }
    }
    parts.push("\n---\n");
  }
  return parts.join("\n");
}

// --- HTML ---

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function paramsTableHtml(params: ParamDef[]): string {
  if (params.length === 0) return "";
  const rows = params
    .map(
      (p) =>
        `<tr><td><code>${escapeHtml(p.name || "—")}</code></td><td>${escapeHtml(p.type || "string")}</td><td>${p.required ? "Yes" : "No"}</td><td>${escapeHtml(p.description || "—")}</td></tr>`,
    )
    .join("");
  return `<table><thead><tr><th>Name</th><th>Type</th><th>Required</th><th>Description</th></tr></thead><tbody>${rows}</tbody></table>`;
}

const HTML_STYLE = `
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; max-width: 860px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a; line-height: 1.6; }
  h1 { font-size: 1.75rem; border-bottom: 1px solid #e5e5e5; padding-bottom: 12px; }
  h2 { font-size: 1.15rem; margin-top: 40px; display: flex; align-items: center; gap: 8px; }
  .method { font-family: monospace; font-weight: 600; padding: 2px 8px; border-radius: 4px; border: 1px solid #ddd; font-size: 0.85rem; }
  .method-GET { color: #1d4ed8; } .method-POST { color: #047857; } .method-PUT { color: #b45309; }
  .method-PATCH { color: #b45309; } .method-DELETE { color: #b91c1c; }
  code { font-family: ui-monospace, monospace; }
  h4 { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.03em; color: #666; margin-bottom: 6px; }
  table { border-collapse: collapse; width: 100%; margin-bottom: 16px; font-size: 0.9rem; }
  th, td { border: 1px solid #e5e5e5; padding: 6px 10px; text-align: left; }
  th { background: #fafafa; font-size: 0.75rem; text-transform: uppercase; color: #666; }
  pre { background: #f5f5f5; padding: 12px; border-radius: 6px; overflow-x: auto; font-size: 0.85rem; }
  .endpoint { border-bottom: 1px solid #e5e5e5; padding-bottom: 24px; margin-bottom: 24px; }
`.trim();

export function toHtml(endpoints: ApiEndpointDef[]): string {
  const body =
    endpoints.length === 0
      ? "<p>No endpoints defined yet.</p>"
      : endpoints
          .map((ep) => {
            const sections: string[] = [];
            if (ep.summary) sections.push(`<p><strong>${escapeHtml(ep.summary)}</strong></p>`);
            if (ep.description) sections.push(`<p>${escapeHtml(ep.description)}</p>`);
            if (ep.pathParams.length) sections.push(`<h4>Path parameters</h4>${paramsTableHtml(ep.pathParams)}`);
            if (ep.queryParams.length) sections.push(`<h4>Query parameters</h4>${paramsTableHtml(ep.queryParams)}`);
            if (ep.headers.length) sections.push(`<h4>Headers</h4>${paramsTableHtml(ep.headers)}`);
            if (ep.requestBody) {
              sections.push(`<h4>Request body (${escapeHtml(ep.requestBody.contentType)})</h4>`);
              if (ep.requestBody.example) sections.push(`<pre>${escapeHtml(ep.requestBody.example)}</pre>`);
            }
            if (ep.responses.length) {
              sections.push("<h4>Responses</h4>");
              for (const r of ep.responses) {
                sections.push(`<p><code>${r.status}</code> — ${escapeHtml(r.description || "—")}</p>`);
                if (r.example) sections.push(`<pre>${escapeHtml(r.example)}</pre>`);
              }
            }
            return `<div class="endpoint"><h2><span class="method method-${ep.method}">${ep.method}</span> <code>${escapeHtml(ep.path || "/")}</code></h2>${sections.join("\n")}</div>`;
          })
          .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>API Documentation</title>
<style>${HTML_STYLE}</style>
</head>
<body>
<h1>API Documentation</h1>
${body}
</body>
</html>
`;
}

// --- OpenAPI (common cases, not every feature) ---

function mapOpenApiType(type: string): string {
  const t = type.trim().toLowerCase();
  if (t === "integer" || t === "int") return "integer";
  if (t === "number" || t === "float" || t === "double") return "number";
  if (t === "boolean" || t === "bool") return "boolean";
  if (t === "array" || t === "list") return "array";
  if (t === "object") return "object";
  return "string";
}

function parseExample(example: string): unknown {
  if (!example.trim()) return undefined;
  try {
    return JSON.parse(example);
  } catch {
    return example;
  }
}

export interface OpenApiInfo {
  title: string;
  version: string;
}

export function toOpenApi(
  endpoints: ApiEndpointDef[],
  info: OpenApiInfo = { title: "API", version: "1.0.0" },
): Record<string, unknown> {
  const paths: Record<string, Record<string, unknown>> = {};

  for (const ep of endpoints) {
    const pathItem = (paths[ep.path] ??= {});
    const parameters = [
      ...ep.pathParams.map((p) => ({
        name: p.name,
        in: "path",
        required: true,
        description: p.description || undefined,
        schema: { type: mapOpenApiType(p.type) },
      })),
      ...ep.queryParams.map((p) => ({
        name: p.name,
        in: "query",
        required: p.required,
        description: p.description || undefined,
        schema: { type: mapOpenApiType(p.type) },
      })),
      ...ep.headers.map((p) => ({
        name: p.name,
        in: "header",
        required: p.required,
        description: p.description || undefined,
        schema: { type: mapOpenApiType(p.type) },
      })),
    ];

    const responses: Record<string, unknown> = {};
    for (const r of ep.responses) {
      const example = parseExample(r.example);
      responses[String(r.status)] = {
        description: r.description || "Response",
        ...(example !== undefined ? { content: { "application/json": { example } } } : {}),
      };
    }
    if (Object.keys(responses).length === 0) responses["200"] = { description: "OK" };

    pathItem[ep.method.toLowerCase()] = {
      summary: ep.summary || undefined,
      description: ep.description || undefined,
      parameters: parameters.length ? parameters : undefined,
      requestBody: ep.requestBody
        ? {
            content: {
              [ep.requestBody.contentType || "application/json"]: {
                example: parseExample(ep.requestBody.example),
              },
            },
          }
        : undefined,
      responses,
    };
  }

  return { openapi: "3.0.3", info, paths };
}
