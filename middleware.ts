import { NextRequest, NextResponse } from 'next/server';

const LOCALE_COOKIE = 'NEXT_LOCALE';

type Locale = 'zh' | 'en';

function pickFromAcceptLanguage(accept: string | null): Locale {
  if (!accept) return 'zh';
  const langs = accept
    .toLowerCase()
    .split(',')
    .map((part) => part.split(';')[0].trim());
  for (const lang of langs) {
    if (lang.startsWith('en')) return 'en';
    if (lang.startsWith('zh')) return 'zh';
  }
  return 'zh';
}

function readCookieLocale(req: NextRequest): Locale | null {
  const value = req.cookies.get(LOCALE_COOKIE)?.value;
  if (value === 'zh' || value === 'en') return value;
  return null;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-pathname', pathname);

  const isEnPath = pathname === '/en' || pathname.startsWith('/en/');
  if (isEnPath) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const cookieLocale = readCookieLocale(req);
  const desired: Locale =
    cookieLocale ?? pickFromAcceptLanguage(req.headers.get('accept-language'));

  if (desired === 'en') {
    const target = pathname === '/' ? '/en' : `/en${pathname}`;
    return NextResponse.redirect(new URL(target, req.url));
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|meta/|assets/|.*\\..*).*)',
  ],
};
