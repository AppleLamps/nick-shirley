import { NextRequest, NextResponse } from 'next/server';

const ADMIN_COOKIE = 'admin_session';
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 60000);
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX || 30);

const rateLimitStore = new Map<string, { count: number; reset: number }>();
const encoder = new TextEncoder();
let adminHashPromise: Promise<string> | null = null;

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

async function getAdminHash(adminPassword: string) {
  if (!adminHashPromise) {
    adminHashPromise = crypto.subtle
      .digest('SHA-256', encoder.encode(adminPassword))
      .then(toHex);
  }
  return adminHashPromise;
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i += 1) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }
  return request.ip ?? 'unknown';
}

function checkRateLimit(key: string, now: number) {
  const entry = rateLimitStore.get(key);
  if (!entry || now > entry.reset) {
    rateLimitStore.set(key, { count: 1, reset: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, reset: now + RATE_LIMIT_WINDOW_MS };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false, reset: entry.reset };
  }

  entry.count += 1;
  return { allowed: true, reset: entry.reset };
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminApi = pathname.startsWith('/api/admin');
  const isAdminLogin = pathname === '/api/admin/login';
  const isArticlesWrite = pathname === '/api/articles' && request.method === 'POST';

  if (!isAdminApi && !isArticlesWrite) {
    return NextResponse.next();
  }

  const ip = getClientIp(request);
  const scope = isAdminApi ? 'admin' : 'articles';
  const rateKey = `${ip}:${scope}`;
  const now = Date.now();
  const rateResult = checkRateLimit(rateKey, now);

  if (!rateResult.allowed) {
    const retryAfter = Math.max(0, Math.ceil((rateResult.reset - now) / 1000));
    return NextResponse.json(
      { error: 'Too many requests', retry_after_seconds: retryAfter },
      { status: 429 }
    );
  }

  if (isAdminLogin) {
    return NextResponse.next();
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json(
      { error: 'ADMIN_PASSWORD is not configured' },
      { status: 500 }
    );
  }

  const expectedHash = await getAdminHash(adminPassword);
  const provided = request.cookies.get(ADMIN_COOKIE)?.value || '';
  const authorized = timingSafeEqual(provided, expectedHash);

  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/admin/:path*', '/api/articles'],
};
