import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Tasker & Steward: Still hiring like it's 2019? Get a free Role Report.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const font = (pkg: string, file: string) => readFile(join(process.cwd(), "node_modules/@fontsource", pkg, "files", file));

export default async function OgImage() {
  const [caslon, caslonItalic, franklin] = await Promise.all([
    font("libre-caslon-text", "libre-caslon-text-latin-400-normal.woff"),
    font("libre-caslon-text", "libre-caslon-text-latin-400-italic.woff"),
    font("libre-franklin", "libre-franklin-latin-600-normal.woff"),
  ]);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#14243A", color: "#F4EFE4", padding: "56px 72px", fontFamily: "Franklin" }}>
        <div style={{ display: "flex", fontFamily: "Caslon", fontSize: 40, gap: 12 }}>
          <span>Tasker</span>
          <span style={{ fontFamily: "CaslonItalic", color: "#D4A5A0" }}>&amp;</span>
          <span>Steward</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 22, letterSpacing: 4, textTransform: "uppercase", color: "#D4A5A0" }}>AI staffing with human accountability</div>
          <div style={{ display: "flex", flexDirection: "column", fontFamily: "Caslon", fontSize: 96, lineHeight: 1.04, marginTop: 18 }}>
            <span>Still hiring</span>
            <span style={{ display: "flex", gap: 22 }}>
              <span>like it's</span>
              <span style={{ fontFamily: "CaslonItalic", color: "#D4A5A0" }}>2019?</span>
            </span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 28, color: "#D9DEE6", maxWidth: 640 }}>See which duties in your job posting an AI agent can handle.</div>
          <div style={{ display: "flex", flexShrink: 0, whiteSpace: "nowrap", background: "#6E1F24", borderRadius: 999, padding: "18px 30px", fontSize: 26 }}>Get a free Role Report</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Caslon", data: caslon, style: "normal", weight: 400 },
        { name: "CaslonItalic", data: caslonItalic, style: "italic", weight: 400 },
        { name: "Franklin", data: franklin, style: "normal", weight: 600 },
      ],
    }
  );
}
