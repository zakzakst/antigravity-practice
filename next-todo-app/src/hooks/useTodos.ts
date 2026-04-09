import useSWR from 'swr';
import { Todo } from '@/types/todo';

const fetcher = async (url: string) => {
  const r = await fetch(url);
  if (!r.ok) throw new Error('API error');
  return r.json();
};

export function useTodos() {
  const { data, error, isLoading, mutate } = useSWR<Todo[]>('/api/todos', fetcher);

  const addTodo = async (title: string) => {
    // 楽観的UI更新は行わず、一度POSTして再取得
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    if (res.ok) {
      const newTodo = await res.json();
      mutate([newTodo, ...(data || [])]);
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    // 楽観的UI更新
    mutate(data?.map(t => t.id === id ? { ...t, completed } : t), false); 
    await fetch(`/api/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed })
    });
    mutate(); // Revalidate
  };

  const deleteTodo = async (id: string) => {
    // 楽観的UI更新
    mutate(data?.filter(t => t.id !== id), false);
    await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    mutate();
  };

  return { todos: data, isLoading, isError: error, addTodo, toggleTodo, deleteTodo };
}
