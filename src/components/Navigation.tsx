'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, PieChart, Award, Lock, Home, Info, Sparkles } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Utama', icon: Home },
    { href: '/topik', label: 'Topik Matematik', icon: BookOpen },
    { href: '/topik/carta-pai/aktiviti', label: 'Aktiviti Interaktif', icon: PieChart },
    { href: '/kemajuan', label: 'Kemajuan Saya', icon: Award },
    { href: '/mengenai', label: 'Mengenai', icon: Info },
  ];

  const isAdminPage = pathname?.startsWith('/admin');

  if (isAdminPage) {
    return null; // Admin has its own sidebar layout
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <PieChart className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl bg-gradient-to-r from-indigo-700 via-blue-700 to-cyan-600 bg-clip-text text-transparent">
                  Math Explorer
                </span>
                <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full border border-amber-200">
                  Tahun 6
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Pembelajaran Matematik Interaktif</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-50/80 p-1.5 rounded-2xl border border-slate-200/60">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/50'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Teacher Portal Link */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 transition-colors border border-slate-200"
            >
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Portal Cikgu</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Bar */}
      <div className="md:hidden flex items-center justify-around bg-white border-t border-slate-100 py-2.5 px-2">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold ${
                isActive ? 'text-indigo-600 font-bold' : 'text-slate-500'
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
              Platform pembelajaran matematik interaktif bertaraf DSKP KSSR Semakan untuk murid Tahun 6 sekolah rendah Malaysia.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Pautan Pantas</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/topik" className="hover:text-amber-400 transition-colors">
                  Topik 8.1 Carta Pai
                </Link>
              </li>
              <li>
                <Link href="/topik/carta-pai/aktiviti" className="hover:text-amber-400 transition-colors">
                  Aktiviti Visual Interaktif
                </Link>
              </li>
              <li>
                <Link href="/topik/carta-pai/kuiz" className="hover:text-amber-400 transition-colors">
                  Kuiz Kefahaman DSKP
                </Link>
              </li>
              <li>
                <Link href="/kemajuan" className="hover:text-amber-400 transition-colors">
                  Semak Laporan Kemajuan
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Akses Guru / Pentadbir</h3>
            <p className="text-sm text-slate-400 mb-3">
              Guru boleh menambah, menyunting, dan menyiarkan modul pembelajaran baharu secara langsung.
            </p>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-amber-300 border border-slate-700 text-xs font-bold hover:bg-slate-700 transition-colors"
            >
              <Lock className="w-3.5 h-3.5" /> Log Masuk Guru
            </Link>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2025 Math Explorer Tahun 6. KSSR Semakan Kementerian Pendidikan Malaysia (KPM).</p>
          <div className="flex items-center gap-2 text-slate-400">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Rekabentuk Pendidikan Interaktif</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
