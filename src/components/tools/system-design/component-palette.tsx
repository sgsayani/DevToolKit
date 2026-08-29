"use client";

import { Button } from "@/components/ui/button";
import { COMPONENT_DEFS, COMPONENT_KINDS, type ComponentKind } from "@/lib/utils/system-design";

interface ComponentPaletteProps {
  onAdd: (kind: ComponentKind) => void;
}

export function ComponentPalette({ onAdd }: ComponentPaletteProps) {
  return (
    <div className="flex max-w-[230px] flex-wrap gap-1.5 rounded-lg border border-border bg-background p-2 shadow-sm">
      {COMPONENT_KINDS.map((kind) => {
        const def = COMPONENT_DEFS[kind];
        const Icon = def.icon;
        return (
          <Button
            key={kind}
            type="button"
            variant="outline"
            size="sm"
            title={`Add ${def.label}`}
            onClick={() => onAdd(kind)}
          >
            <Icon className="size-3.5" />
            {def.label}
          </Button>
        );
      })}
    </div>
  );
}
