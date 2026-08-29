import {
  Monitor,
  Split,
  Server,
  Database,
  Zap,
  ListOrdered,
  HardDrive,
  Globe,
  Boxes,
  type LucideIcon,
} from "lucide-react";

export type ComponentKind =
  | "client"
  | "load-balancer"
  | "api-server"
  | "database"
  | "cache"
  | "queue"
  | "object-storage"
  | "external-api"
  | "microservice";

export interface ComponentNodeData {
  kind: ComponentKind;
  label: string;
  [key: string]: unknown;
}

interface ComponentDef {
  label: string;
  icon: LucideIcon;
}

// Deliberately uncolored (all neutral) — 9 rainbow-coded categories would
// clutter the canvas; the icon + label already distinguish each kind.
export const COMPONENT_DEFS: Record<ComponentKind, ComponentDef> = {
  client: { label: "Client", icon: Monitor },
  "load-balancer": { label: "Load Balancer", icon: Split },
  "api-server": { label: "API Server", icon: Server },
  database: { label: "Database", icon: Database },
  cache: { label: "Cache", icon: Zap },
  queue: { label: "Queue", icon: ListOrdered },
  "object-storage": { label: "Object Storage", icon: HardDrive },
  "external-api": { label: "External API", icon: Globe },
  microservice: { label: "Microservice", icon: Boxes },
};

export const COMPONENT_KINDS = Object.keys(COMPONENT_DEFS) as ComponentKind[];

export function createComponentData(kind: ComponentKind): ComponentNodeData {
  return { kind, label: COMPONENT_DEFS[kind].label };
}
