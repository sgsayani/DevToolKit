export interface TableColumn {
  id: string;
  name: string;
  type: string;
  isPrimaryKey: boolean;
}

export interface TableNodeData {
  name: string;
  columns: TableColumn[];
  // Index signature so this satisfies React Flow's `Node<T extends Record<string, unknown>>` constraint.
  [key: string]: unknown;
}

export interface RelationshipData {
  sourceColumn: string;
  targetColumn: string;
  [key: string]: unknown;
}

export const COLUMN_TYPE_SUGGESTIONS = [
  "integer",
  "bigint",
  "varchar",
  "text",
  "boolean",
  "timestamp",
  "date",
  "numeric",
  "uuid",
  "json",
];

export function createEmptyColumn(): TableColumn {
  return { id: crypto.randomUUID(), name: "", type: "varchar", isPrimaryKey: false };
}

export function createDefaultTableData(name: string): TableNodeData {
  return {
    name,
    columns: [{ id: crypto.randomUUID(), name: "id", type: "integer", isPrimaryKey: true }],
  };
}

export function relationshipLabel(
  sourceTableName: string,
  data: RelationshipData,
  targetTableName: string,
): string {
  return `${sourceTableName}.${data.sourceColumn} → ${targetTableName}.${data.targetColumn}`;
}
