'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, PieChart, Award, Lock, Home, Info, Sun, Moon, User, LogOut, ShieldCheck, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

export function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<{ name: string; email: string; role: 'ADMIN' | 'STUDENT'; picture?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, [pathname]);

  const handleLogout = async () => {
    setIsLoading(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setIsLoading(false);
    window.location.href = '/';
  };

  const navLinks = [
    { href: '/', label: language === 'en' ? 'Home' : 'Utama', icon: Home },
    { href: '/topik', label: language === 'en' ? 'Math Topics' : 'Topik Matematik', icon: BookOpen },
    { href: '/topik/carta-pai/aktiviti', label: language === 'en' ? 'Interactive Activity' : 'Aktiviti Interaktif', icon: PieChart },
    { href: '/kemajuan', label: language === 'en' ? 'My Progress' : 'Kemajuan Saya', icon: Award },
    { href: '/mengenai', label: language === 'en' ? 'About' : 'Mengenai', icon: Info },
  ];

  const isAdminPage = pathname?.startsWith('/admin');

  if (isAdminPage) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-200 dark:shadow-none group-hover:scale-105 transition-transform">
              <PieChart className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl bg-gradient-to-r from-indigo-700 via-blue-700 to-cyan-600 dark:from-indigo-400 dark:via-blue-400 dark:to-cyan-300 bg-clip-text text-transparent">
                  Math Explorer
                </span>
                <span className="bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-xs font-bold px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                  Tahun 6
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {language === 'en' ? 'Interactive Mathematics Learning' : 'Pembelajaran Matematik Interaktif'}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-50/80 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-700">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-sm border border-slate-200/50 dark:border-slate-700'
                      : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100/60 dark:hover:bg-slate-700/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Language + Theme + User Profile / Login Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
              <button
                type="button"
                onClick={() => setLanguage('ms')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  language === 'ms'
                    ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                🇲🇾 BM
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                🇬🇧 EN
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* User Profile or Loading or Login Button */}
            {isLoading ? (
              <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600 dark:text-indigo-400" />
                <span className="hidden sm:inline">Pengesahan...</span>
              </div>
            ) : user ? (
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="w-8 h-8 rounded-lg object-cover shrink-0 shadow-sm border border-slate-200 dark:border-slate-700"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-blue-600 text-white flex items-center justify-center font-extrabold shrink-0 shadow-sm">
                    {user.role === 'ADMIN' ? <ShieldCheck className="w-4.5 h-4.5 text-amber-300" /> : <User className="w-4.5 h-4.5" />}
                  </div>
                )}
                <div className="hidden sm:block text-left pr-1">
                  <div className="font-extrabold text-slate-900 dark:text-white text-[11px] truncate max-w-[120px]">
                    {user.name}
                  </div>
                  <div className="text-[10px] flex items-center gap-1">
                    <span className={`px-1.5 py-0.2 rounded font-black text-[9px] uppercase tracking-wide ${
                      user.role === 'ADMIN'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    }`}>
                      {user.role === 'ADMIN' ? 'GURU' : 'MURID'}
                    </span>
                  </div>
                </div>
                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin/dashboard"
                    className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-extrabold transition-colors shadow-sm"
                  >
                    CMS
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  title={language === 'en' ? 'Log Out' : 'Log Keluar'}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors border border-slate-200 dark:border-slate-700"
              >
                <Lock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span className="hidden sm:inline">{language === 'en' ? 'Log In / DELIMa' : 'Log Masuk DELIMa'}</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="lg:hidden flex items-center justify-around bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 py-2.5 px-2">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-semibold ${
                isActive ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}

export function Footer() {
  const pathname = usePathname();
  const { language } = useLanguage();
  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                <PieChart className="w-6 h-6" />
              </div>
              <span className="font-bold text-lg text-white">Math Explorer Tahun 6</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {language === 'en'
                ? 'Interactive Mathematics learning platform aligned with DSKP KSSR Semakan for Year 6 primary students in Malaysia.'
                : 'Platform pembelajaran matematik interaktif bertaraf DSKP KSSR Semakan untuk murid Tahun 6 sekolah rendah Malaysia.'}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              {language === 'en' ? 'Quick Links' : 'Pautan Pantas'}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/topik" className="hover:text-amber-400 transition-colors">
                  {language === 'en' ? 'All 4 Mathematics Topics' : '4 Topik Utama Matematik'}
                </Link>
              </li>
              <li>
                <Link href="/topik/carta-pai/aktiviti" className="hover:text-amber-400 transition-colors">
                  {language === 'en' ? 'Interactive Pie Chart Activity' : 'Aktiviti Visual Interaktif'}
                </Link>
              </li>
              <li>
                <Link href="/topik/carta-pai/kuiz" className="hover:text-amber-400 transition-colors">
                  {language === 'en' ? 'DSKP Self-Assessment Quizzes' : 'Kuiz Kefahaman DSKP'}
                </Link>
              </li>
              <li>
                <Link href="/kemajuan" className="hover:text-amber-400 transition-colors">
                  {language === 'en' ? 'Check My Progress' : 'Semak Laporan Kemajuan'}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              {language === 'en' ? 'DELIMa / Teacher Access' : 'Akses DELIMa / Guru'}
            </h3>
            <p className="text-sm text-slate-400 mb-3">
              {language === 'en'
                ? 'Authorized teachers can sign in via DELIMa Google Workspace to create, edit, and publish learning modules.'
                : 'Guru boleh log masuk dengan akaun DELIMa Google Workspace untuk menyunting dan menerbit modul baharu.'}
            </p>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-amber-300 border border-slate-700 text-xs font-bold hover:bg-slate-700 transition-colors"
            >
              <Lock className="w-3.5 h-3.5" /> {language === 'en' ? 'DELIMa Single Sign-In' : 'Log Masuk DELIMa'}
            </Link>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2025 Math Explorer Tahun 6. KSSR Semakan Kementerian Pendidikan Malaysia (KPM).</p>
          <div className="flex items-center gap-2 text-slate-400">
            <span>BM | EN Bilingual Mode Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
