"use client";

import { useEffect, useState } from "react";
import { Panel, useNodesState, useEdgesState, addEdge, type Connection, type Edge } from "@xyflow/react";
import { DiagramShell } from "@/components/tools/diagram/diagram-shell";
import { ComponentNode, type ComponentFlowNode } from "@/components/tools/system-design/component-node";
import { ComponentPalette } from "@/components/tools/system-design/component-palette";
import { ComponentEditorPanel } from "@/components/tools/system-design/component-editor-panel";
import { TemplatePicker } from "@/components/tools/system-design/template-picker";
import { createComponentData, type ComponentKind } from "@/lib/utils/system-design";
import { SYSTEM_DESIGN_TEMPLATES } from "@/lib/utils/system-design-templates";

const NODE_TYPES = { component: ComponentNode };
const STORAGE_KEY = "devkit:system-design:diagram";

function loadSavedDiagram(): { nodes: ComponentFlowNode[]; edges: Edge[] } | null {
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

function saveDiagram(nodes: ComponentFlowNode[], edges: Edge[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ nodes, edges }));
  } catch {
    // localStorage unavailable — the diagram just won't persist across reloads.
  }
}

export function SystemDesignTool() {
  const [nodes, setNodes, onNodesChange] = useNodesState<ComponentFlowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
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

  function handleAddComponent(kind: ComponentKind) {
    const id = crypto.randomUUID();
    const newNode: ComponentFlowNode = {
      id,
      type: "component",
      // Offset away from the top-left corner, where the component palette
      // and template picker panel lives.
      position: { x: 320 + Math.random() * 460, y: 220 + Math.random() * 360 },
      data: createComponentData(kind),
    };
    setNodes((nds) => [...nds, newNode]);
    setSelectedNodeId(id);
  }

  function handleLoadTemplate(templateId: string) {
    const template = SYSTEM_DESIGN_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;
    // Deep-cloned so dragging nodes afterward never mutates the shared
    // module-level template data.
    setNodes(JSON.parse(JSON.stringify(template.nodes)));
    setEdges(JSON.parse(JSON.stringify(template.edges)));
    setSelectedNodeId(null);
  }

  function handleDeleteComponent(id: string) {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
    setSelectedNodeId(null);
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-muted-foreground">
        Starter templates are a common shape for that kind of system, not the only correct
        architecture — treat them as a starting point to edit, not a blueprint. Your diagram is
        saved to this browser automatically.
      </p>

      <div className="flex gap-3">
        <div className="min-w-0 flex-1">
          <DiagramShell
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={(connection: Connection) => setEdges((eds) => addEdge(connection, eds))}
            onNodeClick={(_, node) => setSelectedNodeId(node.id)}
            onPaneClick={() => setSelectedNodeId(null)}
            onNodesDelete={(deleted) => {
              const deletedIds = new Set(deleted.map((n) => n.id));
              setEdges((eds) => eds.filter((e) => !deletedIds.has(e.source) && !deletedIds.has(e.target)));
              if (selectedNodeId && deletedIds.has(selectedNodeId)) setSelectedNodeId(null);
            }}
            nodeTypes={NODE_TYPES}
            filenamePrefix="system-design"
          >
            <Panel position="top-left" className="flex flex-col gap-2">
              <ComponentPalette onAdd={handleAddComponent} />
              <TemplatePicker onLoad={handleLoadTemplate} />
            </Panel>
          </DiagramShell>
        </div>

        {selectedNode && (
          <div className="w-64 shrink-0 rounded-lg border border-border">
            <ComponentEditorPanel
              data={selectedNode.data}
              onChange={(data) =>
                setNodes((nds) => nds.map((n) => (n.id === selectedNode.id ? { ...n, data } : n)))
              }
              onDelete={() => handleDeleteComponent(selectedNode.id)}
              onClose={() => setSelectedNodeId(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
