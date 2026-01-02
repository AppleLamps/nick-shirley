import { NextResponse } from 'next/server';
import { createHash, timingSafeEqual } from 'crypto';

const COOKIE_NAME = 'admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 8;

function hashPassword(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json(
      { error: 'ADMIN_PASSWORD is not configured' },
      { status: 500 }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const provided =
    payload && typeof payload === 'object' && 'password' in payload
      ? String((payload as { password?: unknown }).password ?? '')
      : '';

  if (!provided) {
    return NextResponse.json({ error: 'Password is required' }, { status: 400 });
  }

  const expected = Buffer.from(adminPassword);
  const actual = Buffer.from(provided);
  const matches =
    expected.length === actual.length && timingSafeEqual(expected, actual);

  if (!matches) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, hashPassword(adminPassword), {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });

  return response;
}
