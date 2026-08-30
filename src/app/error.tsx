"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    // Next.js already keeps the message generic in production for errors
    // thrown from Server Components (see error.digest for matching
    // server-side logs) — this just surfaces it in the browser console too.
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center">
      <span className="text-sm font-semibold text-destructive">Error</span>
      <h1 className="text-xl font-semibold tracking-tight">Something went wrong</h1>
      <p className="text-sm text-muted-foreground">
        This tool hit an unexpected error. Trying again usually fixes it — if it keeps happening,
        let us know.
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
        <Button onClick={() => retry()}>Try again</Button>
        <Button variant="outline" asChild>
          <Link href="/">Back to DevKit</Link>
        </Button>
      </div>
    </div>
  );
}
