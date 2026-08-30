import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /api: backend routes, not content. /share: individual pastes are
      // user-generated and may be unlisted/private — never worth indexing,
      // and there's no way to tell visibility apart from the URL alone.
      // The /share/[id]/edit path is owner-only regardless. Tool pages
      // under /tools/code-share and /tools/my-pastes (the entry points,
      // not individual pastes) stay crawlable.
      disallow: ["/api/", "/share/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
