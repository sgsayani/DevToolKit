"use client";

import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TableNodeData } from "@/lib/utils/schema-visualizer";

export type TableFlowNode = Node<TableNodeData, "table">;

/** Purely presentational — editing/deleting happens through the side panel
 * (driven by node selection), not via callbacks embedded in node data,
 * which would break JSON serialization for localStorage persistence. */
export function TableNode({ data, selected }: NodeProps<TableFlowNode>) {
  return (
    <div
      className={cn(
        "min-w-[200px] rounded-lg border bg-card shadow-sm transition-shadow",
        selected ? "border-primary ring-2 ring-primary/15" : "border-border",
      )}
    >
      <Handle type="target" position={Position.Left} className="!bg-foreground/40" />
      <Handle type="source" position={Position.Right} className="!bg-foreground/40" />

      <div className="rounded-t-lg border-b border-border bg-muted/50 px-3 py-1.5">
        <span className="font-mono text-sm font-semibold">{data.name || "untitled"}</span>
      </div>

      <div className="flex flex-col">
        {data.columns.length === 0 ? (
          <div className="px-3 py-2 text-xs text-muted-foreground">No columns</div>
        ) : (
          data.columns.map((col) => (
            <div
              key={col.id}
              className="flex items-center justify-between gap-3 border-b border-border/60 px-3 py-1 text-xs last:border-0"
            >
              <span className="flex items-center gap-1 font-mono">
                {col.isPrimaryKey && (
                  <KeyRound className="size-3 shrink-0 text-amber-600 dark:text-amber-400" />
                )}
                {col.name || "—"}
              </span>
              <span className="shrink-0 text-muted-foreground">{col.type}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
