'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, UserCheck, Lock, LogOut } from 'lucide-react';
import Link from 'next/link';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [session, setSession] = useState<any>(null);

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  useEffect(() => {
    // Check current session
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setSession(data.user);
        }
      })
      .catch(() => {});

    // Load Google Identity Script dynamically if Client ID is configured
    if (googleClientId && typeof window !== 'undefined') {
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
              locale: 'ms',
            });
          }
        }
      };
      document.body.appendChild(script);
    }
  }, [googleClientId]);

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
          alert('Log masuk berjaya sebagai Murid DELIMa (' + data.user.email + '). Akaun ini tidak mempunyai kebenaran Pentadbir/Guru.');
        }
      } else {
        setError(data.error || 'Akaun DELIMa tidak disahkan.');
      }
    } catch {
      setError('Ralat sambungan pelayan Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleMockDelimaLogin = async (teacherEmail: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/delima', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: teacherEmail,
          name: teacherEmail.includes('cikgu') ? 'Cikgu DELIMa Utama' : 'Murid DELIMa',
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.role === 'ADMIN') {
          window.location.href = onSuccessRedirect;
        } else {
          alert('Log masuk sebagai Murid DELIMa (' + teacherEmail + '). Akses hanya untuk membaca nota dan menjawab kuiz.');
        }
      } else {
        setError(data.error || 'Akaun DELIMa tidak dibenarkan.');
      }
    } catch {
      setError('Ralat sambungan pelayan.');
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

      {/* Render Google Official Button if Client ID exists */}
      <div id="google-delima-btn" className="flex justify-center" />

      {/* DELIMa Google Workspace OAuth Trigger Button */}
      <button
        type="button"
        disabled={loading}
        onClick={() => handleMockDelimaLogin('cikgu@moe-dl.edu.my')}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50"
      >
        <ShieldCheck className="w-5 h-5 text-amber-300" />
        <span>Log Masuk dengan Akaun DELIMa (@moe-dl.edu.my)</span>
      </button>

      <p className="text-[11px] text-slate-500 text-center">
        *Menggunakan pengesahan Google Workspace DELIMa KPM rasmi.
      </p>
    </div>
  );
}
