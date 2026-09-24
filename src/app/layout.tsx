import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Navbar, Footer } from '@/components/Navigation';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';

const fontSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Math Explorer Tahun 6 | Pembelajaran Matematik Interaktif',
  description: 'Platform pembelajaran matematik interaktif Tahun 6 berasaskan DSKP KSSR Semakan. Carta pai, nombor besar, pecahan & peratus, masa & waktu.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ms" className="light">
      <body className={`${fontSans.variable} font-sans bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 antialiased min-h-screen flex flex-col justify-between transition-colors`}>
        <ThemeProvider>
          <LanguageProvider>
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
            <Footer />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
