'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Head from 'next/head';
import {
  Wand2,
  Edit,
  FileSearch,
  Sparkles,
  Menu,
  X,
  Check,
  Shield,
  Clock,
  BarChart3,
  Star,
  Zap,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';

const NAV_LINKS = [
  { label: 'Features', href: 'features' },
  { label: 'How It Works', href: 'how-it-works' },
  { label: 'Pricing', href: 'pricing' },
  { label: 'FAQ', href: 'faq' },
];

const STATS = [
  { value: '10x', label: 'Faster content creation', note: true },
  { value: '99%', label: 'Analysis accuracy', note: true },
  { value: '50k+', label: 'Content creators', note: true },
];

const FEATURES = [
  {
    iconClass: 'text-blue-600',
    bgClass: 'bg-blue-50',
    Icon: Wand2,
    title: 'AI-Powered Generation',
    desc: 'Generate high-quality, SEO-optimized content in seconds with our advanced AI models.',
  },
  {
    iconClass: 'text-purple-600',
    bgClass: 'bg-purple-50',
    Icon: Edit,
    title: 'Smart Editor',
    desc: 'Craft and refine your content with a powerful editor built for modern creators.',
  },
  {
    iconClass: 'text-pink-600',
    bgClass: 'bg-pink-50',
    Icon: FileSearch,
    title: 'Deep Analysis',
    desc: 'Get detailed readability, plagiarism, and AI-detection insights on any content.',
  },
];

const STEPS = [
  {
    step: '01',
    title: 'Paste or write your content',
    desc: 'Start with a draft, an idea, or paste existing text directly into the editor.',
  },
  {
    step: '02',
    title: 'Analyze & optimize',
    desc: 'Our AI scans for quality, originality, and improvement opportunities in real time.',
  },
  {
    step: '03',
    title: 'Export & publish',
    desc: 'Download as PDF or DOCX, or copy polished content straight to your clipboard.',
  },
];

const TESTIMONIALS = [
  {
    avatar: 'SC',
    name: 'Sarah Chen',
    role: 'Content Manager at TechCorp',
    quote:
      'ContentCraft-Inspector cut our content review time in half. The AI analysis is incredibly accurate.',
  },
  {
    avatar: 'MR',
    name: 'Marcus Rivera',
    role: 'Freelance Writer',
    quote:
      'I use it for every article I write. The plagiarism checker alone is worth the price.',
  },
  {
    avatar: 'PP',
    name: 'Priya Patel',
    role: 'SEO Specialist',
    quote:
      'The deep analysis features surfaced issues I would never have caught manually. Game changer.',
  },
];

const PRICING = [
  {
    tier: 'Free',
    price: '$0',
    period: 'forever',
    features: [
      '5 content analyses / month',
      'Basic AI generation',
      'Plagiarism detection',
      'Export to TXT',
    ],
    cta: 'Get Started Free',
    highlighted: false,
  },
  {
    tier: 'Pro',
    price: '$19',
    period: 'per month',
    features: [
      'Unlimited analyses',
      'Advanced AI models',
      'Priority processing',
      'Export to PDF & DOCX',
      'API access',
      'Priority support',
    ],
    cta: 'Start Pro Trial',
    highlighted: true,
  },
];

const TRUST = [
  { Icon: Shield, label: 'SOC 2 Type II', sub: 'Enterprise-grade security' },
  { Icon: Clock, label: '99.9% Uptime', sub: 'Built for reliability' },
  { Icon: BarChart3, label: 'Real-time Analytics', sub: 'Instant content insights' },
];

const FAQ_ITEMS = [
  {
    q: 'Is my content stored or shared?',
    a: 'No. Your content is processed in memory and never stored on our servers or used to train AI models.',
  },
  {
    q: 'How accurate is the AI detection?',
    a: 'Our AI detection model achieves 99%+ accuracy on benchmark datasets and is continuously updated to handle the latest AI-generated content patterns.',
  },
  {
    q: 'Can I use ContentCraft-Inspector for team collaboration?',
    a: 'Pro plan includes team workspaces with shared history, role-based access, and collaborative editing features.',
  },
  {
    q: 'What file formats can I export?',
    a: 'Free users export as TXT. Pro users get PDF, DOCX, and Markdown export plus a one-click clipboard shortcut.',
  },
];

export default function Welcome() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Head>
        <title>ContentCraft-Inspector — AI Content Platform</title>
        <meta
          name="description"
          content="Create, analyze, and optimize content with ContentCraft-Inspector's AI platform. Get started free."
        />
        <meta property="og:title" content="ContentCraft-Inspector — AI Content Platform" />
        <meta
          property="og:description"
          content="Create, analyze, and optimize content with AI-powered tools. Try it free today."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ContentCraft-Inspector — AI Content Platform" />
        <meta
          name="twitter:description"
          content="Create, analyze, and optimize content with AI-powered tools."
        />
      </Head>

      <div className="min-h-screen bg-white text-gray-900">
        {/* NAVBAR */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <div className="bg-blue-600 p-1.5 rounded-lg">
                  <Sparkles className="w-5 h-5 text-white" aria-hidden="true" />
                </div>
                <span className="font-bold text-gray-900 text-lg">ContentCraft</span>
              </div>

              {/* Desktop nav links */}
              <div className="hidden md:flex items-center gap-8">
                {NAV_LINKS.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => scrollTo(link.href)}
                    className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
              </div>

              {/* Desktop CTAs */}
              <div className="hidden md:flex items-center gap-3">
                <button
                  onClick={() => router.push('/auth/login')}
                  className="text-gray-700 hover:text-blue-600 text-sm font-medium transition-colors px-3 py-2"
                >
                  Sign In
                </button>
                <button
                  onClick={() => router.push('/auth/signup')}
                  className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </button>
              </div>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMenuOpen((o) => !o)}
                aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                {menuOpen ? (
                  <X className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <Menu className="w-5 h-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-3"
            >
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="text-gray-700 hover:text-blue-600 text-sm font-medium text-left transition-colors py-1"
                >
                  {link.label}
                </button>
              ))}
              <hr className="border-gray-100 my-1" />
              <button
                onClick={() => router.push('/auth/login')}
                className="text-gray-700 text-sm font-medium text-left py-1"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push('/auth/signup')}
                className="bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg text-center"
              >
                Get Started Free
              </button>
            </motion.div>
          )}
        </nav>

        {/* HERO */}
        <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-blue-100">
                <Zap className="w-3.5 h-3.5" aria-hidden="true" />
                AI-powered content platform
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Create &amp; analyze content{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                  10x faster
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-8">
                Generate, edit, and deeply analyze your content with AI. Catch plagiarism, optimize
                readability, and export in seconds.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => router.push('/auth/signup')}
                  className="bg-blue-600 text-white px-7 py-3.5 rounded-xl font-semibold text-base hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                >
                  Get Started Free <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  onClick={() => router.push('/auth/login')}
                  className="bg-white text-gray-800 px-7 py-3.5 rounded-xl font-semibold text-base hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm"
                >
                  Sign In
                </button>
              </div>
            </motion.div>

            {/* Product mockup */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                {/* Browser chrome */}
                <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-1.5" aria-hidden="true">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 mx-4 bg-white rounded-md border border-gray-200 px-3 py-1 text-xs text-gray-400 text-center">
                    contentcraft-inspector.app/dashboard
                  </div>
                </div>
                {/* App UI mockup */}
                <div className="grid grid-cols-3 h-64 sm:h-80" aria-label="Product interface preview">
                  {/* Sidebar */}
                  <div className="col-span-1 bg-gray-50 border-r border-gray-100 p-4 flex flex-col gap-3">
                    <div className="h-2.5 bg-blue-200 rounded-full w-3/4" />
                    {['Generate', 'Editor', 'Analysis', 'History'].map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white border border-gray-100 text-xs text-gray-500"
                      >
                        <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                  {/* Editor area */}
                  <div className="col-span-2 p-4 flex flex-col gap-3">
                    <div className="flex gap-2">
                      <div className="h-6 px-3 bg-blue-600 rounded text-white text-xs flex items-center">
                        Analyze
                      </div>
                      <div className="h-6 px-3 bg-gray-100 rounded text-xs text-gray-500 flex items-center">
                        Export
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                      <div className="h-2.5 bg-gray-200 rounded-full w-full" />
                      <div className="h-2.5 bg-gray-200 rounded-full w-5/6" />
                      <div className="h-2.5 bg-gray-200 rounded-full w-4/5" />
                      <div className="h-2.5 bg-gray-100 rounded-full w-full" />
                      <div className="h-2.5 bg-gray-200 rounded-full w-3/4" />
                    </div>
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                      <span className="text-xs text-blue-700 font-medium">
                        AI Score: 98% — No plagiarism detected
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* STATS */}
        <section id="stats" className="py-12 bg-white border-y border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              {STATS.map((s) => (
                <div key={s.value}>
                  <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-1">{s.value}</div>
                  <div className="text-sm text-gray-500">
                    {s.label}{' '}
                    {s.note && <span className="text-xs text-gray-400">(illustrative)</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Everything you need to create great content
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                One platform to generate, edit, and analyze — no context switching.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.bgClass}`}
                  >
                    <f.Icon className={`w-6 h-6 ${f.iconClass}`} aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How it works</h2>
              <p className="text-gray-500 text-lg">Three simple steps to better content.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {STEPS.map((s) => (
                <div key={s.step} className="text-center">
                  <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {s.step}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                Loved by creators worldwide
              </h2>
              <div className="flex justify-center gap-1 text-yellow-400" aria-label="5 out of 5 stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" aria-hidden="true" />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t) => (
                <div key={t.name} className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                      <div className="text-gray-500 text-xs">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Simple, transparent pricing
              </h2>
              <p className="text-gray-500 text-lg">Start free. Upgrade when you need more.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {PRICING.map((p) => (
                <div
                  key={p.tier}
                  className={`rounded-2xl p-8 border ${
                    p.highlighted
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-gray-200 text-gray-900'
                  }`}
                >
                  <div className="text-sm font-semibold mb-1 opacity-80">{p.tier}</div>
                  <div className="text-4xl font-bold mb-1">{p.price}</div>
                  <div
                    className={`text-sm mb-6 ${
                      p.highlighted ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {p.period}
                  </div>
                  <ul className="flex flex-col gap-3 mb-8">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <Check
                          className={`w-4 h-4 flex-shrink-0 ${
                            p.highlighted ? 'text-blue-200' : 'text-blue-600'
                          }`}
                          aria-hidden="true"
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => router.push('/auth/signup')}
                    className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors ${
                      p.highlighted
                        ? 'bg-white text-blue-600 hover:bg-blue-50'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {p.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TRUST BAR — scroll-triggered */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-y border-gray-100"
        >
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              {TRUST.map((t) => (
                <div key={t.label} className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <t.Icon className="w-6 h-6 text-blue-600" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{t.label}</div>
                    <div className="text-gray-500 text-sm">{t.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* FAQ */}
        <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Frequently asked questions
              </h2>
            </div>
            <div className="flex flex-col gap-3">
              {FAQ_ITEMS.map((item, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                    className="w-full flex items-center justify-between px-5 py-4 text-left font-medium text-gray-900 hover:bg-gray-50 transition-colors text-sm"
                  >
                    {item.q}
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${
                        openFaq === i ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA BANNER — scroll-triggered */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to supercharge your content?
            </h2>
            <p className="text-blue-100 text-lg mb-8">
              Join thousands of creators using ContentCraft-Inspector. Free forever — no credit card
              required.
            </p>
            <button
              onClick={() => router.push('/auth/signup')}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-base hover:bg-blue-50 transition-colors shadow-lg"
            >
              Get Started Free
            </button>
          </div>
        </motion.section>

        {/* FOOTER */}
        <footer className="py-10 px-4 sm:px-6 lg:px-8 bg-gray-900 text-gray-400">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Sparkles className="w-4 h-4 text-white" aria-hidden="true" />
              </div>
              <span className="text-white font-bold">ContentCraft-Inspector</span>
            </div>
            <nav className="flex flex-wrap gap-6 text-sm justify-center" aria-label="Footer navigation">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="hover:text-white transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </nav>
            <div className="text-sm">
              &copy; {new Date().getFullYear()} ContentCraft-Inspector. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
