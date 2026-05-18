"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence, useAnimation, useReducedMotion } from "framer-motion";
import { AlertCircle, Loader2, User, Mail, Lock, Building2, UserPlus, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

import { signup } from "@/lib/user/appwrite";
import { createCompany, joinCompany, checkCompanyDomain } from "@/lib/companyHelper/companyHelpers";

interface ValidationError {
  field: string;
  message: string;
}

type Step = "signup" | "company" | "done";

const PUBLIC_DOMAINS = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com"];

const STEP_LABELS = [
  { key: "signup", label: "Account" },
  { key: "company", label: "Company" },
];

const PREMIUM_EASE = [0.22, 1, 0.36, 1] as const;

const fieldVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: PREMIUM_EASE },
  },
};

const STRENGTH_COLORS = ['#ef4444', '#eab308', '#3b82f6', '#22c55e'];

const CONFETTI_PARTICLES = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * 360;
  const distance = 55 + (i % 4) * 15;
  const rad = (angle * Math.PI) / 180;
  return {
    id: i,
    x: Math.cos(rad) * distance,
    y: Math.sin(rad) * distance,
    color: ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'][i % 5],
    size: 6 + (i % 3) * 2,
  };
});

function ProgressBar({ step }: { step: Step }) {
  const activeIndex = step === "signup" ? 0 : 1;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2">
        {STEP_LABELS.map((s, i) => {
          const isCompleted = i < activeIndex;
          const isActive = i === activeIndex;
          return (
            <div key={s.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-1.5 shrink-0">
                <motion.div
                  animate={{
                    backgroundColor: isCompleted ? '#2563eb' : isActive ? '#3b82f6' : '#e5e7eb',
                    scale: isActive ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                >
                  {isCompleted ? '✓' : i + 1}
                </motion.div>
                <span className={`text-xs font-medium transition-colors duration-300 ${isActive ? 'text-blue-600' : isCompleted ? 'text-blue-500' : 'text-gray-400'}`}>
                  {s.label}
                </span>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <motion.div className="flex-1 mx-2 h-0.5 rounded-full overflow-hidden bg-gray-200">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: isCompleted ? '100%' : '0%' }}
                    transition={{ duration: 0.4 }}
                    className="h-full bg-blue-500 rounded-full"
                  />
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Signup() {
  const [step, setStep] = useState<Step>("signup");
  const [error, setError] = useState<ValidationError | null>(null);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyInfo, setCompanyInfo] = useState<any>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [ripple, setRipple] = useState<{ x: number; y: number; id: number } | null>(null);

  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  const nameShakeControls = useAnimation();
  const emailShakeControls = useAnimation();
  const passwordShakeControls = useAnimation();

  // Combined variants: step entrance/exit + stagger for children
  const signupFormVariants = shouldReduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, x: -20, scale: 0.97 },
        visible: {
          opacity: 1,
          x: 0,
          scale: 1,
          transition: {
            duration: 0.35,
            ease: PREMIUM_EASE,
            staggerChildren: 0.09,
            delayChildren: 0.05,
          },
        },
        exit: {
          opacity: 0,
          x: 20,
          scale: 0.96,
          transition: { duration: 0.35, ease: PREMIUM_EASE },
        },
      };

  const stepTransition = { duration: 0.35, ease: PREMIUM_EASE };

  useEffect(() => {
    if (step === "done") {
      const timer = setTimeout(() => router.push("/home"), 2200);
      return () => clearTimeout(timer);
    }
  }, [step, router]);

  const triggerShake = (controls: ReturnType<typeof useAnimation>) => {
    if (shouldReduceMotion) return;
    controls.start({
      x: [-8, 8, -6, 6, -3, 3, 0],
      transition: { duration: 0.5, ease: 'easeInOut' },
    });
  };

  const validateForm = (name: string, email: string, pass: string): ValidationError | null => {
    if (name.length < 2) return { field: "name", message: "Name must be at least 2 characters" };
    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email))
      return { field: "email", message: "Please enter a valid email address" };
    if (pass.length < 6) return { field: "password", message: "Password must be at least 6 characters" };
    return null;
  };

  const getPasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;
    return strength;
  };

  const renderPasswordStrength = () => {
    const strength = getPasswordStrength(password);
    const labels = ["Enter password", "Weak", "Fair", "Good", "Strong"];

    return (
      <div className="space-y-1.5 mt-2">
        <div className="flex gap-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-1 flex-1 rounded-full overflow-hidden bg-gray-200">
              <motion.div
                animate={{
                  scaleX: i < strength ? 1 : 0,
                  backgroundColor: i < strength ? STRENGTH_COLORS[strength - 1] : '#e5e7eb',
                }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { type: 'spring', stiffness: 200, damping: 20, delay: i * 0.04 }
                }
                className="h-full w-full rounded-full origin-left"
                style={{ scaleX: 0 }}
              />
            </div>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={strength}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 4 }}
            transition={{ duration: 0.2 }}
            className="text-xs text-gray-500"
          >
            {labels[strength]}
          </motion.p>
        </AnimatePresence>
      </div>
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const pass = formData.get("password") as string;

    const validationError = validateForm(name, email, pass);
    if (validationError) {
      setError(validationError);
      setLoading(false);
      if (validationError.field === "name") triggerShake(nameShakeControls);
      if (validationError.field === "email") triggerShake(emailShakeControls);
      if (validationError.field === "password") triggerShake(passwordShakeControls);
      return;
    }

    try {
      const session = await signup(email, pass, name);
      localStorage.setItem("sessionToken", session.secret);

      const domain = email.split("@")[1];
      const isPublic = PUBLIC_DOMAINS.includes(domain.toLowerCase());

      if (isPublic) {
        setCompanyInfo({ company: null, user: session.userId, domain });
      } else {
        const matchedCompany = await checkCompanyDomain(domain);
        setCompanyInfo({ company: matchedCompany, user: session.userId, domain });
      }

      setStep("company");
    } catch (err) {
      const msg = (err as Error).message;
      setError({
        field: msg.includes("already exists") ? "email" : "general",
        message: msg.includes("already exists")
          ? "This email is already registered"
          : "Failed to create account. Please try again.",
      });
      if (msg.includes("already exists")) triggerShake(emailShakeControls);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCompany = async () => {
    if (!companyInfo?.company || !companyInfo?.user) return;
    setLoading(true);
    try {
      await joinCompany(companyInfo.company.$id, companyInfo.user);
      setStep("done");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompany = async () => {
    if (!companyName || !companyInfo?.user) {
      setError({ field: "companyName", message: "Please enter your company name" });
      return;
    }
    setLoading(true);
    try {
      await createCompany({
        name: companyName,
        domain: companyInfo.domain,
        users: [companyInfo.user],
      });
      setStep("done");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (shouldReduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top, id: Date.now() });
    setTimeout(() => setRipple(null), 600);
  };

  return (
    <div>
      {step !== "done" && <ProgressBar step={step} />}

      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-700">
          {step === "signup" && "Create Account"}
          {step === "company" && "Company Setup"}
          {step === "done" && "Welcome aboard!"}
        </h3>
      </div>

      <AnimatePresence mode="wait">
        {step === "signup" && (
          <motion.form
            key="signup"
            onSubmit={handleSubmit}
            variants={signupFormVariants}
            initial={shouldReduceMotion ? { opacity: 0 } : "hidden"}
            animate={shouldReduceMotion ? { opacity: 1 } : "visible"}
            exit={shouldReduceMotion ? { opacity: 0, transition: { duration: 0.15 } } : "exit"}
            className="space-y-4"
          >
            {/* Name field */}
            <motion.div variants={shouldReduceMotion ? undefined : fieldVariants}>
              <motion.div className="relative" animate={nameShakeControls}>
                <motion.div
                  className="absolute left-3 top-4 pointer-events-none z-10"
                  animate={
                    shouldReduceMotion
                      ? undefined
                      : {
                          scale: focusedField === 'name' ? 1.15 : 1,
                          color: focusedField === 'name' ? '#3b82f6' : '#9ca3af',
                        }
                  }
                  transition={{ duration: 0.15 }}
                >
                  <User className="h-5 w-5" />
                </motion.div>

                <AnimatePresence>
                  {focusedField === 'name' && !shouldReduceMotion && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute inset-0 rounded-md ring-2 ring-blue-400/40 pointer-events-none z-10"
                    />
                  )}
                </AnimatePresence>

                <Input
                  id="name"
                  name="name"
                  placeholder=" "
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  className={`peer pl-10 h-14 pt-5 pb-1 text-sm transition-all duration-200
                    focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-0
                    ${error?.field === 'name' ? 'border-red-500' : 'border-gray-300'}`}
                />
                <label
                  htmlFor="name"
                  className={`absolute left-10 pointer-events-none transition-all duration-200
                    ${(focusedField === 'name' || nameValue) ? 'top-2 text-xs text-blue-600' : 'top-4 text-sm text-gray-500'}`}
                >
                  Full Name
                </label>
                <AnimatePresence>
                  {error?.field === "name" && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-1 text-sm text-red-500 flex items-center gap-1"
                    >
                      <AlertCircle className="h-4 w-4" />
                      {error.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>

            {/* Email field */}
            <motion.div variants={shouldReduceMotion ? undefined : fieldVariants}>
              <motion.div className="relative" animate={emailShakeControls}>
                <motion.div
                  className="absolute left-3 top-4 pointer-events-none z-10"
                  animate={
                    shouldReduceMotion
                      ? undefined
                      : {
                          scale: focusedField === 'email' ? 1.15 : 1,
                          color: focusedField === 'email' ? '#3b82f6' : '#9ca3af',
                        }
                  }
                  transition={{ duration: 0.15 }}
                >
                  <Mail className="h-5 w-5" />
                </motion.div>

                <AnimatePresence>
                  {focusedField === 'email' && !shouldReduceMotion && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute inset-0 rounded-md ring-2 ring-blue-400/40 pointer-events-none z-10"
                    />
                  )}
                </AnimatePresence>

                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder=" "
                  value={emailValue}
                  onChange={(e) => setEmailValue(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className={`peer pl-10 h-14 pt-5 pb-1 text-sm transition-all duration-200
                    focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-0
                    ${error?.field === 'email' ? 'border-red-500' : 'border-gray-300'}`}
                />
                <label
                  htmlFor="email"
                  className={`absolute left-10 pointer-events-none transition-all duration-200
                    ${(focusedField === 'email' || emailValue) ? 'top-2 text-xs text-blue-600' : 'top-4 text-sm text-gray-500'}`}
                >
                  Email Address
                </label>
                <AnimatePresence>
                  {error?.field === "email" && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-1 text-sm text-red-500 flex items-center gap-1"
                    >
                      <AlertCircle className="h-4 w-4" />
                      {error.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>

            {/* Password field */}
            <motion.div variants={shouldReduceMotion ? undefined : fieldVariants}>
              <motion.div className="relative" animate={passwordShakeControls}>
                <motion.div
                  className="absolute left-3 top-4 pointer-events-none z-10"
                  animate={
                    shouldReduceMotion
                      ? undefined
                      : {
                          scale: focusedField === 'password' ? 1.15 : 1,
                          color: focusedField === 'password' ? '#3b82f6' : '#9ca3af',
                        }
                  }
                  transition={{ duration: 0.15 }}
                >
                  <Lock className="h-5 w-5" />
                </motion.div>

                <AnimatePresence>
                  {focusedField === 'password' && !shouldReduceMotion && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute inset-0 rounded-md ring-2 ring-blue-400/40 pointer-events-none z-10"
                    />
                  )}
                </AnimatePresence>

                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder=" "
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className={`peer pl-10 h-14 pt-5 pb-1 text-sm transition-all duration-200
                    focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-0
                    ${error?.field === 'password' ? 'border-red-500' : 'border-gray-300'}`}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label
                  htmlFor="password"
                  className={`absolute left-10 pointer-events-none transition-all duration-200
                    ${(focusedField === 'password' || password) ? 'top-2 text-xs text-blue-600' : 'top-4 text-sm text-gray-500'}`}
                >
                  Password
                </label>
                {renderPasswordStrength()}
                <AnimatePresence>
                  {error?.field === "password" && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-1 text-sm text-red-500 flex items-center gap-1"
                    >
                      <AlertCircle className="h-4 w-4" />
                      {error.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>

            <AnimatePresence>
              {error?.field === "general" && (
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="text-sm text-red-500 flex items-center gap-2"
                >
                  <AlertCircle className="h-4 w-4" /> {error.message}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.div variants={shouldReduceMotion ? undefined : fieldVariants}>
              <motion.button
                type="submit"
                disabled={loading}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                onClick={handleButtonClick}
                className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2.5 rounded-lg font-medium transition-all duration-200 group disabled:opacity-70"
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12" />
                <AnimatePresence>
                  {ripple && (
                    <motion.span
                      key={ripple.id}
                      initial={{ scale: 0, opacity: 0.4 }}
                      animate={{ scale: 1, opacity: 0 }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="absolute rounded-full bg-white/40 pointer-events-none"
                      style={{ width: 300, height: 300, left: ripple.x - 150, top: ripple.y - 150 }}
                    />
                  )}
                </AnimatePresence>
                <span className="relative">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Continue"}
                </span>
              </motion.button>
            </motion.div>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/auth/login" className="relative font-medium text-blue-600">
                <motion.span
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                  className="inline-block relative"
                >
                  Sign in
                  {!shouldReduceMotion && (
                    <motion.span
                      variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
                      transition={{ duration: 0.2 }}
                      className="absolute bottom-0 left-0 h-px w-full bg-blue-500 origin-left"
                    />
                  )}
                </motion.span>
              </Link>
            </p>
          </motion.form>
        )}

        {step === "company" && (
          <motion.div
            key="company"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -20, scale: 0.97 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 20, scale: 0.96 }}
            transition={stepTransition}
            className="space-y-6"
          >
            {companyInfo?.company ? (
              <>
                <div className="flex flex-col items-center gap-3 py-2">
                  <div className="bg-blue-100 p-4 rounded-2xl">
                    <Building2 className="w-10 h-10 text-blue-600" />
                  </div>
                  <p className="text-gray-700 text-center">
                    Company <strong>{companyInfo.company.name}</strong> matches your email domain.
                    Join your team instantly.
                  </p>
                </div>
                <motion.button
                  onClick={handleJoinCompany}
                  disabled={loading}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2.5 rounded-lg font-medium transition-all duration-200 disabled:opacity-70"
                >
                  {loading ? "Joining..." : `Join ${companyInfo.company.name}`}
                </motion.button>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center gap-3 py-2">
                  <div className="bg-purple-100 p-4 rounded-2xl">
                    <UserPlus className="w-10 h-10 text-purple-600" />
                  </div>
                  <p className="text-gray-700 text-center">
                    No company found for your email domain. Create one for your team:
                  </p>
                </div>
                <Input
                  placeholder="Company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-0 transition-all duration-200"
                />
                <AnimatePresence>
                  {error?.field === "companyName" && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-sm text-red-500"
                    >
                      {error.message}
                    </motion.p>
                  )}
                </AnimatePresence>
                <motion.button
                  onClick={handleCreateCompany}
                  disabled={loading}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2.5 rounded-lg font-medium transition-all duration-200 disabled:opacity-70"
                >
                  {loading ? "Creating Company..." : "Create Company"}
                </motion.button>
              </>
            )}
          </motion.div>
        )}

        {step === "done" && (
          <motion.div
            key="done"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={stepTransition}
            className="text-center py-4"
          >
            <div className="relative flex justify-center mb-6">
              {!shouldReduceMotion &&
                CONFETTI_PARTICLES.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                    animate={{ x: p.x, y: p.y, opacity: 0, scale: 1 }}
                    transition={{ duration: 0.9, delay: 0.35, ease: 'easeOut' }}
                    className="absolute rounded-full"
                    style={{
                      width: p.size,
                      height: p.size,
                      backgroundColor: p.color,
                      top: '50%',
                      left: '50%',
                      marginTop: -(p.size / 2),
                      marginLeft: -(p.size / 2),
                    }}
                  />
                ))}

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
              >
                <svg viewBox="0 0 52 52" className="w-16 h-16">
                  <motion.circle
                    cx="26"
                    cy="26"
                    r="25"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4, ease: PREMIUM_EASE }}
                  />
                  <motion.path
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeLinecap="round"
                    d="M 14 27 L 22 35 L 38 17"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4, delay: 0.3, ease: PREMIUM_EASE }}
                  />
                </svg>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <p className="text-lg font-semibold text-gray-800">You&apos;re all set!</p>
              <p className="text-gray-500 text-sm mt-1">Redirecting to your dashboard...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
