"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Panel, useNodesState, useEdgesState, type Connection, type Edge } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { DiagramShell } from "@/components/tools/diagram/diagram-shell";
import { TableNode, type TableFlowNode } from "@/components/tools/schema-visualizer/table-node";
import { RelationshipPicker } from "@/components/tools/schema-visualizer/relationship-picker";
import { TableEditorPanel } from "@/components/tools/schema-visualizer/table-editor-panel";
import {
  createDefaultTableData,
  relationshipLabel,
  type RelationshipData,
} from "@/lib/utils/schema-visualizer";

const NODE_TYPES = { table: TableNode };
const STORAGE_KEY = "devkit:schema-visualizer:diagram";

type RelationshipEdge = Edge<RelationshipData>;

function loadSavedDiagram(): { nodes: TableFlowNode[]; edges: RelationshipEdge[] } | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed?.nodes) || !Array.isArray(parsed?.edges)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveDiagram(nodes: TableFlowNode[], edges: RelationshipEdge[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ nodes, edges }));
  } catch {
    // localStorage unavailable — the diagram just won't persist across reloads.
  }
}

export function SchemaVisualizerTool() {
  const [nodes, setNodes, onNodesChange] = useNodesState<TableFlowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<RelationshipEdge>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [pendingConnection, setPendingConnection] = useState<Connection | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const saved = loadSavedDiagram();
    if (saved) {
      setNodes(saved.nodes);
      setEdges(saved.edges);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- gates the save-effect below so it doesn't fire (with pre-load empty state) before this load attempt completes.
    setHasLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;
    saveDiagram(nodes, edges);
  }, [nodes, edges, hasLoaded]);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) ?? null;

  function handleAddTable() {
    const id = crypto.randomUUID();
    const newNode: TableFlowNode = {
      id,
      type: "table",
      // Offset away from the top-left corner, where the "Add table" panel lives.
      position: { x: 260 + Math.random() * 360, y: 160 + Math.random() * 280 },
      data: createDefaultTableData(`table_${nodes.length + 1}`),
    };
    setNodes((nds) => [...nds, newNode]);
    setSelectedNodeId(id);
  }

  function handleConnect(connection: Connection) {
    if (!connection.source || !connection.target) return;
    setPendingConnection(connection);
  }

  function handleConfirmRelationship(sourceColumn: string, targetColumn: string) {
    if (!pendingConnection?.source || !pendingConnection.target) return;
    const sourceTable = nodes.find((n) => n.id === pendingConnection.source);
    const targetTable = nodes.find((n) => n.id === pendingConnection.target);
    const data: RelationshipData = { sourceColumn, targetColumn };
    const newEdge: RelationshipEdge = {
      id: crypto.randomUUID(),
      source: pendingConnection.source,
      target: pendingConnection.target,
      sourceHandle: pendingConnection.sourceHandle,
      targetHandle: pendingConnection.targetHandle,
      label:
        sourceTable && targetTable
          ? relationshipLabel(sourceTable.data.name, data, targetTable.data.name)
          : undefined,
      data,
    };
    setEdges((eds) => [...eds, newEdge]);
    setPendingConnection(null);
  }

  function handleDeleteTable(id: string) {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
    setSelectedNodeId(null);
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-muted-foreground">
        Drag a connection between two tables to define a foreign key relationship. Your diagram
        is saved to this browser automatically.
      </p>

      <div className="flex gap-3">
        <div className="min-w-0 flex-1">
          <DiagramShell
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={handleConnect}
            onNodeClick={(_, node) => setSelectedNodeId(node.id)}
            onPaneClick={() => setSelectedNodeId(null)}
            onNodesDelete={(deleted) => {
              const deletedIds = new Set(deleted.map((n) => n.id));
              setEdges((eds) => eds.filter((e) => !deletedIds.has(e.source) && !deletedIds.has(e.target)));
              if (selectedNodeId && deletedIds.has(selectedNodeId)) setSelectedNodeId(null);
            }}
            nodeTypes={NODE_TYPES}
            filenamePrefix="database-schema"
          >
            <Panel position="top-left">
              <Button type="button" size="sm" onClick={handleAddTable}>
                <Plus className="size-3.5" />
                Add table
              </Button>
            </Panel>
          </DiagramShell>
        </div>

        {selectedNode && (
          <div className="w-72 shrink-0 rounded-lg border border-border">
            <TableEditorPanel
              data={selectedNode.data}
              onChange={(data) =>
                setNodes((nds) => nds.map((n) => (n.id === selectedNode.id ? { ...n, data } : n)))
              }
              onDelete={() => handleDeleteTable(selectedNode.id)}
              onClose={() => setSelectedNodeId(null)}
            />
          </div>
        )}
      </div>

      <RelationshipPicker
        connection={pendingConnection}
        nodes={nodes}
        onConfirm={handleConfirmRelationship}
        onCancel={() => setPendingConnection(null)}
      />
    </div>
  );
}
