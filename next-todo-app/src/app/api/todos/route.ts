import { NextResponse } from 'next/server';
import { todos } from '@/lib/dummyDb';
import { cookies } from 'next/headers';

// GET all todos for logged in user
export async function GET() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('dummy_session')?.value;
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const userTodos = todos
    .filter(t => t.userId === userId)
    .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  return NextResponse.json(userTodos);
}

// POST new todo
export async function POST(request: Request) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('dummy_session')?.value;
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { title } = await request.json();
  
  if (!title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }
  
  const newTodo = {
    id: `todo-${Date.now()}`,
    userId,
    title,
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  todos.push(newTodo);
  return NextResponse.json(newTodo);
}
