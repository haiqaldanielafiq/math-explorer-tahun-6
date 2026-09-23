'use client';

import { useState, useEffect } from 'react';
import { Topic } from '@/types';
import { BookOpen, Plus, FileEdit, Trash2, Globe, FileText, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TopicManagerPage() {
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  // New Topic Modal State
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');

  const loadTopics = async () => {
    try {
      const res = await fetch('/api/topics');
      const data = await res.json();
      if (data.success) {
        setTopics(data.data);
      }
    } catch {
      // empty
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTopics();
  }, []);

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !code) return;

    try {
      const res = await fetch('/api/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          code,
          description,
          published: false,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setTitle('');
        setCode('');
        setDescription('');
        loadTopics();
      }
    } catch {
      alert('Gagal mencipta topik baru.');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Padam topik "${name}"?`)) return;
    try {
      await fetch(`/api/topics/${id}`, { method: 'DELETE' });
      loadTopics();
    } catch {
      alert('Gagal memadam.');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Pengurus Topik Matematik</h1>
          <p className="text-slate-600 text-sm">Bina, susun, atau ubah maklumat modul pembelajaran.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Tambah Topik Baru
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <h3 className="text-xl font-bold text-slate-900">Cipta Topik Baharu</h3>
            <form onSubmit={handleCreateTopic} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kod DSKP (e.g. 1.1, 8.2)</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 8.2"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tajuk Topik</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pecahan dan Peratus"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Penerangan Ringkas</label>
                <textarea
                  rows={3}
                  placeholder="Penerangan topik..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-bold shadow"
                >
                  Simpan Topik
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 space-y-4">
        {topics.map((t) => (
          <div
            key={t.id}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200 gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-indigo-700 bg-indigo-100 text-xs px-2.5 py-0.5 rounded-md">
                  {t.code}
                </span>
                <h3 className="font-extrabold text-slate-900 text-base">{t.title}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  t.published ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {t.published ? 'Terbit' : 'Draf'}
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1">{t.description}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/admin/editor/${t.id}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <FileEdit className="w-3.5 h-3.5" /> Edit Kandungan
              </Link>

              <button
                onClick={() => handleDelete(t.id, t.title)}
                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-xl border border-slate-200 transition-colors"
                title="Padam"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
