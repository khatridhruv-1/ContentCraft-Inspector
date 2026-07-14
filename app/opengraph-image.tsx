import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'BlogCreator — Free AI Blog Generator & SEO Tool';
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
          background: 'linear-gradient(135deg, #f8fafc 0%, #ede9fe 45%, #e0f2fe 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: '#7c3aed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 28,
              fontWeight: 800,
            }}
          >
            B
          </div>
          <span style={{ fontSize: 28, fontWeight: 700, color: '#0f172a' }}>BlogCreator</span>
        </div>

        <div
          style={{
            fontSize: 64,
            fontWeight: 900,
            color: '#0f172a',
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            maxWidth: 900,
          }}
        >
          The AI Blog Generator That Ranks and Converts
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
          Platform-based drafts, keyword discovery, deep SEO analysis — plus MCP, skill, and API
          integrations.
        </div>

        <div
          style={{
            marginTop: 40,
            display: 'flex',
            gap: 12,
          }}
        >
          {['Free for everyone', '5 platforms', 'MCP + API'].map(label => (
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
