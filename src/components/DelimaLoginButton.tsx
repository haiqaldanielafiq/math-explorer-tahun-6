'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (parent: HTMLElement, options: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export function DelimaLoginButton({ onSuccessRedirect = '/admin/dashboard' }: { onSuccessRedirect?: string }) {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  useEffect(() => {
    // Load Google Identity Script dynamically
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google) {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleGoogleCallback,
          });
          const btnElem = document.getElementById('google-delima-btn');
          if (btnElem) {
            window.google.accounts.id.renderButton(btnElem, {
              theme: 'outline',
              size: 'large',
              text: 'signin_with',
              locale: language === 'en' ? 'en' : 'ms',
            });
          }
        }
      };
      document.body.appendChild(script);
    }
  }, [googleClientId, language]);

  const handleGoogleCallback = async (response: any) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/delima', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.role === 'ADMIN') {
          window.location.href = onSuccessRedirect;
        } else {
          window.location.href = '/';
        }
      } else {
        setError(data.error || (language === 'en' ? 'DELIMa account authentication failed.' : 'Akaun DELIMa tidak disahkan.'));
      }
    } catch {
      setError(language === 'en' ? 'Google server connection error.' : 'Ralat sambungan pelayan Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Render Official Google Identity Services Button */}
      <div id="google-delima-btn" className="flex justify-center min-h-[44px]" />

      {!googleClientId && (
        <div className="bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 p-4 rounded-xl text-center space-y-2 text-xs">
          <div className="flex items-center justify-center gap-2 text-blue-800 dark:text-blue-300 font-bold">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>{language === 'en' ? 'DELIMa Google Workspace Authentication' : 'Pengesahan Google Workspace DELIMa'}</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {language === 'en'
              ? 'To enable Google Sign-In button, configure NEXT_PUBLIC_GOOGLE_CLIENT_ID in Vercel environment variables.'
              : 'Sila tetapkan NEXT_PUBLIC_GOOGLE_CLIENT_ID dalam Vercel environment variables untuk mengaktifkan butang Google Sign-In.'}
          </p>
        </div>
      )}

      <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center">
        * {language === 'en' ? 'Uses official MOE Malaysia DELIMa Google Workspace authentication.' : 'Menggunakan pengesahan Google Workspace DELIMa KPM rasmi.'}
      </p>
    </div>
  );
}
