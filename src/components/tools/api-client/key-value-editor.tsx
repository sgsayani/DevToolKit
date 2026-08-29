"use client";

import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createEmptyRow, type KeyValueRow } from "@/lib/utils/api-client";

interface KeyValueEditorProps {
  rows: KeyValueRow[];
  onChange: (rows: KeyValueRow[]) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  addLabel?: string;
  emptyHint?: string;
}

/** Add/remove/enable-toggle row editor shared by the Params and Headers tabs. */
export function KeyValueEditor({
  rows,
  onChange,
  keyPlaceholder = "Key",
  valuePlaceholder = "Value",
  addLabel = "Add",
  emptyHint,
}: KeyValueEditorProps) {
  function updateRow(id: string, patch: Partial<KeyValueRow>) {
    onChange(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }
  function removeRow(id: string) {
    onChange(rows.filter((r) => r.id !== id));
  }

  return (
    <div className="flex flex-col gap-2">
      {rows.length === 0 && emptyHint && (
        <p className="text-sm text-muted-foreground">{emptyHint}</p>
      )}
      {rows.map((row) => (
        <div key={row.id} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={row.enabled}
            onChange={(e) => updateRow(row.id, { enabled: e.target.checked })}
            className="size-4 shrink-0 accent-foreground"
            aria-label="Enabled"
          />
          <Input
            value={row.key}
            onChange={(e) => updateRow(row.id, { key: e.target.value })}
            placeholder={keyPlaceholder}
            className="flex-1 font-mono text-sm"
            spellCheck={false}
          />
          <Input
            value={row.value}
            onChange={(e) => updateRow(row.id, { value: e.target.value })}
            placeholder={valuePlaceholder}
            className="flex-1 font-mono text-sm"
            spellCheck={false}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Remove row"
            onClick={() => removeRow(row.id)}
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
        onClick={() => onChange([...rows, createEmptyRow()])}
      >
        <Plus className="size-3.5" />
        {addLabel}
      </Button>
    </div>
  );
}
