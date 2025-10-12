import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 32,
  height: 32,
};

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
          backgroundColor: "#0a0a0a",
          border: "2px solid #fafafa",
        }}
      >
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#fafafa",
            fontFamily: "monospace",
          }}
        >
          W
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
