'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Topic } from '@/types';
import { FileEdit, Eye, Globe, Trash2, CheckCircle, FileText } from 'lucide-react';
import Link from 'next/link';

interface TopicActionButtonsProps {
  topic: Topic;
}

export function TopicActionButtons({ topic }: TopicActionButtonsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleTogglePublish = async () => {
    setLoading(true);
    try {
      await fetch(`/api/topics/${topic.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !topic.published }),
      });
      router.refresh();
    } catch {
      alert('Gagal mengubah status terbitan.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Adakah anda pasti mahu memadam topik "${topic.title}"?`)) return;
    setLoading(true);
    try {
      await fetch(`/api/topics/${topic.id}`, { method: 'DELETE' });
      router.refresh();
    } catch {
      alert('Gagal memadam topik.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inline-flex items-center gap-2">
      <Link
        href={`/admin/editor/${topic.id}`}
        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg border border-slate-200 transition-colors"
        title="Sunting Kandungan"
      >
        <FileEdit className="w-4 h-4" />
      </Link>

      <Link
        href={`/admin/preview/${topic.id}`}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-slate-200 transition-colors"
        title="Pratonton Draf"
      >
        <Eye className="w-4 h-4" />
      </Link>

      <button
        onClick={handleTogglePublish}
        disabled={loading}
        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
          topic.published
            ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
            : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
        }`}
      >
        {topic.published ? 'Nyah-terbit' : 'Terbitkan'}
      </button>

      <button
        onClick={handleDelete}
        disabled={loading}
        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 transition-colors"
        title="Padam Topik"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
