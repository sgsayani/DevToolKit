"use client";

import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import {
  unixToDate,
  dateToUnix,
  formatUtc,
  formatLocal,
  formatIso,
  toDatetimeLocalValue,
  type TimeUnit,
} from "@/lib/utils/timestamp";

function OutputRow({ label, value }: { label: string; value: string }) {
  const { copied, copy } = useCopyToClipboard();
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2">
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="truncate font-mono text-sm">{value}</div>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={`Copy ${label}`}
        disabled={!value}
        onClick={() => copy(value)}
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      </Button>
    </div>
  );
}

export function TimestampConverterTool() {
  const [unixValue, setUnixValue] = useState("");
  const [unixUnit, setUnixUnit] = useState<TimeUnit>("seconds");
  const [dateValue, setDateValue] = useState("");

  const unixResult = useMemo(
    () => (unixValue.trim() ? unixToDate(unixValue, unixUnit) : null),
    [unixValue, unixUnit],
  );
  const dateResult = useMemo(() => (dateValue ? dateToUnix(dateValue) : null), [dateValue]);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="flex flex-col gap-3 rounded-lg border border-border p-4">
        <h2 className="text-sm font-semibold">Unix timestamp → Date</h2>
        <div className="flex gap-2">
          <Input
            value={unixValue}
            onChange={(e) => setUnixValue(e.target.value)}
            placeholder="1700000000"
            className="font-mono text-sm"
            aria-label="Unix timestamp"
          />
          <Select value={unixUnit} onValueChange={(v) => setUnixUnit(v as TimeUnit)}>
            <SelectTrigger size="default" className="w-36" aria-label="Unit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="seconds">Seconds</SelectItem>
              <SelectItem value="milliseconds">Milliseconds</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-fit"
          onClick={() =>
            setUnixValue(
              unixUnit === "seconds"
                ? String(Math.floor(Date.now() / 1000))
                : String(Date.now()),
            )
          }
        >
          Now
        </Button>

        {unixResult && !unixResult.ok && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            {unixResult.error}
          </div>
        )}
        {unixResult?.ok && unixResult.date && (
          <div className="flex flex-col gap-2">
            <OutputRow label="UTC" value={formatUtc(unixResult.date)} />
            <OutputRow label="Local" value={formatLocal(unixResult.date)} />
            <OutputRow label="ISO 8601" value={formatIso(unixResult.date)} />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-border p-4">
        <h2 className="text-sm font-semibold">Date → Unix timestamp</h2>
        <Input
          type="datetime-local"
          step={1}
          value={dateValue}
          onChange={(e) => setDateValue(e.target.value)}
          className="text-sm"
          aria-label="Date and time"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-fit"
          onClick={() => setDateValue(toDatetimeLocalValue(new Date()))}
        >
          Now
        </Button>

        {dateResult && !dateResult.ok && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            {dateResult.error}
          </div>
        )}
        {dateResult?.ok && (
          <div className="flex flex-col gap-2">
            <OutputRow label="Seconds" value={String(dateResult.seconds)} />
            <OutputRow label="Milliseconds" value={String(dateResult.milliseconds)} />
          </div>
        )}
      </div>
    </div>
  );
}
