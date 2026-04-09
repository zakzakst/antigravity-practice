import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('dummy_session');
  
  // ダッシュボード（/）を保護
  if (request.nextUrl.pathname === '/') {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // ログイン済みの場合はログイン/登録画面からダッシュボードへリダイレクト
  if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register') {
    if (session) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/register'],
};
