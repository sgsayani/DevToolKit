export interface QueryParam {
  key: string;
  value: string;
}

export interface ParsedUrl {
  href: string;
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  origin: string;
  queryParams: QueryParam[];
}

export interface ParseUrlResult {
  ok: boolean;
  result?: ParsedUrl;
  error?: string;
}

export function parseUrl(input: string): ParseUrlResult {
  const trimmed = input.trim();
  if (trimmed === "") {
    return { ok: false, error: "Enter a URL to parse." };
  }
  try {
    const url = new URL(trimmed);
    const queryParams = Array.from(url.searchParams.entries()).map(
      ([key, value]) => ({ key, value }),
    );
    return {
      ok: true,
      result: {
        href: url.href,
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port,
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
        origin: url.origin,
        queryParams,
      },
    };
  } catch {
    return {
      ok: false,
      error: "Not a valid absolute URL — include the protocol, e.g. https://example.com",
    };
  }
}
