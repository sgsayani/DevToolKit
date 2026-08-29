"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DownloadButtonProps {
  value: string;
  filename: string;
  label?: string;
  disabled?: boolean;
}

export function DownloadButton({
  value,
  filename,
  label = "Download",
  disabled,
}: DownloadButtonProps) {
  function handleDownload() {
    const blob = new Blob([value], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={disabled || !value}
      onClick={handleDownload}
    >
      <Download className="size-3.5" />
      {label}
    </Button>
  );
}
