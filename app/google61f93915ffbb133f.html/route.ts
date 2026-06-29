export const runtime = 'edge';

export function GET() {
  return new Response('google-site-verification: google61f93915ffbb133f.html', {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
