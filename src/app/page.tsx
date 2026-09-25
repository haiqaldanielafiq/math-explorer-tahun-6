'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Topic } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  PieChart,
  HelpCircle,
  Award,
  Compass
} from 'lucide-react';
import { StarField, SaturnPlanet, AstronautBadge, RocketIcon } from '@/components/SpaceDecorations';

export default function HomePage() {
  const { language, tText } = useLanguage();
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    fetch('/api/topics')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setTopics(data.data.filter((t: Topic) => t.published));
        }
      })
      .catch(() => {});
  }, []);

  const featuredTopic = topics[0];

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl border border-indigo-500/30">
        <StarField />
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Decorative Space Icons */}
        <div className="absolute top-6 right-8 hidden lg:block opacity-90 animate-bounce transition-transform duration-1000">
          <SaturnPlanet className="w-20 h-20" />
        </div>
        <div className="absolute bottom-6 right-36 hidden lg:block opacity-80">
          <AstronautBadge className="w-16 h-16" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/30 border border-indigo-400/40 text-cyan-300 text-xs sm:text-sm font-semibold backdrop-blur-md">
            <RocketIcon className="w-5 h-5" />
            <span>
              {language === 'en'
                ? 'Primary Year 6 Mathematics KSSR Revision'
                : 'Matematik KSSR Semakan Tahun 6'}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            {language === 'en' ? 'Welcome to' : 'Selamat Datang ke'} <br />
            <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-cyan-300 bg-clip-text text-transparent">
              Math Explorer Tahun 6
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-200 font-normal leading-relaxed">
            {language === 'en'
              ? 'Learn Mathematics through interactive visual exploration, simulations, problem solving activities, and quizzes.'
              : 'Belajar Matematik melalui penerokaan visual, simulasi interaktif, aktiviti penyelesaian masalah, dan kuiz kefahaman.'}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              href={featuredTopic ? `/topik/${featuredTopic.slug}` : '/topik'}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-amber-400 text-slate-950 font-extrabold text-base hover:bg-amber-300 transition-all shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95"
            >
              <span>{language === 'en' ? 'Start Learning' : 'Mula Belajar'}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/topik/carta-pai/aktiviti"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-base transition-all border border-white/20 backdrop-blur-sm"
            >
              <PieChart className="w-5 h-5 text-cyan-300" />
              <span>{language === 'en' ? 'Pie Chart Activity' : 'Aktiviti Carta Pai'}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured DSKP Topic Card */}
      {featuredTopic && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm tracking-wider uppercase">
                <Compass className="w-4 h-4" />
                {language === 'en' ? 'Featured DSKP Topic' : 'Topik Pilihan Utama DSKP'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                {language === 'en' ? 'Topic' : 'Topik'} {featuredTopic.code}: {tText(featuredTopic.title)}
              </h2>
            </div>
            <Link
              href="/topik"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800"
            >
              <span>{language === 'en' ? 'View Topic Details' : 'Lihat Maklumat Topik'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-700 shadow-xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300 text-xs font-bold px-3 py-1 rounded-lg">
                    {language === 'en' ? 'Content Standard' : 'Standard Kandungan'} {featuredTopic.code}
                  </span>
                  <span className="bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-xs font-bold px-3 py-1 rounded-lg">
                    {language === 'en' ? 'Year 6 Primary' : 'Tahun 6 Primary'}
                  </span>
                </div>

                <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                  {tText(featuredTopic.description)}
                </p>

                <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700 rounded-2xl p-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white block">
                    {language === 'en' ? 'Learning Standard:' : 'Standard Pembelajaran:'}
                  </span>
                  <p className="italic text-slate-600 dark:text-slate-400">{tText(featuredTopic.standardPembelajaran)}</p>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Link
                    href={`/topik/${featuredTopic.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all"
                  >
                    <BookOpen className="w-4 h-4" /> {language === 'en' ? 'Notes' : 'Nota'}
                  </Link>
                  <Link
                    href={`/topik/${featuredTopic.slug}/aktiviti`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all"
                  >
                    <PieChart className="w-4 h-4" /> {language === 'en' ? 'Activity' : 'Aktiviti'}
                  </Link>
                  <Link
                    href={`/topik/${featuredTopic.slug}/kuiz`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md transition-all"
                  >
                    <HelpCircle className="w-4 h-4" /> {language === 'en' ? 'Quiz' : 'Kuiz'}
                  </Link>
                </div>
              </div>

              {/* Pie Chart Visual Illustration */}
              <div className="lg:col-span-4 flex justify-center">
                <div className="relative w-56 h-56 rounded-full bg-indigo-50 dark:bg-slate-900 border-4 border-white dark:border-slate-700 shadow-xl flex items-center justify-center p-4">
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    <path d="M 50,50 L 50,0 A 50,50 0 0,1 50,100 Z" fill="#3B82F6" className="opacity-90 hover:opacity-100 transition-opacity" />
                    <path d="M 50,50 L 50,100 A 50,50 0 0,1 0,50 Z" fill="#10B981" className="opacity-90 hover:opacity-100 transition-opacity" />
                    <path d="M 50,50 L 0,50 A 50,50 0 0,1 14.64,14.64 Z" fill="#F59E0B" className="opacity-90 hover:opacity-100 transition-opacity" />
                    <path d="M 50,50 L 14.64,14.64 A 50,50 0 0,1 50,0 Z" fill="#8B5CF6" className="opacity-90 hover:opacity-100 transition-opacity" />
                    <circle cx="50" cy="50" r="4" fill="#FFFFFF" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-black text-indigo-900 dark:text-indigo-300 shadow">
                      {language === 'en' ? '360° Pie Chart' : 'Carta Pai 360°'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Interactive Features Cards */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {language === 'en' ? 'What can you do?' : 'Apa yang boleh kamu lakukan?'}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
            {language === 'en'
              ? 'Interactive learning module to help you easily master Year 6 Mathematics.'
              : 'Modul pembelajaran interaktif untuk membantu kamu menguasai subjek Matematik Tahun 6 dengan mudah.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
              {language === 'en' ? '1. Learn Concepts' : '1. Belajar Konsep'}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
              {language === 'en'
                ? 'Understand pie chart concepts, angles, sectors, and data interpretation.'
                : 'Fahami konsep carta pai, nilai sudut sektor, dan cara mentafsir data.'}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
              <PieChart className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
              {language === 'en' ? '2. Interactive Activity' : '2. Aktiviti Interaktif'}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
              {language === 'en'
                ? 'Interact with angles (45°, 90°, 180°) and calculate sector quantities live.'
                : 'Manipulasi sudut (45°, 90°, 180°) dan kira kuantiti sektor secara langsung.'}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-300 flex items-center justify-center">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
              {language === 'en' ? '3. Answer Quizzes' : '3. Jawab Kuiz'}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
              {language === 'en'
                ? 'Answer DSKP questions and receive instant step-by-step solution explanations.'
                : 'Jawab soalan DSKP dan dapatkan penjelasan penyelesaian langkah demi langkah.'}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-300 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
              {language === 'en' ? '4. Check Progress' : '4. Semak Kemajuan'}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
              {language === 'en'
                ? 'Track your percentage scores and collect module mastery badges!'
                : 'Jejak skor peratusan dan kumpul lencana penguasaan modul matematik kamu!'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
