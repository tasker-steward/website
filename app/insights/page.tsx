import type { Metadata } from "next";
import LegalHeader from "../components/LegalHeader";
import SiteFooter from "../components/SiteFooter";
import NewsletterSignup from "../components/NewsletterSignup";
import { allInsights, formatDate } from "@/lib/insights";

const posts = allInsights();

export const metadata: Metadata = {
  title: "Insights: AI, hiring and the trades",
  description:
    "Monthly, plain-English notes for business owners on AI's impact on hiring, the latest job reports, industry trends, and where AI agents can support the people on your team.",
  alternates: { canonical: "/insights" },
  // Stay out of search results until the first issue is published.
  robots: posts.length ? { index: true, follow: true } : { index: false, follow: true },
};

export default function InsightsIndex() {
  return (
    <>
      <LegalHeader />
      <main id="main" className="insights">
        <header className="insights-head">
          <p className="eyebrow">Tasker &amp; Steward Monthly</p>
          <h1>AI, hiring and the trades, in plain English.</h1>
          <p className="lead">
            Once a month: what AI is changing about hiring, what the latest job reports mean for owners, industry trends worth knowing, and where an AI agent can take work off your team.
          </p>
          <div className="insights-signup">
            <NewsletterSignup />
          </div>
        </header>

        {posts.length === 0 ? (
          <p className="insights-empty">The first issue is on its way. Subscribe above and it will land in your inbox.</p>
        ) : (
          <ol className="post-list">
            {posts.map((p) => (
              <li key={p.slug}>
                <a href={`/insights/${p.slug}`}>
                  <time dateTime={p.date}>{formatDate(p.date)}</time>
                  <h2>{p.title}</h2>
                  <p>{p.description}</p>
                </a>
              </li>
            ))}
          </ol>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
