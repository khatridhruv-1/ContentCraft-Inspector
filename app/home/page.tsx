'use client';

import { motion } from 'framer-motion';
import { Edit, FileSearch, Wand2, Lightbulb, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

const MODES = [
  {
    mode: 'ai-generate',
    icon: Wand2,
    accent: 'from-blue-400 to-blue-600',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    labelColor: 'text-blue-500',
    label: 'AI-Powered',
    title: 'Generate with AI',
    description: 'Create high-quality content instantly using our advanced AI technology',
    delay: 0.1,
  },
  {
    mode: 'create',
    icon: Edit,
    accent: 'from-green-400 to-emerald-600',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    labelColor: 'text-green-500',
    label: 'Smart Editor',
    title: 'Create Content',
    description: 'Write and edit your content with our powerful editor tools',
    delay: 0.2,
  },
  {
    mode: 'analyze',
    icon: FileSearch,
    accent: 'from-purple-400 to-purple-600',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    labelColor: 'text-purple-500',
    label: 'Deep Insights',
    title: 'Analyze Content',
    description: 'Get detailed insights and analysis of your content',
    delay: 0.3,
  },
] as const;

function HomeHeader() {
  return (
    <header className="sticky top-0 z-20 backdrop-blur-md bg-white/70 border-b border-white/50 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          ContentCraft Inspector
        </span>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-md">
          <User className="w-5 h-5 text-white" />
        </div>
      </div>
    </header>
  );
}

function ProTipBanner() {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="w-full max-w-6xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-2xl p-6 flex items-center gap-4 shadow-sm"
    >
      <div className="bg-yellow-100 p-3 rounded-full flex-shrink-0">
        <Lightbulb className="h-6 w-6 text-yellow-500" />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-0.5">Pro Tip</p>
        <p className="text-sm text-gray-600">
          Start with <span className="font-medium text-blue-600">Generate with AI</span> to quickly draft content, then refine it in <span className="font-medium text-green-600">Create Content</span>, and use <span className="font-medium text-purple-600">Analyze Content</span> for optimization insights.
        </p>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const router = useRouter();

  const handleModeChange = (mode: string) => {
    router.push(`/dashboard?mode=${mode}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative flex flex-col">
      {/* Background blob decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <HomeHeader />

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-16">
        {/* Hero section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Welcome to your{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              creative workspace
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your all-in-one platform for content creation, analysis, and optimization
          </p>
        </motion.div>

        {/* Mode cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mb-12">
          {MODES.map(({ mode, icon: Icon, accent, iconBg, iconColor, labelColor, label, title, description, delay }) => (
            <motion.div
              key={mode}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              whileHover={{ y: -8, transition: { duration: 0.15, delay: 0 } }}
              transition={{ duration: 0.5, delay }}
              onClick={() => handleModeChange(mode)}
              className="bg-white rounded-2xl border border-gray-100 shadow-lg cursor-pointer overflow-hidden"
            >
              <div className={`h-1.5 bg-gradient-to-r ${accent}`} />
              <div className="flex flex-col items-center text-center p-8">
                <div className={`${iconBg} p-4 rounded-full mb-4`}>
                  <Icon className={`h-12 w-12 ${iconColor}`} />
                </div>
                <span className={`text-xs font-semibold uppercase tracking-wider ${labelColor} mb-2`}>{label}</span>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">{title}</h2>
                <p className="text-gray-600">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <ProTipBanner />
      </div>
    </div>
  );
}
