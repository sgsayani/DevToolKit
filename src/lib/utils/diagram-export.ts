import { toPng, toSvg } from "html-to-image";
import { getNodesBounds, getViewportForBounds, type Node } from "@xyflow/react";

export interface DiagramExportResult {
  ok: boolean;
  error?: string;
}

const EXPORT_WIDTH = 1400;
const EXPORT_HEIGHT = 900;

/** Excludes React Flow's own UI chrome (minimap, controls, the palette
 * panel, attribution) from the exported image — only the diagram itself
 * should show up. */
function filter(node: HTMLElement): boolean {
  if (!(node instanceof HTMLElement)) return true;
  const cls = node.classList;
  if (!cls) return true;
  return !(
    cls.contains("react-flow__minimap") ||
    cls.contains("react-flow__controls") ||
    cls.contains("react-flow__attribution") ||
    cls.contains("react-flow__panel")
  );
}

function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

/**
 * Captures the whole diagram (not just whatever's currently visible/panned
 * into view) by temporarily computing a transform that fits every node into
 * a fixed-size export frame — the same approach shown in React Flow's own
 * "download image" example, since the library has no built-in exporter.
 */
async function captureDiagram(nodes: Node[], format: "png" | "svg"): Promise<string> {
  if (nodes.length === 0) {
    throw new Error("Add something to the canvas first.");
  }

  const viewportEl = document.querySelector<HTMLElement>(".react-flow__viewport");
  if (!viewportEl) {
    throw new Error("Could not find the diagram canvas.");
  }

  const bounds = getNodesBounds(nodes);
  const viewport = getViewportForBounds(bounds, EXPORT_WIDTH, EXPORT_HEIGHT, 0.2, 2, 0.1);

  const options = {
    backgroundColor: "#ffffff",
    width: EXPORT_WIDTH,
    height: EXPORT_HEIGHT,
    filter,
    style: {
      width: `${EXPORT_WIDTH}px`,
      height: `${EXPORT_HEIGHT}px`,
      transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
    },
  };

  return format === "png" ? toPng(viewportEl, options) : toSvg(viewportEl, options);
}

export async function exportDiagram(
  nodes: Node[],
  format: "png" | "svg",
  filename: string,
): Promise<DiagramExportResult> {
  try {
    const dataUrl = await captureDiagram(nodes, format);
    downloadDataUrl(dataUrl, filename);
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : `Could not export this diagram as ${format.toUpperCase()}.`,
    };
  }
}
