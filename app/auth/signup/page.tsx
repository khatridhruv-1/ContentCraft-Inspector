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
    <div className="flex items-center gap-2 mb-7">
      {STEP_LABELS.map((s, i) => {
        const done   = i < activeIndex;
        const active = i === activeIndex;
        return (
          <div key={s.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-1.5 shrink-0">
              <motion.div
                animate={{ backgroundColor: done || active ? '#7c3aed' : '#ffffff15', scale: active ? 1.1 : 1 }}
                transition={{ duration: 0.25 }}
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
              >
                {done ? '✓' : i + 1}
              </motion.div>
              <span className={`text-xs font-medium transition-colors duration-200 ${active ? 'text-violet-400' : done ? 'text-violet-500' : 'text-white/30'}`}>
                {s.label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className="flex-1 mx-2 h-px bg-white/10 overflow-hidden">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: done ? '100%' : '0%' }}
                  transition={{ duration: 0.4 }}
                  className="h-full bg-violet-500"
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
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-0.5 flex-1 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: i < strength ? '100%' : '0%' }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
              className={`h-full ${i < strength ? colors[strength - 1] : ''}`}
            />
          </div>
        ))}
      </div>
      <p className="text-[11px] text-white/35">{labels[strength]}</p>
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
      setError({
        field: msg.includes("already exists") ? "email" : "general",
        message: msg.includes("already exists") ? "This email is already registered" : "Failed to create account. Please try again.",
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
    `w-full bg-white/[0.06] border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-all duration-200
    ${focused === field ? 'border-violet-500/60 ring-2 ring-violet-500/20' : 'border-white/10 hover:border-white/20'}
    ${error?.field === field ? '!border-red-500/60 !ring-red-500/20 ring-2' : ''}`;

  return (
    <div>
      {step !== "done" && <ProgressBar step={step} />}

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">
          {step === "signup" && "Create your account"}
          {step === "company" && "Set up your workspace"}
          {step === "done" && "Almost there..."}
        </h3>
        {step === "signup" && <p className="text-sm text-white/40 mt-0.5">Join your team on ContentCraft</p>}
      </div>

      <AnimatePresence mode="wait">
        {step === "signup" && (
          <motion.form key="signup" onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.25 }} className="space-y-4"
          >
            {/* Name */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-medium text-white/50">Full name</label>
              <div className="relative">
                <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${focused === 'name' ? 'text-violet-400' : 'text-white/25'}`} />
                <input id="name" name="name" placeholder="Jane Smith" value={nameValue}
                  onChange={e => setNameValue(e.target.value)}
                  onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                  className={inputCls('name')} />
              </div>
              {error?.field === "name" && <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{error.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-medium text-white/50">Work email</label>
              <div className="relative">
                <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${focused === 'email' ? 'text-violet-400' : 'text-white/25'}`} />
                <input id="email" name="email" type="email" placeholder="you@company.com" value={emailValue}
                  onChange={e => setEmailValue(e.target.value)}
                  onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                  className={inputCls('email')} />
              </div>
              {error?.field === "email" && <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{error.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-medium text-white/50">Password</label>
              <div className="relative">
                <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${focused === 'password' ? 'text-violet-400' : 'text-white/25'}`} />
                <input id="password" name="password" type="password" placeholder="Min. 6 characters"
                  onFocus={() => setFocused('password')} onBlur={() => setFocused(null)}
                  onChange={e => setPassword(e.target.value)}
                  className={inputCls('password')} />
              </div>
              <PasswordStrength password={password} />
              {error?.field === "password" && <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{error.message}</p>}
            </div>

            {error?.field === "general" && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <p className="text-xs text-red-400 flex items-center gap-2"><AlertCircle className="h-3.5 w-3.5" />{error.message}</p>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-60 transition-colors text-white font-medium py-2.5 rounded-xl text-sm">
              {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Creating account...</span> : 'Continue'}
            </button>

            <p className="text-center text-xs text-white/35">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-violet-400 hover:text-violet-300 transition-colors font-medium">Sign in</Link>
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
                  <div className="w-12 h-12 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-violet-400" />
                  </div>
                  <p className="text-sm text-white/60">
                    <span className="text-white font-medium">{companyInfo.company.name}</span> matches your email domain. Join your team instantly.
                  </p>
                </div>
                <button onClick={handleJoinCompany} disabled={loading}
                  className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-60 transition-colors text-white font-medium py-2.5 rounded-xl text-sm">
                  {loading ? "Joining..." : `Join ${companyInfo.company.name}`}
                </button>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center gap-3 py-2 text-center">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center">
                    <UserPlus className="w-6 h-6 text-indigo-400" />
                  </div>
                  <p className="text-sm text-white/60">No company found for your domain. Create a workspace for your team:</p>
                </div>
                <input
                  placeholder="Company name"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  onFocus={() => setFocused('companyName')} onBlur={() => setFocused(null)}
                  className={inputCls('companyName').replace('pl-10', 'pl-4')}
                />
                {error?.field === "companyName" && <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{error.message}</p>}
                <button onClick={handleCreateCompany} disabled={loading}
                  className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-60 transition-colors text-white font-medium py-2.5 rounded-xl text-sm">
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
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-violet-400 mb-3" />
            <p className="text-sm text-white/40">Redirecting to your dashboard...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
