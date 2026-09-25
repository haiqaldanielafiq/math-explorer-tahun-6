'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Topic } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { BookOpen, Layers, ArrowRight, CheckCircle } from 'lucide-react';
import { StarField, SaturnPlanet, CutePlanet } from '@/components/SpaceDecorations';

export default function TopicsPage() {
  const { language, tText } = useLanguage();
  const [publishedTopics, setPublishedTopics] = useState<Topic[]>([]);

  useEffect(() => {
    fetch('/api/topics')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setPublishedTopics(data.data.filter((t: Topic) => t.published));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-10 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden border border-indigo-500/30">
        <StarField />
        <div className="absolute right-6 top-6 hidden sm:block opacity-80">
          <SaturnPlanet className="w-16 h-16" />
        </div>
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="bg-white/20 text-white font-bold text-xs px-3 py-1 rounded-full border border-white/30 backdrop-blur-sm">
            {language === 'en'
              ? 'Year 6 DSKP Curriculum (Pie Chart Topic)'
              : 'Kurikulum DSKP Tahun 6 (Topik Carta Pai)'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black">
            {language === 'en' ? 'Mathematics Topic List' : 'Senarai Topik Matematik'}
          </h1>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
            {language === 'en'
              ? 'Select the learning module below to explore concepts, interactive animations, and understanding quizzes.'
              : 'Pilih modul pembelajaran di bawah untuk meneroka konsep, animasi interaktif, dan kuiz kefahaman.'}
          </p>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>
              {language === 'en'
                ? `Published Topics (${publishedTopics.length})`
                : `Topik Diterbitkan (${publishedTopics.length})`}
            </span>
          </h2>
        </div>

        {publishedTopics.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-700">
            <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">
              {language === 'en' ? 'No Published Topics' : 'Belum Ada Topik Diterbitkan'}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {language === 'en' ? 'Teacher is preparing learning modules.' : 'Cikgu sedang menyediakan modul pembelajaran baru.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {publishedTopics.map((topic, idx) => (
              <div
                key={topic.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-md hover:shadow-xl transition-all duration-200 p-6 flex flex-col justify-between group hover:border-indigo-300 dark:hover:border-indigo-500 hover:-translate-y-1 relative overflow-hidden"
              >
                <div className="absolute -right-4 -bottom-4 opacity-15 pointer-events-none group-hover:opacity-30 transition-opacity">
                  <CutePlanet className="w-24 h-24" color={idx % 3 === 0 ? 'cyan' : idx % 3 === 1 ? 'purple' : 'amber'} />
                </div>

                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <span className="bg-indigo-600 text-white text-xs font-black px-3 py-1 rounded-lg">
                      {language === 'en' ? 'Topic' : 'Topik'} {topic.code}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {language === 'en' ? 'Ready to Learn' : 'Bersedia Belajar'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {tText(topic.title)}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm mt-2 line-clamp-2">
                      {tText(topic.description)}
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 border border-slate-100 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {language === 'en' ? 'Learning Standard:' : 'Standard Pembelajaran:'}
                    </span>
                    <p className="line-clamp-2 italic">{tText(topic.standardPembelajaran)}</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {topic.sections?.length || 0} {language === 'en' ? 'Note Sections' : 'Bahagian Nota'}
                  </span>
                  <Link
                    href={`/topik/${topic.slug}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs hover:bg-indigo-600 hover:text-white transition-all group-hover:bg-indigo-600 group-hover:text-white"
                  >
                    <span>{language === 'en' ? 'Start Learning' : 'Mula Belajar'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
