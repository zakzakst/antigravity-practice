'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Auto login after register
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    
    if (res.ok) {
      await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      router.push('/');
    } else {
      const data = await res.json();
      setError(data.error || '登録に失敗しました');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950">
      <Card className="w-full max-w-sm shadow-xl border-zinc-200 dark:border-zinc-800 transition-all">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">新規登録</CardTitle>
          <CardDescription>アカウントを作成してタスクの管理を始めましょう。</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="山田 太郎" value={name} onChange={e => setName(e.target.value)} required className="transition-all hover:border-zinc-400 focus:scale-[1.01]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="test@example.com" value={email} onChange={e => setEmail(e.target.value)} required className="transition-all hover:border-zinc-400 focus:scale-[1.01]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="transition-all hover:border-zinc-400 focus:scale-[1.01]" />
            </div>
            {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
            <Button type="submit" className="w-full mt-4 font-semibold active:scale-95 transition-transform">登録</Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-zinc-500">
            すでにアカウントをお持ちですか？ <Link href="/login" className="text-blue-500 hover:text-blue-600 hover:underline font-medium transition-colors">ログイン</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
