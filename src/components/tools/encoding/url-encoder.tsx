"use client";

import { TextTransformTool } from "@/components/tools/shared/text-transform-tool";
import { urlEncode } from "@/lib/utils/encoding";

export function UrlEncoderTool() {
  return (
    <TextTransformTool
      actionLabel="Encode"
      transform={urlEncode}
      inputPlaceholder={"hello world & friends?"}
      outputPlaceholder="URL-encoded output will appear here."
      downloadFilename="encoded.txt"
      inputId="url-encoder-input"
    />
  );
}
