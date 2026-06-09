'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  marketingAuthInput,
  marketingFieldShell,
  marketingLabel,
} from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

interface AuthTextFieldProps {
  id: string;
  name: string;
  type?: string;
  label: string;
  icon?: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  autoComplete?: string;
  required?: boolean;
  placeholder?: string;
}

const fieldShell = cn(
  'auth-field flex h-11 w-full pl-2.5 pr-2',
  marketingFieldShell
);

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
  placeholder,
}: AuthTextFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = type === 'password';
  const inputType = isPasswordField ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className={marketingLabel}>
        {label}
      </Label>
      <div
        className={cn(
          fieldShell,
          error && 'border-red-400/70 focus-within:border-red-400/70 focus-within:ring-red-400/20'
        )}
        style={{ colorScheme: 'dark' }}
      >
        {icon && (
          <span
            className="flex h-4 w-4 shrink-0 items-center justify-center text-white/45 [&_svg]:h-4 [&_svg]:w-4"
            aria-hidden
          >
            {icon}
          </span>
        )}
        <input
          id={id}
          name={name}
          type={inputType}
          autoComplete={autoComplete}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={e => {
            if (!isPasswordField) return;
            const field = e.currentTarget.closest('.auth-field');
            if (!field) return;
            requestAnimationFrame(() => {
              field.scrollIntoView({ block: 'center', behavior: 'smooth' });
            });
          }}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={marketingAuthInput}
          style={{
            backgroundColor: 'transparent',
            color: '#ffffff',
            WebkitBoxShadow: 'none',
            WebkitTextFillColor: '#ffffff',
          }}
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword(prev => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/50 hover:text-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-1.5 text-sm text-red-400"
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
