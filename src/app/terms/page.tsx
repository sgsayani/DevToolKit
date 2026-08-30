import type { Metadata } from "next";
import Link from "next/link";
import { GITHUB_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The practical ground rules for using DevKit.",
  alternates: { canonical: "/terms" },
};

const LAST_UPDATED = "August 30, 2026";

export default function TermsPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Terms of Use</h1>
        <p className="text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
        <p className="text-sm text-muted-foreground">
          These are the practical ground rules for using DevKit, written in plain language rather
          than dense legal boilerplate.
        </p>
      </div>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold tracking-tight">Acceptance</h2>
        <p className="text-sm text-muted-foreground">
          By using DevKit, you agree to these terms. If you don&rsquo;t agree, don&rsquo;t use the
          site.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold tracking-tight">Using DevKit</h2>
        <p className="text-sm text-muted-foreground">
          DevKit is a set of developer utilities — formatting, debugging, data conversion,
          diagramming, an API client, code sharing, and a small set of AI-assisted tools. It&rsquo;s
          provided as-is for everyday development work. See the{" "}
          <Link href="/privacy" className="text-primary underline-offset-4 hover:underline">
            Privacy Policy
          </Link>{" "}
          for exactly what each tool does with your data.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold tracking-tight">Acceptable use</h2>
        <p className="text-sm text-muted-foreground">Don&rsquo;t use DevKit to:</p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>Attack, probe, or gain unauthorized access to systems you don&rsquo;t own or have permission to test.</li>
          <li>Distribute malware, phishing content, or anything illegal.</li>
          <li>Abuse rate limits or attempt to disrupt the service for other users.</li>
          <li>
            Use the API Client to reach internal or private network addresses you don&rsquo;t
            control — the proxy blocks known-private ranges, but you&rsquo;re still responsible for
            what you point it at.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold tracking-tight">Code Share and pastes</h2>
        <p className="text-sm text-muted-foreground">
          You&rsquo;re responsible for what you paste. Don&rsquo;t share content you don&rsquo;t
          have the right to share, credentials or secrets, or anything illegal or harmful. Public
          and unlisted pastes are reachable by anyone with the link; private pastes are restricted
          to the browser that created them, as described in the Privacy Policy. DevKit reserves the
          right to remove pastes that violate these terms.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold tracking-tight">API Client</h2>
        <p className="text-sm text-muted-foreground">
          The API Client sends requests on your behalf to endpoints you specify. Only use it
          against systems you&rsquo;re authorized to test. DevKit isn&rsquo;t responsible for the
          content or behavior of third-party APIs you choose to call.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold tracking-tight">AI-generated content</h2>
        <p className="text-sm text-muted-foreground">
          The AI tools generate explanations, commands, SQL, and regular expressions using an
          external AI model. This output can be wrong, incomplete, or unsafe — review it yourself
          before relying on it. In particular: never run a generated Git command you don&rsquo;t
          understand, and never execute generated SQL against a real database without reviewing it
          first — DevKit never runs it for you.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold tracking-tight">Your responsibility</h2>
        <p className="text-sm text-muted-foreground">
          You&rsquo;re responsible for the content you submit to any tool and for how you use the
          results. DevKit doesn&rsquo;t review pastes, API requests, or AI outputs before they
          happen.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold tracking-tight">Intellectual property</h2>
        <p className="text-sm text-muted-foreground">
          You retain ownership of anything you paste or submit. DevKit&rsquo;s own code, design,
          and branding belong to its author.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold tracking-tight">Third-party services</h2>
        <p className="text-sm text-muted-foreground">
          Some tools depend on third-party infrastructure (a database for Code Share, an external
          AI provider for the AI tools). DevKit isn&rsquo;t responsible for their availability,
          accuracy, or downtime.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold tracking-tight">Availability</h2>
        <p className="text-sm text-muted-foreground">
          DevKit is provided without uptime guarantees. Tools, including Code Share and the AI
          tools, may be unavailable if the underlying database or AI provider isn&rsquo;t configured
          or is temporarily down.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold tracking-tight">Changes</h2>
        <p className="text-sm text-muted-foreground">
          These terms and the tools themselves may change over time. Continued use after a change
          means you accept the updated terms.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold tracking-tight">Contact</h2>
        <p className="text-sm text-muted-foreground">
          Questions about these terms can be raised as a{" "}
          <Link
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline-offset-4 hover:underline"
          >
            GitHub issue
          </Link>
          .
        </p>
      </section>

      <p className="text-xs text-muted-foreground">
        This page is written to be clear and practical. It is not legal advice.
      </p>
    </div>
  );
}
