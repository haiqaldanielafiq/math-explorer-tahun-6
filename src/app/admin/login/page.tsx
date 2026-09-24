'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, KeyRound, ShieldCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { DelimaLoginButton } from '@/components/DelimaLoginButton';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/admin/dashboard');
        router.refresh();
      } else {
        setError(data.error || 'Nama pengguna atau kata laluan tidak sah.');
      }
    } catch {
      setError('Ralat rangkaian. Sila cuba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-10 left-10 w-64 h-64 bg-indigo-200 dark:bg-indigo-900/30 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-200 dark:bg-blue-900/30 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Laman Utama
        </Link>

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Portal Guru & Pentadbir
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Log masuk dengan Akaun DELIMa atau Kredensial Guru
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 space-y-6">
        {/* DELIMa Primary OAuth Option */}
        <div className="bg-white dark:bg-slate-800 py-6 px-6 shadow-xl rounded-2xl border border-slate-100 dark:border-slate-700 sm:px-8">
          <h3 className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-4 text-center">
            Pilihan 1: Log Masuk Pentadbir DELIMa
          </h3>
          <DelimaLoginButton onSuccessRedirect="/admin/dashboard" />
        </div>

        {/* Password Fallback Form */}
        <div className="bg-white dark:bg-slate-800 py-8 px-6 shadow-xl rounded-2xl border border-slate-100 dark:border-slate-700 sm:px-8">
          <h3 className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-4 text-center">
            Pilihan 2: Kredensial Tempatan Guru
          </h3>

          <form className="space-y-4" onSubmit={handleLogin}>
            {error && (
              <div className="bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs p-3 rounded-xl flex items-start gap-2">
                <Lock className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                ID Pengguna Guru
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="cikgu"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Kata Laluan
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 focus:outline-none transition-all disabled:opacity-50"
            >
              {loading ? 'Sedang Log Masuk...' : 'Log Masuk ID Kredensial'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
