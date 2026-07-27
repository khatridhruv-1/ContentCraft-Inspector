import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'BlogCreator — Humanized Content for Every Platform';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '72px 80px',
          background: 'linear-gradient(135deg, #f8fafc 0%, #ccfbf1 45%, #e0f2fe 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            marginBottom: 32,
          }}
        >
          <svg width="56" height="56" viewBox="0 0 32 32" aria-hidden>
            <rect width="32" height="32" rx="8" fill="#0f766e" />
            <rect x="9" y="7" width="14" height="18" rx="2.5" fill="#ffffff" />
            <path
              d="M12 11.5h8"
              stroke="#0f766e"
              strokeOpacity="0.35"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M12 14.5h6"
              stroke="#0f766e"
              strokeOpacity="0.35"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M12.5 21C14.5 17.5 18 13.5 22 10"
              stroke="#0d9488"
              strokeWidth="2.25"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="12.5" cy="21" r="1.5" fill="#0f172a" />
          </svg>
          <span style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-0.025em' }}>
            <span style={{ color: '#0f172a' }}>Blog</span>
            <span style={{ color: '#0f766e' }}>Creator</span>
          </span>
        </div>

        <div
          style={{
            fontSize: 56,
            fontWeight: 900,
            color: '#0f172a',
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            maxWidth: 900,
          }}
        >
          Content that sounds like a person wrote it
        </div>

        <div
          style={{
            marginTop: 28,
            fontSize: 26,
            color: '#475569',
            lineHeight: 1.45,
            maxWidth: 820,
          }}
        >
          Humanized drafts for every platform — keyword discovery and SEO analysis included.
        </div>

        <div
          style={{
            marginTop: 40,
            display: 'flex',
            gap: 12,
          }}
        >
          {['Free for everyone', '5 platforms', 'Human voice'].map(label => (
            <div
              key={label}
              style={{
                padding: '10px 20px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.85)',
                border: '1px solid #e2e8f0',
                fontSize: 18,
                fontWeight: 600,
                color: '#334155',
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
