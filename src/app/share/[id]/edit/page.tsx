import { notFound } from "next/navigation";
import { PasteForm } from "@/components/paste/paste-form";
import { getPasteById } from "@/lib/server/paste-store";
import { getOwnerHash } from "@/lib/server/owner-token";
import { isMongoConfigured, NOT_CONFIGURED_MESSAGE } from "@/lib/server/mongodb";

interface EditPastePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPastePage({ params }: EditPastePageProps) {
  const { id } = await params;

  if (!isMongoConfigured()) {
    return (
      <div className="max-w-2xl rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
        {NOT_CONFIGURED_MESSAGE}
      </div>
    );
  }

  const paste = await getPasteById(id);
  const ownerHash = await getOwnerHash();

  // Same "not found" (not "forbidden") treatment as the view page — editing
  // someone else's paste isn't possible, and this doesn't confirm it exists.
  if (!paste || ownerHash !== paste.ownerHash) {
    notFound();
  }

  return (
    <div className="flex max-w-5xl flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Edit paste</h1>
        <p className="mt-1 text-sm text-muted-foreground">Update the content, visibility, or expiration.</p>
      </div>
      <PasteForm
        mode="edit"
        pasteId={id}
        initial={{
          title: paste.title,
          content: paste.content,
          language: paste.language,
          visibility: paste.visibility,
        }}
      />
    </div>
  );
}
