'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'What types of content can I generate with ContentCraft Inspector?',
    answer:
      'You can generate blog posts, social media captions, product descriptions, ad copy, email drafts, and long-form articles. Simply provide a topic or brief, choose your tone and format, and the AI produces a ready-to-edit draft in seconds.',
  },
  {
    question: 'How does the SEO analysis work?',
    answer:
      'ContentCraft Inspector scans your content for keyword density, readability score, meta-tag completeness, and heading structure — then scores each factor against current search-engine best practices. You get a prioritized list of fixes so you know exactly what to change to improve ranking potential.',
  },
  {
    question: 'Who owns the content I create?',
    answer:
      'You do. All content you generate or upload belongs entirely to you. ContentCraft Inspector does not claim any license or ownership over your work, and we do not use your content to train our models.',
  },
  {
    question: "What's the difference between the Free and Pro plans?",
    answer:
      'The Free plan gives you access to AI generation, the smart editor, and basic SEO analysis with a monthly usage limit. Pro unlocks unlimited generations, advanced plagiarism checking, priority processing, and team collaboration seats. See the pricing section for a full side-by-side comparison.',
  },
  {
    question: 'Is my content private and secure?',
    answer:
      'Yes. All data is encrypted in transit and at rest using industry-standard encryption, and we follow security best practices to keep your information safe. Your drafts and projects are visible only to you — or to team members you explicitly invite.',
  },
  {
    question: 'Can I export my content to other formats?',
    answer:
      'You can export any piece of content as plain text, Markdown, or HTML directly from the editor. Copy-to-clipboard is available for every format, making it easy to paste into your CMS, email tool, or document editor.',
  },
  {
    question: 'Does ContentCraft Inspector support multiple languages?',
    answer:
      'ContentCraft Inspector supports content generation and analysis in multiple languages, including English, Spanish, French, German, Portuguese, and Japanese. Simply select your target language before generating or paste existing content for multilingual SEO analysis.',
  },
  {
    question: "How do I get started if I'm not a writer?",
    answer:
      "No writing experience is needed. Choose a content type, fill in a short prompt describing your topic and audience, and the AI handles the rest. The built-in editor lets you refine the output with one-click suggestions, so you can produce polished content even if you're starting from scratch.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  const renderItem = (faq: (typeof faqs)[0], index: number) => {
    const isOpen = openIndex === index;
    return (
      <div key={faq.question} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <button
          id={`faq-btn-${index}`}
          onClick={() => toggle(index)}
          aria-expanded={isOpen}
          className="w-full flex items-center justify-between px-6 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-2xl"
        >
          <span className="text-base font-semibold text-gray-900 pr-4">{faq.question}</span>
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
              id={`faq-panel-${index}`}
              role="region"
              aria-labelledby={`faq-btn-${index}`}
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
  };

  const mid = Math.ceil(faqs.length / 2);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="mb-16"
    >
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Frequently asked questions</h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          Everything you need to know before getting started with ContentCraft Inspector.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          {faqs.slice(0, mid).map((faq, i) => renderItem(faq, i))}
        </div>
        <div className="space-y-3">
          {faqs.slice(mid).map((faq, i) => renderItem(faq, mid + i))}
        </div>
      </div>
    </motion.div>
  );
}
