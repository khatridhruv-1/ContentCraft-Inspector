'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, MessageCircle } from 'lucide-react';

type Category = 'Content Generation' | 'SEO' | 'Plans & Pricing' | 'Privacy & Security';

const categoryColors: Record<Category, string> = {
  'Content Generation': 'bg-blue-100 text-blue-700',
  SEO: 'bg-green-100 text-green-700',
  'Plans & Pricing': 'bg-purple-100 text-purple-700',
  'Privacy & Security': 'bg-orange-100 text-orange-700',
};

const SUPPORT_EMAIL = 'support@contentcraft-inspector.com';

const faqs: { question: string; answer: string; category: Category }[] = [
  {
    question: 'What types of content can I generate with ContentCraft Inspector?',
    answer:
      'You can generate blog posts, social media captions, product descriptions, ad copy, email drafts, and long-form articles. Simply provide a topic or brief, choose your tone and format, and the AI produces a ready-to-edit draft in seconds.',
    category: 'Content Generation',
  },
  {
    question: 'How does the SEO analysis work?',
    answer:
      'ContentCraft Inspector scans your content for keyword density, readability score, meta-tag completeness, and heading structure — then scores each factor against current search-engine best practices. You get a prioritized list of fixes so you know exactly what to change to improve ranking potential.',
    category: 'SEO',
  },
  {
    question: 'Who owns the content I create?',
    answer:
      'You do. All content you generate or upload belongs entirely to you. ContentCraft Inspector does not claim any license or ownership over your work, and we do not use your content to train our models.',
    category: 'Privacy & Security',
  },
  {
    question: "What's the difference between the Free and Pro plans?",
    answer:
      'The Free plan gives you access to AI generation, the smart editor, and basic SEO analysis with a monthly usage limit. Pro unlocks unlimited generations, advanced plagiarism checking, priority processing, and team collaboration seats. See the pricing section for a full side-by-side comparison.',
    category: 'Plans & Pricing',
  },
  {
    question: 'Is my content private and secure?',
    answer:
      'Yes. All data is encrypted in transit and at rest using industry-standard encryption, and we follow security best practices to keep your information safe. Your drafts and projects are visible only to you — or to team members you explicitly invite.',
    category: 'Privacy & Security',
  },
  {
    question: 'Can I export my content to other formats?',
    answer:
      'You can export any piece of content as plain text, Markdown, or HTML directly from the editor. Copy-to-clipboard is available for every format, making it easy to paste into your CMS, email tool, or document editor.',
    category: 'Content Generation',
  },
  {
    question: 'Does ContentCraft Inspector support multiple languages?',
    answer:
      'ContentCraft Inspector supports content generation and analysis in multiple languages, including English, Spanish, French, German, Portuguese, and Japanese. Simply select your target language before generating or paste existing content for multilingual SEO analysis.',
    category: 'Content Generation',
  },
  {
    question: "How do I get started if I'm not a writer?",
    answer:
      "No writing experience is needed. Choose a content type, fill in a short prompt describing your topic and audience, and the AI handles the rest. The built-in editor lets you refine the output with one-click suggestions, so you can produce polished content even if you're starting from scratch.",
    category: 'Content Generation',
  },
];

type FaqItemProps = {
  faq: { question: string; answer: string; category: Category; originalIndex: number };
  isOpen: boolean;
  onToggle: () => void;
};

function FaqItem({ faq, isOpen, onToggle }: FaqItemProps) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 ${
        isOpen ? 'border-l-4 border-l-blue-500' : ''
      }`}
    >
      <button
        id={`faq-btn-${faq.originalIndex}`}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${faq.originalIndex}`}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-2xl transition-colors"
      >
        <div className="flex flex-col gap-1.5 pr-4">
          <span className="text-base font-semibold text-gray-900">{faq.question}</span>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full self-start ${categoryColors[faq.category]}`}
          >
            {faq.category}
          </span>
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 text-gray-500"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-panel-${faq.originalIndex}`}
            role="region"
            aria-labelledby={`faq-btn-${faq.originalIndex}`}
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-gray-600 leading-relaxed">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqSection() {
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return faqs.map((faq, i) => ({ ...faq, originalIndex: i }));
    return faqs
      .map((faq, i) => ({ ...faq, originalIndex: i }))
      .filter(
        faq =>
          faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q),
      );
  }, [searchQuery]);

  const allExpanded =
    filteredFaqs.length > 0 && filteredFaqs.every(f => openIndices.has(f.originalIndex));

  const toggle = (index: number) => {
    setOpenIndices(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (allExpanded) {
      setOpenIndices(new Set());
    } else {
      setOpenIndices(new Set(filteredFaqs.map(f => f.originalIndex)));
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="mb-16"
    >
      <div className="text-center mb-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Frequently asked questions</h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          Everything you need to know before getting started with ContentCraft Inspector.
        </p>
      </div>

      <div className="flex justify-end max-w-3xl mx-auto mb-4">
        <button
          onClick={toggleAll}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          {allExpanded ? 'Collapse all' : 'Expand all'}
        </button>
      </div>

      <div className="relative max-w-3xl mx-auto mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          aria-label="Search frequently asked questions"
          type="text"
          placeholder="Search questions..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-sm text-gray-900 placeholder:text-gray-400"
        />
      </div>

      <div className="space-y-3 max-w-3xl mx-auto">
        {filteredFaqs.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No results found for &ldquo;{searchQuery}&rdquo;
          </p>
        ) : (
          filteredFaqs.map(faq => (
            <FaqItem
              key={faq.originalIndex}
              faq={faq}
              isOpen={openIndices.has(faq.originalIndex)}
              onToggle={() => toggle(faq.originalIndex)}
            />
          ))
        )}
      </div>

      <div className="mt-10 max-w-3xl mx-auto text-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
        <MessageCircle className="w-8 h-8 text-blue-600 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Still have questions?</h3>
        <p className="text-gray-600 mb-4 text-sm">
          Can&apos;t find the answer you&apos;re looking for? Our support team is here to help.
        </p>
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          Contact Support
        </a>
      </div>
    </motion.div>
  );
}
