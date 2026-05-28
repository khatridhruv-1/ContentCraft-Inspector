"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Loader2, User, Mail, Lock, Building2, UserPlus, Sparkles } from "lucide-react";
import { ErrorAlert } from "@/components/auth/ErrorAlert";
import { Button } from "@/components/ui/button";
import AuthTextField from "@/components/auth/AuthTextField";

import { signup } from "@/lib/user/appwrite";
import { createCompany, joinCompany, checkCompanyDomain } from "@/lib/companyHelper/companyHelpers";
import { useGuestGuard } from "@/hooks/useAuthRedirect";

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

function ProgressBar({ step }: { step: Step }) {
  const activeIndex = step === "signup" ? 0 : 1;

  return (
    <div className="mb-8">
      <div className="flex items-center">
        {STEP_LABELS.map((s, i) => {
          const isCompleted = i < activeIndex;
          const isActive = i === activeIndex;
          return (
            <div key={s.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <motion.div
                  animate={{
                    backgroundColor: isCompleted || isActive ? '#2563eb' : '#e2e8f0',
                  }}
                  transition={{ duration: 0.25 }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                >
                  {isCompleted ? '✓' : i + 1}
                </motion.div>
                <span
                  className={`text-xs font-medium transition-colors duration-200 ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-blue-500' : 'text-slate-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div className="flex-1 mx-3 mb-4 h-px bg-slate-200 relative overflow-hidden">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: isCompleted ? '100%' : '0%' }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-y-0 left-0 bg-blue-500"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Signup() {
  useGuestGuard();

  const [step, setStep] = useState<Step>("signup");
  const [error, setError] = useState<ValidationError | null>(null);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyInfo, setCompanyInfo] = useState<any>(null);
  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const shouldReduceMotion = useReducedMotion();

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
        <div className="flex gap-1" role="img" aria-label={`Password strength: ${labels[strength]}`}>
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div key={i} className="h-1 flex-1 rounded-full overflow-hidden bg-gray-200">
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
      const normalized = msg.toLowerCase();

      const friendlyMessage = normalized.includes("over_email_send_rate_limit")
        ? "Too many signup attempts in a short time. Please wait a minute and try again."
        : normalized.includes("email rate limit exceeded")
          ? "Signup emails are temporarily rate-limited. Please wait a minute and try again."
          : normalized.includes("already exists")
            ? "This email is already registered"
            : msg || "Failed to create account. Please try again.";

      setError({
        field: normalized.includes("already exists") ? "email" : "general",
        message: friendlyMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCompany = async () => {
    if (!companyInfo?.company || !companyInfo?.user) return;
    setError(null);
    setLoading(true);
    try {
      await joinCompany(companyInfo.company.$id, companyInfo.user);
      setStep("done");
      setIsRedirecting(true);
      await new Promise((resolve) => setTimeout(resolve, shouldReduceMotion ? 0 : 450));
      router.push("/home");
    } catch (err) {
      setError({
        field: "general",
        message: "Failed to join company. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompany = async () => {
    if (!companyName.trim()) {
      setError({ field: "companyName", message: "Please enter your company name" });
      return;
    }
    if (!companyInfo?.user) return;
    setError(null);
    setLoading(true);
    try {
      await createCompany({
        name: companyName,
        domain: companyInfo.domain,
        users: [companyInfo.user],
      });
      setStep("done");
      setIsRedirecting(true);
      await new Promise((resolve) => setTimeout(resolve, shouldReduceMotion ? 0 : 450));
      router.push("/home");
    } catch (err) {
      setError({
        field: "general",
        message: "Failed to create company. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      {step !== "done" && <ProgressBar step={step} />}

      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">
          {step === "signup" && "Create your account"}
          {step === "company" && "Set up your company"}
          {step === "done" && "Almost there..."}
        </h1>
        {step === "signup" && (
          <p className="text-sm text-slate-500 mt-1">Fill in your details to get started</p>
        )}
        {step === "company" && (
          <p className="text-sm text-slate-500 mt-1">Connect to your team or create a new workspace</p>
        )}
      </div>

      {step === "signup" && (
        <div className="mb-5 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs text-slate-600 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-600" />
            Just two quick steps: create your account, then connect your company.
          </p>
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === "signup" && (
          <motion.form
            key="signup"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <AuthTextField
              id="name"
              name="name"
              label="Full Name"
              icon={<User className="h-5 w-5" />}
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              error={error?.field === "name" ? error.message : undefined}
              autoComplete="name"
              required
            />

            <AuthTextField
              id="email"
              name="email"
              type="email"
              label="Email Address"
              icon={<Mail className="h-5 w-5" />}
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              error={error?.field === "email" ? error.message : undefined}
              autoComplete="email"
              required
            />

            <div>
              <AuthTextField
                id="password"
                name="password"
                type="password"
                label="Password"
                icon={<Lock className="h-5 w-5" />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={error?.field === "password" ? error.message : undefined}
                autoComplete="new-password"
                required
              />
              {renderPasswordStrength()}
            </div>

            <ErrorAlert message={error?.field === "general" ? error.message : ""} />

            <Button type="submit" className="w-full" disabled={loading || isRedirecting}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Continue"
              )}
            </Button>

            <p className="text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-700 transition-colors">
                Sign in
              </Link>
            </p>
          </motion.form>
        )}

        {step === "company" && (
          <motion.div
            key="company"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <ErrorAlert message={error?.field === "general" ? error.message : ""} />

            {companyInfo?.company ? (
              <>
                <div className="flex flex-col items-center gap-3 py-2">
                  <div className="bg-blue-100 p-4 rounded-2xl">
                    <Building2 className="w-10 h-10 text-blue-600" />
                  </div>
                  <p className="text-slate-700 text-center text-sm">
                    Company <strong>{companyInfo.company.name}</strong> matches your email domain.
                    Join your team instantly.
                  </p>
                </div>
                <Button onClick={handleJoinCompany} className="w-full" disabled={loading || isRedirecting}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    `Join ${companyInfo.company.name}`
                  )}
                </Button>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center gap-3 py-2">
                  <div className="bg-purple-100 p-4 rounded-2xl">
                    <UserPlus className="w-10 h-10 text-purple-600" />
                  </div>
                  <p className="text-slate-700 text-center text-sm">
                    No company found for your email domain. Create one for your team:
                  </p>
                </div>

                <AuthTextField
                  id="companyName"
                  name="companyName"
                  label="Company Name"
                  icon={<Building2 className="h-5 w-5" />}
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  error={error?.field === "companyName" ? error.message : undefined}
                  autoComplete="organization"
                />

                <Button onClick={handleCreateCompany} className="w-full" disabled={loading || isRedirecting}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating company...
                    </>
                  ) : (
                    "Create Company"
                  )}
                </Button>
              </>
            )}
          </motion.div>
        )}

        {step === "done" && (
          <motion.div
            key="done"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="text-center py-4"
          >
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-600 mb-2" />
            <p className="text-slate-600">{isRedirecting ? "Redirecting to your dashboard..." : "Preparing your workspace..."}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
