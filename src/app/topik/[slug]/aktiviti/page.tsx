'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Topic } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { InteractivePieChart } from '@/components/InteractivePieChart';
import { BookOpen, ChevronRight, HelpCircle, Loader2 } from 'lucide-react';

export default function ActivityPage({
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
        <span>{language === 'en' ? 'Loading activity...' : 'Memuatkan aktiviti...'}</span>
      </div>
    );
  }

  if (!topic || !topic.published) {
    notFound();
  }

  const topicTitle = tText(topic.title);

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
        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
          {language === 'en' ? 'Interactive Activity' : 'Aktiviti Interaktif'}
        </span>
      </nav>

      {/* Top Banner Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white rounded-2xl p-6 shadow-md">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            {language === 'en' ? 'Learning Activity' : 'Aktiviti Pembelajaran'}
          </span>
          <h1 className="text-2xl font-black">
            {topicTitle} - {language === 'en' ? 'Activity Module' : 'Modul Aktiviti'}
          </h1>
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
            href={`/topik/${topic.slug}/kuiz`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            {language === 'en' ? 'Take Quiz' : 'Jawab Kuiz'}
          </Link>
        </div>
      </div>

      {/* Interactive Pie Chart Component */}
      <InteractivePieChart activityData={topic.activity} />
    </div>
  );
}
