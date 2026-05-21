'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    number: 1,
    title: 'Create your account',
    description: 'Sign up free or sign in if you already have an account to get started.',
  },
  {
    number: 2,
    title: 'Open the dashboard',
    description: 'After login, go to the dashboard to start a new content project.',
  },
  {
    number: 3,
    title: 'Generate & edit content',
    description: 'Use AI tools to draft content, then refine it in the smart editor.',
  },
  {
    number: 4,
    title: 'Analyze & optimize',
    description: 'Run analysis (SEO, plagiarism, info gain) and apply suggestions before publishing.',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6 } },
};

export default function UserGuideSection() {
  return (
    <section data-testid="homepage-user-guide" className="mb-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-foreground mb-3">How to get started</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          From sign-up to publishing — four simple steps to your first piece of AI-powered content.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
      >
        {steps.map(({ number, title, description }) => (
          <motion.div
            key={number}
            variants={cardVariants}
            whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
            className="bg-card text-card-foreground rounded-2xl p-6 shadow-lg hover:shadow-xl border border-transparent hover:border-indigo-100 dark:hover:border-indigo-800 transition-all duration-200 cursor-default flex gap-4"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              {number}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
              <p className="text-muted-foreground">{description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
