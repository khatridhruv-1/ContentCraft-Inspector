"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Loader2, User, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { signup } from "@/lib/user/appwrite";
import { createCompany, joinCompany, checkCompanyDomain } from "@/lib/companyHelper/companyHelpers";

interface ValidationError {
  field: string;
  message: string;
}

type Step = "signup" | "company" | "done";

const PUBLIC_DOMAINS = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com"];

export default function Signup() {
  const [step, setStep] = useState<Step>("signup");
  const [error, setError] = useState<ValidationError | null>(null);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyInfo, setCompanyInfo] = useState<any>(null);
console.log("companyName" ,companyName)
console.log(
  "companyInfo",companyInfo
);

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
    const bars = Array.from({ length: 4 }).map((_, i) => (
      <div
        key={i}
        className={`h-1 w-full rounded-full transition-colors duration-300 ${
          i < strength
            ? ["bg-red-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"][strength - 1]
            : "bg-gray-200"
        }`}
      />
    ));

    return (
      <div className="space-y-2">
        <div className="flex gap-1">{bars}</div>
        <p className="text-xs text-gray-500">
          {["Enter password", "Weak", "Fair", "Good", "Strong"][strength]}
        </p>
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
      setError({
        field: msg.includes("already exists") ? "email" : "general",
        message: msg.includes("already exists")
          ? "This email is already registered"
          : "Failed to create account. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCompany = async () => {
    if (!companyInfo?.company || !companyInfo?.user) return;
    setLoading(true);
    try {
      let joinedCompany = await joinCompany(companyInfo.company.$id, companyInfo.user);
      console.log("joinedCompany" ,joinedCompany);
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
      const newCompany = await createCompany({
        name: companyName,
        domain: companyInfo.domain,
        users: [companyInfo.user],
      });
      console.log("newCompany" ,newCompany);
      

  
      setStep("done");
      router.push("/home");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-700">
          {step === "signup" && "Create Account"}
          {step === "company" && "Company Setup"}
          {step === "done" && "Finalizing..."}
        </h3>
      </div>

      <AnimatePresence mode="wait">
        {step === "signup" && (
          <motion.form
            key="signup"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input id="name" name="name" placeholder="John Doe" className="pl-10" />
              </div>
              {error?.field === "name" && <p className="text-sm text-red-500">{error.message}</p>}
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input id="email" name="email" type="email" placeholder="you@email.com" className="pl-10" />
              </div>
              {error?.field === "email" && <p className="text-sm text-red-500">{error.message}</p>}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="mt-2">{renderPasswordStrength()}</div>
              {error?.field === "password" && <p className="text-sm text-red-500">{error.message}</p>}
            </div>

            {error?.field === "general" && (
              <p className="text-sm text-red-500 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" /> {error.message}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue"}
            </Button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-blue-600 hover:underline">Sign in</Link>
            </p>
          </motion.form>
        )}

        {step === "company" && (
          <motion.div
            key="company"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {companyInfo?.company ? (
              <>
                <p className="text-gray-700">
                  Company <strong>{companyInfo.company.name}</strong> matches your email domain.
                </p>
                <Button onClick={handleJoinCompany} className="w-full" disabled={loading}>
                  {loading ? "Joining..." : `Join ${companyInfo.company.name}`}
                </Button>
              </>
            ) : (
              <>
                <p className="text-gray-700">No company found for your email domain. Create one:</p>
                <Input
                  placeholder="Company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
                {error?.field === "companyName" && (
                  <p className="text-sm text-red-500">{error.message}</p>
                )}
                <Button onClick={handleCreateCompany} className="w-full" disabled={loading}>
                  {loading ? "Creating Company..." : "Create Company"}
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
            className="text-center"
          >
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-600 mb-2" />
            <p className="text-gray-600">Redirecting to your dashboard...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
