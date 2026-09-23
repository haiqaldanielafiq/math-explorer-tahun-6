'use client';

import { useState, useEffect } from 'react';
import { Award, CheckCircle2, PieChart, RefreshCw, Sparkles, Trophy } from 'lucide-react';
import Link from 'next/link';

interface ProgressRecord {
  topicSlug: string;
  topicTitle: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: string;
}

export default function StudentProgressPage() {
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
    if (confirm('Adakah anda pasti mahu menetapkan semula kemajuan anda?')) {
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
            <span>Laporan Pembelajaran Peribadi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">Kemajuan & Pencapaian Saya</h1>
          <p className="text-amber-100 text-sm sm:text-base leading-relaxed">
            Semak keputusan kuiz, markah peratusan, dan rekod penguasaan topik Matematik kamu.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{totalQuizzes}</div>
            <div className="text-xs font-bold text-slate-500">Kuiz Diselesaikan</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{avgScore}%</div>
            <div className="text-xs font-bold text-slate-500">Purata Peratusan</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">
              {avgScore >= 80 ? 'Pakar' : avgScore >= 50 ? 'Baik' : 'Mula'}
            </div>
            <div className="text-xs font-bold text-slate-500">Tahap Penguasaan</div>
          </div>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-xl font-bold text-slate-900">Rekod Keputusan Kuiz</h2>
          {records.length > 0 && (
            <button
              onClick={handleClearProgress}
              className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-800 font-semibold bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Set Semula Kemajuan
            </button>
          )}
        </div>

        {records.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <PieChart className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">Belum Ada Rekod Kuiz</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Kamu belum menjawab sebarang kuiz lagi. Sila pilih topik Carta Pai dan jawab kuiz untuk melihat rekod markah kamu di sini!
            </p>
            <Link
              href="/topik/carta-pai/kuiz"
              className="inline-block mt-3 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors shadow"
            >
              Jawab Kuiz Carta Pai Sekarang
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {records.map((rec, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200 gap-4"
              >
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 text-base">{rec.topicTitle}</div>
                  <div className="text-xs text-slate-500">
                    Tarikh: {new Date(rec.completedAt).toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-black text-indigo-900">{rec.score} / {rec.totalQuestions} Soalan</div>
                    <div className="text-xs font-bold text-emerald-600">{rec.percentage}% Markah</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    rec.percentage >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {rec.percentage >= 80 ? 'Lulus Cemerlang' : 'Selesai'}
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
