'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, ChevronDown, ChevronUp, ExternalLink,
  Loader2, Eye, EyeOff, ArrowLeft,
} from 'lucide-react';
import { toast } from 'sonner';

interface SocialTokens {
  linkedin?: { accessToken: string; authorUrn: string; connected: boolean };
  instagram?: { accessToken: string; businessAccountId: string; connected: boolean };
  twitter?: { apiKey: string; apiSecret: string; accessToken: string; accessTokenSecret: string; connected: boolean };
  facebook?: { pageAccessToken: string; pageId: string; connected: boolean };
}

interface SocialConnectProps {
  userId: string;
  brandProfileId: string;
  initialTokens?: SocialTokens;
  onBack: () => void;
}

const PLATFORMS = [
  {
    id: 'wordpress',
    name: 'WordPress',
    icon: '🌐',
    color: '#21759b',
    guide: 'https://wordpress.org/documentation/article/application-passwords/',
    fields: [
      { key: 'siteUrl', label: 'WordPress Site URL', placeholder: 'https://yoursite.com', secret: false, help: 'Your WordPress website URL' },
      { key: 'username', label: 'Username', placeholder: 'admin', secret: false, help: 'WordPress admin username' },
      { key: 'appPassword', label: 'Application Password', placeholder: 'xxxx xxxx xxxx xxxx xxxx xxxx', secret: true, help: 'WordPress Admin → Users → Profile → Application Passwords → Add New' },
    ],
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: '🔗',
    color: '#0077b5',
    guide: 'https://www.linkedin.com/developers/apps',
    fields: [
      { key: 'accessToken', label: 'Access Token', placeholder: 'AQV...long token...', secret: true, help: 'LinkedIn Developer App → Auth → Access Token' },
      { key: 'authorUrn', label: 'Author URN', placeholder: 'urn:li:person:XXXXXXX or urn:li:organization:XXXXXXX', secret: false, help: 'Your LinkedIn Person ID or Company ID' },
    ],
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '📸',
    color: '#e1306c',
    guide: 'https://developers.facebook.com/apps',
    fields: [
      { key: 'accessToken', label: 'Access Token', placeholder: 'EAABsbCS...long token...', secret: true, help: 'Facebook Developer App → Instagram Graph API token' },
      { key: 'businessAccountId', label: 'Instagram Business Account ID', placeholder: '17841400...', secret: false, help: 'Facebook Business Manager → Instagram Account ID' },
    ],
  },
  {
    id: 'twitter',
    name: 'Twitter / X',
    icon: '𝕏',
    color: '#000000',
    guide: 'https://developer.twitter.com/en/portal/dashboard',
    fields: [
      { key: 'apiKey', label: 'API Key', placeholder: 'xxxx...', secret: true, help: 'Twitter Developer Portal → App → Keys and Tokens' },
      { key: 'apiSecret', label: 'API Secret', placeholder: 'xxxx...', secret: true, help: 'Twitter Developer Portal → App → Keys and Tokens' },
      { key: 'accessToken', label: 'Access Token', placeholder: 'xxxx-xxxx...', secret: true, help: 'Twitter Developer Portal → App → Access Token' },
      { key: 'accessTokenSecret', label: 'Access Token Secret', placeholder: 'xxxx...', secret: true, help: 'Twitter Developer Portal → App → Access Token Secret' },
    ],
  },
  {
    id: 'facebook',
    name: 'Facebook Page',
    icon: '📘',
    color: '#1877f2',
    guide: 'https://developers.facebook.com/apps',
    fields: [
      { key: 'pageAccessToken', label: 'Page Access Token', placeholder: 'EAABsbCS...long token...', secret: true, help: 'Facebook Developer App → Graph API Explorer → Page Token' },
      { key: 'pageId', label: 'Page ID', placeholder: '12345678...', secret: false, help: 'Facebook Page → About → Page ID' },
    ],
  },
];

function PlatformCard({
  platform, tokens, onChange, onSave, saving,
}: {
  platform: typeof PLATFORMS[0];
  tokens: Record<string, string>;
  onChange: (field: string, value: string) => void;
  onSave: () => void;
  saving: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const isConnected = !!tokens.connected;
  const allFilled = platform.fields.every(f => (tokens[f.key] ?? '').trim().length > 0);

  return (
    <div className="border border-border rounded-2xl overflow-hidden bg-background">
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-secondary/40 transition-colors text-left"
      >
        <span className="text-2xl">{platform.icon}</span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">{platform.name}</p>
          <p className="text-xs text-muted-foreground">
            {isConnected ? 'Connected — posting enabled' : 'Not connected'}
          </p>
        </div>
        {isConnected && <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />}
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border"
          >
            <div className="px-5 py-4 space-y-4">
              {/* How to get credentials */}
              <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-xl">
                <span className="text-xs text-muted-foreground">Get API credentials from</span>
                <a
                  href={platform.guide}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-semibold text-primary hover:opacity-80"
                >
                  {platform.name} Developer Portal <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              {/* Fields */}
              {platform.fields.map(field => (
                <div key={field.key}>
                  <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground block mb-1.5">
                    {field.label}
                  </label>
                  <p className="text-[10px] text-muted-foreground mb-1.5">{field.help}</p>
                  <div className="relative">
                    <input
                      type={field.secret && !showSecrets[field.key] ? 'password' : 'text'}
                      value={tokens[field.key] ?? ''}
                      onChange={e => onChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2.5 pr-10 text-xs text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/60 transition-all font-mono"
                    />
                    {field.secret && (
                      <button
                        type="button"
                        onClick={() => setShowSecrets(p => ({ ...p, [field.key]: !p[field.key] }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showSecrets[field.key] ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Save button */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={onSave}
                  disabled={!allFilled || saving}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl grad text-white text-xs font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-all"
                >
                  {saving ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Connecting...</> : <><CheckCircle2 className="h-3.5 w-3.5" /> Connect {platform.name}</>}
                </button>
                {isConnected && (
                  <span className="text-xs text-emerald-500 font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Connected
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SocialConnect({ userId, brandProfileId, initialTokens = {}, onBack }: SocialConnectProps) {
  const [tokens, setTokens] = useState<Record<string, Record<string, any>>>(() => {
    const init: Record<string, Record<string, any>> = {};
    PLATFORMS.forEach(p => {
      init[p.id] = { ...((initialTokens as any)[p.id] ?? {}) };
    });
    return init;
  });
  const [saving, setSaving] = useState<string | null>(null);

  const handleChange = (platformId: string, field: string, value: string) => {
    setTokens(prev => ({ ...prev, [platformId]: { ...prev[platformId], [field]: value } }));
  };

  const handleSave = async (platformId: string) => {
    setSaving(platformId);
    try {
      const platformTokens = { ...tokens[platformId], connected: true };

      const res = await fetch('/api/brand/social-tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, brandProfileId, platformId, tokens: platformTokens }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save');
      }

      setTokens(prev => ({ ...prev, [platformId]: platformTokens }));
      toast.success(`${PLATFORMS.find(p => p.id === platformId)?.name} connected!`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to connect account');
    } finally {
      setSaving(null);
    }
  };

  const connectedCount = PLATFORMS.filter(p => !!tokens[p.id]?.connected).length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border px-6 py-4 flex items-center gap-3">
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-lg hover:bg-secondary">
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </button>
        <div>
          <h1 className="text-sm font-semibold text-foreground">Connect Social Accounts</h1>
          <p className="text-xs text-muted-foreground">{connectedCount} of {PLATFORMS.length} connected</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-8 space-y-4">

          {/* Status bar */}
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-[#1e1b4b]/5 to-[#6366f1]/5 border border-primary/20">
            <div className="flex-1">
              <p className="text-xs font-semibold text-foreground mb-1">{connectedCount} accounts connected</p>
              <div className="flex gap-1">
                {PLATFORMS.map(p => (
                  <div
                    key={p.id}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${tokens[p.id]?.connected ? 'grad' : 'bg-border'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="p-4 rounded-2xl bg-secondary/40 border border-border space-y-2">
            <p className="text-xs font-semibold text-foreground">How publishing works:</p>
            <div className="space-y-1.5">
              {[
                'After the pipeline completes, a "Publish" button will appear',
                'LinkedIn — text post will be published directly',
                'Instagram — caption with placeholder image will be published',
                'Twitter — thread will be published',
                'Facebook — page post will be published',
              ].map((item, i) => (
                <p key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                  <span className="text-primary shrink-0 font-bold">{i + 1}.</span>
                  {item}
                </p>
              ))}
            </div>
          </div>

          {/* Platform cards */}
          {PLATFORMS.map(platform => (
            <PlatformCard
              key={platform.id}
              platform={platform}
              tokens={tokens[platform.id] ?? {}}
              onChange={(field, value) => handleChange(platform.id, field, value)}
              onSave={() => handleSave(platform.id)}
              saving={saving === platform.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
