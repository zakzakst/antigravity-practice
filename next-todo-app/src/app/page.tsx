'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTodos } from '@/hooks/useTodos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { todos, isLoading: todosLoading, addTodo, toggleTodo, deleteTodo } = useTodos();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  if (authLoading) return <div className="flex min-h-screen items-center justify-center text-zinc-500">Loading...</div>;

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    await addTodo(newTaskTitle);
    setNewTaskTitle('');
  };

  const filteredTodos = todos?.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 p-4 md:p-8">
      <header className="max-w-3xl mx-auto flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">タスク管理</h1>
          <p className="text-zinc-500 mt-1">こんにちは、{user?.name}さん</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>ログアウト</Button>
      </header>

      <main className="max-w-3xl mx-auto space-y-6">
        <Card className="shadow-sm border-zinc-200 dark:border-zinc-800">
          <CardContent className="p-4">
            <form onSubmit={handleAddTodo} className="flex gap-2">
              <Input 
                value={newTaskTitle} 
                onChange={e => setNewTaskTitle(e.target.value)} 
                placeholder="新しいタスクを入力... (Enterで追加)" 
                className="flex-1 focus-visible:ring-1 transition-shadow"
              />
              <Button type="submit" disabled={!newTaskTitle.trim()}>追加</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <CardHeader className="py-4 bg-zinc-100/50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-lg">タスク一覧</CardTitle>
            <div className="flex gap-1 text-sm bg-zinc-200/50 dark:bg-zinc-800/50 p-1 rounded-full">
              <button 
                className={`px-4 py-1.5 rounded-full transition-all duration-200 ${filter === 'all' ? 'bg-white shadow-sm dark:bg-zinc-700 text-zinc-900 dark:text-white font-medium' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'}`}
                onClick={() => setFilter('all')}
              >
                すべて
              </button>
              <button 
                className={`px-4 py-1.5 rounded-full transition-all duration-200 ${filter === 'active' ? 'bg-white shadow-sm dark:bg-zinc-700 text-zinc-900 dark:text-white font-medium' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'}`}
                onClick={() => setFilter('active')}
              >
                未完了
              </button>
              <button 
                className={`px-4 py-1.5 rounded-full transition-all duration-200 ${filter === 'completed' ? 'bg-white shadow-sm dark:bg-zinc-700 text-zinc-900 dark:text-white font-medium' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'}`}
                onClick={() => setFilter('completed')}
              >
                完了
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {todosLoading ? (
              <div className="p-12 text-center text-zinc-500 animate-pulse">読み込み中...</div>
            ) : filteredTodos?.length === 0 ? (
              <div className="p-12 text-center text-zinc-500">
                {filter === 'all' ? 'まだタスクがありません。上から追加してみましょう。' : '該当するタスクはありません。'}
              </div>
            ) : (
              <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {filteredTodos?.map(todo => (
                  <li key={todo.id} className="flex items-center gap-4 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors group">
                    <Checkbox 
                      checked={todo.completed} 
                      onCheckedChange={(checked) => toggleTodo(todo.id, checked as boolean)} 
                      className="h-5 w-5 rounded-[4px]"
                    />
                    <span className={`flex-1 transition-all duration-300 ${todo.completed ? 'line-through text-zinc-400 dark:text-zinc-500' : 'text-zinc-800 dark:text-zinc-100'}`}>
                      {todo.title}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                      onClick={() => deleteTodo(todo.id)}
                    >
                      削除
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
