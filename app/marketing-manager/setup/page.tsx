'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/user/appwrite';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import SetupWizard from '@/components/marketing/SetupWizard';
import type { BrandProfile } from '@/types/agents';
import { useCompanyId } from '@/hooks/useCompany';

export default function SetupPage() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [ready, setReady] = useState(false);
  const { companyId } = useCompanyId();

  useEffect(() => {
    const init = async () => {
      const sessionToken = localStorage.getItem('sessionToken');
      if (!sessionToken) { router.push('/auth/login'); return; }
      try {
        const user = await getUser(sessionToken);
        setUserId(user.$id);
        setReady(true);
      } catch {
        router.push('/auth/login');
      }
    };
    init();
  }, [router]);

  const handleComplete = (profile: BrandProfile) => {
    router.push('/marketing-manager');
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <motion.div
            className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-xs text-muted-foreground">Loading setup...</p>
        </div>
      </div>
    );
  }

  return <SetupWizard userId={userId} companyId={companyId} onComplete={handleComplete} />;
}
