'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, User as UserIcon, Phone, ArrowRight, Sparkles, AlertCircle, Loader2, Sparkle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/account';

  const { register, user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
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
    if (password !== passwordConfirmation) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await register({
        name,
        email: email.trim(),
        password,
        password_confirmation: passwordConfirmation,
        phone: phone || undefined,
      });
      router.push(redirect);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check the provided information.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoData = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    setName('Julian Wright');
    setEmail(`julian.${randomSuffix}@example.com`);
    setPhone('+1 (555) 349-8812');
    setPassword('password123');
    setPasswordConfirmation('password123');
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
          Create an Account
        </h1>
        <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
          Join our client collective for order tracking and exclusive release access
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
                Full Name *
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Julian Wright"
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="julian@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                Phone Number <span className="text-[10px] text-neutral-400 normal-case font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 chars"
                    className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                  Confirm *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-400" />
                  <input
                    type="password"
                    required
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    placeholder="Repeat"
                    className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 font-bold rounded-xl text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Pre-fill */}
          <div className="pt-2">
            <button
              type="button"
              onClick={fillDemoData}
              className="w-full py-2 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-600 dark:text-neutral-400 transition flex items-center justify-center gap-1.5"
            >
              <Sparkle className="w-3.5 h-3.5 text-amber-500" />
              <span>Fill Quick Demo Details</span>
            </button>
          </div>

          {/* Link to Login */}
          <div className="text-center pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              Already have an account?{' '}
              <Link
                href={`/login${redirect !== '/account' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
                className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CustomerRegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-neutral-950">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
