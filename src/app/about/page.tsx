import type { Metadata } from "next";
import Link from "next/link";
import { GITHUB_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About",
  description: "What DevKit is and why it exists.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">About DevKit</h1>
      </div>

      <p className="text-sm text-muted-foreground">
        DevKit is a collection of practical tools built to make everyday development tasks faster
        — the kind of formatting, debugging, and data-wrangling work that comes up constantly and
        doesn&rsquo;t deserve its own tab full of ads and pop-ups.
      </p>

      <p className="text-sm text-muted-foreground">It covers a handful of areas:</p>

      <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
        <li>
          <span className="text-foreground">API development</span> — an API client, documentation
          generator, and mock API server.
        </li>
        <li>
          <span className="text-foreground">Debugging</span> — JSON, JWTs, regex, diffs, and log
          analysis.
        </li>
        <li>
          <span className="text-foreground">Data transformation</span> — encoding, hashing, and
          conversions between JSON, CSV, YAML, and XML.
        </li>
        <li>
          <span className="text-foreground">Visualization</span> — database schema and system
          design diagramming.
        </li>
        <li>
          <span className="text-foreground">Code sharing</span> — pastes with syntax highlighting
          and expiration.
        </li>
        <li>
          <span className="text-foreground">AI-assisted development</span> — explaining errors and
          code, and generating git commands, SQL, and regex, when an AI provider is configured.
        </li>
      </ul>

      <p className="text-sm text-muted-foreground">
        Most tools run entirely in your browser — nothing you type gets sent anywhere. A few tools
        genuinely need a server (proxying API requests, hosting a mock endpoint, storing a paste,
        calling an AI model), and DevKit tries to be upfront about which is which — see the{" "}
        <Link href="/privacy" className="text-primary underline-offset-4 hover:underline">
          Privacy Policy
        </Link>{" "}
        for the specifics.
      </p>

      <p className="text-sm text-muted-foreground">
        The source is on{" "}
        <Link
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline-offset-4 hover:underline"
        >
          GitHub
        </Link>
        .
      </p>
    </div>
  );
}
