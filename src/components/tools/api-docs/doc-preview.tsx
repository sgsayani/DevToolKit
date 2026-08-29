import { METHOD_BADGE_CLASS } from "@/lib/utils/api-client";
import type { ApiEndpointDef, ParamDef } from "@/lib/utils/api-docs";

function ParamTable({ title, params }: { title: string; params: ParamDef[] }) {
  if (params.length === 0) return null;
  return (
    <div className="flex flex-col gap-1">
      <h4 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{title}</h4>
      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs text-muted-foreground">
            <tr>
              <th className="px-2 py-1 text-left font-medium">Name</th>
              <th className="px-2 py-1 text-left font-medium">Type</th>
              <th className="px-2 py-1 text-left font-medium">Required</th>
              <th className="px-2 py-1 text-left font-medium">Description</th>
            </tr>
          </thead>
          <tbody>
            {params.map((p) => (
              <tr key={p.id} className="border-t border-border/60">
                <td className="px-2 py-1 font-mono">{p.name || "—"}</td>
                <td className="px-2 py-1 font-mono text-muted-foreground">{p.type || "string"}</td>
                <td className="px-2 py-1">{p.required ? "Yes" : "No"}</td>
                <td className="px-2 py-1 text-muted-foreground">{p.description || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function DocPreview({ endpoints }: { endpoints: ApiEndpointDef[] }) {
  if (endpoints.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        Add an endpoint to see a preview.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {endpoints.map((ep) => (
        <article key={ep.id} className="flex flex-col gap-3 border-b border-border pb-8 last:border-0">
          <div className="flex items-center gap-2">
            <span
              className={`rounded-md border border-border px-2 py-0.5 font-mono text-sm font-semibold ${METHOD_BADGE_CLASS[ep.method]}`}
            >
              {ep.method}
            </span>
            <code className="font-mono text-sm">{ep.path || "/"}</code>
          </div>
          {ep.summary && <p className="text-sm font-medium">{ep.summary}</p>}
          {ep.description && <p className="text-sm text-muted-foreground">{ep.description}</p>}

          <ParamTable title="Path parameters" params={ep.pathParams} />
          <ParamTable title="Query parameters" params={ep.queryParams} />
          <ParamTable title="Headers" params={ep.headers} />

          {ep.requestBody && (
            <div className="flex flex-col gap-1">
              <h4 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Request body{" "}
                <span className="font-mono normal-case">({ep.requestBody.contentType})</span>
              </h4>
              {ep.requestBody.example && (
                <pre className="overflow-x-auto rounded-md border border-border bg-muted/30 p-2 font-mono text-xs">
                  {ep.requestBody.example}
                </pre>
              )}
            </div>
          )}

          {ep.responses.length > 0 && (
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Responses
              </h4>
              {ep.responses.map((r) => (
                <div key={r.id} className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-mono font-semibold">{r.status}</span>
                    <span className="text-muted-foreground">{r.description || "—"}</span>
                  </div>
                  {r.example && (
                    <pre className="overflow-x-auto rounded-md border border-border bg-muted/30 p-2 font-mono text-xs">
                      {r.example}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
