'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Loader2, KeyRound, Check, Sparkles } from 'lucide-react';

const getApiBase = () => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== 'undefined') {
    return `http://${window.location.hostname}:8000/api/v1`;
  }
  return 'http://127.0.0.1:8000/api/v1';
};

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@admin.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in as admin, redirect directly to dashboard
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const userStr = localStorage.getItem('admin_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role === 'admin') {
          router.push('/dashboard');
        }
      } catch (e) {
        // invalid cached user, ignore
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${getApiBase()}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        const errorMsg =
          responseData.errors?.email?.[0] ||
          responseData.errors?.password?.[0] ||
          responseData.message ||
          'Invalid administrator credentials.';
        throw new Error(errorMsg);
      }

      // Robust payload extraction (envelope data.user/data.token or direct user/token)
      const payload = responseData.data || responseData;
      const user = payload.user;
      const token = payload.token;

      if (!token || !user) {
        throw new Error('Authentication response did not contain an access token or user profile.');
      }

      if (user.role !== 'admin') {
        throw new Error(
          `Access denied: The account "${user.email}" has role "${user.role}". Merchant Administrator privileges are strictly required.`
        );
      }

      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_user', JSON.stringify(user));
      router.push('/dashboard');
    } catch (err: any) {
      if (err.name === 'TypeError' || err.message?.includes('fetch')) {
        setError('Unable to connect to the backend server (http://localhost:8000). Please ensure the backend is running.');
      } else {
        setError(err.message || 'An error occurred during authentication.');
      }
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-6 selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background Glow Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 mb-4 shadow-lg shadow-indigo-500/10">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            <span>Merchant Back-Office</span>
            <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              Admin
            </span>
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Authenticate via Laravel Sanctum multi-guard RBAC
          </p>
        </div>

        <div className="bg-neutral-900/80 border border-neutral-800 backdrop-blur-xl rounded-2xl p-8 shadow-2xl space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-950/50 border border-red-800/60 text-red-300 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                Merchant Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@admin.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Password
                </label>
                <span className="text-[11px] text-neutral-500 font-mono">Min 8 chars</span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating via Sanctum...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="pt-4 border-t border-neutral-800">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Quick Fill Verified Credentials</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDemoCredentials('admin@admin.com')}
                className="px-3 py-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-left text-xs text-neutral-300 transition"
              >
                <div className="font-semibold text-white truncate">admin@admin.com</div>
                <div className="text-[10px] text-neutral-500 font-mono">password123</div>
              </button>

              <button
                type="button"
                onClick={() => setDemoCredentials('admin@shopify-clone.test')}
                className="px-3 py-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-left text-xs text-neutral-300 transition"
              >
                <div className="font-semibold text-white truncate">admin@shopify-clone...</div>
                <div className="text-[10px] text-neutral-500 font-mono">password123</div>
              </button>
            </div>
          </div>

          {/* Link to Customer Storefront */}
          <div className="text-center pt-2">
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-neutral-400 hover:text-white transition inline-flex items-center gap-1"
            >
              <span>Switch to Customer Storefront (Port 3000)</span>
              <span>↗</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
