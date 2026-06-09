'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageLoadingScreen from '@/components/loading/PageLoadingScreen';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/welcome');
  }, [router]);

  return <PageLoadingScreen label="Loading" />;
}
