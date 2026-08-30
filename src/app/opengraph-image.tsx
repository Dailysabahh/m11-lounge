import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "M11 Snooker & Shisha Lounge — Opening Soon";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logo = await readFile(join(process.cwd(), "public/brand/logo.png"));
  const src = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#050505",
          backgroundImage:
            "radial-gradient(ellipse at center, rgba(201,162,39,0.28), transparent 58%)",
        }}
      >
        <img
          src={src}
          width={280}
          height={280}
          style={{ borderRadius: "999px" }}
        />
        <div
          style={{
            marginTop: 28,
            fontSize: 64,
            letterSpacing: "0.18em",
            color: "#e8d48b",
            fontWeight: 600,
          }}
        >
          M11 LOUNGE
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 22,
            letterSpacing: "0.42em",
            color: "#c9a227",
            textTransform: "uppercase",
          }}
        >
          Opening soon · Osogbo
        </div>
      </div>
    ),
    { ...size },
  );
}
