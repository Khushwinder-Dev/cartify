'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, ArrowRight, Sparkles, AlertCircle, Loader2, KeyRound, UserCheck, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/account';

  const { login, user } = useAuth();
  const [email, setEmail] = useState('customer@customer.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      router.push(redirect);
    }
  }, [user, redirect, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      router.push(redirect);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-neutral-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-neutral-900 dark:text-neutral-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 group mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
            ATELIER &amp; CO.
          </span>
        </Link>
        <h1 className="text-2xl font-serif font-bold text-neutral-950 dark:text-white">
          Sign In to Your Account
        </h1>
        <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
          Track purchases, manage shipping addresses, and review previous orders
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white dark:bg-neutral-900 py-8 px-6 sm:px-10 shadow-xl border border-neutral-200 dark:border-neutral-800 rounded-3xl space-y-6">
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="customer@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 font-bold rounded-xl text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-2 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-indigo-500" />
              <span>Demo Customer Accounts</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleFillDemo('customer@customer.com')}
                className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-indigo-500 text-left text-xs bg-neutral-50 dark:bg-neutral-950 transition"
              >
                <div className="font-bold text-neutral-900 dark:text-white truncate">customer@customer...</div>
                <div className="text-[10px] text-neutral-500 font-mono">password123</div>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo('customer@example.com')}
                className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-indigo-500 text-left text-xs bg-neutral-50 dark:bg-neutral-950 transition"
              >
                <div className="font-bold text-neutral-900 dark:text-white truncate">Eleanor Vance</div>
                <div className="text-[10px] text-neutral-500 font-mono">password123</div>
              </button>
            </div>
          </div>

          {/* Link to Register */}
          <div className="text-center pt-2">
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              Don't have an account yet?{' '}
              <Link
                href={`/register${redirect !== '/account' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
                className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Merchant Admin Switcher */}
        <div className="text-center mt-6">
          <a
            href="http://localhost:3001/login"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300 inline-flex items-center gap-1 transition"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
            <span>Store Administrator? Sign in to Merchant Studio (:3001) ↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function CustomerLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-neutral-950">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
