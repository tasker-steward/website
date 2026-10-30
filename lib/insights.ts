import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

// Each newsletter issue lives in content/insights/<slug>.md with frontmatter:
// title, description, date (YYYY-MM-DD), and optional draft: true.

const DIR = path.join(process.cwd(), "content", "insights");

export type Insight = {
  slug: string;
  title: string;
  description: string;
  date: string;
  html: string;
  readingMinutes: number;
};

function load(file: string): Insight | null {
  const raw = fs.readFileSync(path.join(DIR, file), "utf8");
  const { data, content } = matter(raw);
  if (data.draft) return null;
  const words = content.split(/\s+/).filter(Boolean).length;
  return {
    slug: file.replace(/\.md$/, ""),
    title: String(data.title ?? ""),
    description: String(data.description ?? ""),
    date: String(data.date ?? ""),
    html: marked.parse(content, { async: false }) as string,
    readingMinutes: Math.max(1, Math.round(words / 230)),
  };
}

export function allInsights(): Insight[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map(load)
    .filter((x): x is Insight => x !== null)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getInsight(slug: string): Insight | undefined {
  return allInsights().find((i) => i.slug === slug);
}

export function formatDate(d: string) {
  const dt = new Date(`${d}T12:00:00Z`);
  return isNaN(dt.getTime()) ? d : dt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}
