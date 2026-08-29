"use client";

import { useState } from "react";
import type { Connection } from "@xyflow/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TableFlowNode } from "@/components/tools/schema-visualizer/table-node";

interface RelationshipPickerProps {
  connection: Connection | null;
  nodes: TableFlowNode[];
  onConfirm: (sourceColumn: string, targetColumn: string) => void;
  onCancel: () => void;
}

function PickerContent({
  connection,
  nodes,
  onConfirm,
  onCancel,
}: {
  connection: Connection;
  nodes: TableFlowNode[];
  onConfirm: (sourceColumn: string, targetColumn: string) => void;
  onCancel: () => void;
}) {
  const sourceTable = nodes.find((n) => n.id === connection.source);
  const targetTable = nodes.find((n) => n.id === connection.target);
  const [sourceColumn, setSourceColumn] = useState(sourceTable?.data.columns[0]?.name ?? "");
  const [targetColumn, setTargetColumn] = useState(
    targetTable?.data.columns.find((c) => c.isPrimaryKey)?.name ??
      targetTable?.data.columns[0]?.name ??
      "",
  );

  if (!sourceTable || !targetTable) return null;

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Define relationship</DialogTitle>
        <DialogDescription>
          <span className="font-mono">{sourceTable.data.name}</span> references{" "}
          <span className="font-mono">{targetTable.data.name}</span>
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">
            Foreign key column on <span className="font-mono">{sourceTable.data.name}</span>
          </Label>
          <Select value={sourceColumn} onValueChange={setSourceColumn}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sourceTable.data.columns.map((c) => (
                <SelectItem key={c.id} value={c.name || c.id}>
                  {c.name || "(unnamed)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">
            Referenced column on <span className="font-mono">{targetTable.data.name}</span>
          </Label>
          <Select value={targetColumn} onValueChange={setTargetColumn}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {targetTable.data.columns.map((c) => (
                <SelectItem key={c.id} value={c.name || c.id}>
                  {c.name || "(unnamed)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <DialogFooter>
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={() => onConfirm(sourceColumn, targetColumn)} disabled={!sourceColumn || !targetColumn}>
          Add relationship
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

/** Opened when the user drags a connection between two tables — asks which
 * column is the foreign key and which is referenced, rather than adding an
 * unlabeled edge. Keyed by the connection so switching to a new pending
 * connection resets the selects via remount instead of an effect. */
export function RelationshipPicker({ connection, nodes, onConfirm, onCancel }: RelationshipPickerProps) {
  return (
    <Dialog
      open={connection !== null}
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
    >
      {connection && (
        <PickerContent
          key={`${connection.source}-${connection.target}-${connection.sourceHandle}-${connection.targetHandle}`}
          connection={connection}
          nodes={nodes}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      )}
    </Dialog>
  );
}
