"use client";

import { Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  COLUMN_TYPE_SUGGESTIONS,
  createEmptyColumn,
  type TableColumn,
  type TableNodeData,
} from "@/lib/utils/schema-visualizer";

interface TableEditorPanelProps {
  data: TableNodeData;
  onChange: (data: TableNodeData) => void;
  onDelete: () => void;
  onClose: () => void;
}

export function TableEditorPanel({ data, onChange, onDelete, onClose }: TableEditorPanelProps) {
  function updateColumn(id: string, patch: Partial<TableColumn>) {
    onChange({ ...data, columns: data.columns.map((c) => (c.id === id ? { ...c, ...patch } : c)) });
  }
  function removeColumn(id: string) {
    onChange({ ...data, columns: data.columns.filter((c) => c.id !== id) });
  }

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Edit table
        </span>
        <Button variant="ghost" size="icon-sm" aria-label="Close editor" onClick={onClose}>
          <X className="size-3.5" />
        </Button>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground">Table name</Label>
        <Input
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
          className="font-mono text-sm"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground">Columns</Label>
        {data.columns.map((col) => (
          <div key={col.id} className="flex items-center gap-1.5">
            <Input
              value={col.name}
              onChange={(e) => updateColumn(col.id, { name: e.target.value })}
              placeholder="name"
              className="flex-1 font-mono text-xs"
            />
            <Input
              value={col.type}
              onChange={(e) => updateColumn(col.id, { type: e.target.value })}
              placeholder="type"
              list="column-type-suggestions"
              className="w-24 font-mono text-xs"
            />
            <label
              className="flex items-center gap-1 text-xs text-muted-foreground"
              title="Primary key"
            >
              <input
                type="checkbox"
                checked={col.isPrimaryKey}
                onChange={(e) => updateColumn(col.id, { isPrimaryKey: e.target.checked })}
                className="size-3.5 accent-foreground"
              />
              PK
            </label>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Remove column"
              onClick={() => removeColumn(col.id)}
            >
              <X className="size-3.5" />
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          className="w-fit"
          onClick={() => onChange({ ...data, columns: [...data.columns, createEmptyColumn()] })}
        >
          <Plus className="size-3.5" />
          Add column
        </Button>
      </div>

      <datalist id="column-type-suggestions">
        {COLUMN_TYPE_SUGGESTIONS.map((t) => (
          <option key={t} value={t} />
        ))}
      </datalist>

      <Button variant="destructive" size="sm" className="mt-auto w-fit" onClick={onDelete}>
        <Trash2 className="size-3.5" />
        Delete table
      </Button>
    </div>
  );
}
