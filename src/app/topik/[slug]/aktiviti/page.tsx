import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTopicBySlug } from '@/lib/storage';
import { InteractivePieChart } from '@/components/InteractivePieChart';
import { ArrowLeft, BookOpen, ChevronRight, HelpCircle } from 'lucide-react';

export const revalidate = 0;

export default async function ActivityPage({
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
        <span className="text-emerald-600 font-bold">Aktiviti Interaktif</span>
      </nav>

      {/* Top Banner Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white rounded-2xl p-6 shadow-md">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Aktiviti Pembelajaran</span>
          <h1 className="text-2xl font-black">{topic.title} - Penerokaan Sudut 45°, 90°, 180°</h1>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href={`/topik/${topic.slug}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" /> Baca Nota
          </Link>
          <Link
            href={`/topik/${topic.slug}/kuiz`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" /> Jawab Kuiz
          </Link>
        </div>
      </div>

      {/* Interactive Pie Chart Component */}
      <InteractivePieChart activityData={topic.activity} />
    </div>
  );
}
