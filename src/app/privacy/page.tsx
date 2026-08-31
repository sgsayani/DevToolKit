import type { Metadata } from "next";
import Link from "next/link";
import { GITHUB_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How DevKit handles the data you give it, tool by tool.",
  alternates: { canonical: "/privacy" },
};

const LAST_UPDATED = "September 1, 2026";

export default function PrivacyPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
        <p className="text-sm text-muted-foreground">
          This describes what DevKit actually does with the data you give it. It&rsquo;s written
          to match the real implementation, not a generic template — different tools handle data
          differently, and this page says which is which.
        </p>
      </div>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold tracking-tight">Tools that never leave your browser</h2>
        <p className="text-sm text-muted-foreground">
          Most of DevKit — JSON, encoding, generators, JWT, regex, diff, timestamps, hashing, SQL
          formatting, log analysis, format conversion, and the diagram tools — runs entirely in
          your browser. What you type or paste into these is never sent to a server, DevKit&rsquo;s
          or anyone else&rsquo;s. Closing the tab is enough to remove it.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold tracking-tight">Tools that use DevKit&rsquo;s server</h2>
        <div className="flex flex-col gap-3 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">API Client.</span> Cross-origin requests
            are relayed through DevKit&rsquo;s server (a same-origin browser restriction, not a
            DevKit choice). The target URL, method, headers, and body pass through the server only
            to make that one request and are not logged or stored — on failure, the server logs at
            most the method and target hostname, never headers, bodies, or full URLs.
          </p>
          <p>
            <span className="font-medium text-foreground">Mock API Generator.</span> Mock endpoint
            definitions you create are held in the server&rsquo;s memory so they can respond to
            requests. They are not written to a database and are lost when the server restarts.
          </p>
          <p>
            <span className="font-medium text-foreground">Code Share (pastes).</span> A paste&rsquo;s
            title, content, language, visibility, and expiration are stored in a database so the
            link works for others. Ownership (for My Pastes, editing, and deleting) is tracked with
            an anonymous, random identifier in an <code>httpOnly</code> cookie on your browser — not
            an account or email address. Only a one-way hash of that identifier is stored, not the
            cookie value itself.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold tracking-tight">AI tools</h2>
        <p className="text-sm text-muted-foreground">
          The Error Explainer, Code Explainer, Git Command Generator, SQL Generator, and Regex
          Generator send the text you submit to Google&rsquo;s Gemini API to generate a response.
          This only happens when you click the tool&rsquo;s generate button, and only if the person
          running this DevKit instance has configured an API key — otherwise these tools show a
          setup notice and make no network call. DevKit&rsquo;s server does not store your prompts
          or the AI&rsquo;s responses; they pass through for that one request. Use of these tools is
          subject to Google&rsquo;s own terms and privacy practices for the Gemini API, which DevKit
          does not control.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold tracking-tight">Cookies</h2>
        <p className="text-sm text-muted-foreground">
          DevKit sets exactly one cookie — the anonymous, <code>httpOnly</code> paste-ownership
          identifier described above. It is not used for tracking, analytics, or advertising, and
          nothing else on the site sets a cookie. Your light/dark theme preference is stored in
          your browser&rsquo;s local storage, not a cookie.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold tracking-tight">Local storage</h2>
        <p className="text-sm text-muted-foreground">
          Favorites, recently used tools, API Client request history, saved diagrams, and your
          theme preference are kept in your browser&rsquo;s local storage. This data stays on your
          device, is never transmitted to DevKit, and is cleared whenever you clear your
          browser&rsquo;s site data for this site.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold tracking-tight">Analytics</h2>
        <p className="text-sm text-muted-foreground">
          DevKit uses{" "}
          <Link
            href="https://vercel.com/docs/analytics/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline-offset-4 hover:underline"
          >
            Vercel Analytics
          </Link>{" "}
          to count page views and see which tools get used. It&rsquo;s cookieless and doesn&rsquo;t
          track you across other sites — see Vercel&rsquo;s own page linked above for exactly what
          it collects. DevKit does not use any other analytics, tracking pixels, or advertising
          services.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold tracking-tight">Server logs and IP addresses</h2>
        <p className="text-sm text-muted-foreground">
          To prevent abuse, requests to server-backed tools are rate-limited using a
          request&rsquo;s IP-related headers as a temporary, in-memory counter key — this is never
          written to a log or a database. Operational error logs record generic outcomes (for
          example, that an AI request failed, or which hostname a proxy request couldn&rsquo;t
          reach) and never include request bodies, headers, prompts, or API keys.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold tracking-tight">Data retention and deletion</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>
            Pastes are kept until you delete them from My Pastes, or until their chosen expiration
            passes (checked on every read, and also removed automatically in the background). A
            paste set to &ldquo;Never&rdquo; expire is kept until you delete it yourself.
          </li>
          <li>Mock API definitions live only in server memory and are gone on server restart.</li>
          <li>
            Everything else described above is local-only and is deleted the moment you clear it
            from your browser.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold tracking-tight">Third-party services</h2>
        <p className="text-sm text-muted-foreground">
          Depending on how this instance of DevKit is configured, it may use a MongoDB database
          (for Code Share) and Google&rsquo;s Gemini API (for the AI tools). No other third-party
          service is used.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold tracking-tight">Security</h2>
        <p className="text-sm text-muted-foreground">
          The API Client&rsquo;s proxy blocks requests to private/internal network addresses.
          Routes that change data require a same-origin request and are rate-limited. Server
          secrets (API keys, database credentials) are kept in environment variables and are never
          sent to the browser. DevKit does not execute pasted or generated code. This is a
          description of what&rsquo;s implemented, not a certification, security audit, or a claim
          of encryption, GDPR, or CCPA compliance.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold tracking-tight">Your choices</h2>
        <p className="text-sm text-muted-foreground">
          DevKit has no account system, so there is no profile or email address to manage. You can
          delete any paste you own from My Pastes at any time, and clear favorites, recent tools,
          history, and saved diagrams by clearing this site&rsquo;s data in your browser.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold tracking-tight">Contact</h2>
        <p className="text-sm text-muted-foreground">
          Questions about this policy can be raised as a{" "}
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
        This page describes how DevKit&rsquo;s software behaves. It is not legal advice.
      </p>
    </div>
  );
}
