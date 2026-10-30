type IconProps = { size?: number; stroke?: string; strokeWidth?: number; ring?: boolean };

const GEAR =
  "M36.0 20.5 L36.3 21.8 L39.4 22.2 L39.4 25.8 L36.3 26.2 L35.8 28.2 L35.3 29.4 L37.5 31.6 L35.4 34.5 L32.6 33.0 L31.0 34.3 L29.9 35.0 L30.5 38.1 L27.0 39.2 L25.7 36.4 L23.6 36.5 L22.3 36.4 L21.0 39.2 L17.5 38.1 L18.1 35.0 L16.3 33.9 L15.4 33.0 L12.6 34.5 L10.5 31.6 L12.7 29.4 L12.0 27.5 L11.7 26.2 L8.6 25.8 L8.6 22.2 L11.7 21.8 L12.2 19.8 L12.7 18.6 L10.5 16.4 L12.6 13.5 L15.4 15.0 L17.0 13.7 L18.1 13.0 L17.5 9.9 L21.0 8.8 L22.3 11.6 L24.4 11.5 L25.7 11.6 L27.0 8.8 L30.5 9.9 L29.9 13.0 L31.7 14.1 L32.6 15.0 L35.4 13.5 L37.5 16.4 L35.3 18.6 Z";

/** The Steward mark: a key, for the person who holds responsibility. */
export function StewardIcon({ size = 48, stroke = "#D4A5A0", strokeWidth = 1.6, ring = true }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="24" cy="24" r="22.5" />
      {ring && <circle cx="24" cy="24" r="20.5" strokeWidth={0.8} />}
      <circle cx="16" cy="24" r="6" />
      {ring && <circle cx="16" cy="24" r="2.4" />}
      {ring && <path d="M31.5 24 V28 H33.5 V24" />}
      <path d="M22 24 H36" />
      <path d="M36 24 V29" />
    </svg>
  );
}

/** The agent mark: a gear. */
export function AgentIcon({ size = 48, stroke = "#F4EFE4", strokeWidth = 1.6, ring = true }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" aria-hidden="true">
      <circle cx="24" cy="24" r="22.5" />
      {ring && <circle cx="24" cy="24" r="20.5" strokeWidth={0.8} />}
      <path d={GEAR} />
      {ring && <circle cx="24" cy="24" r="4.5" />}
    </svg>
  );
}

export function RoleDocIcon({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="#8A6A2F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="24" cy="24" r="22.5" />
      <circle cx="24" cy="24" r="20.5" strokeWidth="0.8" />
      <path d="M17 12 H27 L32 17 V36 H17 Z" />
      <path d="M27 12 V17 H32" />
      <path d="M20.5 22 H28.5" />
      <path d="M20.5 26 H28.5" />
      <path d="M20.5 30 H25.5" />
    </svg>
  );
}

export function TrialIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 48 48" fill="none" stroke="#C9D2E0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="24" cy="24" r="22.5" />
      <circle cx="24" cy="24" r="20.5" strokeWidth="0.8" />
      <rect x="14" y="16" width="20" height="18" rx="2" />
      <path d="M29 13v5M19 13v5M14 22h20" />
      <path d="M20 28l3 3 5-5" />
    </svg>
  );
}

export function RetrainIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 48 48" fill="none" stroke="#C9D2E0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="24" cy="24" r="22.5" />
      <circle cx="24" cy="24" r="20.5" strokeWidth="0.8" />
      <path d="M34 24a10 10 0 0 1-17.2 6.9" />
      <path d="M14 24a10 10 0 0 1 17.2-6.9" />
      <path d="M31.5 13.5v4h-4" />
      <path d="M16.5 34.5v-4h4" />
    </svg>
  );
}

export function ArrowIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#6E1F24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}
