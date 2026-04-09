import { NextResponse } from 'next/server';
import { users } from '@/lib/dummyDb';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('dummy_session')?.value;
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const user = users.find(u => u.id === userId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  
  return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } });
}
