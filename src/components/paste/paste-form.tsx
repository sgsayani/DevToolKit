"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToolPanel, ToolActionBar } from "@/components/tools/shared/tool-panels";
import { EditorPanel } from "@/components/tools/shared/editor-panel";
import { createPaste, updatePaste } from "@/lib/utils/paste-client";
import {
  PASTE_EXPIRATIONS,
  PASTE_LANGUAGES,
  PASTE_MAX_CONTENT_LENGTH,
  PASTE_MAX_TITLE_LENGTH,
  PASTE_VISIBILITIES,
  type PasteExpiration,
  type PasteLanguage,
  type PasteVisibility,
} from "@/lib/utils/paste";

interface PasteFormProps {
  mode: "create" | "edit";
  pasteId?: string;
  initial?: {
    title: string;
    content: string;
    language: PasteLanguage;
    visibility: PasteVisibility;
  };
}

const NOT_CONFIGURED_NOTICE =
  "Code Share needs a MONGODB_URI environment variable. Add one to your .env.local file and restart the server.";

export function PasteForm({ mode, pasteId, initial }: PasteFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [language, setLanguage] = useState<PasteLanguage>(initial?.language ?? "plaintext");
  const [visibility, setVisibility] = useState<PasteVisibility>(initial?.visibility ?? "public");
  const [expiration, setExpiration] = useState<PasteExpiration>("never");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notConfigured, setNotConfigured] = useState(false);

  const lineCount = content ? content.split("\n").length : 0;
  const visibilityMeta = PASTE_VISIBILITIES.find((v) => v.value === visibility);

  async function handleSubmit() {
    if (!content.trim() || submitting) return;
    setSubmitting(true);
    setError(null);

    const input = { title, content, language, visibility, expiration };
    const result = mode === "create" ? await createPaste(input) : await updatePaste(pasteId!, input);

    setSubmitting(false);
    if (!result.ok) {
      if (result.code === "not_configured") setNotConfigured(true);
      else setError(result.error ?? "Something went wrong. Try again.");
      return;
    }
    if (mode === "create" && result.id) router.push(`/share/${result.id}?created=1`);
    else router.push(`/share/${pasteId}?updated=1`);
  }

  if (notConfigured) {
    return (
      <div className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
        {NOT_CONFIGURED_NOTICE}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ToolPanel title="Title (optional)" htmlFor="paste-title">
          <Input
            id="paste-title"
            value={title}
            onChange={(e) => setTitle(e.target.value.slice(0, PASTE_MAX_TITLE_LENGTH))}
            placeholder="e.g. Auth middleware fix"
          />
        </ToolPanel>
        <ToolPanel title="Language" htmlFor="paste-language">
          <Select value={language} onValueChange={(v) => setLanguage(v as PasteLanguage)}>
            <SelectTrigger id="paste-language" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PASTE_LANGUAGES.map((l) => (
                <SelectItem key={l.value} value={l.value}>
                  {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </ToolPanel>
      </div>

      <EditorPanel
        label="CONTENT"
        actions={
          <span className="text-xs text-editor-muted">
            {lineCount} {lineCount === 1 ? "line" : "lines"} ·{" "}
            {content.length.toLocaleString()} / {PASTE_MAX_CONTENT_LENGTH.toLocaleString()} chars
          </span>
        }
      >
        <Textarea
          variant="code"
          aria-label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, PASTE_MAX_CONTENT_LENGTH))}
          placeholder="Paste your code or text here…"
          className="min-h-[320px] rounded-none border-0 focus-visible:ring-0"
          spellCheck={false}
        />
      </EditorPanel>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ToolPanel title="Visibility" htmlFor="paste-visibility">
          <Select value={visibility} onValueChange={(v) => setVisibility(v as PasteVisibility)}>
            <SelectTrigger id="paste-visibility" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PASTE_VISIBILITIES.map((v) => (
                <SelectItem key={v.value} value={v.value}>
                  {v.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {visibilityMeta && <p className="text-xs text-muted-foreground">{visibilityMeta.description}</p>}
        </ToolPanel>
        <ToolPanel title="Expiration" htmlFor="paste-expiration">
          <Select value={expiration} onValueChange={(v) => setExpiration(v as PasteExpiration)}>
            <SelectTrigger id="paste-expiration" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PASTE_EXPIRATIONS.map((e) => (
                <SelectItem key={e.value} value={e.value}>
                  {e.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {mode === "edit" && (
            <p className="text-xs text-muted-foreground">Resets the expiration countdown from now.</p>
          )}
        </ToolPanel>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <ToolActionBar>
        <Button type="button" onClick={handleSubmit} disabled={submitting || !content.trim()}>
          {submitting
            ? mode === "create"
              ? "Creating…"
              : "Saving…"
            : mode === "create"
              ? "Create paste"
              : "Save changes"}
        </Button>
        {mode === "create" && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setTitle("");
              setContent("");
            }}
          >
            Clear
          </Button>
        )}
      </ToolActionBar>
    </div>
  );
}
