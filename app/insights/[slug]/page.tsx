import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LegalHeader from "../../components/LegalHeader";
import SiteFooter from "../../components/SiteFooter";
import NewsletterSignup from "../../components/NewsletterSignup";
import JsonLd from "../../components/JsonLd";
import { allInsights, formatDate, getInsight } from "@/lib/insights";
import { SITE_URL, organizationJsonLd } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return allInsights().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getInsight(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/insights/${post.slug}` },
    openGraph: { type: "article", title: post.title, description: post.description, url: `/insights/${post.slug}`, publishedTime: post.date },
  };
}

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getInsight(slug);
  if (!post) notFound();
  const url = `${SITE_URL}/insights/${post.slug}`;

  return (
    <>
      <LegalHeader />
      <main id="main" className="article">
        <a className="back" href="/insights">
          ← All issues
        </a>
        <p className="eyebrow">Tasker &amp; Steward Monthly</p>
        <h1>{post.title}</h1>
        <p className="article-meta">
          <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.readingMinutes} min read
        </p>
        <div className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />
        <aside className="article-cta">
          <h2>Get the next issue</h2>
          <p>One short, practical email a month on AI, hiring and the trades.</p>
          <NewsletterSignup />
          <p className="article-rr">
            Hiring for a role right now? <a href="/#join">Get a free Role Report</a> and see which duties an AI agent can take off the job.
          </p>
        </aside>
      </main>
      <SiteFooter />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            organizationJsonLd(),
            {
              "@type": "Article",
              "@id": `${url}#article`,
              headline: post.title,
              description: post.description,
              datePublished: post.date,
              dateModified: post.date,
              mainEntityOfPage: url,
              url,
              author: { "@type": "Organization", name: "Tasker & Steward", url: SITE_URL },
              publisher: { "@id": `${SITE_URL}/#organization` },
              isPartOf: { "@type": "CreativeWorkSeries", name: "Tasker & Steward Monthly", url: `${SITE_URL}/insights` },
              image: `${SITE_URL}/opengraph-image`,
            },
          ],
        }}
      />
    </>
  );
}
