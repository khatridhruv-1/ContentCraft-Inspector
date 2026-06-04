'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Globe, Share2, Tag, Calendar, Mic2,
  ChevronRight, ChevronLeft, Check, Loader2, Wand2,
} from 'lucide-react';
import { toast } from 'sonner';
import type { BrandProfile, PostingSchedule, SocialAccounts } from '@/types/agents';

interface SetupWizardProps {
  userId: string;
  companyId?: string | null;
  onComplete: (profile: BrandProfile) => void;
}

const INDUSTRIES = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'E-commerce',
  'Marketing & Advertising', 'Real Estate', 'Legal', 'Manufacturing',
  'Hospitality & Travel', 'Media & Entertainment', 'SaaS', 'Consulting', 'Retail', 'Other',
];

const BRAND_VOICES = [
  { id: 'professional', label: 'Professional', desc: 'Formal, expert, authoritative', adjectives: ['authoritative', 'credible', 'precise'] },
  { id: 'friendly', label: 'Friendly', desc: 'Warm, approachable, conversational', adjectives: ['warm', 'approachable', 'relatable'] },
  { id: 'inspirational', label: 'Inspirational', desc: 'Motivating, visionary, bold', adjectives: ['bold', 'visionary', 'empowering'] },
  { id: 'educational', label: 'Educational', desc: 'Informative, clear, helpful', adjectives: ['informative', 'clear', 'practical'] },
  { id: 'casual', label: 'Casual', desc: 'Relaxed, witty, human', adjectives: ['witty', 'humorous', 'genuine'] },
  { id: 'innovative', label: 'Innovative', desc: 'Forward-thinking, disruptive, fresh', adjectives: ['innovative', 'cutting-edge', 'bold'] },
];

const CONTENT_CATEGORIES = [
  'Industry Insights', 'How-To Guides', 'Case Studies', 'Thought Leadership',
  'Product Updates', 'Customer Stories', 'Trends & News', 'Tips & Tricks',
  'Company Culture', 'Research & Data', 'Tutorials', 'Opinion Pieces',
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const FREQUENCIES = [
  { id: 'daily', label: 'Daily', desc: '7 posts/week' },
  { id: 'weekly', label: 'Weekly', desc: '1 post/week' },
  { id: 'biweekly', label: '3x/Week', desc: '3 posts/week' },
  { id: 'monthly', label: 'Monthly', desc: '1 post/month' },
];

const steps = [
  { id: 1, label: 'Brand Info', icon: Building2 },
  { id: 2, label: 'Website', icon: Globe },
  { id: 3, label: 'Social', icon: Share2 },
  { id: 4, label: 'Topics', icon: Tag },
  { id: 5, label: 'Schedule', icon: Calendar },
  { id: 6, label: 'Voice', icon: Mic2 },
];

export default function SetupWizard({ userId, companyId, onComplete }: SetupWizardProps) {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  const [brandName, setBrandName] = useState('');
  const [industry, setIndustry] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [brandColors, setBrandColors] = useState<string[]>(['#6366f1', '#8b5cf6']);
  const [social, setSocial] = useState<SocialAccounts>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [schedule, setSchedule] = useState<PostingSchedule>({ frequency: 'weekly', days: ['Monday', 'Thursday'], time: '09:00', timezone: Intl.DateTimeFormat().resolvedOptions().timeZone });
  const [voiceId, setVoiceId] = useState('professional');
  const [avoidWords, setAvoidWords] = useState('');

  const selectedVoice = BRAND_VOICES.find(v => v.id === voiceId)!;

  const canProceed = () => {
    if (step === 1) return brandName.trim().length > 0 && industry.length > 0 && targetAudience.trim().length > 0;
    if (step === 2) return true;
    if (step === 3) return true;
    if (step === 4) return categories.length > 0;
    if (step === 5) return schedule.days.length > 0;
    if (step === 6) return true;
    return true;
  };

  const toggleCategory = (cat: string) => {
    setCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const toggleDay = (day: string) => {
    setSchedule(prev => ({
      ...prev,
      days: prev.days.includes(day) ? prev.days.filter(d => d !== day) : [...prev.days, day],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const profile: Omit<BrandProfile, 'id' | 'createdAt' | 'updatedAt'> = {
        userId,
        companyId,
        brandName: brandName.trim(),
        websiteUrl: websiteUrl.trim(),
        industry,
        targetAudience: targetAudience.trim(),
        brandVoice: {
          tone: voiceId,
          adjectives: selectedVoice.adjectives,
          persona: selectedVoice.label,
          avoidWords: avoidWords.split(',').map(w => w.trim()).filter(Boolean),
        },
        brandColors,
        socialAccounts: social,
        contentCategories: categories,
        postingSchedule: schedule,
        isSetupComplete: true,
      };

      const res = await fetch('/api/brand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (!res.ok) throw new Error('Failed to save brand profile');
      const { profile: saved } = await res.json();
      toast.success('AI Marketing Manager setup complete!');
      onComplete(saved);
    } catch (err: any) {
      toast.error(err.message || 'Failed to save setup');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border px-6 py-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl grad flex items-center justify-center">
          <Wand2 className="h-4 w-4 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-foreground">AI Marketing Manager Setup</h1>
          <p className="text-xs text-muted-foreground">Configure your autonomous marketing engine</p>
        </div>
      </div>

      {/* Steps indicator */}
      <div className="px-6 py-5 border-b border-border">
        <div className="flex items-center gap-1 max-w-2xl mx-auto">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const done = step > s.id;
            const active = step === s.id;
            return (
              <div key={s.id} className="flex items-center flex-1">
                <div className={`flex flex-col items-center gap-1 ${active || done ? '' : 'opacity-40'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${done ? 'grad text-white' : active ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                    {done ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                  </div>
                  <span className="text-[9px] font-medium text-muted-foreground hidden sm:block">{s.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 rounded ${done ? 'bg-primary' : 'bg-border'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Step 1: Brand Information */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-foreground">Brand Information</h2>
                    <p className="text-sm text-muted-foreground mt-1">Tell us about your brand so we can tailor content perfectly.</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block mb-2">
                        Brand Name <span className="text-destructive">*</span>
                      </label>
                      <input
                        value={brandName}
                        onChange={e => setBrandName(e.target.value)}
                        placeholder="e.g. Acme Corp"
                        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/60 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block mb-2">
                        Industry <span className="text-destructive">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={industry}
                          onChange={e => setIndustry(e.target.value)}
                          className="w-full appearance-none bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/60 transition-all cursor-pointer"
                        >
                          <option value="">Select your industry...</option>
                          {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                        </select>
                        <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block mb-2">
                        Target Audience <span className="text-destructive">*</span>
                      </label>
                      <textarea
                        value={targetAudience}
                        onChange={e => setTargetAudience(e.target.value)}
                        placeholder="e.g. B2B SaaS founders and CTOs at companies with 10-200 employees who want to scale their teams"
                        rows={3}
                        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/60 transition-all resize-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block mb-2">Brand Colors</label>
                      <div className="flex items-center gap-3">
                        {brandColors.map((color, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <input
                              type="color"
                              value={color}
                              onChange={e => setBrandColors(prev => prev.map((c, idx) => idx === i ? e.target.value : c))}
                              className="w-9 h-9 rounded-lg cursor-pointer border border-border"
                            />
                            <span className="text-xs text-muted-foreground font-mono">{color}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Website */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-foreground">Website & Online Presence</h2>
                    <p className="text-sm text-muted-foreground mt-1">Your website helps us understand your brand context and generate better content.</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block mb-2">Website URL</label>
                      <input
                        value={websiteUrl}
                        onChange={e => setWebsiteUrl(e.target.value)}
                        placeholder="https://yourcompany.com"
                        type="url"
                        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/60 transition-all"
                      />
                      <p className="text-xs text-muted-foreground mt-2">Used to generate contextually relevant content and internal linking suggestions.</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-secondary/50 border border-border">
                      <h3 className="text-xs font-semibold text-foreground mb-2">What we use this for:</h3>
                      <ul className="space-y-1.5">
                        {['Generate brand-consistent content', 'Create internal linking recommendations', 'Analyze your industry positioning', 'Tailor SEO strategy to your domain'].map(item => (
                          <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Social Accounts */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-foreground">Social Media Accounts</h2>
                    <p className="text-sm text-muted-foreground mt-1">Connect your social profiles so we can tailor content for each platform.</p>
                  </div>
                  <div className="space-y-4">
                    {[
                      { key: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/company/your-company', icon: '🔗' },
                      { key: 'twitter', label: 'Twitter / X', placeholder: '@yourhandle', icon: '𝕏' },
                      { key: 'facebook', label: 'Facebook', placeholder: 'facebook.com/yourpage', icon: '📘' },
                      { key: 'instagram', label: 'Instagram', placeholder: '@yourhandle', icon: '📸' },
                    ].map(({ key, label, placeholder, icon }) => (
                      <div key={key}>
                        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block mb-2">
                          <span className="mr-1">{icon}</span> {label}
                        </label>
                        <input
                          value={(social as any)[key] ?? ''}
                          onChange={e => setSocial(prev => ({ ...prev, [key]: e.target.value }))}
                          placeholder={placeholder}
                          className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/60 transition-all"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Content Categories */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-foreground">Content Categories</h2>
                    <p className="text-sm text-muted-foreground mt-1">Select the content types your brand publishes. Pick at least one.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {CONTENT_CATEGORIES.map(cat => {
                      const selected = categories.includes(cat);
                      return (
                        <button
                          key={cat}
                          onClick={() => toggleCategory(cat)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${selected ? 'grad text-white border-transparent' : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/40 bg-background'}`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                  {categories.length > 0 && (
                    <p className="text-xs text-muted-foreground">{categories.length} selected: {categories.join(', ')}</p>
                  )}
                </div>
              )}

              {/* Step 5: Schedule */}
              {step === 5 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-foreground">Publishing Schedule</h2>
                    <p className="text-sm text-muted-foreground mt-1">Set when the AI should generate and prepare content for publishing.</p>
                  </div>
                  <div className="space-y-5">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block mb-3">Frequency</label>
                      <div className="grid grid-cols-2 gap-3">
                        {FREQUENCIES.map(f => (
                          <button
                            key={f.id}
                            onClick={() => setSchedule(prev => ({ ...prev, frequency: f.id as any }))}
                            className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition-all ${schedule.frequency === f.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'}`}
                          >
                            <span className={`text-sm font-semibold ${schedule.frequency === f.id ? 'text-primary' : 'text-foreground'}`}>{f.label}</span>
                            <span className="text-xs text-muted-foreground">{f.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block mb-3">Active Days</label>
                      <div className="flex flex-wrap gap-2">
                        {DAYS.map(day => {
                          const active = schedule.days.includes(day);
                          return (
                            <button
                              key={day}
                              onClick={() => toggleDay(day)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${active ? 'grad text-white border-transparent' : 'border-border text-muted-foreground hover:text-foreground'}`}
                            >
                              {day.slice(0, 3)}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block mb-2">Preferred Time</label>
                        <input
                          type="time"
                          value={schedule.time}
                          onChange={e => setSchedule(prev => ({ ...prev, time: e.target.value }))}
                          className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/60 transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block mb-2">Timezone</label>
                        <input
                          value={schedule.timezone}
                          onChange={e => setSchedule(prev => ({ ...prev, timezone: e.target.value }))}
                          className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/60 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Brand Voice */}
              {step === 6 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-foreground">Brand Voice</h2>
                    <p className="text-sm text-muted-foreground mt-1">Define how your brand sounds. Every piece of content will match this voice.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {BRAND_VOICES.map(v => (
                      <button
                        key={v.id}
                        onClick={() => setVoiceId(v.id)}
                        className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all ${voiceId === v.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}
                      >
                        <div className="flex items-center justify-between w-full mb-1.5">
                          <span className={`text-sm font-semibold ${voiceId === v.id ? 'text-primary' : 'text-foreground'}`}>{v.label}</span>
                          {voiceId === v.id && <Check className="h-4 w-4 text-primary" />}
                        </div>
                        <span className="text-xs text-muted-foreground">{v.desc}</span>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {v.adjectives.map(a => (
                            <span key={a} className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground">{a}</span>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block mb-2">Words to Avoid (comma-separated)</label>
                    <input
                      value={avoidWords}
                      onChange={e => setAvoidWords(e.target.value)}
                      placeholder="e.g. synergy, leverage, paradigm shift"
                      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/60 transition-all"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer navigation */}
      <div className="border-t border-border px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => setStep(prev => Math.max(prev - 1, 1))}
          disabled={step === 1}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed px-4 py-2 rounded-xl hover:bg-secondary border border-transparent hover:border-border"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </button>

        <span className="text-xs text-muted-foreground">Step {step} of {steps.length}</span>

        {step < steps.length ? (
          <button
            onClick={() => setStep(prev => prev + 1)}
            disabled={!canProceed()}
            className="flex items-center gap-2 text-sm font-semibold px-5 py-2 rounded-xl grad text-white disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-all"
          >
            Continue <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 text-sm font-semibold px-5 py-2 rounded-xl grad text-white disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-all"
          >
            {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Check className="h-4 w-4" /> Launch AI Manager</>}
          </button>
        )}
      </div>
    </div>
  );
}
