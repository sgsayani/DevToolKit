"use client";

import { TextTransformTool } from "@/components/tools/shared/text-transform-tool";
import { base64Encode } from "@/lib/utils/encoding";

export function Base64EncoderTool() {
  return (
    <TextTransformTool
      actionLabel="Encode"
      transform={base64Encode}
      inputPlaceholder={"Hello, world!"}
      outputPlaceholder="Base64 output will appear here."
      downloadFilename="encoded.txt"
      inputId="base64-encoder-input"
    />
  );
}
