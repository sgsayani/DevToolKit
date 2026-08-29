"use client";

import { TextTransformTool } from "@/components/tools/shared/text-transform-tool";
import { base64Decode } from "@/lib/utils/encoding";

export function Base64DecoderTool() {
  return (
    <TextTransformTool
      actionLabel="Decode"
      transform={base64Decode}
      inputPlaceholder={"SGVsbG8sIHdvcmxkIQ=="}
      outputPlaceholder="Decoded text will appear here."
      downloadFilename="decoded.txt"
      inputId="base64-decoder-input"
    />
  );
}
