import React from 'react';
import { BottomNav } from './BottomNav';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  // Check if we are on Landing or Onboarding page
  const isAuthPage = location.pathname.endsWith('/join') || location.pathname.split('/').length <= 3;
  const isAdminPage = location.pathname.includes('/admin');
  const showNav = !isAuthPage && !isAdminPage;

  return (
    <div className={`min-h-screen font-sans pb-24 relative overflow-hidden transition-colors duration-500 ${
      isAuthPage ? 'bg-slate-900 text-white stars-bg' : 'bg-[#F5F5F7] text-[#1D1D1F]'
    }`}>
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
        {isAuthPage ? (
          // Dark mode subtle glows
          <>
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-900/40 rounded-full mix-blend-screen filter blur-3xl animate-blob" />
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-900/40 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000" />
            <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] bg-blue-900/40 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-4000" />
          </>
        ) : (
          // Light mode blobs
          <>
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
            <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
          </>
        )}
      </div>

      <main className="max-w-md mx-auto p-4 min-h-screen relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.02, y: -10 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 25,
              mass: 0.5
            }}
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      {showNav && <BottomNav />}
    </div>
  );
}
