export const config = { matcher: ['/((?!_vercel|.*\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff2?|ttf|otf|css|js|json|txt)$).*)'] };
export default function middleware(req) {
  const auth = req.headers.get('authorization') || '';
  const [scheme, encoded] = auth.split(' ');
  if (scheme === 'Basic' && encoded) {
    try {
      const decoded = atob(encoded);
      const colon = decoded.indexOf(':');
      if (colon !== -1 && decoded.slice(colon + 1) === 'Karim_njm') {
        return; // pass through to static file
      }
    } catch (_) {}
  }
  return new Response('Zugang verweigert', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Privat"',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
