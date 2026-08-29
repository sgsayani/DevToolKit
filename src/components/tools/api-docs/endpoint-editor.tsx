"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ParamListEditor } from "@/components/tools/api-docs/param-list-editor";
import { ResponseListEditor } from "@/components/tools/api-docs/response-list-editor";
import { HTTP_METHODS, type HttpMethod } from "@/lib/utils/api-client";
import type { ApiEndpointDef } from "@/lib/utils/api-docs";

interface EndpointEditorProps {
  endpoint: ApiEndpointDef;
  onChange: (endpoint: ApiEndpointDef) => void;
}

export function EndpointEditor({ endpoint, onChange }: EndpointEditorProps) {
  function set<K extends keyof ApiEndpointDef>(key: K, value: ApiEndpointDef[K]) {
    onChange({ ...endpoint, [key]: value });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Select value={endpoint.method} onValueChange={(v) => set("method", v as HttpMethod)}>
          <SelectTrigger size="default" className="w-28" aria-label="HTTP method">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {HTTP_METHODS.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          value={endpoint.path}
          onChange={(e) => set("path", e.target.value)}
          placeholder="/users/{id}"
          className="flex-1 font-mono text-sm"
          spellCheck={false}
        />
      </div>

      <Input
        value={endpoint.summary}
        onChange={(e) => set("summary", e.target.value)}
        placeholder="Short summary"
        className="text-sm"
      />
      <Textarea
        value={endpoint.description}
        onChange={(e) => set("description", e.target.value)}
        placeholder="Longer description (optional)"
        className="min-h-[80px] text-sm"
      />

      <div className="flex flex-col gap-2">
        <Label className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Path parameters
        </Label>
        <ParamListEditor params={endpoint.pathParams} onChange={(p) => set("pathParams", p)} />
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Query parameters
        </Label>
        <ParamListEditor params={endpoint.queryParams} onChange={(p) => set("queryParams", p)} />
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Headers
        </Label>
        <ParamListEditor params={endpoint.headers} onChange={(p) => set("headers", p)} />
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Request body
        </Label>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={endpoint.requestBody !== null}
            onChange={(e) =>
              set("requestBody", e.target.checked ? { contentType: "application/json", example: "" } : null)
            }
            className="size-4 accent-foreground"
          />
          Include a request body
        </label>
        {endpoint.requestBody && (
          <>
            <Input
              value={endpoint.requestBody.contentType}
              onChange={(e) => set("requestBody", { ...endpoint.requestBody!, contentType: e.target.value })}
              className="w-56 font-mono text-sm"
            />
            <Textarea
              value={endpoint.requestBody.example}
              onChange={(e) => set("requestBody", { ...endpoint.requestBody!, example: e.target.value })}
              placeholder='{"name": "Ada"} (optional example)'
              className="min-h-[100px] font-mono text-xs"
              spellCheck={false}
            />
          </>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Responses
        </Label>
        <ResponseListEditor responses={endpoint.responses} onChange={(r) => set("responses", r)} />
      </div>
    </div>
  );
}
