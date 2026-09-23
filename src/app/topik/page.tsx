import Link from 'next/link';
import { getTopics } from '@/lib/storage';
import { BookOpen, PieChart, Layers, ArrowRight, CheckCircle } from 'lucide-react';

export const revalidate = 0;

export default async function TopicsPage() {
  const topics = await getTopics();
  const publishedTopics = topics.filter((t) => t.published);

  return (
    <div className="space-y-10 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-800 via-indigo-700 to-blue-800 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="bg-white/20 text-white font-bold text-xs px-3 py-1 rounded-full border border-white/30 backdrop-blur-sm">
            Kurikulum DSKP Tahun 6
          </span>
          <h1 className="text-3xl sm:text-4xl font-black">Senarai Topik Matematik</h1>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
            Pilih modul pembelajaran di bawah untuk meneroka konsep, animasi interaktif, dan kuiz kefahaman.
          </p>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <span>Topik Diterbitkan ({publishedTopics.length})</span>
          </h2>
        </div>

        {publishedTopics.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-700">Belum Ada Topik Diterbitkan</h3>
            <p className="text-sm text-slate-500 mt-1">Cikgu sedang menyediakan modul pembelajaran baru.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {publishedTopics.map((topic) => (
              <div
                key={topic.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-200 p-6 flex flex-col justify-between group hover:border-indigo-300"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <span className="bg-indigo-600 text-white text-xs font-black px-3 py-1 rounded-lg">
                      Topik {topic.code}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Bersedia Belajar
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-slate-600 text-sm mt-2 line-clamp-2">
                      {topic.description}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs text-slate-600 space-y-1">
                    <span className="font-bold text-slate-800">Standard Pembelajaran:</span>
                    <p className="line-clamp-2 italic">{topic.standardPembelajaran}</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">
                    {topic.sections?.length || 0} Bahagian Nota
                  </span>
                  <Link
                    href={`/topik/${topic.slug}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs hover:bg-indigo-600 hover:text-white transition-all group-hover:bg-indigo-600 group-hover:text-white"
                  >
                    <span>Mula Belajar</span>
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
