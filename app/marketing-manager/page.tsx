'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getUser } from '@/lib/user/appwrite';
import { ArrowLeft, Share2 } from 'lucide-react';
import AgentDashboard from '@/components/marketing/AgentDashboard';
import SetupWizard from '@/components/marketing/SetupWizard';
import SocialConnect from '@/components/marketing/SocialConnect';
import type { BrandProfile } from '@/types/agents';
import { useCompanyId } from '@/hooks/useCompany';

type PageState = 'loading' | 'setup' | 'dashboard' | 'social';

export default function MarketingManagerPage() {
  const router = useRouter();
  const [pageState, setPageState] = useState<PageState>('loading');
  const [userId, setUserId] = useState('');
  const [brandProfile, setBrandProfile] = useState<BrandProfile | null>(null);
  const [editingSetup, setEditingSetup] = useState(false);
  const { companyId } = useCompanyId();

  useEffect(() => {
    const init = async () => {
      const sessionToken = localStorage.getItem('sessionToken');
      if (!sessionToken) { router.push('/auth/login'); return; }

      try {
        const user = await getUser(sessionToken);
        setUserId(user.$id);

        const res = await fetch(`/api/brand?userId=${user.$id}`);
        if (res.ok) {
          const { profile } = await res.json();
          if (profile?.isSetupComplete) {
            setBrandProfile(profile);
            setPageState('dashboard');
          } else {
            setPageState('setup');
          }
        } else {
          setPageState('setup');
        }
      } catch (err: any) {
        const msg = err?.message ?? '';
        if (msg === 'SESSION_EXPIRED') {
          localStorage.removeItem('sessionToken');
          router.push('/auth/login');
        } else {
          setPageState('setup');
        }
      }
    };

    init();
  }, [router]);

  const handleSetupComplete = (profile: BrandProfile) => {
    setBrandProfile(profile);
    setEditingSetup(false);
    setPageState('dashboard');
  };

  if (pageState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <motion.div
            className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-xs text-muted-foreground">Initializing AI Marketing Manager...</p>
        </div>
      </div>
    );
  }

  if (pageState === 'setup' || editingSetup) {
    return <SetupWizard userId={userId} companyId={companyId} onComplete={handleSetupComplete} />;
  }

  if (pageState === 'social' && brandProfile) {
    return (
      <SocialConnect
        userId={userId}
        brandProfileId={brandProfile.id ?? ''}
        onBack={() => setPageState('dashboard')}
      />
    );
  }

  return (
    <div className="min-h-screen h-screen flex flex-col bg-background">
      {/* Navbar */}
      <header className="border-b border-border px-4 py-3 flex items-center gap-3 shrink-0">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-lg hover:bg-secondary"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Dashboard
        </button>
        {brandProfile && (
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={() => setPageState('social')}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-secondary border border-border text-foreground hover:bg-accent transition-colors"
            >
              <Share2 className="h-3.5 w-3.5" /> Connect Socials
            </button>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-muted-foreground">Active</span>
            </div>
          </div>
        )}
      </header>

      {/* Content */}
      {brandProfile && (
        <AgentDashboard
          userId={userId}
          brandProfile={brandProfile}
          onSetupEdit={() => setEditingSetup(true)}
        />
      )}
    </div>
  );
}
