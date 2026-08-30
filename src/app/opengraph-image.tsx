import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION } from "@/lib/site-config";

// Generated social-sharing image — same "D" mark and indigo accent as the
// app itself (icon.tsx, top nav), not stock art or generic AI imagery.
export const alt = "DevKit — Practical tools for developers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "#fafafa",
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 84,
              height: 84,
              borderRadius: 18,
              background: "#305eb7",
              color: "#ffffff",
              fontSize: 44,
              fontWeight: 700,
            }}
          >
            D
          </div>
          <div style={{ fontSize: 64, fontWeight: 700, color: "#111111", letterSpacing: -1 }}>
            DevKit
          </div>
        </div>
        <div style={{ marginTop: 36, fontSize: 30, color: "#4b5563", maxWidth: 820 }}>
          {SITE_DESCRIPTION}
        </div>
      </div>
    ),
    { ...size },
  );
}
