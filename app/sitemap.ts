import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const UPDATED = new Date("2026-10-29");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, lastModified: UPDATED, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/privacy`, lastModified: UPDATED, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/sms-terms`, lastModified: UPDATED, changeFrequency: "yearly", priority: 0.2 },
  ];
}
