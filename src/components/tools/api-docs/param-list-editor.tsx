"use client";

import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createEmptyParam, type ParamDef } from "@/lib/utils/api-docs";

interface ParamListEditorProps {
  params: ParamDef[];
  onChange: (params: ParamDef[]) => void;
  addLabel?: string;
}

export function ParamListEditor({ params, onChange, addLabel = "Add parameter" }: ParamListEditorProps) {
  function update(id: string, patch: Partial<ParamDef>) {
    onChange(params.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }
  function remove(id: string) {
    onChange(params.filter((p) => p.id !== id));
  }

  return (
    <div className="flex flex-col gap-2">
      {params.map((p) => (
        <div key={p.id} className="flex flex-wrap items-center gap-2">
          <Input
            value={p.name}
            onChange={(e) => update(p.id, { name: e.target.value })}
            placeholder="name"
            className="w-32 font-mono text-sm"
          />
          <Input
            value={p.type}
            onChange={(e) => update(p.id, { type: e.target.value })}
            placeholder="type"
            className="w-24 font-mono text-sm"
          />
          <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={p.required}
              onChange={(e) => update(p.id, { required: e.target.checked })}
              className="size-4 accent-foreground"
            />
            Required
          </label>
          <Input
            value={p.description}
            onChange={(e) => update(p.id, { description: e.target.value })}
            placeholder="Description"
            className="min-w-[140px] flex-1 text-sm"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Remove parameter"
            onClick={() => remove(p.id)}
          >
            <X className="size-3.5" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-fit"
        onClick={() => onChange([...params, createEmptyParam()])}
      >
        <Plus className="size-3.5" />
        {addLabel}
      </Button>
    </div>
  );
}
