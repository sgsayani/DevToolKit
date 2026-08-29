"use client";

import { TextTransformTool } from "@/components/tools/shared/text-transform-tool";
import { urlDecode } from "@/lib/utils/encoding";

export function UrlDecoderTool() {
  return (
    <TextTransformTool
      actionLabel="Decode"
      transform={urlDecode}
      inputPlaceholder={"hello%20world%20%26%20friends%3F"}
      outputPlaceholder="Decoded text will appear here."
      downloadFilename="decoded.txt"
      inputId="url-decoder-input"
    />
  );
}
