// Calls from this site's server to the T&S CRM, which is the system of record
// for surveys and leads. Authenticated with CRM_LEAD_WEBHOOK_SECRET (the
// CRM's WEBSITE_LEAD_SECRET). The CRM's address comes from
// CRM_LEAD_WEBHOOK_URL, so no new setting is needed.

export type SurveyQuestion = { id: string; question: string; type: "single" | "multiple" | "text"; options: string[]; required: boolean };
export type Survey = {
  slug: string;
  title: string;
  intro: string | null;
  thankYou: string | null;
  open: boolean;
  closesAt: string | null;
  raffle: { enabled: boolean; prize: string | null; rulesUrl: string | null };
  questions: SurveyQuestion[];
};

function crm(): { origin: string; secret: string } | null {
  const url = process.env.CRM_LEAD_WEBHOOK_URL;
  const secret = process.env.CRM_LEAD_WEBHOOK_SECRET;
  if (!url || !secret) return null;
  return { origin: new URL(url).origin, secret };
}

export async function crmFetch(path: string, init: RequestInit = {}): Promise<Response | null> {
  const c = crm();
  if (!c) return null;
  return fetch(`${c.origin}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${c.secret}`, "Content-Type": "application/json", ...(init.headers ?? {}) },
  });
}

/** The live survey, refreshed at most once a minute. Null when missing or a draft. */
export async function getSurvey(slug: string): Promise<Survey | null> {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) return null;
  const res = await crmFetch(`/api/public/surveys/${slug}`, { next: { revalidate: 60, tags: [`survey:${slug}`] } } as RequestInit);
  if (!res || !res.ok) return null;
  return (await res.json()) as Survey;
}

export function closeDate(iso: string | null): string | null {
  return iso ? new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "America/New_York" }) : null;
}
