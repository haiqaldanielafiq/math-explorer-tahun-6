import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTopicBySlug } from '@/lib/storage';
import { getLocalizedText } from '@/lib/utils';
import { Eye } from 'lucide-react';

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

  const topicTitle = getLocalizedText(topic.title);
  const topicDesc = getLocalizedText(topic.description);
  const stdPembelajaran = getLocalizedText(topic.standardPembelajaran);

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
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-700 shadow-xl space-y-8">
        <div className="space-y-3">
          <span className="bg-indigo-600 text-white font-extrabold text-xs px-3 py-1 rounded-lg">
            Topik {topic.code}
          </span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">{topicTitle}</h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            {topicDesc}
          </p>

          <div className="bg-indigo-50 dark:bg-indigo-950/60 rounded-2xl p-4 border border-indigo-100 dark:border-indigo-900 text-xs text-indigo-950 dark:text-indigo-200 space-y-1">
            <span className="font-bold">Standard Pembelajaran:</span>
            <p>{stdPembelajaran}</p>
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-700 pt-6 space-y-8">
          {topic.sections?.map((section) => (
            <div key={section.id} className="space-y-4 bg-slate-50/60 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700">
              <h2 className="text-xl font-extrabold text-indigo-900 dark:text-indigo-300">{getLocalizedText(section.title)}</h2>
              {section.content && <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{getLocalizedText(section.content)}</p>}

              <div className="space-y-3">
                {section.blocks?.map((block) => {
                  if (block.type === 'heading') {
                    return <h3 key={block.id} className="text-base font-bold text-slate-900 dark:text-white">{getLocalizedText(block.title)}</h3>;
                  }
                  if (block.type === 'paragraph') {
                    return <p key={block.id} className="text-slate-700 dark:text-slate-300 text-sm whitespace-pre-line">{getLocalizedText(block.body)}</p>;
                  }
                  if (block.type === 'callout') {
                    return (
                      <div key={block.id} className="bg-indigo-50 dark:bg-indigo-950/60 border-l-4 border-indigo-500 rounded-r-xl p-4 text-xs text-indigo-950 dark:text-indigo-200 space-y-1">
                        {block.title && <div className="font-bold">{getLocalizedText(block.title)}</div>}
                        <p>{getLocalizedText(block.body)}</p>
                      </div>
                    );
                  }
                  if (block.type === 'formula') {
                    return (
                      <div key={block.id} className="bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-center font-mono font-bold text-amber-950 dark:text-amber-200 text-sm">
                        {getLocalizedText(block.body)}
                      </div>
                    );
                  }
                  if (block.type === 'example') {
                    return (
                      <div key={block.id} className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 text-xs text-emerald-950 dark:text-emerald-200 space-y-1">
                        {block.title && <div className="font-bold">{getLocalizedText(block.title)}</div>}
                        <p>{getLocalizedText(block.body)}</p>
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
