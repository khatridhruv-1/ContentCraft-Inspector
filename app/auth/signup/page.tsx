"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence, useAnimation, useReducedMotion } from "framer-motion";
import { AlertCircle, Loader2, User, Mail, Lock, Building2, UserPlus, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
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

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { type: 'spring' as const, stiffness: 300, damping: 24, delay },
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
                <motion.div
                  className="flex-1 mx-2 h-0.5 rounded-full overflow-hidden bg-gray-200"
                >
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
  const shakeControls = useAnimation();
  const prefersReducedMotion = useReducedMotion();

  const isNameValid = nameValue.length >= 2;
  const isEmailValid = Boolean(emailValue.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/));

  const router = useRouter();

  const validateForm = (name: string, email: string, password: string): ValidationError | null => {
    if (name.length < 2) return { field: "name", message: "Name must be at least 2 characters" };
    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email))
      return { field: "email", message: "Please enter a valid email address" };
    if (password.length < 6) return { field: "password", message: "Password must be at least 6 characters" };
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
    const colors = ["bg-red-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"];
    const labels = ["Enter password", "Weak", "Fair", "Good", "Strong"];

    return (
      <div className="space-y-1.5 mt-2">
        <div className="flex gap-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              className="h-1 flex-1 rounded-full overflow-hidden bg-gray-200"
            >
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: i < strength ? '100%' : '0%' }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className={`h-full rounded-full ${i < strength ? colors[strength - 1] : ''}`}
              />
            </motion.div>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={strength}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
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
    const password = formData.get("password") as string;

    const validationError = validateForm(name, email, password);
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      const session = await signup(email, password, name);
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
      const isEmailError = msg.includes("already exists");
      setError({
        field: isEmailError ? "email" : "general",
        message: isEmailError
          ? "This email is already registered"
          : "Failed to create account. Please try again.",
      });
      if (!isEmailError) {
        shakeControls.start({
          x: [-8, 8, -6, 6, -3, 3, 0],
          transition: { duration: 0.5, ease: 'easeInOut' },
        });
      }
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
      router.push("/home");
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
      router.push("/home");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {step !== "done" && <ProgressBar step={step} />}

      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-700">
          {step === "signup" && "Create Account"}
          {step === "company" && "Company Setup"}
          {step === "done" && "Finalizing..."}
        </h3>
      </div>

      <AnimatePresence mode="wait">
        {step === "signup" && (
          <motion.div
            key="signup"
            initial={{ opacity: 0, x: -20, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          >
            <motion.form
              onSubmit={handleSubmit}
              animate={shakeControls}
              className="space-y-4"
            >
              {/* Name */}
              <motion.div {...fadeUp(0.05)} className="relative">
                <div className="absolute left-3 top-4 pointer-events-none z-10">
                  <User className={`h-5 w-5 transition-colors duration-200 ${focusedField === 'name' ? 'text-blue-500' : 'text-gray-400'}`} />
                </div>
                <motion.div
                  animate={{
                    boxShadow: focusedField === 'name'
                      ? '0 0 0 3px rgba(59, 130, 246, 0.2)'
                      : '0 0 0 0px rgba(59, 130, 246, 0)',
                  }}
                  transition={{ duration: 0.2 }}
                  className="relative rounded-md"
                >
                  <Input
                    id="name"
                    name="name"
                    placeholder=" "
                    value={nameValue}
                    onChange={(e) => setNameValue(e.target.value)}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    className={`peer pl-10 pr-10 h-14 pt-5 pb-1 text-sm transition-all duration-200
                      focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-0
                      ${focusedField === 'name' ? 'bg-blue-50/30' : ''}
                      ${error?.field === 'name' ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <label
                    htmlFor="name"
                    className={`absolute left-10 pointer-events-none transition-all duration-200
                      ${(focusedField === 'name' || nameValue) ? 'top-2 text-xs text-blue-600' : 'top-4 text-sm text-gray-500'}`}
                  >
                    Full Name
                  </label>
                  <div className="absolute right-3 top-4 pointer-events-none z-10">
                    <AnimatePresence>
                      {isNameValid && error?.field !== 'name' && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        >
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
                <AnimatePresence>
                  {error?.field === "name" && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-1 text-sm text-red-500 flex items-center gap-1"
                    >
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {error.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Email */}
              <motion.div {...fadeUp(0.12)} className="relative">
                <div className="absolute left-3 top-4 pointer-events-none z-10">
                  <Mail className={`h-5 w-5 transition-colors duration-200 ${focusedField === 'email' ? 'text-blue-500' : 'text-gray-400'}`} />
                </div>
                <motion.div
                  animate={{
                    boxShadow: focusedField === 'email'
                      ? '0 0 0 3px rgba(59, 130, 246, 0.2)'
                      : '0 0 0 0px rgba(59, 130, 246, 0)',
                  }}
                  transition={{ duration: 0.2 }}
                  className="relative rounded-md"
                >
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder=" "
                    value={emailValue}
                    onChange={(e) => setEmailValue(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className={`peer pl-10 pr-10 h-14 pt-5 pb-1 text-sm transition-all duration-200
                      focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-0
                      ${focusedField === 'email' ? 'bg-blue-50/30' : ''}
                      ${error?.field === 'email' ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <label
                    htmlFor="email"
                    className={`absolute left-10 pointer-events-none transition-all duration-200
                      ${(focusedField === 'email' || emailValue) ? 'top-2 text-xs text-blue-600' : 'top-4 text-sm text-gray-500'}`}
                  >
                    Email Address
                  </label>
                  <div className="absolute right-3 top-4 pointer-events-none z-10">
                    <AnimatePresence>
                      {isEmailValid && error?.field !== 'email' && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        >
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
                <AnimatePresence>
                  {error?.field === "email" && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-1 text-sm text-red-500 flex items-center gap-1"
                    >
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {error.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Password */}
              <motion.div {...fadeUp(0.19)} className="relative">
                <div className="absolute left-3 top-4 pointer-events-none z-10">
                  <Lock className={`h-5 w-5 transition-colors duration-200 ${focusedField === 'password' ? 'text-blue-500' : 'text-gray-400'}`} />
                </div>
                <motion.div
                  animate={{
                    boxShadow: focusedField === 'password'
                      ? '0 0 0 3px rgba(59, 130, 246, 0.2)'
                      : '0 0 0 0px rgba(59, 130, 246, 0)',
                  }}
                  transition={{ duration: 0.2 }}
                  className="relative rounded-md"
                >
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder=" "
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className={`peer pl-10 h-14 pt-5 pb-1 text-sm transition-all duration-200
                      focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-0
                      ${focusedField === 'password' ? 'bg-blue-50/30' : ''}
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
                </motion.div>
                {renderPasswordStrength()}
                <AnimatePresence>
                  {error?.field === "password" && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-1 text-sm text-red-500 flex items-center gap-1"
                    >
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {error.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              <AnimatePresence>
                {error?.field === "general" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3 rounded-lg bg-red-50 border border-red-200"
                  >
                    <p className="text-sm text-red-600 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" /> {error.message}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div {...fadeUp(0.26)}>
                <motion.div whileTap={!loading && !prefersReducedMotion ? { scale: 0.97 } : {}}>
                  <Button
                    type="submit"
                    className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium group"
                    disabled={loading}
                  >
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12" />
                    <span className="relative">
                      {loading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Continue"}
                    </span>
                  </Button>
                </motion.div>

                <AnimatePresence>
                  {loading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-1 bg-gray-200 rounded-full mt-2 overflow-hidden"
                    >
                      <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: '85%' }}
                        transition={{ duration: 2.5, ease: 'easeInOut' }}
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.p {...fadeUp(0.33)} className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-blue-600 relative group">
                  Sign in
                  <span className="absolute bottom-0 left-0 h-[1px] bg-blue-600 w-0 group-hover:w-full transition-all duration-300" />
                </Link>
              </motion.p>
            </motion.form>
          </motion.div>
        )}

        {step === "company" && (
          <motion.div
            key="company"
            initial={{ opacity: 0, x: 20, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="space-y-6"
          >
            {companyInfo?.company ? (
              <>
                <div className="flex flex-col items-center gap-3 py-2">
                  <motion.div
                    initial={{ scale: 0, rotate: -15 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 12, delay: 0.1 }}
                    className="bg-blue-100 p-4 rounded-2xl"
                  >
                    <Building2 className="w-10 h-10 text-blue-600" />
                  </motion.div>
                  <p className="text-gray-700 text-center">
                    Company <strong>{companyInfo.company.name}</strong> matches your email domain.
                    Join your team instantly.
                  </p>
                </div>
                <motion.div whileTap={!loading && !prefersReducedMotion ? { scale: 0.97 } : {}}>
                  <Button
                    onClick={handleJoinCompany}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    disabled={loading}
                  >
                    {loading ? "Joining..." : `Join ${companyInfo.company.name}`}
                  </Button>
                </motion.div>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center gap-3 py-2">
                  <motion.div
                    initial={{ scale: 0, rotate: 15 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 12, delay: 0.1 }}
                    className="bg-purple-100 p-4 rounded-2xl"
                  >
                    <UserPlus className="w-10 h-10 text-purple-600" />
                  </motion.div>
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
                      className="text-sm text-red-500 flex items-center gap-1"
                    >
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {error.message}
                    </motion.p>
                  )}
                </AnimatePresence>
                <motion.div whileTap={!loading && !prefersReducedMotion ? { scale: 0.97 } : {}}>
                  <Button
                    onClick={handleCreateCompany}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    disabled={loading}
                  >
                    {loading ? "Creating Company..." : "Create Company"}
                  </Button>
                </motion.div>
              </>
            )}
          </motion.div>
        )}

        {step === "done" && (
          <motion.div
            key="done"
            initial={{ opacity: 0, x: 20, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="text-center py-4"
          >
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-600 mb-2" />
            <p className="text-gray-600">Redirecting to your dashboard...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
