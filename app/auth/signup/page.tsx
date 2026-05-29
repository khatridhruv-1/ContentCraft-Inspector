"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Loader2, User, Mail, Lock, Building2, UserPlus } from "lucide-react";
import { signup } from "@/lib/user/appwrite";
import { createCompany, joinCompany, checkCompanyDomain } from "@/lib/companyHelper/companyHelpers";

interface ValidationError { field: string; message: string; }
type Step = "signup" | "company" | "done";

const PUBLIC_DOMAINS = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com"];
const STEP_LABELS = [{ key: "signup", label: "Account" }, { key: "company", label: "Company" }];

function ProgressBar({ step }: { step: Step }) {
  const activeIndex = step === "signup" ? 0 : 1;
  return (
    <div className="flex items-center gap-2 mb-7" role="progressbar" aria-label={`Step ${activeIndex + 1} of ${STEP_LABELS.length}`} aria-valuenow={activeIndex + 1} aria-valuemin={1} aria-valuemax={STEP_LABELS.length}>
      {STEP_LABELS.map((s, i) => {
        const done   = i < activeIndex;
        const active = i === activeIndex;
        return (
          <div key={s.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-1.5 shrink-0">
              <motion.div
                animate={{ backgroundColor: done || active ? '#7c3aed' : 'hsl(var(--border))', scale: active ? 1.1 : 1 }}
                transition={{ duration: 0.25 }}
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                aria-hidden="true"
              >
                {done ? '✓' : i + 1}
              </motion.div>
              <span className={`text-xs font-medium transition-colors duration-200 ${active ? 'text-primary' : done ? 'text-primary/70' : 'text-muted-foreground/40'}`}>
                {s.label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className="flex-1 mx-2 h-px bg-border overflow-hidden" aria-hidden="true">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: done ? '100%' : '0%' }}
                  transition={{ duration: 0.4 }}
                  className="h-full bg-primary"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function PasswordStrength({ password }: { password: string }) {
  const strength = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  const colors = ['bg-red-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'];
  const labels = ['Enter password', 'Weak', 'Fair', 'Good', 'Strong'];

  if (!password) return null;
  return (
    <div className="mt-2 space-y-1.5" aria-live="polite" aria-label={`Password strength: ${labels[strength]}`}>
      <div className="flex gap-1" aria-hidden="true">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-1 flex-1 rounded-full bg-border overflow-hidden">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: i < strength ? '100%' : '0%' }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
              className={`h-full ${i < strength ? colors[strength - 1] : ''}`}
            />
          </div>
        ))}
      </div>
      <p className="text-[11px] text-muted-foreground">{labels[strength]}</p>
    </div>
  );
}

export default function Signup() {
  const [step, setStep]           = useState<Step>("signup");
  const [error, setError]         = useState<ValidationError | null>(null);
  const [loading, setLoading]     = useState(false);
  const [password, setPassword]   = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyInfo, setCompanyInfo] = useState<any>(null);
  const [focused, setFocused]     = useState<string | null>(null);
  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const router = useRouter();

  const validate = (name: string, email: string, pw: string): ValidationError | null => {
    if (name.length < 2) return { field: "name", message: "Name must be at least 2 characters" };
    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) return { field: "email", message: "Please enter a valid email address" };
    if (pw.length < 6) return { field: "password", message: "Password must be at least 6 characters" };
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const name = fd.get("name") as string;
    const email = fd.get("email") as string;
    const pw = fd.get("password") as string;
    const vErr = validate(name, email, pw);
    if (vErr) { setError(vErr); setLoading(false); return; }
    try {
      const session = await signup(email, pw, name);
      localStorage.setItem("sessionToken", session.secret);
      const domain = email.split("@")[1];
      const isPublic = PUBLIC_DOMAINS.includes(domain.toLowerCase());
      if (isPublic) {
        setCompanyInfo({ company: null, user: session.userId, domain });
      } else {
        const matched = await checkCompanyDomain(domain);
        setCompanyInfo({ company: matched, user: session.userId, domain });
      }
      setStep("company");
    } catch (err) {
      const msg = (err as Error).message;
      let userMsg = "Failed to create account. Please try again.";
      if (msg.includes("already exists") || msg.includes("already registered")) {
        userMsg = "This email is already registered.";
      } else if (msg.includes("confirm") || msg.includes("not confirmed")) {
        userMsg = "Account created! Please check your email to confirm your account before signing in.";
      } else if (msg.includes("network") || msg.includes("fetch")) {
        userMsg = "Network error. Please check your connection and try again.";
      }
      setError({
        field: msg.includes("already exists") || msg.includes("already registered") ? "email" : "general",
        message: userMsg,
      });
    } finally { setLoading(false); }
  };

  const handleJoinCompany = async () => {
    if (!companyInfo?.company || !companyInfo?.user) return;
    setLoading(true);
    try { await joinCompany(companyInfo.company.$id, companyInfo.user); router.push("/home"); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleCreateCompany = async () => {
    if (!companyName || !companyInfo?.user) { setError({ field: "companyName", message: "Please enter your company name" }); return; }
    setLoading(true);
    try { await createCompany({ name: companyName, domain: companyInfo.domain, users: [companyInfo.user] }); router.push("/home"); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const inputCls = (field: string) =>
    `w-full bg-secondary border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none transition-all duration-200
    ${focused === field ? 'border-primary/60 ring-2 ring-primary/20' : 'border-input hover:border-primary/40'}
    ${error?.field === field ? '!border-destructive/60 !ring-destructive/20 ring-2' : ''}`;

  return (
    <div>
      {step !== "done" && <ProgressBar step={step} />}

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground">
          {step === "signup" && "Create your account"}
          {step === "company" && "Set up your workspace"}
          {step === "done" && "Almost there..."}
        </h2>
        {step === "signup" && <p className="text-sm text-muted-foreground mt-1">Join your team on ContentCraft Inspector</p>}
        {step === "company" && <p className="text-sm text-muted-foreground mt-1">One last step to get started</p>}
      </div>

      <AnimatePresence mode="wait">
        {step === "signup" && (
          <motion.form key="signup" onSubmit={handleSubmit} noValidate aria-label="Create account form"
            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.25 }} className="space-y-4"
          >
            {/* Name */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-medium text-foreground/70">Full name</label>
              <div className="relative">
                <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${focused === 'name' ? 'text-primary' : 'text-muted-foreground/50'}`} aria-hidden="true" />
                <input id="name" name="name" placeholder="Jane Smith" value={nameValue}
                  onChange={e => setNameValue(e.target.value)}
                  onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                  aria-invalid={error?.field === 'name' ? 'true' : 'false'}
                  aria-describedby={error?.field === 'name' ? 'name-error' : undefined}
                  className={inputCls('name')} />
              </div>
              {error?.field === "name" && <p id="name-error" role="alert" className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />{error.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-medium text-foreground/70">Work email</label>
              <div className="relative">
                <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${focused === 'email' ? 'text-primary' : 'text-muted-foreground/50'}`} aria-hidden="true" />
                <input id="email" name="email" type="email" autoComplete="email" placeholder="you@company.com" value={emailValue}
                  onChange={e => setEmailValue(e.target.value)}
                  onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                  aria-invalid={error?.field === 'email' ? 'true' : 'false'}
                  aria-describedby={error?.field === 'email' ? 'email-error' : undefined}
                  className={inputCls('email')} />
              </div>
              {error?.field === "email" && <p id="email-error" role="alert" className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />{error.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-medium text-foreground/70">Password</label>
              <div className="relative">
                <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${focused === 'password' ? 'text-primary' : 'text-muted-foreground/50'}`} aria-hidden="true" />
                <input id="password" name="password" type="password" autoComplete="new-password" placeholder="Min. 6 characters"
                  onFocus={() => setFocused('password')} onBlur={() => setFocused(null)}
                  onChange={e => setPassword(e.target.value)}
                  aria-invalid={error?.field === 'password' ? 'true' : 'false'}
                  aria-describedby="password-strength"
                  className={inputCls('password')} />
              </div>
              <div id="password-strength">
                <PasswordStrength password={password} />
              </div>
              {error?.field === "password" && <p role="alert" className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />{error.message}</p>}
            </div>

            {error?.field === "general" && (
              <div role="alert" className="p-3 rounded-xl bg-destructive/10 border border-destructive/20">
                <p className="text-xs text-destructive flex items-center gap-2"><AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />{error.message}</p>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full grad hover:opacity-90 disabled:opacity-60 transition-opacity text-white font-medium py-3 rounded-xl text-sm min-h-[44px]">
              {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /><span>Creating account...</span></span> : 'Continue'}
            </button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-primary hover:opacity-80 transition-opacity font-medium">Sign in</Link>
            </p>
          </motion.form>
        )}

        {step === "company" && (
          <motion.div key="company"
            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.25 }} className="space-y-5"
          >
            {companyInfo?.company ? (
              <>
                <div className="flex flex-col items-center gap-3 py-2 text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center" aria-hidden="true">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span className="text-foreground font-medium">{companyInfo.company.name}</span> matches your email domain. Join your team instantly.
                  </p>
                </div>
                <button onClick={handleJoinCompany} disabled={loading}
                  className="w-full grad hover:opacity-90 disabled:opacity-60 transition-opacity text-white font-medium py-3 rounded-xl text-sm min-h-[44px]">
                  {loading ? "Joining..." : `Join ${companyInfo.company.name}`}
                </button>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center gap-3 py-2 text-center">
                  <div className="w-12 h-12 rounded-xl bg-secondary border border-border flex items-center justify-center" aria-hidden="true">
                    <UserPlus className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">No company found for your domain. Create a workspace for your team:</p>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="companyName" className="text-xs font-medium text-foreground/70">Company name</label>
                  <input
                    id="companyName"
                    placeholder="Acme Inc."
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    onFocus={() => setFocused('companyName')} onBlur={() => setFocused(null)}
                    aria-invalid={error?.field === 'companyName' ? 'true' : 'false'}
                    aria-describedby={error?.field === 'companyName' ? 'company-error' : undefined}
                    className={`w-full bg-secondary border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none transition-all duration-200 ${focused === 'companyName' ? 'border-primary/60 ring-2 ring-primary/20' : 'border-input hover:border-primary/40'} ${error?.field === 'companyName' ? '!border-destructive/60 !ring-destructive/20 ring-2' : ''}`}
                  />
                  {error?.field === "companyName" && <p id="company-error" role="alert" className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />{error.message}</p>}
                </div>
                <button onClick={handleCreateCompany} disabled={loading}
                  className="w-full grad hover:opacity-90 disabled:opacity-60 transition-opacity text-white font-medium py-3 rounded-xl text-sm min-h-[44px]">
                  {loading ? "Creating..." : "Create workspace"}
                </button>
              </>
            )}
          </motion.div>
        )}

        {step === "done" && (
          <motion.div key="done"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-center py-6"
          >
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary mb-3" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">Redirecting to your workspace...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
