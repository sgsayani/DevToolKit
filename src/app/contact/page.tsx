import type { Metadata } from "next";
import { ExternalLink, Bug, Lightbulb, MessageSquare } from "lucide-react";
import Link from "next/link";
import { GITHUB_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description: "Report a bug, suggest a feature, or send feedback about DevKit.",
  alternates: { canonical: "/contact" },
};

const REASONS = [
  {
    icon: Bug,
    title: "Found a bug",
    description: "A tool producing the wrong output, crashing, or behaving unexpectedly.",
  },
  {
    icon: Lightbulb,
    title: "Feature suggestion",
    description: "A tool you wish existed, or an improvement to an existing one.",
  },
  {
    icon: MessageSquare,
    title: "General feedback",
    description: "Anything else — what's working, what isn't, what's confusing.",
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Contact</h1>
        <p className="text-sm text-muted-foreground">
          DevKit doesn&rsquo;t have a support inbox — the most direct way to reach the project is
          through GitHub Issues on the repository.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {REASONS.map((reason) => (
          <div key={reason.title} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 shadow-xs">
            <reason.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{reason.title}</p>
              <p className="text-sm text-muted-foreground">{reason.description}</p>
            </div>
          </div>
        ))}
      </div>

      <Link
        href={`${GITHUB_URL}/issues`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
      >
        Open a GitHub issue
        <ExternalLink className="size-3.5" />
      </Link>
    </div>
  );
}
