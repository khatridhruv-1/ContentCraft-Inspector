'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface AuthTextFieldProps {
  id: string;
  name: string;
  type?: string;
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  autoComplete?: string;
  required?: boolean;
}

export default function AuthTextField({
  id,
  name,
  type = 'text',
  label,
  icon,
  value,
  onChange,
  error,
  autoComplete,
  required,
}: AuthTextFieldProps) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = type === 'password';
  const inputType = isPasswordField ? (showPassword ? 'text' : 'password') : type;
  const isFloated = focused || value.length > 0;

  return (
    <div className="relative">
      <div
        className={`absolute left-3 top-[14px] pointer-events-none z-10 transition-colors duration-200 ${
          focused ? 'text-blue-500' : 'text-gray-400'
        }`}
      >
        {icon}
      </div>

      <Input
        id={id}
        name={name}
        type={inputType}
        autoComplete={autoComplete}
        required={required}
        placeholder=" "
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`pl-10 ${isPasswordField ? 'pr-10' : ''} h-14 pt-5 pb-1 text-sm transition-all duration-200
          focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-0
          ${error ? 'border-red-500 focus-visible:ring-red-500/40' : 'border-gray-300'}`}
      />

      <label
        htmlFor={id}
        className={`absolute left-10 pointer-events-none transition-all duration-200 origin-left select-none
          ${isFloated ? 'top-2 text-xs text-blue-600' : 'top-4 text-sm text-gray-500'}`}
      >
        {label}
      </label>

      {isPasswordField && (
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="absolute right-3 top-[14px] text-gray-400 hover:text-gray-600 transition-colors"
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      )}

      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1 text-sm text-red-500 flex items-center gap-1"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
