import {
  Braces,
  Binary,
  Wand2,
  Globe,
  type LucideIcon,
} from "lucide-react";

export type CategoryId = "json" | "encoding" | "generators" | "web";

export interface Category {
  id: CategoryId;
  label: string;
  description: string;
  icon: LucideIcon;
  order: number;
}

export const categories: Record<CategoryId, Category> = {
  json: {
    id: "json",
    label: "JSON",
    description: "Format, validate, and minify JSON.",
    icon: Braces,
    order: 0,
  },
  encoding: {
    id: "encoding",
    label: "Encoding",
    description: "Encode and decode text.",
    icon: Binary,
    order: 1,
  },
  generators: {
    id: "generators",
    label: "Generators",
    description: "Generate UUIDs and passwords.",
    icon: Wand2,
    order: 2,
  },
  web: {
    id: "web",
    label: "Web",
    description: "Inspect URLs and HTTP status codes.",
    icon: Globe,
    order: 3,
  },
};

export const categoryList = Object.values(categories).sort(
  (a, b) => a.order - b.order,
);
