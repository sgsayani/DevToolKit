"use client";

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/tools/shared/copy-button";
import { DownloadButton } from "@/components/tools/shared/download-button";
import { FILE_EXTENSION_BY_LANGUAGE, type PasteLanguage } from "@/lib/utils/paste";

interface PasteActionsProps {
  id: string;
  content: string;
  language: PasteLanguage;
  title: string;
}

export function PasteActions({ id, content, language, title }: PasteActionsProps) {
  // Empty until mount so server and client render identical markup —
  // window.location isn't available during SSR.
  const [shareUrl, setShareUrl] = useState("");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of window.location, which is unavailable during server rendering.
    setShareUrl(window.location.href);
  }, []);

  const filename = `${title || "paste"}.${FILE_EXTENSION_BY_LANGUAGE[language]}`;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <CopyButton value={content} label="Copy code" />
      <CopyButton value={shareUrl} label="Copy link" disabled={!shareUrl} />
      <DownloadButton value={content} filename={filename} />
      <Button type="button" variant="outline" size="sm" asChild>
        <a href={`/api/pastes/${id}/raw`} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="size-3.5" />
          Raw
        </a>
      </Button>
    </div>
  );
}
