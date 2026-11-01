"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Survey } from "@/lib/crm";

const SIZES = ["1 to 10", "11 to 50", "51 to 200", "201 to 500", "Over 500"];
// Same list as the Role Report form.
const INDUSTRIES = ["Home services", "Healthcare", "Legal", "Professional services", "Finance and insurance", "Real estate", "Manufacturing", "Retail", "Hospitality", "Technology", "Nonprofit", "Other"];
type Answer = string | string[];

// One question per screen on phones and desktops alike, then the contact
// block. The progress bar counts the questions plus the contact step.
export default function SurveyForm({ survey, rulesUrl }: { survey: Survey; rulesUrl: string }) {
  const qs = survey.questions;
  const total = qs.length + 1;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [problem, setProblem] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const tracking = useRef<Record<string, string>>({});
  const heading = useRef<HTMLHeadingElement>(null);

  // The personal link from an email (?t=…&utm_content=step1) counts as a click.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const keys = ["t", "utm_source", "utm_medium", "utm_campaign", "utm_content"];
    tracking.current = Object.fromEntries(keys.map((k) => [k, p.get(k) ?? ""]).filter(([, v]) => v));
    const token = p.get("t");
    if (token && token !== "test") {
      void fetch(`/api/survey/${survey.slug}/visit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, step: p.get("utm_content") }),
        keepalive: true,
      }).catch(() => undefined);
    }
  }, [survey.slug]);

  useEffect(() => {
    if (step > 0) heading.current?.focus();
  }, [step]);

  const q = step < qs.length ? qs[step] : null;
  const value = q ? answers[q.id] : undefined;
  const answered = (a: Answer | undefined) => (Array.isArray(a) ? a.length > 0 : Boolean(a && a.trim()));

  function next() {
    if (q && q.required && !answered(value)) {
      setProblem(q.type === "multiple" ? "Choose at least one answer to continue." : "Choose an answer to continue.");
      return;
    }
    setProblem("");
    setStep(step + 1);
  }

  function toggle(option: string) {
    if (!q) return;
    const current = Array.isArray(value) ? value : [];
    setAnswers({ ...answers, [q.id]: current.includes(option) ? current.filter((x) => x !== option) : [...current, option] });
    setProblem("");
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step < qs.length) return next();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch(`/api/survey/${survey.slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          name: data.name,
          email: data.email,
          company: data.company,
          title: data.title,
          company_size: data.company_size,
          industry: data.industry,
          wants_report: data.wants_report === "on",
          raffle_entry: data.raffle_entry === "on",
          marketing_consent: data.marketing_consent === "on",
          website: data.website,
          token: tracking.current.t,
          utm_source: tracking.current.utm_source,
          utm_medium: tracking.current.utm_medium,
          utm_campaign: tracking.current.utm_campaign,
          utm_content: tracking.current.utm_content,
        }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string; problems?: string[] };
      if (!res.ok) throw new Error([body.error, ...(body.problems ?? [])].filter(Boolean).join(" ") || "Something went wrong.");
      setStatus("sent");
      const w = window as unknown as { gtag?: (...args: unknown[]) => void };
      w.gtag?.("event", "survey_complete", { survey: survey.slug, raffle: data.raffle_entry === "on", source: tracking.current.utm_content || "direct" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't save your answers. Please try again.");
      setStatus("idle");
    }
  }

  if (status === "sent") {
    return (
      <section className="survey-card" aria-live="polite">
        <h2>Thank you</h2>
        <p>{survey.thankYou || "Your answers are in. We'll email you the results report when the survey closes."}</p>
        <p>
          <a href="/">Visit Tasker &amp; Steward</a>
        </p>
      </section>
    );
  }

  const pct = Math.round((step / total) * 100);
  return (
    <form className="survey-card" onSubmit={onSubmit} noValidate={step < qs.length}>
      <div className="survey-progress" role="progressbar" aria-label="Survey progress" aria-valuemin={0} aria-valuemax={total} aria-valuenow={step} aria-valuetext={`Step ${Math.min(step + 1, total)} of ${total}`}>
        <span style={{ width: `${pct}%` }} />
      </div>
      <p className="survey-step">{q ? `Question ${step + 1} of ${qs.length}` : "Last step"}</p>

      {q ? (
        <fieldset className="survey-q" key={q.id}>
          <legend>
            <h2 ref={heading} tabIndex={-1}>
              {q.question}
            </h2>
            {q.type === "multiple" && <span className="survey-hint">Select all that apply.</span>}
            {!q.required && <span className="survey-hint">Optional.</span>}
          </legend>
          {q.type === "text" ? (
            <label className="field">
              <span className="sr-only">Your answer</span>
              <textarea value={typeof value === "string" ? value : ""} maxLength={2000} onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })} />
            </label>
          ) : (
            <div className="survey-options">
              {q.options.map((o) => {
                const checked = q.type === "single" ? value === o : Array.isArray(value) && value.includes(o);
                return (
                  <label key={o} className={`survey-option${checked ? " is-on" : ""}`}>
                    <input
                      type={q.type === "single" ? "radio" : "checkbox"}
                      name={q.id}
                      value={o}
                      checked={checked}
                      onChange={() => (q.type === "single" ? (setAnswers({ ...answers, [q.id]: o }), setProblem("")) : toggle(o))}
                    />
                    <span>{o}</span>
                  </label>
                );
              })}
            </div>
          )}
          {problem && (
            <p className="form-error" role="alert">
              {problem}
            </p>
          )}
        </fieldset>
      ) : (
        <fieldset className="survey-q">
          <legend>
            <h2 ref={heading} tabIndex={-1}>
              Where should we send the results?
            </h2>
          </legend>
          <p className="survey-hint">Only your work email is required.</p>
          <div className="row survey-row">
            <label className="field">
              Name
              <input name="name" autoComplete="name" maxLength={120} />
            </label>
            <label className="field">
              Work email
              <input name="email" type="email" autoComplete="email" required maxLength={254} />
            </label>
          </div>
          <div className="row survey-row">
            <label className="field">
              Company
              <input name="company" autoComplete="organization" maxLength={200} />
            </label>
            <label className="field">
              Role or title
              <input name="title" autoComplete="organization-title" maxLength={120} />
            </label>
          </div>
          <div className="row survey-row">
            <label className="field">
              Industry
              <select name="industry" defaultValue="">
                <option value="">Choose…</option>
                {INDUSTRIES.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              Company size
              <select name="company_size" defaultValue="">
                <option value="">Choose…</option>
                {SIZES.map((s) => (
                  <option key={s} value={s}>
                    {s} employees
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="consent">
            <input type="checkbox" name="wants_report" defaultChecked />
            <span>Send me the results report.</span>
          </label>
          {survey.raffle.enabled && (
            <label className="consent">
              <input type="checkbox" name="raffle_entry" />
              <span>
                Enter me in the {survey.raffle.prize ?? "gift card"} drawing. No purchase necessary. <a href={rulesUrl}>Official rules</a>.
              </span>
            </label>
          )}
          <label className="consent">
            <input type="checkbox" name="marketing_consent" />
            <span>Also send me the Tasker &amp; Steward monthly email. Unsubscribe any time.</span>
          </label>
          <div className="hp" aria-hidden="true">
            <label>
              Website <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
        </fieldset>
      )}

      <div className="survey-nav">
        {step > 0 && (
          <button type="button" className="btn survey-back" onClick={() => (setProblem(""), setStep(step - 1))}>
            Back
          </button>
        )}
        <button type="submit" className="btn btn-red submit" disabled={status === "sending"}>
          {q ? "Next" : status === "sending" ? "Sending…" : "Submit"}
        </button>
      </div>
    </form>
  );
}
