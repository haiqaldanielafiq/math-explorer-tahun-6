import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTopicBySlug } from '@/lib/storage';
import { QuizRunner } from '@/components/QuizRunner';
import { ArrowLeft, BookOpen, ChevronRight, PieChart } from 'lucide-react';

export const revalidate = 0;

export default async function QuizPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = await getTopicBySlug(slug);

  if (!topic || !topic.published) {
    notFound();
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/" className="hover:text-indigo-600">Utama</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/topik" className="hover:text-indigo-600">Topik Matematik</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/topik/${topic.slug}`} className="hover:text-indigo-600">{topic.title}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-amber-600 font-bold">Kuiz Uji Kefahaman</span>
      </nav>

      {/* Top Banner Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white rounded-2xl p-6 shadow-md">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Modul Pentaksiran</span>
          <h1 className="text-2xl font-black">{topic.quiz.title || `Kuiz ${topic.title}`}</h1>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href={`/topik/${topic.slug}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" /> Baca Nota
          </Link>
          <Link
            href={`/topik/${topic.slug}/aktiviti`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-colors"
          >
            <PieChart className="w-3.5 h-3.5" /> Aktiviti Visual
          </Link>
        </div>
      </div>

      {/* Quiz Runner */}
      <QuizRunner
        quizData={topic.quiz}
        topicTitle={topic.title}
        topicSlug={topic.slug}
      />
    </div>
  );
}
