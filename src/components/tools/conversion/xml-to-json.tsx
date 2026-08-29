"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ToolPanel,
  ToolPanelGrid,
  ToolActionBar,
  ToolErrorPanel,
} from "@/components/tools/shared/tool-panels";
import { CopyButton } from "@/components/tools/shared/copy-button";
import { DownloadButton } from "@/components/tools/shared/download-button";
import { xmlToJson, type XmlToJsonResult } from "@/lib/utils/xml-to-json";

const SAMPLE = `<user id="1">\n  <name>Ada Lovelace</name>\n  <active>true</active>\n</user>`;

export function XmlToJsonTool() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<XmlToJsonResult | null>(null);

  function handleConvert() {
    setResult(xmlToJson(input));
  }

  function handleClear() {
    setInput("");
    setResult(null);
  }

  const output = result?.ok ? (result.output ?? "") : "";

  return (
    <div className="flex flex-col gap-4">
      <ToolPanelGrid>
        <ToolPanel title="XML" htmlFor="xml-to-json-input">
          <Textarea
            id="xml-to-json-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={SAMPLE}
            className="min-h-[320px] font-mono text-sm"
            spellCheck={false}
          />
        </ToolPanel>
        <ToolPanel title="JSON">
          {result && !result.ok ? (
            <ToolErrorPanel>{result.error}</ToolErrorPanel>
          ) : (
            <Textarea
              value={output}
              readOnly
              placeholder="Converted JSON will appear here."
              className="min-h-[320px] font-mono text-sm"
              spellCheck={false}
            />
          )}
        </ToolPanel>
      </ToolPanelGrid>

      <ToolActionBar>
        <Button size="sm" onClick={handleConvert}>
          Convert
        </Button>
        <CopyButton value={output} />
        <DownloadButton value={output} filename="converted.json" />
        <Button variant="ghost" size="sm" onClick={handleClear}>
          Clear
        </Button>
      </ToolActionBar>
    </div>
  );
}
