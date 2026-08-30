// Single source of truth for site-wide identity used across metadata,
// sitemap, robots, footer, and the about/contact pages. Nothing here is
// invented — the GitHub URL and Vercel deployment come straight from this
// repo's own `git remote` and the project's actual deployment, and both
// can be overridden by env vars if they ever change.

/** Real repository for this project — do not change unless the repo moves. */
export const GITHUB_URL = process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/sgsayani/DevToolKit";

/** The deployed production URL. Override with NEXT_PUBLIC_SITE_URL if the
 * project moves to a custom domain — falls back to the actual current
 * Vercel deployment, then to localhost for local development. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://dev-tool-kit-ruddy.vercel.app");

export const SITE_NAME = "DevKit";

export const SITE_DESCRIPTION =
  "Practical tools for developers — APIs, debugging, data, visualization, and more.";
