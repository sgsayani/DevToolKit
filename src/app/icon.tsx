import { ImageResponse } from "next/og";

// Generated favicon — the same "D" mark shown in the top nav, in the app's
// indigo accent color (#305eb7, matching --primary in globals.css), so the
// browser tab matches the product instead of using Next.js's default icon.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#305eb7",
          color: "#ffffff",
          fontSize: 20,
          fontWeight: 700,
          fontFamily: "system-ui, sans-serif",
          borderRadius: 7,
        }}
      >
        D
      </div>
    ),
    { ...size },
  );
}
