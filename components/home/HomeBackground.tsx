export default function HomeBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute rounded-full"
        style={{
          width: '55vw',
          height: '55vw',
          left: '-15vw',
          top: '-18vh',
          background: 'radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 68%)',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: '45vw',
          height: '45vw',
          right: '-12vw',
          top: '8vh',
          background: 'radial-gradient(circle, rgba(99,102,241,0.09) 0%, transparent 68%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          opacity: 0.05,
        }}
      />
    </div>
  );
}
