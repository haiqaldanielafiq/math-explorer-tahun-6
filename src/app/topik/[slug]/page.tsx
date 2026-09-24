import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTopicBySlug } from '@/lib/storage';
import { getLocalizedText } from '@/lib/utils';
import {
  BookOpen,
  PieChart,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Lightbulb,
  ChevronRight
} from 'lucide-react';

export const revalidate = 0;

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = await getTopicBySlug(slug);

  if (!topic || !topic.published) {
    notFound();
  }

  const titleText = getLocalizedText(topic.title);
  const descText = getLocalizedText(topic.description);
  const stdKandunganText = getLocalizedText(topic.standardKandungan);
  const stdPembelajaranText = getLocalizedText(topic.standardPembelajaran);

  return (
    <div className="space-y-10 pb-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">Utama</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/topik" className="hover:text-indigo-600 dark:hover:text-indigo-400">Topik Matematik</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-indigo-600 dark:text-indigo-400 font-bold">{titleText}</span>
      </nav>

      {/* Lesson Header Hero */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-amber-400 text-slate-950 font-extrabold text-xs px-3 py-1 rounded-lg">
              Topik {topic.code}
            </span>
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-lg backdrop-blur-sm">
              Standard Kandungan {stdKandunganText}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black">{titleText}</h1>
          <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
            {descText}
          </p>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 space-y-2 text-xs sm:text-sm">
            <div className="font-bold text-amber-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Standard Pembelajaran {topic.code}.1:
            </div>
            <p className="text-slate-100">{stdPembelajaranText}</p>
          </div>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href={`/topik/${topic.slug}/aktiviti`}
          className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl p-5 shadow-lg flex items-center justify-between group transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <PieChart className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-base">Aktiviti Visual Interaktif</div>
              <div className="text-xs text-emerald-100">Bina & teroka konsep modul ini</div>
            </div>
          </div>
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href={`/topik/${topic.slug}/kuiz`}
          className="bg-amber-500 hover:bg-amber-600 text-white rounded-2xl p-5 shadow-lg flex items-center justify-between group transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-base">Kuiz Uji Kefahaman</div>
              <div className="text-xs text-amber-100">Jawab soalan & terima skor peratusan</div>
            </div>
          </div>
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Lesson Content Render */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-700 shadow-lg space-y-10">
        <div className="border-b border-slate-100 dark:border-slate-700 pb-4 flex items-center gap-3">
          <BookOpen className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Modul Nota Pembelajaran</h2>
        </div>

        {topic.sections?.map((section) => (
          <div key={section.id} className="space-y-6 bg-slate-50/50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700">
            <h3 className="text-xl font-extrabold text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-600 dark:bg-indigo-400 inline-block" />
              {getLocalizedText(section.title)}
            </h3>

            {section.content && (
              <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
                {getLocalizedText(section.content)}
              </p>
            )}

            {/* Block Items */}
            <div className="space-y-4">
              {section.blocks?.map((block) => {
                if (block.type === 'heading') {
                  return (
                    <h4 key={block.id} className="text-lg font-bold text-slate-900 dark:text-white pt-2">
                      {getLocalizedText(block.title)}
                    </h4>
                  );
                }

                if (block.type === 'paragraph') {
                  return (
                    <div key={block.id} className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                      {getLocalizedText(block.body)}
                    </div>
                  );
                }

                if (block.type === 'callout') {
                  return (
                    <div
                      key={block.id}
                      className="bg-indigo-50 dark:bg-indigo-950/60 border-l-4 border-indigo-500 rounded-r-xl p-4 text-sm text-indigo-950 dark:text-indigo-200 space-y-1"
                    >
                      {block.title && <div className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        {getLocalizedText(block.title)}
                      </div>}
                      <p className="whitespace-pre-line">{getLocalizedText(block.body)}</p>
                    </div>
                  );
                }

                if (block.type === 'formula') {
                  return (
                    <div
                      key={block.id}
                      className="bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 text-center space-y-2"
                    >
                      {block.title && <div className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">{getLocalizedText(block.title)}</div>}
                      <div className="text-base sm:text-xl font-black text-amber-950 dark:text-amber-200 font-mono">
                        {getLocalizedText(block.body)}
                      </div>
                    </div>
                  );
                }

                if (block.type === 'example') {
                  return (
                    <div
                      key={block.id}
                      className="bg-emerald-50/80 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5 text-sm space-y-2"
                    >
                      {block.title && (
                        <div className="font-extrabold text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> {getLocalizedText(block.title)}
                        </div>
                      )}
                      <p className="text-emerald-950 dark:text-emerald-200 whitespace-pre-line">{getLocalizedText(block.body)}</p>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-2xl font-extrabold">Bersedia Uji Minda?</h3>
          <p className="text-slate-100 text-sm">
            Ayo teruskan ke aktiviti interaktif dan kuiz kefahaman modul ini!
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/topik/${topic.slug}/aktiviti`}
            className="px-6 py-3 rounded-xl bg-white text-indigo-700 font-extrabold text-sm shadow hover:bg-slate-100 transition-colors"
          >
            Mula Aktiviti
          </Link>
        </div>
      </div>
    </div>
  );
}
