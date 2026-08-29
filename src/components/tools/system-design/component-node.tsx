"use client";

import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { cn } from "@/lib/utils";
import { COMPONENT_DEFS, type ComponentNodeData } from "@/lib/utils/system-design";

export type ComponentFlowNode = Node<ComponentNodeData, "component">;

export function ComponentNode({ data, selected }: NodeProps<ComponentFlowNode>) {
  const def = COMPONENT_DEFS[data.kind];
  const Icon = def.icon;
  const isRenamed = data.label !== def.label;

  return (
    <div
      className={cn(
        "flex min-w-[150px] items-center gap-2 rounded-lg border bg-card px-3 py-2 shadow-sm transition-shadow",
        selected ? "border-primary ring-2 ring-primary/15" : "border-border",
      )}
    >
      <Handle type="target" position={Position.Left} className="!bg-foreground/40" />
      <Handle type="source" position={Position.Right} className="!bg-foreground/40" />
      <Icon className="size-4 shrink-0 text-muted-foreground" />
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-medium">{data.label || def.label}</span>
        {isRenamed && <span className="text-[0.65rem] text-muted-foreground">{def.label}</span>}
      </div>
    </div>
  );
}
