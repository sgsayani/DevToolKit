import { load, dump, YAMLException } from "js-yaml";

export interface YamlResult {
  ok: boolean;
  output?: string;
  error?: string;
}

export function jsonToYaml(jsonText: string): YamlResult {
  if (jsonText.trim() === "") return { ok: false, error: "Input is empty." };

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch (err) {
    return { ok: false, error: err instanceof Error ? `Invalid JSON — ${err.message}` : "Invalid JSON." };
  }

  try {
    return { ok: true, output: dump(parsed, { indent: 2, lineWidth: 100 }) };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Could not convert to YAML." };
  }
}

export function yamlToJson(yamlText: string): YamlResult {
  if (yamlText.trim() === "") return { ok: false, error: "Input is empty." };

  try {
    const parsed = load(yamlText);
    return { ok: true, output: JSON.stringify(parsed, null, 2) };
  } catch (err) {
    if (err instanceof YAMLException) return { ok: false, error: err.message };
    return { ok: false, error: err instanceof Error ? err.message : "Could not parse this YAML." };
  }
}
