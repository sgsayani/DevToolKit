import { Send, Bug, Database, Wand2, Workflow, Share2, Cpu, type LucideIcon } from "lucide-react";

export type CategoryId = "api" | "debug" | "data" | "generators" | "visualize" | "share" | "ai";

export interface Category {
  id: CategoryId;
  label: string;
  description: string;
  icon: LucideIcon;
  order: number;
}

export const categories: Record<CategoryId, Category> = {
  api: {
    id: "api",
    label: "API",
    description: "Send requests, document endpoints, and mock APIs.",
    icon: Send,
    order: 0,
  },
  debug: {
    id: "debug",
    label: "Debug",
    description: "Format JSON and debug JWTs, regex, diffs, timestamps, hashes, and logs.",
    icon: Bug,
    order: 1,
  },
  data: {
    id: "data",
    label: "Data",
    description: "Encode, decode, parse, and convert between data formats.",
    icon: Database,
    order: 2,
  },
  generators: {
    id: "generators",
    label: "Generators",
    description: "Generate UUIDs, passwords, git commands, and look up HTTP statuses.",
    icon: Wand2,
    order: 3,
  },
  visualize: {
    id: "visualize",
    label: "Visualize",
    description: "Diagram database schemas and system architecture.",
    icon: Workflow,
    order: 4,
  },
  share: {
    id: "share",
    label: "Share",
    description: "Share code snippets and text via a link.",
    icon: Share2,
    order: 5,
  },
  ai: {
    id: "ai",
    label: "AI",
    description: "Explain errors and code, and generate SQL and regex.",
    icon: Cpu,
    order: 6,
  },
};

export const categoryList = Object.values(categories).sort((a, b) => a.order - b.order);
