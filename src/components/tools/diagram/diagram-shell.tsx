"use client";

import { useState, type ReactNode } from "react";
import { Download } from "lucide-react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  Panel,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type OnNodesDelete,
  type NodeMouseHandler,
  type NodeTypes,
} from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { exportDiagram } from "@/lib/utils/diagram-export";

interface DiagramShellProps<NodeType extends Node = Node, EdgeType extends Edge = Edge> {
  nodes: NodeType[];
  edges: EdgeType[];
  onNodesChange: OnNodesChange<NodeType>;
  onEdgesChange: OnEdgesChange<EdgeType>;
  onConnect: OnConnect;
  nodeTypes: NodeTypes;
  /** Base filename (without extension) used for PNG/SVG exports. */
  filenamePrefix: string;
  onNodeClick?: NodeMouseHandler<NodeType>;
  onPaneClick?: () => void;
  onNodesDelete?: OnNodesDelete<NodeType>;
  /** Tool-specific palette/toolbar, rendered as a top-left canvas Panel. */
  children?: ReactNode;
}

function ExportControls({ nodes, filenamePrefix }: { nodes: Node[]; filenamePrefix: string }) {
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleExport(format: "png" | "svg") {
    setExporting(true);
    setError(null);
    const result = await exportDiagram(nodes, format, `${filenamePrefix}.${format}`);
    setExporting(false);
    if (!result.ok) setError(result.error ?? "Export failed.");
  }

  return (
    <Panel position="top-right" className="flex flex-col items-end gap-1">
      <div className="flex gap-1 rounded-lg border border-border bg-background p-1 shadow-sm">
        <Button type="button" variant="ghost" size="sm" disabled={exporting} onClick={() => handleExport("png")}>
          <Download className="size-3.5" />
          PNG
        </Button>
        <Button type="button" variant="ghost" size="sm" disabled={exporting} onClick={() => handleExport("svg")}>
          <Download className="size-3.5" />
          SVG
        </Button>
      </div>
      {error && (
        <span className="rounded-md border border-destructive/30 bg-destructive/10 px-2 py-1 text-xs text-destructive">
          {error}
        </span>
      )}
    </Panel>
  );
}

/** Shared canvas chrome for both diagram tools — background, zoom/pan
 * controls, minimap, and PNG/SVG export. Each tool supplies its own node
 * types, state, and palette (rendered via `children` in a top-left Panel).
 * Generic over the node/edge type so each tool's `useNodesState<T>()` /
 * `useEdgesState<T>()` handlers pass through without widening to the
 * library's default untyped Node/Edge. */
export function DiagramShell<NodeType extends Node = Node, EdgeType extends Edge = Edge>({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  nodeTypes,
  filenamePrefix,
  onNodeClick,
  onPaneClick,
  onNodesDelete,
  children,
}: DiagramShellProps<NodeType, EdgeType>) {
  return (
    <div className="h-[70vh] min-h-[520px] w-full overflow-hidden rounded-lg border border-border">
      <ReactFlowProvider>
        <ReactFlow<NodeType, EdgeType>
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onNodesDelete={onNodesDelete}
          nodeTypes={nodeTypes}
          fitView
          deleteKeyCode={["Backspace", "Delete"]}
        >
          <Background />
          <Controls />
          <MiniMap pannable zoomable className="!bg-muted" />
          {children}
          <ExportControls nodes={nodes} filenamePrefix={filenamePrefix} />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
