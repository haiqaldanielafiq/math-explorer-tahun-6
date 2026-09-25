'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Topic } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { QuizRunner } from '@/components/QuizRunner';
import { BookOpen, ChevronRight, PieChart, Loader2 } from 'lucide-react';

export default function QuizPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { language, tText } = useLanguage();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/topics/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setTopic(data.data);
        } else {
          setTopic(null);
        }
      })
      .catch(() => setTopic(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-slate-500 gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
        <span>{language === 'en' ? 'Loading quiz...' : 'Memuatkan kuiz...'}</span>
      </div>
    );
  }

  if (!topic || !topic.published) {
    notFound();
  }

  const topicTitle = tText(topic.title);
  const quizTitle = tText(topic.quiz.title) || (language === 'en' ? `${topicTitle} Quiz` : `Kuiz ${topicTitle}`);

  return (
    <div className="space-y-8 pb-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">
          {language === 'en' ? 'Home' : 'Utama'}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/topik" className="hover:text-indigo-600 dark:hover:text-indigo-400">
          {language === 'en' ? 'Math Topics' : 'Topik Matematik'}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/topik/${topic.slug}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">{topicTitle}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-amber-600 dark:text-amber-400 font-bold">
          {language === 'en' ? 'Understanding Quiz' : 'Kuiz Uji Kefahaman'}
        </span>
      </nav>

      {/* Top Banner Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white rounded-2xl p-6 shadow-md">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            {language === 'en' ? 'Assessment Module' : 'Modul Pentaksiran'}
          </span>
          <h1 className="text-2xl font-black">{quizTitle}</h1>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href={`/topik/${topic.slug}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            {language === 'en' ? 'Read Notes' : 'Baca Nota'}
          </Link>
          <Link
            href={`/topik/${topic.slug}/aktiviti`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-colors"
          >
            <PieChart className="w-3.5 h-3.5" />
            {language === 'en' ? 'Visual Activity' : 'Aktiviti Visual'}
          </Link>
        </div>
      </div>

      {/* Quiz Runner */}
      <QuizRunner
        quizData={topic.quiz}
        topicTitle={topicTitle}
        topicSlug={topic.slug}
      />
    </div>
  );
}
