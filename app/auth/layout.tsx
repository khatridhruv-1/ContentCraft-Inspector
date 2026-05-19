'use client';

import type { ReactNode } from "react";
import { useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: LayoutProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = useReducedMotion();

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    setMousePos({
      x: (clientX / window.innerWidth - 0.5) * 24,
      y: (clientY / window.innerHeight - 0.5) * 24,
    });
  }, []);

  return (
    <html lang="en">
      <body>
        <div
          className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6 relative overflow-hidden"
          onMouseMove={handleMouseMove}
        >
          {/* Parallax blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob transition-transform duration-75 ease-out"
              style={{ transform: `translate(${mousePos.x * 0.6}px, ${mousePos.y * 0.6}px)` }}
            />
            <div
              className="absolute top-40 right-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-2000 transition-transform duration-75 ease-out"
              style={{ transform: `translate(${mousePos.x * -0.4}px, ${mousePos.y * -0.4}px)` }}
            />
            <div
              className="absolute -bottom-8 left-1/3 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-4000 transition-transform duration-75 ease-out"
              style={{ transform: `translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.5}px)` }}
            />
          </div>

          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="relative z-10 w-full max-w-md"
          >
            {/* Animated gradient border wrapper */}
            <div className="relative p-[2px] rounded-2xl overflow-hidden">
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b, #3b82f6)',
                }}
                animate={prefersReducedMotion ? {} : { rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                whileHover={{ boxShadow: '0 0 32px 8px rgba(99, 102, 241, 0.25)' }}
                transition={{ duration: 0.3 }}
                className="bg-white/90 backdrop-blur-2xl rounded-[14px] shadow-2xl p-8 relative"
              >
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-4">
                    <motion.div
                      className="bg-blue-100 p-3 rounded-xl animate-pulse-glow"
                      animate={{ rotate: [0, 8, -8, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <Sparkles className="w-8 h-8 text-blue-600" />
                    </motion.div>
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                    ContentCraft Inspector
                  </h2>
                </div>
                {children}
              </motion.div>
            </div>
          </motion.div>

          <style jsx global>{`
            @keyframes blob {
              0% { transform: translate(0px, 0px) scale(1); }
              33% { transform: translate(30px, -50px) scale(1.1); }
              66% { transform: translate(-20px, 20px) scale(0.9); }
              100% { transform: translate(0px, 0px) scale(1); }
            }
            .animate-blob { animation: blob 7s infinite; }
            .animation-delay-2000 { animation-delay: 2s; }
            .animation-delay-4000 { animation-delay: 4s; }

            @keyframes pulse-glow {
              0%, 100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
              50% { box-shadow: 0 0 20px 6px rgba(99, 102, 241, 0.25); }
            }
            .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }

            @keyframes shimmer-text {
              0% { background-position: 200% center; }
              100% { background-position: -200% center; }
            }
            .animate-shimmer-text {
              animation: shimmer-text 3s linear infinite;
              background-size: 200% auto;
            }

            @media (prefers-reduced-motion: reduce) {
              .animate-blob,
              .animate-pulse-glow,
              .animate-shimmer-text {
                animation: none !important;
              }
            }
          `}</style>
        </div>
      </body>
    </html>
  );
}
