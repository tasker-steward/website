// "$100 Gift Card" in T&S navy and oxblood. No retailer logo or card artwork.
export default function GiftCard({ prize = "$100 Gift Card" }: { prize?: string }) {
  const amount = prize.match(/\$\s?\d[\d,]*/)?.[0]?.replace(/\s/g, "") ?? "";
  const rest = amount ? prize.replace(amount, "").trim() : prize;
  return (
    <svg className="giftcard" viewBox="0 0 320 200" role="img" aria-label={prize}>
      <defs>
        <linearGradient id="gc-navy" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1c2f48" />
          <stop offset="1" stopColor="#0f1b2c" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="318" height="198" rx="16" fill="url(#gc-navy)" stroke="#d9c08a" strokeWidth="2" />
      <rect x="1" y="140" width="318" height="20" fill="#6e1f24" />
      <rect x="236" y="1" width="20" height="198" fill="#6e1f24" />
      <text x="24" y="44" fill="#f4efe4" fontFamily="Libre Caslon Text, Georgia, serif" fontSize="17">
        Tasker <tspan fontStyle="italic" fill="#d4a5a0">&amp;</tspan> Steward
      </text>
      {amount && (
        <text x="24" y="104" fill="#f4efe4" fontFamily="Libre Caslon Text, Georgia, serif" fontSize="48">
          {amount}
        </text>
      )}
      <text x="24" y={amount ? 128 : 104} fill="#d9c08a" fontFamily="Libre Caslon Text, Georgia, serif" fontSize={amount ? 18 : 28}>
        {rest || "Gift Card"}
      </text>
      <text x="24" y="186" fill="#b9c0cc" fontFamily="Libre Franklin, Arial, sans-serif" fontSize="10" letterSpacing="1.5">
        SURVEY DRAWING
      </text>
    </svg>
  );
}
