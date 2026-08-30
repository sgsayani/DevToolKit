import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center">
      <span className="text-sm font-semibold text-primary">404</span>
      <h1 className="text-xl font-semibold tracking-tight">Tool not found</h1>
      <p className="text-sm text-muted-foreground">
        The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved.
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
        <Button asChild>
          <Link href="/">Back to DevKit</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">
            <Search className="size-3.5" />
            Search Tools
          </Link>
        </Button>
      </div>
    </div>
  );
}
