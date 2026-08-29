"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SYSTEM_DESIGN_TEMPLATES } from "@/lib/utils/system-design-templates";

interface TemplatePickerProps {
  onLoad: (templateId: string) => void;
}

export function TemplatePicker({ onLoad }: TemplatePickerProps) {
  return (
    <Select onValueChange={onLoad}>
      <SelectTrigger size="sm" className="w-44 bg-background" aria-label="Load a starter template">
        <SelectValue placeholder="Starter templates" />
      </SelectTrigger>
      <SelectContent>
        {SYSTEM_DESIGN_TEMPLATES.map((t) => (
          <SelectItem key={t.id} value={t.id}>
            {t.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
