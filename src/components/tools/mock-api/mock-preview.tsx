"use client";

import { useMemo } from "react";
import { JsonTreeView } from "@/components/tools/api-client/json-tree-view";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { generateMockData, type MockField, type MockResponseShape } from "@/lib/utils/mock-data";

interface MockPreviewProps {
  fields: MockField[];
  recordCount: number;
  responseShape: MockResponseShape;
}

export function MockPreview({ fields, recordCount, responseShape }: MockPreviewProps) {
  const hasNamedFields = fields.some((f) => f.name.trim());
  // generateMockData is randomized — computing it during the server render
  // would produce different values than the client's first render and
  // trigger a hydration mismatch, so the real data only renders post-mount.
  const hasMounted = useHasMounted();
  const data = useMemo(
    () => generateMockData(fields, recordCount, responseShape),
    [fields, recordCount, responseShape],
  );

  return (
    <div className="rounded-lg border border-border p-3">
      {!hasNamedFields ? (
        <p className="text-sm text-muted-foreground">
          Add at least one named field above to preview sample data.
        </p>
      ) : !hasMounted ? (
        <p className="text-sm text-muted-foreground">Generating preview…</p>
      ) : (
        <JsonTreeView data={data} />
      )}
    </div>
  );
}
