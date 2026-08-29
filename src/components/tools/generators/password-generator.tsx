"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { CopyButton } from "@/components/tools/shared/copy-button";
import {
  generatePassword,
  estimatePasswordEntropyBits,
  type PasswordOptions,
} from "@/lib/utils/generators";

function strengthLabel(bits: number): { label: string; className: string } {
  if (bits === 0) return { label: "—", className: "text-muted-foreground" };
  if (bits < 40) return { label: "Weak", className: "text-destructive" };
  if (bits < 60) return { label: "Fair", className: "text-amber-600 dark:text-amber-400" };
  if (bits < 80) return { label: "Good", className: "text-emerald-600 dark:text-emerald-400" };
  return { label: "Strong", className: "text-emerald-600 dark:text-emerald-400" };
}

function ToggleRow({
  label,
  checked,
  onCheckedChange,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm">{label}</span>
      <Switch checked={checked} onCheckedChange={onCheckedChange} aria-label={label} />
    </div>
  );
}

const DEFAULT_OPTIONS: PasswordOptions = {
  length: 16,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: false,
};

export function PasswordGeneratorTool() {
  const [options, setOptions] = useState<PasswordOptions>(DEFAULT_OPTIONS);
  // Starts empty so server and client render identical markup — generating
  // the random password during render would produce a different value on
  // each side and trigger a hydration mismatch.
  const [password, setPassword] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time initial password generation; must happen post-mount to avoid an SSR/CSR value mismatch.
    setPassword(generatePassword(DEFAULT_OPTIONS));
  }, []);

  function update<K extends keyof PasswordOptions>(key: K, value: PasswordOptions[K]) {
    const next = { ...options, [key]: value };
    setOptions(next);
    setPassword(generatePassword(next));
  }

  function regenerate() {
    setPassword(generatePassword(options));
  }

  const noCharsetsSelected =
    !options.uppercase && !options.lowercase && !options.numbers && !options.symbols;
  const entropy = estimatePasswordEntropyBits(options);
  const strength = strengthLabel(entropy);
  const displayValue = noCharsetsSelected ? "" : password;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Password
        </Label>
        <div className="flex items-center gap-2">
          <Input
            readOnly
            value={displayValue}
            placeholder="Select at least one character type"
            className="h-11 font-mono text-base"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Generate new password"
            onClick={regenerate}
            disabled={noCharsetsSelected}
          >
            <RefreshCw className="size-4" />
          </Button>
          <CopyButton value={displayValue} />
        </div>
        <p className={`text-xs ${strength.className}`}>
          {noCharsetsSelected
            ? "Choose at least one character type."
            : `Strength: ${strength.label} (~${entropy} bits of entropy)`}
        </p>
      </div>

      <div className="flex max-w-md flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Length</Label>
            <span className="font-mono text-sm text-muted-foreground">{options.length}</span>
          </div>
          <Slider
            min={8}
            max={64}
            step={1}
            value={[options.length]}
            onValueChange={([value]) => update("length", value)}
          />
        </div>

        <ToggleRow
          label="Uppercase letters (A–Z)"
          checked={options.uppercase}
          onCheckedChange={(v) => update("uppercase", v)}
        />
        <ToggleRow
          label="Lowercase letters (a–z)"
          checked={options.lowercase}
          onCheckedChange={(v) => update("lowercase", v)}
        />
        <ToggleRow
          label="Numbers (0–9)"
          checked={options.numbers}
          onCheckedChange={(v) => update("numbers", v)}
        />
        <ToggleRow
          label="Symbols (!@#$…)"
          checked={options.symbols}
          onCheckedChange={(v) => update("symbols", v)}
        />
      </div>
    </div>
  );
}
