'use client';

import { useState, useEffect } from 'react';
import { Award, CheckCircle2, PieChart, RefreshCw, Sparkles, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

interface ProgressRecord {
  topicSlug: string;
  topicTitle: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: string;
}

export default function StudentProgressPage() {
  const { language } = useLanguage();
  const [records, setRecords] = useState<ProgressRecord[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('math_explorer_progress');
      if (stored) {
        setRecords(JSON.parse(stored));
      }
    } catch {
      // empty
    }
  }, []);

  const handleClearProgress = () => {
    const confirmMsg = language === 'en'
      ? 'Are you sure you want to reset your progress?'
      : 'Adakah anda pasti mahu menetapkan semula kemajuan anda?';
    if (confirm(confirmMsg)) {
      localStorage.removeItem('math_explorer_progress');
      setRecords([]);
    }
  };

  const totalQuizzes = records.length;
  const avgScore = totalQuizzes > 0
    ? Math.round(records.reduce((acc, curr) => acc + curr.percentage, 0) / totalQuizzes)
    : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
            <Trophy className="w-4 h-4 text-amber-200" />
            <span>{language === 'en' ? 'Personal Learning Report' : 'Laporan Pembelajaran Peribadi'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">
            {language === 'en' ? 'My Progress & Achievements' : 'Kemajuan & Pencapaian Saya'}
          </h1>
          <p className="text-amber-100 text-sm sm:text-base leading-relaxed">
            {language === 'en'
              ? 'Check quiz results, percentage scores, and Mathematics topic mastery records.'
              : 'Semak keputusan kuiz, markah peratusan, dan rekod penguasaan topik Matematik kamu.'}
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 flex items-center justify-center font-bold">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{totalQuizzes}</div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {language === 'en' ? 'Quizzes Completed' : 'Kuiz Diselesaikan'}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{avgScore}%</div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {language === 'en' ? 'Average Score' : 'Purata Peratusan'}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {avgScore >= 80 ? (language === 'en' ? 'Master' : 'Pakar') : avgScore >= 50 ? (language === 'en' ? 'Good' : 'Baik') : (language === 'en' ? 'Beginner' : 'Mula')}
            </div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {language === 'en' ? 'Mastery Level' : 'Tahap Penguasaan'}
            </div>
          </div>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-lg space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {language === 'en' ? 'Quiz Result History' : 'Rekod Keputusan Kuiz'}
          </h2>
          {records.length > 0 && (
            <button
              onClick={handleClearProgress}
              className="inline-flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 hover:text-rose-800 font-semibold bg-rose-50 dark:bg-rose-950/50 px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-800 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> {language === 'en' ? 'Reset Progress' : 'Set Semula Kemajuan'}
            </button>
          )}
        </div>

        {records.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <PieChart className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">
              {language === 'en' ? 'No Quiz Records Yet' : 'Belum Ada Rekod Kuiz'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              {language === 'en'
                ? 'You have not taken any quizzes yet. Select Pie Chart topic and complete the quiz to see your score record here!'
                : 'Kamu belum menjawab sebarang kuiz lagi. Sila pilih topik Carta Pai dan jawab kuiz untuk melihat rekod markah kamu di sini!'}
            </p>
            <Link
              href="/topik/carta-pai/kuiz"
              className="inline-block mt-3 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors shadow"
            >
              {language === 'en' ? 'Take Pie Chart Quiz Now' : 'Jawab Kuiz Carta Pai Sekarang'}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {records.map((rec, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 gap-4"
              >
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white text-base">{rec.topicTitle}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {language === 'en' ? 'Date' : 'Tarikh'}: {new Date(rec.completedAt).toLocaleDateString(language === 'en' ? 'en-US' : 'ms-MY', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-black text-indigo-900 dark:text-indigo-300">
                      {rec.score} / {rec.totalQuestions} {language === 'en' ? 'Questions' : 'Soalan'}
                    </div>
                    <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{rec.percentage}% {language === 'en' ? 'Score' : 'Markah'}</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    rec.percentage >= 80 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                  }`}>
                    {rec.percentage >= 80 ? (language === 'en' ? 'Excellent Pass' : 'Lulus Cemerlang') : (language === 'en' ? 'Completed' : 'Selesai')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
