'use client';

import { ShieldCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { DelimaLoginButton } from '@/components/DelimaLoginButton';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminLoginPage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-10 left-10 w-64 h-64 bg-indigo-200 dark:bg-indigo-900/30 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-200 dark:bg-blue-900/30 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> {language === 'en' ? 'Back to Main Site' : 'Kembali ke Laman Utama'}
        </Link>

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {language === 'en' ? 'Log Masuk / Sign In' : 'Log Masuk Math Explorer'}
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {language === 'en'
              ? 'Sign in with your DELIMa Google Workspace account'
              : 'Log masuk menggunakan akaun DELIMa Google Workspace KPM'}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 space-y-6">
        {/* Unified Single Login Entry Point via Google Identity / DELIMa */}
        <div className="bg-white dark:bg-slate-800 py-8 px-6 shadow-xl rounded-2xl border border-slate-100 dark:border-slate-700 sm:px-8">
          <DelimaLoginButton onSuccessRedirect="/admin/dashboard" />
        </div>
      </div>
    </div>
  );
}
