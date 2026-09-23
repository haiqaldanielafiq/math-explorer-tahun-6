import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTopicBySlug } from '@/lib/storage';
import { ArrowLeft, BookOpen, Eye, Globe, Sparkles, Lightbulb, CheckCircle2 } from 'lucide-react';

export const revalidate = 0;

export default async function AdminPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const topic = await getTopicBySlug(id);

  if (!topic) {
    notFound();
  }

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Draft Watermark Top Bar */}
      <div className="bg-amber-500 text-slate-950 px-6 py-4 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 font-bold">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-slate-900" />
          <span>MOD PRATONTON DRAF GURU ({topic.published ? 'DITERBITKAN' : 'DRAF SAHAJA'})</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/admin/editor/${topic.id}`}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs hover:bg-slate-800 transition-colors"
          >
            Kembali ke Editor
          </Link>
          <Link
            href="/admin/dashboard"
            className="px-4 py-2 bg-amber-400 text-slate-900 rounded-xl text-xs hover:bg-amber-300 transition-colors border border-amber-600"
          >
            Dashboard
          </Link>
        </div>
      </div>

      {/* Render Student View Preview */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl space-y-8">
        <div className="space-y-3">
          <span className="bg-indigo-600 text-white font-extrabold text-xs px-3 py-1 rounded-lg">
            Topik {topic.code}
          </span>
          <h1 className="text-3xl font-black text-slate-900">{topic.title}</h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {topic.description}
          </p>

          <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100 text-xs text-indigo-950 space-y-1">
            <span className="font-bold">Standard Pembelajaran:</span>
            <p>{topic.standardPembelajaran}</p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6 space-y-8">
          {topic.sections?.map((section) => (
            <div key={section.id} className="space-y-4 bg-slate-50/60 p-6 rounded-2xl border border-slate-200/60">
              <h2 className="text-xl font-extrabold text-indigo-900">{section.title}</h2>
              {section.content && <p className="text-slate-700 text-sm leading-relaxed">{section.content}</p>}

              <div className="space-y-3">
                {section.blocks?.map((block) => {
                  if (block.type === 'heading') {
                    return <h3 key={block.id} className="text-base font-bold text-slate-900">{block.title}</h3>;
                  }
                  if (block.type === 'paragraph') {
                    return <p key={block.id} className="text-slate-700 text-sm whitespace-pre-line">{block.body}</p>;
                  }
                  if (block.type === 'callout') {
                    return (
                      <div key={block.id} className="bg-indigo-50 border-l-4 border-indigo-500 rounded-r-xl p-4 text-xs text-indigo-950 space-y-1">
                        {block.title && <div className="font-bold">{block.title}</div>}
                        <p>{block.body}</p>
                      </div>
                    );
                  }
                  if (block.type === 'formula') {
                    return (
                      <div key={block.id} className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center font-mono font-bold text-amber-950 text-sm">
                        {block.body}
                      </div>
                    );
                  }
                  if (block.type === 'example') {
                    return (
                      <div key={block.id} className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-950 space-y-1">
                        {block.title && <div className="font-bold">{block.title}</div>}
                        <p>{block.body}</p>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
