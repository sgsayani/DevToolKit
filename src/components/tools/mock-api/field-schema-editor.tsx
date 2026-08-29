"use client";

import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createEmptyMockField, MOCK_FIELD_TYPES, type MockField } from "@/lib/utils/mock-data";

interface FieldSchemaEditorProps {
  fields: MockField[];
  onChange: (fields: MockField[]) => void;
}

export function FieldSchemaEditor({ fields, onChange }: FieldSchemaEditorProps) {
  function updateField(id: string, patch: Partial<MockField>) {
    onChange(fields.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  }
  function removeField(id: string) {
    onChange(fields.filter((f) => f.id !== id));
  }

  return (
    <div className="flex flex-col gap-2">
      {fields.map((field) => (
        <div key={field.id} className="flex items-center gap-2">
          <Input
            value={field.name}
            onChange={(e) => updateField(field.id, { name: e.target.value })}
            placeholder="Field name"
            className="flex-1 font-mono text-sm"
            spellCheck={false}
          />
          <Select
            value={field.type}
            onValueChange={(v) => updateField(field.id, { type: v as MockField["type"] })}
          >
            <SelectTrigger size="sm" className="w-32" aria-label="Field type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MOCK_FIELD_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Remove field"
            onClick={() => removeField(field.id)}
          >
            <X className="size-3.5" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-fit"
        onClick={() => onChange([...fields, createEmptyMockField()])}
      >
        <Plus className="size-3.5" />
        Add field
      </Button>
    </div>
  );
}
