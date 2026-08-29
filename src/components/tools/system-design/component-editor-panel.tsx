"use client";

import { Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { COMPONENT_DEFS, type ComponentNodeData } from "@/lib/utils/system-design";

interface ComponentEditorPanelProps {
  data: ComponentNodeData;
  onChange: (data: ComponentNodeData) => void;
  onDelete: () => void;
  onClose: () => void;
}

export function ComponentEditorPanel({ data, onChange, onDelete, onClose }: ComponentEditorPanelProps) {
  const def = COMPONENT_DEFS[data.kind];
  const Icon = def.icon;

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Edit component
        </span>
        <Button variant="ghost" size="icon-sm" aria-label="Close editor" onClick={onClose}>
          <X className="size-3.5" />
        </Button>
      </div>

      <div className="flex items-center gap-2 rounded-md border border-border bg-muted/40 px-2.5 py-1.5">
        <Icon className="size-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">{def.label}</span>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground">Label</Label>
        <Input value={data.label} onChange={(e) => onChange({ ...data, label: e.target.value })} />
      </div>

      <Button variant="destructive" size="sm" className="mt-auto w-fit" onClick={onDelete}>
        <Trash2 className="size-3.5" />
        Delete component
      </Button>
    </div>
  );
}
