import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  // セッションCookieを破棄
  response.cookies.delete('dummy_session');
  return response;
}
