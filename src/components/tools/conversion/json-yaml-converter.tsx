"use client";

import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ToolPanel,
  ToolPanelGrid,
  ToolActionBar,
  ToolErrorPanel,
} from "@/components/tools/shared/tool-panels";
import { CopyButton } from "@/components/tools/shared/copy-button";
import { DownloadButton } from "@/components/tools/shared/download-button";
import { jsonToYaml, yamlToJson, type YamlResult } from "@/lib/utils/yaml";

type Direction = "json-to-yaml" | "yaml-to-json";

const SAMPLE_JSON = `{
  "name": "Ada Lovelace",
  "active": true,
  "roles": ["admin", "editor"]
}`;
const SAMPLE_YAML = `name: Ada Lovelace\nactive: true\nroles:\n  - admin\n  - editor`;

export function JsonYamlConverterTool() {
  const [direction, setDirection] = useState<Direction>("json-to-yaml");
  const [input, setInput] = useState("");
  const [result, setResult] = useState<YamlResult | null>(null);

  const isJsonToYaml = direction === "json-to-yaml";
  const inputLabel = isJsonToYaml ? "JSON" : "YAML";
  const outputLabel = isJsonToYaml ? "YAML" : "JSON";

  function handleConvert() {
    setResult(isJsonToYaml ? jsonToYaml(input) : yamlToJson(input));
  }

  function handleSwap() {
    const currentOutput = result?.ok ? (result.output ?? "") : "";
    setDirection(isJsonToYaml ? "yaml-to-json" : "json-to-yaml");
    if (currentOutput) setInput(currentOutput);
    setResult(null);
  }

  function handleClear() {
    setInput("");
    setResult(null);
  }

  const output = result?.ok ? (result.output ?? "") : "";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Select value={direction} onValueChange={(v) => setDirection(v as Direction)}>
          <SelectTrigger size="default" className="w-44" aria-label="Direction">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="json-to-yaml">JSON → YAML</SelectItem>
            <SelectItem value="yaml-to-json">YAML → JSON</SelectItem>
          </SelectContent>
        </Select>
        <Button type="button" variant="outline" size="sm" onClick={handleSwap}>
          <ArrowLeftRight className="size-3.5" />
          Swap
        </Button>
      </div>

      <ToolPanelGrid>
        <ToolPanel title={inputLabel} htmlFor="json-yaml-input">
          <Textarea
            id="json-yaml-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isJsonToYaml ? SAMPLE_JSON : SAMPLE_YAML}
            className="min-h-[320px] font-mono text-sm"
            spellCheck={false}
          />
        </ToolPanel>
        <ToolPanel title={outputLabel}>
          {result && !result.ok ? (
            <ToolErrorPanel>{result.error}</ToolErrorPanel>
          ) : (
            <Textarea
              value={output}
              readOnly
              placeholder={`Converted ${outputLabel} will appear here.`}
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
        <DownloadButton
          value={output}
          filename={isJsonToYaml ? "converted.yaml" : "converted.json"}
        />
        <Button variant="ghost" size="sm" onClick={handleClear}>
          Clear
        </Button>
      </ToolActionBar>
    </div>
  );
}
