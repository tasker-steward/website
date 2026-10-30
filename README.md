# Tasker & Steward website

The public site for taskerandsteward.com: the landing page and the free Role Report request form.

## Stack
Next.js 15 (App Router) on Vercel. Fonts are self-hosted from `@fontsource`. GA4 is loaded on every page (`G-05639XJBEN`, override with `NEXT_PUBLIC_GA_ID`).

## Run locally
```
npm install
npm run dev
```

## Role Report form
The form posts to `/api/role-report`, which:
1. Forwards the request to the CRM if `CRM_LEAD_WEBHOOK_URL` is set (creates a Lead with source "Website Form" and the SMS consent record).
2. Emails the team through Resend if `RESEND_API_KEY` is set (`NOTIFY_EMAIL`, `FROM_EMAIL`).

At least one of the two must be configured or the form returns an error. See `.env.example`.

A successful submit fires the GA4 `generate_lead` event (mark it as a key event in GA4).

## Pages
- `/` landing page
- `/privacy` Privacy Policy
- `/sms-terms` SMS Terms (needed for Twilio A2P 10DLC registration)
