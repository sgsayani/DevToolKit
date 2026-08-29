export type StatusCategory = "2xx" | "3xx" | "4xx" | "5xx";

export interface HttpStatus {
  code: number;
  name: string;
  category: StatusCategory;
  meaning: string;
  commonCause: string;
}

export const httpStatuses: HttpStatus[] = [
  // 2xx — Success
  {
    code: 200,
    name: "OK",
    category: "2xx",
    meaning: "The request succeeded.",
    commonCause: "Standard successful response for GET, POST, or other requests.",
  },
  {
    code: 201,
    name: "Created",
    category: "2xx",
    meaning: "The request succeeded and a new resource was created.",
    commonCause: "Returned after a successful POST that creates a record.",
  },
  {
    code: 202,
    name: "Accepted",
    category: "2xx",
    meaning: "The request was accepted for processing, but isn't finished.",
    commonCause: "Async or queued processing (e.g. background jobs).",
  },
  {
    code: 204,
    name: "No Content",
    category: "2xx",
    meaning: "The request succeeded but there's no response body.",
    commonCause: "Successful DELETE, or a PUT/PATCH that returns nothing.",
  },
  {
    code: 206,
    name: "Partial Content",
    category: "2xx",
    meaning: "Only part of the resource was returned, as requested.",
    commonCause: "Range requests — resumable downloads, video streaming.",
  },

  // 3xx — Redirection
  {
    code: 301,
    name: "Moved Permanently",
    category: "3xx",
    meaning: "The resource has permanently moved to a new URL.",
    commonCause: "Domain changes, canonical URL redirects, HTTPS upgrades.",
  },
  {
    code: 302,
    name: "Found",
    category: "3xx",
    meaning: "The resource temporarily lives at a different URL.",
    commonCause: "Temporary redirects, post-login redirects.",
  },
  {
    code: 303,
    name: "See Other",
    category: "3xx",
    meaning: "Fetch the response from a different URL using GET.",
    commonCause: "Redirect after a form submission (POST-redirect-GET pattern).",
  },
  {
    code: 304,
    name: "Not Modified",
    category: "3xx",
    meaning: "The cached version is still valid — no need to re-fetch.",
    commonCause: "Conditional GET requests with ETag or If-Modified-Since.",
  },
  {
    code: 307,
    name: "Temporary Redirect",
    category: "3xx",
    meaning: "Temporary redirect that preserves the original HTTP method.",
    commonCause: "Like 302, but guarantees the method and body aren't changed.",
  },
  {
    code: 308,
    name: "Permanent Redirect",
    category: "3xx",
    meaning: "Permanent redirect that preserves the original HTTP method.",
    commonCause: "Like 301, but guarantees the method and body aren't changed.",
  },

  // 4xx — Client errors
  {
    code: 400,
    name: "Bad Request",
    category: "4xx",
    meaning: "The server couldn't understand the request.",
    commonCause: "Malformed JSON, missing required fields, invalid syntax.",
  },
  {
    code: 401,
    name: "Unauthorized",
    category: "4xx",
    meaning: "Authentication is required or has failed.",
    commonCause: "Missing, invalid, or expired auth token.",
  },
  {
    code: 402,
    name: "Payment Required",
    category: "4xx",
    meaning: "Reserved for future use — occasionally used for billing/paywalls.",
    commonCause: "API usage limits tied to billing status.",
  },
  {
    code: 403,
    name: "Forbidden",
    category: "4xx",
    meaning: "The server understood the request but refuses to authorize it.",
    commonCause: "Authenticated, but lacking permission for this resource.",
  },
  {
    code: 404,
    name: "Not Found",
    category: "4xx",
    meaning: "The server can't find the requested resource.",
    commonCause: "Wrong URL, deleted resource, or unmatched route.",
  },
  {
    code: 405,
    name: "Method Not Allowed",
    category: "4xx",
    meaning: "The HTTP method isn't supported for this resource.",
    commonCause: "Calling POST on a read-only endpoint, or similar mismatch.",
  },
  {
    code: 406,
    name: "Not Acceptable",
    category: "4xx",
    meaning: "The server can't produce a response matching the Accept headers.",
    commonCause: "Requesting a content type the server doesn't support.",
  },
  {
    code: 408,
    name: "Request Timeout",
    category: "4xx",
    meaning: "The server timed out waiting for the request.",
    commonCause: "Slow or idle client connection.",
  },
  {
    code: 409,
    name: "Conflict",
    category: "4xx",
    meaning: "The request conflicts with the current state of the resource.",
    commonCause: "Concurrent edits, duplicate unique keys, version mismatches.",
  },
  {
    code: 410,
    name: "Gone",
    category: "4xx",
    meaning: "The resource used to exist but has been permanently removed.",
    commonCause: "Deliberately retired endpoints or deleted content.",
  },
  {
    code: 411,
    name: "Length Required",
    category: "4xx",
    meaning: "The request needs a Content-Length header.",
    commonCause: "Missing Content-Length on a request that requires one.",
  },
  {
    code: 413,
    name: "Payload Too Large",
    category: "4xx",
    meaning: "The request body is larger than the server will accept.",
    commonCause: "Large file uploads exceeding a size limit.",
  },
  {
    code: 414,
    name: "URI Too Long",
    category: "4xx",
    meaning: "The request URL is longer than the server will accept.",
    commonCause: "Overly long query strings, often from GET-based search.",
  },
  {
    code: 415,
    name: "Unsupported Media Type",
    category: "4xx",
    meaning: "The request body's format isn't supported.",
    commonCause: "Sending XML to a JSON-only API, or a wrong Content-Type header.",
  },
  {
    code: 418,
    name: "I'm a Teapot",
    category: "4xx",
    meaning: "An April Fools' joke from RFC 2324 — not to be implemented seriously.",
    commonCause: "Occasionally used by APIs as an easter egg.",
  },
  {
    code: 422,
    name: "Unprocessable Entity",
    category: "4xx",
    meaning: "The request is well-formed but semantically invalid.",
    commonCause: "Validation errors — e.g. an invalid email format.",
  },
  {
    code: 423,
    name: "Locked",
    category: "4xx",
    meaning: "The resource is locked.",
    commonCause: "WebDAV locking, or a record locked for editing.",
  },
  {
    code: 425,
    name: "Too Early",
    category: "4xx",
    meaning: "The server is unwilling to process a request that might be replayed.",
    commonCause: "Early Data (0-RTT) requests in TLS 1.3.",
  },
  {
    code: 426,
    name: "Upgrade Required",
    category: "4xx",
    meaning: "The client should switch to a different protocol.",
    commonCause: "Server requires a protocol upgrade, e.g. to WebSocket or TLS.",
  },
  {
    code: 429,
    name: "Too Many Requests",
    category: "4xx",
    meaning: "The client has sent too many requests in a given time.",
    commonCause: "Rate limiting.",
  },
  {
    code: 431,
    name: "Request Header Fields Too Large",
    category: "4xx",
    meaning: "The request's header fields are too large.",
    commonCause: "Oversized cookies or headers.",
  },

  // 5xx — Server errors
  {
    code: 500,
    name: "Internal Server Error",
    category: "5xx",
    meaning: "A generic, unexpected error occurred on the server.",
    commonCause: "Unhandled exceptions or bugs in server-side code.",
  },
  {
    code: 501,
    name: "Not Implemented",
    category: "5xx",
    meaning: "The server doesn't support the functionality required.",
    commonCause: "Unsupported HTTP method or feature.",
  },
  {
    code: 502,
    name: "Bad Gateway",
    category: "5xx",
    meaning: "A gateway or proxy received an invalid response from upstream.",
    commonCause: "Upstream service crashed or returned malformed data.",
  },
  {
    code: 503,
    name: "Service Unavailable",
    category: "5xx",
    meaning: "The server isn't ready to handle the request.",
    commonCause: "Server overload, maintenance mode, or startup in progress.",
  },
  {
    code: 504,
    name: "Gateway Timeout",
    category: "5xx",
    meaning: "A gateway or proxy didn't get a timely response from upstream.",
    commonCause: "Slow or unresponsive upstream service.",
  },
  {
    code: 505,
    name: "HTTP Version Not Supported",
    category: "5xx",
    meaning: "The server doesn't support the HTTP protocol version used.",
    commonCause: "Client using an outdated or unsupported HTTP version.",
  },
  {
    code: 507,
    name: "Insufficient Storage",
    category: "5xx",
    meaning: "The server can't store the representation needed to complete the request.",
    commonCause: "WebDAV servers running out of disk space.",
  },
  {
    code: 511,
    name: "Network Authentication Required",
    category: "5xx",
    meaning: "The client needs to authenticate to gain network access.",
    commonCause: "Captive portals (e.g. public Wi-Fi login pages).",
  },
];
