import Link from 'next/link';
import { getTopics } from '@/lib/storage';
import { getLocalizedText } from '@/lib/utils';
import {
  BookOpen,
  CheckCircle,
  PieChart,
  HelpCircle,
  Plus,
  Globe,
  FileText
} from 'lucide-react';
import { TopicActionButtons } from '@/components/TopicActionButtons';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const topics = await getTopics();

  const totalTopics = topics.length;
  const publishedTopics = topics.filter((t) => t.published).length;
  const draftTopics = totalTopics - publishedTopics;

  const totalActivities = topics.reduce((acc, t) => acc + (t.activity ? 1 : 0), 0);
  const totalQuizQuestions = topics.reduce((acc, t) => acc + (t.quiz?.questions?.length || 0), 0);

  return (
    <div className="space-y-8 pb-12">
      {/* Page Title & Quick Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Papan Pemuka Pentadbir (Dashboard)</h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            Selamat datang, Cikgu! Urus 4 modul utama, nota, aktiviti, dan kuiz Matematik Tahun 6 di sini.
          </p>
        </div>

        <Link
          href="/admin/topik"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Tambah Topik Baru
        </Link>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase">Jumlah Topik</span>
            <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">{totalTopics}</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase">Diterbitkan</span>
            <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{publishedTopics}</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase">Draf Sahaja</span>
            <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-600 dark:text-amber-400">{draftTopics}</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase">Aktiviti</span>
            <PieChart className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-3xl font-black text-blue-600 dark:text-blue-400">{totalActivities}</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase">Soalan Kuiz</span>
            <HelpCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-3xl font-black text-purple-600 dark:text-purple-400">{totalQuizQuestions}</div>
        </div>
      </div>

      {/* Content Management Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700 shadow-lg p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Senarai Pengurusan Kandungan</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Sunting kandungan, ubah status draf/terbitan atau lihat pratonton.</p>
          </div>
          <Link
            href="/admin/topik"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800"
          >
            Urus Semua Topik &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="pb-3 px-2">Kod DSKP</th>
                <th className="pb-3 px-2">Tajuk Modul / Topik</th>
                <th className="pb-3 px-2">Status</th>
                <th className="pb-3 px-2">Tarikh Kemaskini</th>
                <th className="pb-3 px-2 text-right">Tindakan Editor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {topics.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="py-4 px-2 font-mono font-bold text-indigo-700 dark:text-indigo-300">
                    {t.code}
                  </td>
                  <td className="py-4 px-2 font-bold text-slate-900 dark:text-white">
                    {getLocalizedText(t.title)}
                    <span className="block text-xs font-normal text-slate-500 dark:text-slate-400 line-clamp-1">{getLocalizedText(t.standardKandungan)}</span>
                  </td>
                  <td className="py-4 px-2">
                    {t.published ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle className="w-3 h-3" /> Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
                        <FileText className="w-3 h-3" /> Draft
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-2 text-slate-500 dark:text-slate-400 text-xs">
                    {new Date(t.updatedAt).toLocaleDateString('ms-MY')}
                  </td>
                  <td className="py-4 px-2 text-right">
                    <TopicActionButtons topic={t} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
