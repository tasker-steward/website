import type { Metadata, Viewport } from "next";
import "@fontsource/libre-caslon-text/latin-400.css";
import "@fontsource/libre-caslon-text/latin-400-italic.css";
import "@fontsource/libre-caslon-text/latin-700.css";
import "@fontsource/libre-franklin/latin-400.css";
import "@fontsource/libre-franklin/latin-500.css";
import "@fontsource/libre-franklin/latin-600.css";
import "@fontsource/libre-franklin/latin-700.css";
import Script from "next/script";
import "./globals.css";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-05639XJBEN";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://taskerandsteward.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Tasker & Steward | AI staffing with human accountability",
  description:
    "Most job descriptions were written before AI could do any of the work. Send us a role you're hiring for and get a free Role Report: what an AI agent can carry, what still needs a person, and what each option costs.",
  openGraph: {
    title: "Still hiring like it's 2019? | Tasker & Steward",
    description:
      "Get a free Role Report. We break your job posting down duty by duty and show what an AI agent can handle, managed by a real person on our team.",
    url: SITE_URL,
    siteName: "Tasker & Steward",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#14243A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="ga4" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
        </Script>
      </body>
    </html>
  );
}
