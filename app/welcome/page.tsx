'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Wand2, Edit, FileSearch, Sparkles, ArrowRight } from 'lucide-react';
import Head from 'next/head';
import FaqSection from './FaqSection';

const PARTICLES = [
  { id: 0, size: 4, left: 8, top: 20, duration: 20, delay: 0 },
  { id: 1, size: 3, left: 18, top: 65, duration: 25, delay: 1 },
  { id: 2, size: 5, left: 30, top: 40, duration: 18, delay: 2.5 },
  { id: 3, size: 2, left: 45, top: 10, duration: 22, delay: 0.5 },
  { id: 4, size: 4, left: 55, top: 80, duration: 28, delay: 3 },
  { id: 5, size: 3, left: 70, top: 25, duration: 20, delay: 1.5 },
  { id: 6, size: 5, left: 82, top: 55, duration: 24, delay: 4 },
  { id: 7, size: 2, left: 92, top: 70, duration: 19, delay: 0.8 },
  { id: 8, size: 4, left: 25, top: 85, duration: 23, delay: 2 },
  { id: 9, size: 3, left: 60, top: 90, duration: 17, delay: 1.2 },
  { id: 10, size: 4, left: 75, top: 45, duration: 21, delay: 3.5 },
  { id: 11, size: 2, left: 38, top: 60, duration: 26, delay: 0.3 },
  { id: 12, size: 5, left: 12, top: 45, duration: 16, delay: 4.5 },
  { id: 13, size: 3, left: 48, top: 30, duration: 29, delay: 2.8 },
  { id: 14, size: 4, left: 85, top: 15, duration: 22, delay: 1.7 },
  { id: 15, size: 2, left: 65, top: 75, duration: 20, delay: 0.6 },
  { id: 16, size: 5, left: 95, top: 35, duration: 18, delay: 3.2 },
  { id: 17, size: 3, left: 20, top: 92, duration: 24, delay: 1.9 },
  { id: 18, size: 4, left: 42, top: 5, duration: 27, delay: 4.2 },
  { id: 19, size: 2, left: 78, top: 88, duration: 21, delay: 2.3 },
];

const heroVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const heroItemVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8 } },
};

const cardContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6 } },
};

const features = [
  {
    icon: Wand2,
    title: 'AI-Powered',
    description: 'Generate high-quality content with advanced AI technology',
    bg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    icon: Edit,
    title: 'Smart Editor',
    description: 'Create and edit content with powerful tools',
    bg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    icon: FileSearch,
    title: 'Deep Analysis',
    description: 'Get detailed insights and content optimization tips',
    bg: 'bg-pink-100',
    iconColor: 'text-pink-600',
  },
];

export default function Welcome() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Welcome to ContentCraft-Inspector</title>
        <meta
          name="description"
          content="Content creation with ContentCraft-Inspector's AI platform. Create, analyze, and optimize content with smart editing tools and deep insights. Try it free today!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob" />
          <div className="absolute top-40 right-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-2000" />
          <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-4000" />
          <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-3000" />
          <div className="absolute bottom-1/3 right-1/4 w-56 h-56 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-5000" />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          {PARTICLES.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full bg-blue-400/20 animate-float-particle"
              style={{
                width: p.size,
                height: p.size,
                left: `${p.left}%`,
                top: `${p.top}%`,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <div className="relative z-10 max-w-4xl w-full">
          {/* Hero */}
          <motion.div
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-16"
          >
            <motion.div variants={heroItemVariants} className="flex justify-center mb-6">
              <motion.div
                className="bg-white p-4 rounded-2xl shadow-xl"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Sparkles className="w-16 h-16 text-blue-600" />
              </motion.div>
            </motion.div>

            <motion.h1 variants={heroItemVariants} className="text-6xl font-bold text-gray-900 mb-6">
              Welcome to{' '}
              <span className="animate-gradient-x bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-[length:200%_auto] text-transparent bg-clip-text">
                ContentCraft-Inspector
              </span>
            </motion.h1>

            <span
              data-testid="qa-pipeline-badge-v3"
              className="inline-block bg-blue-600 text-white text-sm font-semibold px-4 py-1 rounded-full mb-6"
            >
              QA-PIPELINE-v3-PASS
            </span>

            <motion.p
              variants={heroItemVariants}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Your all-in-one platform for creating, analyzing, and optimizing content with the power of AI
            </motion.p>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            variants={cardContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-3 gap-6 mb-16"
          >
            {features.map(({ icon: Icon, title, description, bg, iconColor }) => (
              <motion.div
                key={title}
                variants={cardVariants}
                whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl border border-transparent hover:border-indigo-100 transition-all duration-200 cursor-default"
              >
                <motion.div
                  className={`${bg} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}
                  whileHover={{ rotate: 12, scale: 1.15, transition: { type: 'spring', stiffness: 300, damping: 15 } }}
                >
                  <Icon className={`w-6 h-6 ${iconColor}`} />
                </motion.div>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-gray-600">{description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* FAQ Section */}
          <FaqSection />

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center gap-6"
          >
            <motion.button
              onClick={() => router.push('/auth/signup')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow group"
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12" />
              <span className="relative flex items-center gap-2">
                Get Started - It&apos;s Free
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                  <ArrowRight className="w-5 h-5" />
                </span>
              </span>
            </motion.button>

            <motion.button
              onClick={() => router.push('/auth/login')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-white text-gray-800 px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl border border-gray-200 transition-shadow"
            >
              Sign In
            </motion.button>
          </motion.div>
        </div>

        <style jsx>{`
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob { animation: blob 7s infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-3000 { animation-delay: 3s; }
          .animation-delay-4000 { animation-delay: 4s; }
          .animation-delay-5000 { animation-delay: 5s; }

          @keyframes float-particle {
            0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.4; }
            33% { transform: translateY(-15px) translateX(8px); opacity: 0.8; }
            66% { transform: translateY(-8px) translateX(-6px); opacity: 0.6; }
          }
          .animate-float-particle { animation: float-particle ease-in-out infinite; }

          @media (prefers-reduced-motion: reduce) {
            .animate-blob,
            .animate-float-particle {
              animation: none !important;
            }
          }
        `}</style>
      </div>
    </>
  );
}
