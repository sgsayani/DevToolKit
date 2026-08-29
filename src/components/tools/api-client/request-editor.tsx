"use client";

import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShortcutHint } from "@/components/tools/shared/shortcut-hint";
import { KeyValueEditor } from "@/components/tools/api-client/key-value-editor";
import { validateJson } from "@/lib/utils/json";
import {
  HTTP_METHODS,
  METHOD_BADGE_CLASS,
  buildUrlWithParams,
  type AuthConfig,
  type BodyType,
  type HttpMethod,
  type KeyValueRow,
} from "@/lib/utils/api-client";

interface RequestEditorProps {
  method: HttpMethod;
  onMethodChange: (method: HttpMethod) => void;
  url: string;
  onUrlChange: (url: string) => void;
  params: KeyValueRow[];
  onParamsChange: (rows: KeyValueRow[]) => void;
  headers: KeyValueRow[];
  onHeadersChange: (rows: KeyValueRow[]) => void;
  bodyType: BodyType;
  onBodyTypeChange: (type: BodyType) => void;
  bodyText: string;
  onBodyTextChange: (text: string) => void;
  auth: AuthConfig;
  onAuthChange: (auth: AuthConfig) => void;
  onSend: () => void;
  sending: boolean;
}

export function RequestEditor({
  method,
  onMethodChange,
  url,
  onUrlChange,
  params,
  onParamsChange,
  headers,
  onHeadersChange,
  bodyType,
  onBodyTypeChange,
  bodyText,
  onBodyTextChange,
  auth,
  onAuthChange,
  onSend,
  sending,
}: RequestEditorProps) {
  const effectiveUrl = buildUrlWithParams(url, params);
  const jsonError =
    bodyType === "json" && bodyText.trim() !== "" ? validateJson(bodyText).error : undefined;

  return (
    <div className="flex flex-col gap-3">
      <form
        className="flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          onSend();
        }}
      >
        <Select value={method} onValueChange={(v) => onMethodChange(v as HttpMethod)}>
          <SelectTrigger size="default" className="w-28" aria-label="HTTP method">
            <SelectValue>
              <span className={`font-mono font-semibold ${METHOD_BADGE_CLASS[method]}`}>
                {method}
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {HTTP_METHODS.map((m) => (
              <SelectItem key={m} value={m}>
                <span className={`font-mono font-semibold ${METHOD_BADGE_CLASS[m]}`}>{m}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="https://api.example.com/v1/users"
          className="flex-1 font-mono text-sm"
          spellCheck={false}
          aria-label="Request URL"
        />
        <Button type="submit" disabled={sending || url.trim() === ""}>
          <Send className="size-3.5" />
          {sending ? "Sending…" : "Send"}
          <ShortcutHint>⌘⏎</ShortcutHint>
        </Button>
      </form>

      {params.some((p) => p.enabled && p.key.trim() !== "") && (
        <p className="truncate font-mono text-xs text-muted-foreground" title={effectiveUrl}>
          {effectiveUrl}
        </p>
      )}

      <Tabs defaultValue="params">
        <TabsList aria-label="Request options">
          <TabsTrigger value="params">Params</TabsTrigger>
          <TabsTrigger value="headers">Headers</TabsTrigger>
          <TabsTrigger value="body">Body</TabsTrigger>
          <TabsTrigger value="auth">Auth</TabsTrigger>
        </TabsList>

        <TabsContent value="params" className="pt-3">
          <KeyValueEditor
            rows={params}
            onChange={onParamsChange}
            keyPlaceholder="Param name"
            valuePlaceholder="Value"
            addLabel="Add param"
            emptyHint="No query parameters."
          />
        </TabsContent>

        <TabsContent value="headers" className="pt-3">
          <KeyValueEditor
            rows={headers}
            onChange={onHeadersChange}
            keyPlaceholder="Header name"
            valuePlaceholder="Value"
            addLabel="Add header"
            emptyHint="No custom headers."
          />
        </TabsContent>

        <TabsContent value="body" className="flex flex-col gap-2 pt-3">
          <Select value={bodyType} onValueChange={(v) => onBodyTypeChange(v as BodyType)}>
            <SelectTrigger size="sm" className="w-32" aria-label="Body type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
              <SelectItem value="text">Text</SelectItem>
            </SelectContent>
          </Select>
          {bodyType !== "none" && (
            <>
              <Textarea
                value={bodyText}
                onChange={(e) => onBodyTextChange(e.target.value)}
                placeholder={bodyType === "json" ? '{\n  "key": "value"\n}' : "Request body"}
                className="min-h-[180px] font-mono text-sm"
                spellCheck={false}
              />
              {jsonError && (
                <p className="text-xs text-destructive">Invalid JSON — {jsonError.message}</p>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="auth" className="flex flex-col gap-3 pt-3">
          <Select
            value={auth.type}
            onValueChange={(v) => onAuthChange({ ...auth, type: v as AuthConfig["type"] })}
          >
            <SelectTrigger size="sm" className="w-40" aria-label="Auth type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No auth</SelectItem>
              <SelectItem value="basic">Basic auth</SelectItem>
              <SelectItem value="bearer">Bearer token</SelectItem>
            </SelectContent>
          </Select>

          {auth.type === "basic" && (
            <div className="grid max-w-sm grid-cols-1 gap-2">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-muted-foreground">Username</Label>
                <Input
                  value={auth.username}
                  onChange={(e) => onAuthChange({ ...auth, username: e.target.value })}
                  className="text-sm"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-muted-foreground">Password</Label>
                <Input
                  type="password"
                  value={auth.password}
                  onChange={(e) => onAuthChange({ ...auth, password: e.target.value })}
                  className="text-sm"
                />
              </div>
            </div>
          )}

          {auth.type === "bearer" && (
            <div className="flex max-w-sm flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Token</Label>
              <Input
                type="password"
                value={auth.token}
                onChange={(e) => onAuthChange({ ...auth, token: e.target.value })}
                className="font-mono text-sm"
              />
            </div>
          )}

          {auth.type !== "none" && (
            <p className="text-xs text-muted-foreground">
              Sent as an <span className="font-mono">Authorization</span> header. Never saved to
              history.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
