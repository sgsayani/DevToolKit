import dns from "node:dns";
import net from "node:net";

/** mDNS-style hostnames that are always internal regardless of what they
 * resolve to. `localhost`/loopback is deliberately NOT in this list — it's
 * allowed (see isPrivateIPv4/isPrivateIPv6) so this tool can hit a local
 * dev server, which is a normal, expected use of an API client. */
const BLOCKED_HOSTNAME_SUFFIXES = [".local"];

function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return true; // malformed -> treat as unsafe
  const [a, b] = parts;
  if (a === 0) return true; // "this network"
  if (a === 10) return true; // RFC1918
  if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT
  // 127.0.0.0/8 (loopback) intentionally allowed — see comment above.
  if (a === 169 && b === 254) return true; // link-local (incl. 169.254.169.254 cloud metadata)
  if (a === 172 && b >= 16 && b <= 31) return true; // RFC1918
  if (a === 192 && b === 0) return true; // IETF protocol assignments (covers 192.0.0.0/24, 192.0.2.0/24)
  if (a === 192 && b === 168) return true; // RFC1918
  if (a === 198 && (b === 18 || b === 19)) return true; // benchmarking
  if (a === 198 && b === 51) return true; // documentation (TEST-NET-2)
  if (a === 203 && b === 0) return true; // documentation (TEST-NET-3)
  if (a >= 224) return true; // multicast + reserved
  return false;
}

function isPrivateIPv6(ipRaw: string): boolean {
  const ip = ipRaw.toLowerCase();
  // "::1" (loopback) intentionally allowed — see comment above.
  if (ip === "::") return true;
  // fe80::/10 link-local
  if (/^fe[89ab]/.test(ip)) return true;
  // fc00::/7 unique local
  if (/^f[cd]/.test(ip)) return true;
  // IPv4-mapped (::ffff:a.b.c.d) — check the embedded address too
  const mapped = ip.match(/^::ffff:([\d.]+)$/);
  if (mapped && net.isIP(mapped[1]) === 4) return isPrivateIPv4(mapped[1]);
  return false;
}

export function isPrivateOrReservedIp(ip: string): boolean {
  const version = net.isIP(ip);
  if (version === 4) return isPrivateIPv4(ip);
  if (version === 6) return isPrivateIPv6(ip);
  return true; // not a valid IP literal — be conservative
}

export interface UrlSafetyResult {
  safe: boolean;
  reason?: string;
}

/**
 * Best-effort SSRF guard for the request proxy: blocks obviously internal
 * network targets (RFC1918, link-local incl. cloud metadata, CGNAT, ULA,
 * multicast — and hostnames that *resolve* to any of those). This is not a
 * hard security boundary — a DNS-rebinding attack could still slip through
 * the gap between this check and the actual fetch, since the connection
 * isn't pinned to the resolved address.
 *
 * `localhost`/loopback (127.0.0.0/8, ::1) is deliberately allowed, not
 * blocked: this is a local API-testing tool, and hitting your own local
 * dev server is the normal case, not an attack. That's a real, intentional
 * trade-off — it means anything with access to this page can also reach
 * whatever's listening on the machine's loopback interface.
 */
export async function isSafeUrl(rawUrl: string): Promise<UrlSafetyResult> {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return { safe: false, reason: "Not a valid URL." };
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return { safe: false, reason: "Only http and https URLs are allowed." };
  }

  const hostname = url.hostname.toLowerCase();
  if (!hostname) return { safe: false, reason: "URL is missing a hostname." };
  if (BLOCKED_HOSTNAME_SUFFIXES.some((suffix) => hostname.endsWith(suffix))) {
    return { safe: false, reason: "Requests to local/internal hostnames are blocked." };
  }

  if (net.isIP(hostname)) {
    if (isPrivateOrReservedIp(hostname)) {
      return { safe: false, reason: "Requests to private or reserved IP addresses are blocked." };
    }
    return { safe: true };
  }

  try {
    const records = await dns.promises.lookup(hostname, { all: true });
    if (records.length === 0) {
      return { safe: false, reason: "Could not resolve this hostname." };
    }
    for (const record of records) {
      if (isPrivateOrReservedIp(record.address)) {
        return {
          safe: false,
          reason: "This hostname resolves to a private or reserved IP address.",
        };
      }
    }
    return { safe: true };
  } catch {
    return { safe: false, reason: "Could not resolve this hostname." };
  }
}
