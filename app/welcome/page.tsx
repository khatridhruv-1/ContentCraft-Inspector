'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Wand2, Edit, FileSearch, Sparkles } from 'lucide-react';
import Head from 'next/head';

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

      <div className="relative min-h-screen bg-slate-950 dark:bg-slate-950 flex flex-col items-center justify-center p-6 overflow-hidden">
        {/* Dot-grid texture */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Ambient indigo blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-80 h-80 bg-indigo-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute top-40 right-20 w-80 h-80 bg-violet-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-indigo-400 rounded-full mix-blend-screen filter blur-3xl opacity-[0.12] animate-blob animation-delay-4000" />
        </div>

        {/* Main content */}
        <div className="relative z-10 max-w-4xl w-full">
          {/* Logo and Title */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-indigo-600/20 border border-indigo-500/30 backdrop-blur-sm p-4 rounded-2xl shadow-xl shadow-indigo-900/40">
                <Sparkles className="w-16 h-16 text-indigo-400" />
              </div>
            </div>
            <h1 className="text-6xl font-black leading-tight tracking-tight text-white mb-6">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-300 text-transparent bg-clip-text">
                ContentCraft-Inspector
              </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
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
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-indigo-500/40 transition-all duration-200">
              <div className="bg-indigo-500/20 border border-indigo-500/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Wand2 className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">AI-Powered</h3>
              <p className="text-slate-400">Generate high-quality content with advanced AI technology</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-indigo-500/40 transition-all duration-200">
              <div className="bg-indigo-500/20 border border-indigo-500/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Edit className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Smart Editor</h3>
              <p className="text-slate-400">Create and edit content with powerful tools</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-indigo-500/40 transition-all duration-200">
              <div className="bg-indigo-500/20 border border-indigo-500/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <FileSearch className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Deep Analysis</h3>
              <p className="text-slate-400">Get detailed insights and content optimization tips</p>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center gap-6 mb-12"
          >
            <button
              onClick={() => router.push('/auth/signup')}
              className="relative bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold
               hover:bg-indigo-500 transform hover:-translate-y-1 transition-all duration-200
               [box-shadow:0_0_0_1px_rgba(99,102,241,0.5),0_4px_24px_rgba(99,102,241,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]
               hover:[box-shadow:0_0_0_1px_rgba(99,102,241,0.7),0_8px_36px_rgba(99,102,241,0.55),inset_0_1px_0_rgba(255,255,255,0.15)]"
            >
              Get Started - It&apos;s Free
            </button>

            <button
              onClick={() => router.push('/auth/login')}
              className="bg-white/5 backdrop-blur-sm text-white px-8 py-4 rounded-xl text-lg font-semibold
               hover:bg-white/10 transform hover:-translate-y-1 transition-all duration-200
               border border-white/20 hover:border-indigo-500/50"
            >
              Sign In
            </button>
          </motion.div>

          {/* CTA Banner */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="rounded-2xl bg-gradient-to-r from-indigo-900/60 via-violet-900/60 to-indigo-800/60 backdrop-blur-md border border-indigo-500/20 p-6 text-center"
          >
            <p className="text-indigo-300 text-sm font-medium tracking-widest uppercase mb-1">
              Trusted by creators worldwide
            </p>
            <p className="text-white font-semibold text-lg">
              Start crafting better content today — no credit card required
            </p>
          </motion.div>
        </div>

        <style jsx>{`
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
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
