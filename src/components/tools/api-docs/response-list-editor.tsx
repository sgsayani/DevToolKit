"use client";

import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createEmptyResponse, type ResponseDef } from "@/lib/utils/api-docs";

interface ResponseListEditorProps {
  responses: ResponseDef[];
  onChange: (responses: ResponseDef[]) => void;
}

export function ResponseListEditor({ responses, onChange }: ResponseListEditorProps) {
  function update(id: string, patch: Partial<ResponseDef>) {
    onChange(responses.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }
  function remove(id: string) {
    onChange(responses.filter((r) => r.id !== id));
  }

  return (
    <div className="flex flex-col gap-3">
      {responses.map((r) => (
        <div key={r.id} className="flex flex-col gap-2 rounded-lg border border-border p-2">
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={r.status}
              onChange={(e) => update(r.id, { status: Number(e.target.value) || 200 })}
              className="w-24 font-mono text-sm"
            />
            <Input
              value={r.description}
              onChange={(e) => update(r.id, { description: e.target.value })}
              placeholder="Description"
              className="flex-1 text-sm"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Remove response"
              onClick={() => remove(r.id)}
            >
              <X className="size-3.5" />
            </Button>
          </div>
          <Textarea
            value={r.example}
            onChange={(e) => update(r.id, { example: e.target.value })}
            placeholder='{"id": 1} (optional example)'
            className="min-h-[80px] font-mono text-xs"
            spellCheck={false}
          />
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-fit"
        onClick={() => onChange([...responses, createEmptyResponse()])}
      >
        <Plus className="size-3.5" />
        Add response
      </Button>
    </div>
  );
}
