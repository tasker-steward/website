import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GiftCard from "../../components/GiftCard";
import LegalHeader from "../../components/LegalHeader";
import SiteFooter from "../../components/SiteFooter";
import { closeDate, getSurvey } from "@/lib/crm";
import SurveyForm from "./SurveyForm";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const survey = await getSurvey((await params).slug);
  if (!survey) return { title: "Survey", robots: { index: false } };
  return {
    title: survey.title,
    description: survey.intro ?? `A short survey from Tasker & Steward.`,
    alternates: { canonical: `/survey/${survey.slug}` },
    robots: { index: false, follow: true },
  };
}

// Surveys are built in the T&S CRM; this page renders whatever is live there.
export default async function SurveyPage({ params }: Params) {
  const survey = await getSurvey((await params).slug);
  if (!survey) notFound();
  const closes = closeDate(survey.closesAt);
  const rulesUrl = survey.raffle.rulesUrl || `/survey/${survey.slug}/rules`;
  return (
    <>
      <LegalHeader />
      <main className="survey">
        <header className="survey-head">
          <p className="eyebrow">A Tasker &amp; Steward survey</p>
          <h1>{survey.title}</h1>
          {survey.intro && <p className="survey-intro">{survey.intro}</p>}
          {survey.raffle.enabled && survey.open && (
            <div className="survey-raffle">
              <GiftCard prize={survey.raffle.prize ?? "$100 Gift Card"} />
              <p>
                Finish the survey and you can enter the drawing for a {survey.raffle.prize ?? "gift card"}. No purchase necessary.{" "}
                <a href={rulesUrl}>Official rules</a>.
              </p>
            </div>
          )}
          <p className="survey-run-by">
            This survey is run by Tasker &amp; Steward LLC. Your answers are used for our research and the results report, never sold. See our <a href="/privacy">Privacy Policy</a>.
            {closes && survey.open ? ` Closes ${closes}.` : ""}
          </p>
        </header>
        {survey.open ? (
          <SurveyForm survey={survey} rulesUrl={rulesUrl} />
        ) : (
          <section className="survey-card">
            <h2>This survey is closed</h2>
            <p>Thank you for your interest. If you took part, the results report is on its way.</p>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
