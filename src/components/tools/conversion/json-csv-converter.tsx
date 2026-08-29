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
import { jsonToCsv, csvToJson, type CsvResult } from "@/lib/utils/csv";

type Direction = "json-to-csv" | "csv-to-json";

const SAMPLE_JSON = `[
  { "id": 1, "name": "Ada Lovelace", "active": true },
  { "id": 2, "name": "Grace Hopper", "active": false }
]`;
const SAMPLE_CSV = `id,name,active\n1,Ada Lovelace,true\n2,Grace Hopper,false`;

export function JsonCsvConverterTool() {
  const [direction, setDirection] = useState<Direction>("json-to-csv");
  const [input, setInput] = useState("");
  const [result, setResult] = useState<CsvResult | null>(null);

  const isJsonToCsv = direction === "json-to-csv";
  const inputLabel = isJsonToCsv ? "JSON" : "CSV";
  const outputLabel = isJsonToCsv ? "CSV" : "JSON";

  function handleConvert() {
    setResult(isJsonToCsv ? jsonToCsv(input) : csvToJson(input));
  }

  function handleSwap() {
    const currentOutput = result?.ok ? (result.output ?? "") : "";
    setDirection(isJsonToCsv ? "csv-to-json" : "json-to-csv");
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
            <SelectItem value="json-to-csv">JSON → CSV</SelectItem>
            <SelectItem value="csv-to-json">CSV → JSON</SelectItem>
          </SelectContent>
        </Select>
        <Button type="button" variant="outline" size="sm" onClick={handleSwap}>
          <ArrowLeftRight className="size-3.5" />
          Swap
        </Button>
      </div>

      <ToolPanelGrid>
        <ToolPanel title={inputLabel} htmlFor="json-csv-input">
          <Textarea
            id="json-csv-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isJsonToCsv ? SAMPLE_JSON : SAMPLE_CSV}
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
          filename={isJsonToCsv ? "converted.csv" : "converted.json"}
        />
        <Button variant="ghost" size="sm" onClick={handleClear}>
          Clear
        </Button>
      </ToolActionBar>
    </div>
  );
}
