import { NextResponse } from 'next/server';
import { users } from '@/lib/dummyDb';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    
    if (users.find(u => u.email === email)) {
      return NextResponse.json({ error: 'このメールアドレスは既に登録されています' }, { status: 400 });
    }
    
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    
    return NextResponse.json({ success: true, user: { id: newUser.id, name: newUser.name, email: newUser.email } });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
