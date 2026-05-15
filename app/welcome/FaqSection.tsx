'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'What is ContentCraft Inspector?',
    answer:
      'ContentCraft Inspector is an AI-powered platform that helps you create, analyze, and optimize content. It combines advanced language models with SEO and plagiarism analysis tools so you can produce high-quality, original content that ranks well.',
  },
  {
    question: 'Is there a free plan?',
    answer:
      'Yes! ContentCraft Inspector offers a free plan that lets you explore core features without entering a credit card. You can generate and analyze content up to a generous monthly limit before deciding to upgrade.',
  },
  {
    question: 'Do I need a credit card to sign up?',
    answer:
      'No credit card is required to create a free account. You only need to provide payment details if you choose to upgrade to a paid plan.',
  },
  {
    question: 'What AI models power the content generation?',
    answer:
      'ContentCraft Inspector uses state-of-the-art large language models to generate and refine content. Our pipeline is regularly updated to leverage the best available models, ensuring high-quality, contextually relevant output.',
  },
  {
    question: 'How accurate is the plagiarism and SEO analysis?',
    answer:
      'Our plagiarism detector checks content against billions of web pages and academic sources, achieving industry-leading accuracy. The SEO analysis engine evaluates keyword density, readability, and metadata against current search-engine best practices.',
  },
  {
    question: 'Can I use ContentCraft Inspector for team collaboration?',
    answer:
      'Absolutely. Team plans support multiple seats, shared workspaces, and real-time collaborative editing so your entire content team can work together seamlessly.',
  },
  {
    question: 'How is my data stored and kept secure?',
    answer:
      'All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We follow SOC 2 Type II practices and never sell your data to third parties. You retain full ownership of your content at all times.',
  },
  {
    question: 'Can I cancel my subscription at any time?',
    answer:
      'Yes. You can cancel your subscription from your account settings with no cancellation fees. Your plan remains active until the end of the current billing period, and you can continue using free-tier features after that.',
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

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

      <div className="space-y-3 max-w-3xl mx-auto">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <button
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${index}`}
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
        })}
      </div>
    </motion.div>
  );
}
