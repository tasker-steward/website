import { NextResponse } from "next/server";
import { crmFetch } from "@/lib/crm";

export const runtime = "nodejs";

// Someone opened their personal survey link from an email: tell the CRM, which
// counts it as the click for that email. Never blocks the page.
export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const body = (await req.json().catch(() => ({}))) as { token?: unknown; step?: unknown };
  const token = typeof body.token === "string" ? body.token.slice(0, 64) : "";
  const step = typeof body.step === "string" ? body.step.slice(0, 20) : null;
  if (token.length < 8) return NextResponse.json({ ok: false });
  await crmFetch(`/api/public/surveys/${encodeURIComponent(slug)}/visit`, { method: "POST", body: JSON.stringify({ token, step }) }).catch(() => null);
  return NextResponse.json({ ok: true });
}
