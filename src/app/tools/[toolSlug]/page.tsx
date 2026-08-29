import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolShell } from "@/components/layout/tool-shell";
import { getToolBySlug, tools } from "@/lib/tools/registry";

interface ToolPageProps {
  params: Promise<{ toolSlug: string }>;
}

export function generateStaticParams() {
  return tools.map((tool) => ({ toolSlug: tool.slug }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { toolSlug } = await params;
  const tool = getToolBySlug(toolSlug);
  if (!tool) return {};
  return {
    title: `${tool.name} — DevKit`,
    description: tool.description,
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { toolSlug } = await params;
  const tool = getToolBySlug(toolSlug);
  if (!tool) notFound();

  const ToolComponent = tool.component;

  return (
    <ToolShell title={tool.name} description={tool.description}>
      <ToolComponent />
    </ToolShell>
  );
}
