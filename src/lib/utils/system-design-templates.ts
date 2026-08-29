import type { Node, Edge } from "@xyflow/react";
import type { ComponentKind, ComponentNodeData } from "@/lib/utils/system-design";

export type ComponentFlowNode = Node<ComponentNodeData, "component">;

// Nudged away from the canvas origin so the leftmost/topmost node doesn't
// land directly under the palette/template-picker panel (also top-left).
const OFFSET_X = 200;
const OFFSET_Y = 140;

function node(id: string, kind: ComponentKind, label: string, x: number, y: number): ComponentFlowNode {
  return { id, type: "component", position: { x: x + OFFSET_X, y: y + OFFSET_Y }, data: { kind, label } };
}

function edge(id: string, source: string, target: string, label?: string): Edge {
  return { id, source, target, label };
}

export interface SystemDesignTemplate {
  id: string;
  name: string;
  nodes: ComponentFlowNode[];
  edges: Edge[];
}

/**
 * Starter shapes for a common version of each system — not the only
 * correct architecture. Real systems vary a lot with scale, team, and
 * requirements; these exist to give you something to edit, not a
 * blueprint to follow as-is.
 */
export const SYSTEM_DESIGN_TEMPLATES: SystemDesignTemplate[] = [
  {
    id: "url-shortener",
    name: "URL Shortener",
    nodes: [
      node("client", "client", "Client", 40, 140),
      node("api", "api-server", "API Server", 280, 140),
      node("cache", "cache", "Cache", 520, 40),
      node("db", "database", "Database", 520, 220),
    ],
    edges: [
      edge("e1", "client", "api"),
      edge("e2", "api", "cache", "lookup"),
      edge("e3", "api", "db", "read / write"),
    ],
  },
  {
    id: "chat-application",
    name: "Chat Application",
    nodes: [
      node("client", "client", "Client", 40, 140),
      node("lb", "load-balancer", "Load Balancer", 260, 140),
      node("chat", "microservice", "Chat Service", 480, 40),
      node("queue", "queue", "Message Queue", 480, 220),
      node("db", "database", "Database", 700, 140),
    ],
    edges: [
      edge("e1", "client", "lb"),
      edge("e2", "lb", "chat"),
      edge("e3", "chat", "queue", "publish"),
      edge("e4", "chat", "db"),
    ],
  },
  {
    id: "ecommerce-system",
    name: "E-commerce System",
    nodes: [
      node("client", "client", "Client", 20, 180),
      node("lb", "load-balancer", "Load Balancer", 240, 180),
      node("api", "api-server", "API Server", 460, 180),
      node("catalog", "microservice", "Catalog Service", 700, 60),
      node("orders", "microservice", "Order Service", 700, 180),
      node("payments", "external-api", "Payment Gateway", 700, 300),
      node("db", "database", "Database", 940, 180),
      node("storage", "object-storage", "Object Storage", 940, 60),
    ],
    edges: [
      edge("e1", "client", "lb"),
      edge("e2", "lb", "api"),
      edge("e3", "api", "catalog"),
      edge("e4", "api", "orders"),
      edge("e5", "api", "payments"),
      edge("e6", "orders", "db"),
      edge("e7", "catalog", "storage"),
    ],
  },
];
