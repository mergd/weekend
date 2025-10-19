import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Weekend Projects - A new project every weekend";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "40px",
          }}
        >
          <div
            style={{
              display: "flex",
              border: "3px solid #a3a3a3",
              padding: "40px 60px",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                fontSize: 72,
                fontWeight: 400,
                color: "#fafafa",
                letterSpacing: "-0.02em",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex" }}>┌─────────────────────┐</div>
              <div style={{ display: "flex", padding: "20px 0" }}>
                │ WEEKEND PROJECTS │
              </div>
              <div style={{ display: "flex" }}>└─────────────────────┘</div>
            </div>
          </div>

          <div
            style={{
              fontSize: 32,
              color: "#737373",
              letterSpacing: "-0.01em",
              display: "flex",
            }}
          >
            █ A new project every weekend
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
