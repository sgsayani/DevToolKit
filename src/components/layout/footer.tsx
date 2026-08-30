import Link from "next/link";
import { GITHUB_URL, SITE_NAME } from "@/lib/site-config";

const TOOL_LINKS = [
  { label: "JSON Formatter", href: "/tools/json-formatter" },
  { label: "API Client", href: "/tools/api-client" },
  { label: "Regex Tester", href: "/tools/regex-tester" },
  { label: "Diff Checker", href: "/tools/diff-checker" },
  { label: "SQL Formatter", href: "/tools/sql-formatter" },
];

const RESOURCE_LINKS = [
  { label: "About", href: "/about" },
  { label: "GitHub", href: GITHUB_URL, external: true },
  { label: "Contact", href: "/contact" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {title}
      </h3>
      <ul className="flex flex-col gap-1.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 md:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 flex flex-col gap-2 sm:col-span-1">
            <span className="flex items-center gap-2 font-semibold tracking-tight">
              <span className="flex size-6 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
                D
              </span>
              {SITE_NAME}
            </span>
            <p className="text-sm text-muted-foreground">Practical tools for developers.</p>
          </div>
          <FooterColumn title="Tools" links={TOOL_LINKS} />
          <FooterColumn title="Resources" links={RESOURCE_LINKS} />
          <FooterColumn title="Legal" links={LEGAL_LINKS} />
        </div>
        <p className="text-xs text-muted-foreground">
          © {year} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
