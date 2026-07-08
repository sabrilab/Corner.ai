import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#7c3aed",
        }}
      >
        <div
          style={{
            fontSize: 108,
            fontWeight: 800,
            color: "white",
            letterSpacing: -4,
          }}
        >
          c
        </div>
      </div>
    ),
    { ...size }
  );
}
