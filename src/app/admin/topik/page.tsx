'use client';

import { useState, useEffect } from 'react';
import { Topic, LocalizedString } from '@/types';
import { getText } from '@/context/LanguageContext';
import { Plus, FileEdit, Trash2, X, Save, Eye, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function TopicManagerPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  // New Topic Modal State
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form Fields
  const [code, setCode] = useState('');
  const [titleMs, setTitleMs] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [stdKandunganMs, setStdKandunganMs] = useState('');
  const [stdKandunganEn, setStdKandunganEn] = useState('');
  const [stdPembelajaranMs, setStdPembelajaranMs] = useState('');
  const [stdPembelajaranEn, setStdPembelajaranEn] = useState('');
  const [descriptionMs, setDescriptionMs] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [isPublished, setIsPublished] = useState(false);

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

  const handleOpenModal = () => {
    setCode('');
    setTitleMs('');
    setTitleEn('');
    setStdKandunganMs('');
    setStdKandunganEn('');
    setStdPembelajaranMs('');
    setStdPembelajaranEn('');
    setDescriptionMs('');
    setDescriptionEn('');
    setIsPublished(false);
    setError('');
    setShowModal(true);
  };

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleMs || !code) {
      setError('Tajuk (Malay) dan Kod DSKP wajib diisi.');
      return;
    }

    setSubmitting(true);
    setError('');

    const newTopicPayload = {
      code,
      title: titleEn ? { ms: titleMs, en: titleEn } : titleMs,
      standardKandungan: stdKandunganEn ? { ms: stdKandunganMs || code, en: stdKandunganEn } : (stdKandunganMs || code),
      standardPembelajaran: stdPembelajaranEn ? { ms: stdPembelajaranMs, en: stdPembelajaranEn } : stdPembelajaranMs,
      description: descriptionEn ? { ms: descriptionMs, en: descriptionEn } : descriptionMs,
      objectives: [{ ms: 'Menguasai konsep DSKP ' + code }],
      published: isPublished,
      order: topics.length + 1,
      sections: [
        {
          id: `sec-${Date.now()}-1`,
          title: { ms: '1. Pengenalan ' + titleMs, en: '1. Introduction to ' + (titleEn || titleMs) },
          content: { ms: 'Penerangan awal bagi modul ' + titleMs, en: 'Introduction for ' + (titleEn || titleMs) },
          order: 1,
          blocks: [
            {
              id: `blk-${Date.now()}-1`,
              type: 'heading',
              title: { ms: 'Selamat Datang ke ' + titleMs, en: 'Welcome to ' + (titleEn || titleMs) },
              order: 1
            },
            {
              id: `blk-${Date.now()}-2`,
              type: 'paragraph',
              body: { ms: descriptionMs || 'Pelajari konsep utama dalam modul ini.', en: descriptionEn || 'Learn key concepts in this module.' },
              order: 2
            }
          ]
        }
      ],
      activity: {
        id: `act-${Date.now()}`,
        title: { ms: 'Aktiviti Interaktif ' + titleMs, en: titleMs + ' Interactive Activity' },
        description: { ms: 'Aktiviti simulasi dan latihan kefahaman.', en: 'Interactive simulation activity.' },
        totalQuantity: 20,
        initialData: [],
        questions: [
          {
            id: `q-act-${Date.now()}`,
            prompt: { ms: 'Soalan latihan asas bagi ' + titleMs, en: 'Basic practice question for ' + (titleEn || titleMs) },
            correctAnswer: 'Betul',
            options: ['Betul', 'Salah'],
            explanation: { ms: 'Penerangan penyelesaian.', en: 'Solution explanation.' }
          }
        ]
      },
      quiz: {
        id: `quiz-${Date.now()}`,
        title: { ms: 'Kuiz ' + titleMs, en: (titleEn || titleMs) + ' Quiz' },
        description: { ms: 'Uji kefahaman modul ini.', en: 'Test your understanding.' },
        passingScore: 70,
        questions: [
          {
            id: `q-${Date.now()}-1`,
            type: 'mcq',
            question: { ms: 'Soalan 1: Apakah konsep utama ' + titleMs + '?', en: 'Question 1: What is the key concept of ' + (titleEn || titleMs) + '?' },
            options: ['Konsep A', 'Konsep B', 'Konsep C', 'Konsep D'],
            correctAnswer: 'Konsep A',
            explanation: { ms: 'Penerangan soalan 1.', en: 'Question 1 explanation.' },
            marks: 10,
            difficulty: 'mudah'
          }
        ]
      }
    };

    try {
      const res = await fetch('/api/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTopicPayload),
      });

      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        await loadTopics();
      } else {
        setError(data.error || 'Gagal merakam topik baharu.');
      }
    } catch {
      setError('Ralat pelayan semasa menyimpan.');
    } finally {
      setSubmitting(false);
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
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Pengurus Topik Matematik</h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm">Bina, susun, atau ubah maklumat modul pembelajaran.</p>
        </div>

        <button
          type="button"
          onClick={handleOpenModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Tambah Topik Baru
        </button>
      </div>

      {/* CREATE NEW TOPIC MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 border border-slate-200 dark:border-slate-700 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Tambah Topik Baharu DSKP</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Bina modul pembelajaran matematik baharu</p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateTopic} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Kod DSKP *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 3.1"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Status Terbitan</label>
                  <select
                    value={isPublished ? 'published' : 'draft'}
                    onChange={(e) => setIsPublished(e.target.value === 'published')}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value="draft">Draf (Disimpan Sahaja)</option>
                    <option value="published">Diterbitkan Ke Pelajar</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tajuk Topik (Bahasa Melayu) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Nisbah dan Kadaran"
                    value={titleMs}
                    onChange={(e) => setTitleMs(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Topic Title (English)</label>
                  <input
                    type="text"
                    placeholder="Example: Ratios and Proportions"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Standard Kandungan (BM)</label>
                  <input
                    type="text"
                    placeholder="Contoh: 3.1 Nisbah dua kuantiti"
                    value={stdKandunganMs}
                    onChange={(e) => setStdKandunganMs(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Standard Kandungan (EN)</label>
                  <input
                    type="text"
                    placeholder="Example: 3.1 Ratio of two quantities"
                    value={stdKandunganEn}
                    onChange={(e) => setStdKandunganEn(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Standard Pembelajaran (BM)</label>
                <input
                  type="text"
                  placeholder="Contoh: 3.1.1 Menentukan nisbah..."
                  value={stdPembelajaranMs}
                  onChange={(e) => setStdPembelajaranMs(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Penerangan Ringkas (BM)</label>
                <textarea
                  rows={2}
                  placeholder="Penerangan modul..."
                  value={descriptionMs}
                  onChange={(e) => setDescriptionMs(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{submitting ? 'Sedang Menyimpan...' : 'Cipta & Simpan Topik'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOPICS LIST */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md p-6 space-y-4">
        {topics.map((t) => {
          const topicTitle = getText(t.title);
          return (
            <div
              key={t.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-950/60 text-xs px-2.5 py-0.5 rounded-md">
                    {t.code}
                  </span>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">{topicTitle}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    t.published ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {t.published ? 'Terbit' : 'Draf'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{getText(t.description)}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/admin/editor/${t.id}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  <FileEdit className="w-3.5 h-3.5" /> Edit Kandungan
                </Link>

                <button
                  type="button"
                  onClick={() => handleDelete(t.id, topicTitle)}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                  title="Padam"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
