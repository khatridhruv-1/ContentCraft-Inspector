'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Edit, FileSearch, Sparkles, ChevronDown } from 'lucide-react';
import Head from 'next/head';

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

export default function Welcome() {
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      {/* Meta information for SEO */}
      <Head>
        <title>Welcome to ContentCraft-Inspector</title>
        <meta
          name="description"
          content="Content creation with ContentCraft-Inspector's AI platform. Create, analyze, and optimize content with smart editing tools and deep insights. Try it free today!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center p-6">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-40 right-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        {/* Main content */}
        <div className="relative z-10 max-w-4xl w-full">
          {/* Logo and Title Section */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-white p-4 rounded-2xl shadow-xl">
                <Sparkles className="w-16 h-16 text-blue-600" />
              </div>
            </div>
            <h1 className="text-6xl font-bold text-gray-900 mb-6">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                ContentCraft-Inspector
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your all-in-one platform for creating, analyzing, and optimizing content with the power of AI
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-3 gap-6 mb-16"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Wand2 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">AI-Powered</h3>
              <p className="text-gray-600">Generate high-quality content with advanced AI technology</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Edit className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Smart Editor</h3>
              <p className="text-gray-600">Create and edit content with powerful tools</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-pink-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <FileSearch className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Deep Analysis</h3>
              <p className="text-gray-600">Get detailed insights and content optimization tips</p>
            </div>
          </motion.div>

          {/* FAQ Section */}
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

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center gap-6"
          >
            <button
              onClick={() => router.push('/auth/signup')}
              className={`bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold 
               hover:bg-blue-700 transform hover:-translate-y-1 transition-all duration-200
               shadow-lg hover:shadow-xl`}
            >
              Get Started - It&apos;s Free
            </button>

            <button
              onClick={() => router.push('/auth/login')}
              className={`bg-white text-gray-800 px-8 py-4 rounded-xl text-lg font-semibold
               hover:bg-gray-50 transform hover:-translate-y-1 transition-all duration-200
               shadow-lg hover:shadow-xl border border-gray-200`}
            >
              Sign In
            </button>
          </motion.div>
        </div>

        {/* Add animation keyframes in style tag */}
        <style jsx>{`
          @keyframes blob {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>
      </div>
    </>
  );
}