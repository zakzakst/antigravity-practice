import { NextResponse } from 'next/server';
import { users } from '@/lib/dummyDb';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return NextResponse.json({ error: 'メールアドレスまたはパスワードが違います' }, { status: 401 });
    }
    
    const response = NextResponse.json({ 
      user: { id: user.id, name: user.name, email: user.email } 
    });
    
    // CookieにダミーセッションIDをセット
    response.cookies.set('dummy_session', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    });
    
    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
