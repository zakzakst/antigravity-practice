import { NextResponse } from 'next/server';
import { todos } from '@/lib/dummyDb';
import { cookies } from 'next/headers';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('dummy_session')?.value;
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { id } = await params;
  const body = await request.json();
  
  const index = todos.findIndex(t => t.id === id && t.userId === userId);
  if (index === -1) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  
  todos[index] = { ...todos[index], ...body, updatedAt: new Date().toISOString() };
  return NextResponse.json(todos[index]);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('dummy_session')?.value;
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { id } = await params;
  const index = todos.findIndex(t => t.id === id && t.userId === userId);
  
  if (index === -1) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  
  todos.splice(index, 1);
  return NextResponse.json({ success: true });
}
