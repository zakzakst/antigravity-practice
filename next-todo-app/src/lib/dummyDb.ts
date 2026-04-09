import { User } from '@/types/user';
import { Todo } from '@/types/todo';

// In-memory data store for development
export let users: User[] = [
  {
    id: 'user-1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'password', // モック用
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export let todos: Todo[] = [
  {
    id: 'todo-1',
    userId: 'user-1',
    title: 'Next.jsの学習',
    completed: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'todo-2',
    userId: 'user-1',
    title: 'TODOアプリの構築',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];
