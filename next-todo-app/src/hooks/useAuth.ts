import useSWR from 'swr';
import { User } from '@/types/user';

const fetcher = async (url: string) => {
  const r = await fetch(url);
  if (!r.ok) throw new Error('Not logged in');
  return r.json();
};

export function useAuth() {
  const { data, error, mutate } = useSWR<{ user: User }>('/api/auth/me', fetcher, {
    shouldRetryOnError: false
  });

  return {
    user: data?.user,
    isLoading: !error && !data,
    isError: error,
    mutate
  };
}
