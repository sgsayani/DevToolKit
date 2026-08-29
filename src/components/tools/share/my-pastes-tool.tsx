"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/tools/shared/copy-button";
import { deletePaste, listMyPastes, type PasteSummary } from "@/lib/utils/paste-client";
import { languageLabel } from "@/lib/utils/paste";

const NOT_CONFIGURED_NOTICE =
  "Code Share needs a MONGODB_URI environment variable. Add one to your .env.local file and restart the server.";

export function MyPastesTool() {
  const [pastes, setPastes] = useState<PasteSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [notConfigured, setNotConfigured] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    listMyPastes().then((result) => {
      if (result.code === "not_configured") setNotConfigured(true);
      setPastes(result.pastes);
      setLoading(false);
    });
  }, []);

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this paste? This can't be undone.")) return;
    setDeletingId(id);
    const result = await deletePaste(id);
    setDeletingId(null);
    if (result.ok) setPastes((prev) => prev.filter((p) => p.id !== id));
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading your pastes…</p>;
  }

  if (notConfigured) {
    return (
      <div className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
        {NOT_CONFIGURED_NOTICE}
      </div>
    );
  }

  if (pastes.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border p-10 text-center">
        <p className="text-sm font-medium">No pastes yet</p>
        <p className="text-sm text-muted-foreground">Create your first paste to see it here.</p>
        <Button asChild size="sm" className="mt-2">
          <Link href="/tools/code-share">New paste</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground uppercase">
            <th className="px-3 py-2">Title</th>
            <th className="px-3 py-2">Language</th>
            <th className="px-3 py-2">Visibility</th>
            <th className="px-3 py-2">Created</th>
            <th className="px-3 py-2">Expiration</th>
            <th className="px-3 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pastes.map((paste) => (
            <tr key={paste.id} className="border-b border-border/60 last:border-0">
              <td className="max-w-48 truncate px-3 py-2 font-medium">
                <Link href={`/share/${paste.id}`} className="hover:text-primary hover:underline">
                  {paste.title || "Untitled paste"}
                </Link>
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">
                {languageLabel(paste.language)}
              </td>
              <td className="px-3 py-2 text-muted-foreground capitalize">{paste.visibility}</td>
              <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">
                {new Date(paste.createdAt).toLocaleDateString()}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">
                {paste.expiresAt ? new Date(paste.expiresAt).toLocaleString() : "Never"}
              </td>
              <td className="px-3 py-2">
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon-sm" aria-label="Open paste" asChild>
                    <Link href={`/share/${paste.id}`}>
                      <ExternalLink className="size-3.5" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon-sm" aria-label="Edit paste" asChild>
                    <Link href={`/share/${paste.id}/edit`}>
                      <Pencil className="size-3.5" />
                    </Link>
                  </Button>
                  <CopyButton
                    value={typeof window !== "undefined" ? `${window.location.origin}/share/${paste.id}` : ""}
                    label="Copy link"
                  />
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Delete paste"
                    disabled={deletingId === paste.id}
                    onClick={() => handleDelete(paste.id)}
                  >
                    <Trash2 className="size-3.5 text-destructive" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
