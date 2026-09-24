'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Topic, ContentBlock, LessonSection } from '@/types';
import { getText } from '@/context/LanguageContext';
import {
  Save,
  Eye,
  Globe,
  Plus,
  Trash2,
  ArrowLeft,
  Layers
} from 'lucide-react';
import Link from 'next/link';

export default function ContentEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function load() {
      const { id } = await params;
      try {
        const res = await fetch(`/api/topics/${id}`);
        const data = await res.json();
        if (data.success) {
          setTopic(data.data);
        }
      } catch {
        setMessage('Gagal memuatkan data topik.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params]);

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 font-semibold">
        Sedang memuatkan modul editor...
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="p-12 text-center text-rose-600 font-bold">
        Topik tidak dijumpai.
      </div>
    );
  }

  const handleSave = async (publishedState?: boolean) => {
    setSaving(true);
    setMessage('');

    const payload = {
      ...topic,
      published: publishedState !== undefined ? publishedState : topic.published,
    };

    try {
      const res = await fetch(`/api/topics/${topic.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setTopic(data.data);
        setMessage('Kandungan berjaya disimpan!');
      } else {
        setMessage('Gagal menyimpan perubahan.');
      }
    } catch {
      setMessage('Ralat rangkaian semasa menyimpan.');
    } finally {
      setSaving(false);
    }
  };

  // Section handling
  const handleAddSection = () => {
    const newSec: LessonSection = {
      id: `sec-${Date.now()}`,
      title: 'Bahagian Baru',
      content: 'Isi maklumat penerangan bahagian ini.',
      order: (topic.sections?.length || 0) + 1,
      blocks: [],
    };

    setTopic({
      ...topic,
      sections: [...(topic.sections || []), newSec],
    });
  };

  const handleUpdateSection = (secId: string, fields: Partial<LessonSection>) => {
    const updated = topic.sections.map((s) => (s.id === secId ? { ...s, ...fields } : s));
    setTopic({ ...topic, sections: updated });
  };

  const handleDeleteSection = (secId: string) => {
    if (!confirm('Padam bahagian ini?')) return;
    setTopic({ ...topic, sections: topic.sections.filter((s) => s.id !== secId) });
  };

  // Block handling
  const handleAddBlock = (secId: string, type: ContentBlock['type']) => {
    const newBlock: ContentBlock = {
      id: `blk-${Date.now()}`,
      type,
      title: type === 'heading' ? 'Tajuk Kecil Baru' : type === 'callout' ? 'Info Peringatan' : '',
      body: type === 'paragraph' ? 'Tuliskan penerangan perenggan di sini...' : '',
      order: 1,
    };

    const updated = topic.sections.map((s) => {
      if (s.id === secId) {
        return { ...s, blocks: [...(s.blocks || []), newBlock] };
      }
      return s;
    });

    setTopic({ ...topic, sections: updated });
  };

  const handleUpdateBlock = (secId: string, blkId: string, fields: Partial<ContentBlock>) => {
    const updated = topic.sections.map((s) => {
      if (s.id === secId) {
        const blocks = s.blocks.map((b) => (b.id === blkId ? { ...b, ...fields } : b));
        return { ...s, blocks };
      }
      return s;
    });
    setTopic({ ...topic, sections: updated });
  };

  const handleDeleteBlock = (secId: string, blkId: string) => {
    const updated = topic.sections.map((s) => {
      if (s.id === secId) {
        return { ...s, blocks: s.blocks.filter((b) => b.id !== blkId) };
      }
      return s;
    });
    setTopic({ ...topic, sections: updated });
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700 pb-6">
        <div>
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-indigo-600 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Kembali ke Papan Pemuka
          </Link>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Editor Kandungan: {getText(topic.title)} ({topic.code})
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/admin/preview/${topic.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all"
          >
            <Eye className="w-4 h-4" /> Pratonton
          </Link>

          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow transition-all"
          >
            <Save className="w-4 h-4" /> Simpan Draf
          </button>

          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all"
          >
            <Globe className="w-4 h-4" /> Terbitkan Modul
          </button>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 text-sm font-bold">
          {message}
        </div>
      )}

      {/* Meta Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Maklumat Asas Topik DSKP</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tajuk Topik</label>
            <input
              type="text"
              value={getText(topic.title)}
              onChange={(e) => setTopic({ ...topic, title: e.target.value })}
              className="w-full p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-xl text-sm font-semibold dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Kod DSKP (e.g. 8.1)</label>
            <input
              type="text"
              value={topic.code}
              onChange={(e) => setTopic({ ...topic, code: e.target.value })}
              className="w-full p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-xl text-sm font-semibold dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Standard Kandungan</label>
            <input
              type="text"
              value={getText(topic.standardKandungan)}
              onChange={(e) => setTopic({ ...topic, standardKandungan: e.target.value })}
              className="w-full p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-xl text-sm font-semibold dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Standard Pembelajaran</label>
            <input
              type="text"
              value={getText(topic.standardPembelajaran)}
              onChange={(e) => setTopic({ ...topic, standardPembelajaran: e.target.value })}
              className="w-full p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-xl text-sm font-semibold dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Penerangan Ringkas Topik</label>
          <textarea
            rows={2}
            value={getText(topic.description)}
            onChange={(e) => setTopic({ ...topic, description: e.target.value })}
            className="w-full p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-xl text-sm font-medium dark:text-white"
          />
        </div>
      </div>

      {/* Visual Block Sections */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Bahagian-Bahagian Nota Pembelajaran</span>
          </h2>
          <button
            onClick={handleAddSection}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-600 hover:text-white font-bold text-xs transition-colors"
          >
            <Plus className="w-4 h-4" /> Tambah Bahagian
          </button>
        </div>

        {topic.sections?.map((sec) => (
          <div key={sec.id} className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-md space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
              <input
                type="text"
                value={getText(sec.title)}
                onChange={(e) => handleUpdateSection(sec.id, { title: e.target.value })}
                className="text-lg font-black text-indigo-900 dark:text-indigo-300 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-600 focus:outline-none w-full max-w-lg"
              />
              <button
                onClick={() => handleDeleteSection(sec.id)}
                className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
                title="Padam Bahagian Ini"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Block Items List */}
            <div className="space-y-4 pl-2 sm:pl-4 border-l-2 border-indigo-100 dark:border-indigo-900">
              {sec.blocks?.map((block) => (
                <div key={block.id} className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-3 relative group">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded">
                      Blok: {block.type}
                    </span>
                    <button
                      onClick={() => handleDeleteBlock(sec.id, block.id)}
                      className="text-rose-500 hover:text-rose-700 text-xs font-bold"
                    >
                      Padam Blok
                    </button>
                  </div>

                  {block.type === 'heading' && (
                    <input
                      type="text"
                      value={getText(block.title)}
                      onChange={(e) => handleUpdateBlock(sec.id, block.id, { title: e.target.value })}
                      placeholder="Masukkan tajuk kecil..."
                      className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold dark:text-white"
                    />
                  )}

                  {block.type === 'paragraph' && (
                    <textarea
                      rows={3}
                      value={getText(block.body)}
                      onChange={(e) => handleUpdateBlock(sec.id, block.id, { body: e.target.value })}
                      placeholder="Tuliskan perenggan nota..."
                      className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-white"
                    />
                  )}

                  {block.type === 'callout' && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={getText(block.title)}
                        onChange={(e) => handleUpdateBlock(sec.id, block.id, { title: e.target.value })}
                        placeholder="Tajuk Peringatan / Tips..."
                        className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-indigo-900 dark:text-indigo-300"
                      />
                      <textarea
                        rows={2}
                        value={getText(block.body)}
                        onChange={(e) => handleUpdateBlock(sec.id, block.id, { body: e.target.value })}
                        placeholder="Teks penerangan tips..."
                        className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-white"
                      />
                    </div>
                  )}

                  {block.type === 'formula' && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={getText(block.title)}
                        onChange={(e) => handleUpdateBlock(sec.id, block.id, { title: e.target.value })}
                        placeholder="Nama Formula"
                        className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-amber-900 dark:text-amber-300"
                      />
                      <input
                        type="text"
                        value={getText(block.body)}
                        onChange={(e) => handleUpdateBlock(sec.id, block.id, { body: e.target.value })}
                        placeholder="Teks Formula Math..."
                        className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono font-bold dark:text-white"
                      />
                    </div>
                  )}

                  {block.type === 'example' && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={getText(block.title)}
                        onChange={(e) => handleUpdateBlock(sec.id, block.id, { title: e.target.value })}
                        placeholder="Tajuk Contoh..."
                        className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-emerald-900 dark:text-emerald-300"
                      />
                      <textarea
                        rows={3}
                        value={getText(block.body)}
                        onChange={(e) => handleUpdateBlock(sec.id, block.id, { body: e.target.value })}
                        placeholder="Penerangan contoh..."
                        className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-white"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add Block Toolbar */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-2">+ Tambah Blok:</span>
              <button
                onClick={() => handleAddBlock(sec.id, 'heading')}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold"
              >
                Tajuk
              </button>
              <button
                onClick={() => handleAddBlock(sec.id, 'paragraph')}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold"
              >
                Perenggan
              </button>
              <button
                onClick={() => handleAddBlock(sec.id, 'callout')}
                className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold"
              >
                Tips / Callout
              </button>
              <button
                onClick={() => handleAddBlock(sec.id, 'formula')}
                className="px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-bold"
              >
                Formula
              </button>
              <button
                onClick={() => handleAddBlock(sec.id, 'example')}
                className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold"
              >
                Contoh
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
