'use client';

import { useState, useEffect } from 'react';
import { Topic } from '@/types';
import { getText } from '@/context/LanguageContext';
import { Save } from 'lucide-react';

export default function ActivityManagerPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/topics');
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setTopics(data.data);
          setSelectedTopicId(data.data[0].id);
        }
      } catch {
        // empty
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const currentTopic = topics.find((t) => t.id === selectedTopicId);

  const handleSaveActivity = async () => {
    if (!currentTopic) return;
    setSaving(true);
    setMsg('');

    try {
      const res = await fetch(`/api/topics/${currentTopic.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activity: currentTopic.activity }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg('Aktiviti berjaya disimpan!');
      }
    } catch {
      setMsg('Gagal menyimpan aktiviti.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-semibold">Sedang memuatkan...</div>;
  }

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700 pb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Pengurus Aktiviti Interaktif</h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm">Kemaskini data aktiviti simulasi DSKP.</p>
        </div>

        <button
          onClick={handleSaveActivity}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition-all shrink-0"
        >
          <Save className="w-4 h-4" /> Simpan Aktiviti
        </button>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 text-sm font-bold border border-indigo-200 dark:border-indigo-800">
          {msg}
        </div>
      )}

      {/* Select Topic */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Pilih Topik Untuk Ditingkatkan:</label>
        <select
          value={selectedTopicId}
          onChange={(e) => setSelectedTopicId(e.target.value)}
          className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white"
        >
          {topics.map((t) => (
            <option key={t.id} value={t.id}>
              Topik {t.code}: {getText(t.title)}
            </option>
          ))}
        </select>
      </div>

      {currentTopic && currentTopic.activity && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tajuk Aktiviti</label>
            <input
              type="text"
              value={getText(currentTopic.activity.title)}
              onChange={(e) => {
                const updated = { ...currentTopic.activity, title: e.target.value };
                setTopics(topics.map((t) => (t.id === currentTopic.id ? { ...t, activity: updated } : t)));
              }}
              className="w-full p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-xl text-sm font-bold dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Penerangan Aktiviti</label>
            <textarea
              rows={3}
              value={getText(currentTopic.activity.description)}
              onChange={(e) => {
                const updated = { ...currentTopic.activity, description: e.target.value };
                setTopics(topics.map((t) => (t.id === currentTopic.id ? { ...t, activity: updated } : t)));
              }}
              className="w-full p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-xl text-sm dark:text-white"
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Soalan Latihan Aktiviti ({currentTopic.activity.questions?.length || 0})</h3>
            {currentTopic.activity.questions?.map((q, qIdx) => (
              <div key={q.id} className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Soalan Latihan #{qIdx + 1}</div>
                <input
                  type="text"
                  value={getText(q.prompt)}
                  onChange={(e) => {
                    const questions = [...currentTopic.activity.questions];
                    questions[qIdx].prompt = e.target.value;
                    const updated = { ...currentTopic.activity, questions };
                    setTopics(topics.map((t) => (t.id === currentTopic.id ? { ...t, activity: updated } : t)));
                  }}
                  className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold dark:text-white"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
