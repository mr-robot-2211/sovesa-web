'use client';

import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export default function LoginDialog({ isOpen, onClose, onLoginSuccess }: LoginDialogProps) {
  if (!isOpen) return null;

  const handleLogin = () => {
    signIn('google');
    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl p-8 max-w-md w-full text-center"
      >
        <div className="text-6xl mb-4">🔐</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h3>
        <p className="text-gray-600 mb-6">
          Please log in with your Google account to continue.
        </p>
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleLogin}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Login with Google
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
} 