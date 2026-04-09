'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (res.ok) {
      router.push('/');
    } else {
      const data = await res.json();
      setError(data.error || 'ログインに失敗しました');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950">
      <Card className="w-full max-w-sm shadow-xl border-zinc-200 dark:border-zinc-800 transition-all">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">ログイン</CardTitle>
          <CardDescription>
            メールアドレスとパスワードを入力してください。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="test@example.com" value={email} onChange={e => setEmail(e.target.value)} required className="transition-all hover:border-zinc-400 focus:scale-[1.01]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="transition-all hover:border-zinc-400 focus:scale-[1.01]" />
            </div>
            {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
            <Button type="submit" className="w-full mt-4 font-semibold active:scale-95 transition-transform">ログイン</Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-zinc-500">
            アカウントをお持ちでないですか？ <Link href="/register" className="text-blue-500 hover:text-blue-600 hover:underline font-medium transition-colors">新規登録</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
