export interface XmlToJsonResult {
  ok: boolean;
  output?: string;
  error?: string;
}

function elementToJson(el: Element): unknown {
  const attrs: Record<string, unknown> = {};
  for (const attr of Array.from(el.attributes)) {
    attrs[`@${attr.name}`] = attr.value;
  }

  const childElements = Array.from(el.children);
  const textContent = Array.from(el.childNodes)
    .filter((n) => n.nodeType === Node.TEXT_NODE)
    .map((n) => n.textContent ?? "")
    .join("")
    .trim();

  if (childElements.length === 0) {
    if (Object.keys(attrs).length === 0) return textContent;
    const leaf: Record<string, unknown> = { ...attrs };
    if (textContent) leaf["#text"] = textContent;
    return leaf;
  }

  const result: Record<string, unknown> = { ...attrs };
  for (const child of childElements) {
    const childValue = elementToJson(child);
    const tag = child.tagName;
    if (result[tag] === undefined) {
      result[tag] = childValue;
    } else if (Array.isArray(result[tag])) {
      (result[tag] as unknown[]).push(childValue);
    } else {
      result[tag] = [result[tag], childValue];
    }
  }
  if (textContent) result["#text"] = textContent;
  return result;
}

/** Uses the browser's native DOMParser rather than hand-rolling an XML
 * parser — client-side only (called from event handlers, never at module
 * load, so it's safe to import from a server-rendered component tree). */
export function xmlToJson(xmlText: string): XmlToJsonResult {
  if (xmlText.trim() === "") return { ok: false, error: "Input is empty." };
  if (typeof DOMParser === "undefined") {
    return { ok: false, error: "XML parsing is only available in the browser." };
  }

  const doc = new DOMParser().parseFromString(xmlText, "application/xml");
  const parserError = doc.getElementsByTagName("parsererror")[0];
  if (parserError) {
    return { ok: false, error: parserError.textContent?.trim() || "Invalid XML." };
  }

  const root = doc.documentElement;
  if (!root) return { ok: false, error: "No root element found." };

  const value = { [root.tagName]: elementToJson(root) };
  return { ok: true, output: JSON.stringify(value, null, 2) };
}
