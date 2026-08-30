import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PasteViewer } from "@/components/paste/paste-viewer";
import { PasteActions } from "@/components/paste/paste-actions";
import { getPasteById } from "@/lib/server/paste-store";
import { getOwnerHash } from "@/lib/server/owner-token";
import { isMongoConfigured, NOT_CONFIGURED_MESSAGE } from "@/lib/server/mongodb";
import { highlightPaste } from "@/lib/server/paste-highlight";
import { languageLabel } from "@/lib/utils/paste";

// This page's HTML depends on who's asking (isOwner, and for a private
// paste the content itself) — never let it be served from a shared cache.
export const dynamic = "force-dynamic";

interface PasteViewPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string; updated?: string }>;
}

export async function generateMetadata({ params }: PasteViewPageProps): Promise<Metadata> {
  const { id } = await params;
  // Never indexed: paste content is user-generated and often not meant for
  // public discovery (that's the whole point of unlisted/private), and even
  // public pastes aren't something DevKit itself wants to promise as a
  // stable, indexable page.
  if (!isMongoConfigured()) return { title: "Paste", robots: { index: false } };
  const paste = await getPasteById(id);
  if (!paste || paste.visibility === "private") return { title: "Paste", robots: { index: false } };
  return {
    title: paste.title || "Untitled paste",
    description: `A ${languageLabel(paste.language)} paste shared on DevKit.`,
    robots: { index: false },
  };
}

export default async function PasteViewPage({ params, searchParams }: PasteViewPageProps) {
  const { id } = await params;
  const { created, updated } = await searchParams;

  if (!isMongoConfigured()) {
    return (
      <div className="max-w-2xl rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
        {NOT_CONFIGURED_MESSAGE}
      </div>
    );
  }

  const paste = await getPasteById(id);
  const ownerHash = await getOwnerHash();
  const isOwner = !!paste && ownerHash === paste.ownerHash;

  // A private paste a non-owner requests behaves exactly like a missing
  // one — it never confirms that the id exists.
  if (!paste || (paste.visibility === "private" && !isOwner)) {
    notFound();
  }

  const highlighted = highlightPaste(paste.content, paste.language);
  const lineCount = paste.content.split("\n").length;

  return (
    <div className="flex max-w-5xl flex-col gap-4">
      {created === "1" && (
        <div className="rounded-lg border border-emerald-600/30 bg-emerald-600/5 px-3 py-2 text-sm text-emerald-800 dark:text-emerald-400">
          Paste created successfully.
        </div>
      )}
      {updated === "1" && (
        <div className="rounded-lg border border-emerald-600/30 bg-emerald-600/5 px-3 py-2 text-sm text-emerald-800 dark:text-emerald-400">
          Paste updated successfully.
        </div>
      )}

      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{paste.title || "Untitled paste"}</h1>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            <span>{languageLabel(paste.language)}</span>
            <span aria-hidden="true">·</span>
            <span>Created {paste.createdAt.toLocaleString()}</span>
            <span aria-hidden="true">·</span>
            <span>{paste.expiresAt ? `Expires ${paste.expiresAt.toLocaleString()}` : "Never expires"}</span>
            {paste.visibility !== "public" && (
              <>
                <span aria-hidden="true">·</span>
                <span className="capitalize">{paste.visibility}</span>
              </>
            )}
          </p>
        </div>
        {isOwner && (
          <Button type="button" variant="outline" size="sm" asChild>
            <Link href={`/share/${id}/edit`}>Edit</Link>
          </Button>
        )}
      </div>

      <PasteActions id={id} content={paste.content} language={paste.language} title={paste.title} />

      <PasteViewer highlightedHtml={highlighted} lineCount={lineCount} language={paste.language} />
    </div>
  );
}
