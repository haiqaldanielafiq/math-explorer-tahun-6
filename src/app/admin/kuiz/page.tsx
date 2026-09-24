'use client';

import { useState, useEffect } from 'react';
import { Topic, Question } from '@/types';
import { getText } from '@/context/LanguageContext';
import { Save, Plus, Trash2 } from 'lucide-react';

export default function QuizManagerPage() {
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

  const handleSaveQuiz = async () => {
    if (!currentTopic) return;
    setSaving(true);
    setMsg('');

    try {
      const res = await fetch(`/api/topics/${currentTopic.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quiz: currentTopic.quiz }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg('Kuiz berjaya disimpan!');
      }
    } catch {
      setMsg('Gagal menyimpan kuiz.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddQuestion = () => {
    if (!currentTopic) return;
    const newQ: Question = {
      id: `q-${Date.now()}`,
      type: 'mcq',
      question: 'Soalan Baru Matematik?',
      options: ['Jawapan A', 'Jawapan B', 'Jawapan C', 'Jawapan D'],
      correctAnswer: 'Jawapan A',
      explanation: 'Penerangan penyelesaian soalan.',
      marks: 10,
    };

    const updatedQuiz = {
      ...currentTopic.quiz,
      questions: [...(currentTopic.quiz?.questions || []), newQ],
    };

    setTopics(topics.map((t) => (t.id === currentTopic.id ? { ...t, quiz: updatedQuiz } : t)));
  };

  const handleDeleteQuestion = (qId: string) => {
    if (!currentTopic) return;
    const updatedQuiz = {
      ...currentTopic.quiz,
      questions: currentTopic.quiz.questions.filter((q) => q.id !== qId),
    };
    setTopics(topics.map((t) => (t.id === currentTopic.id ? { ...t, quiz: updatedQuiz } : t)));
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-semibold">Sedang memuatkan pengurus kuiz...</div>;
  }

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700 pb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Pengurus Kuiz Matematik</h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm">Sunting soalan, pilihan jawapan, dan penjelasan.</p>
        </div>

        <button
          onClick={handleSaveQuiz}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow transition-all shrink-0"
        >
          <Save className="w-4 h-4" /> Simpan Perubahan Kuiz
        </button>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 text-sm font-bold border border-indigo-200 dark:border-indigo-800">
          {msg}
        </div>
      )}

      {/* Select Topic */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Pilih Topik Modul Kuiz:</label>
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

      {currentTopic && currentTopic.quiz && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Senarai Soalan ({currentTopic.quiz.questions?.length || 0})
            </h2>
            <button
              onClick={handleAddQuestion}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-600 hover:text-white font-bold text-xs transition-colors"
            >
              <Plus className="w-4 h-4" /> Tambah Soalan Baru
            </button>
          </div>

          {currentTopic.quiz.questions?.map((q, qIdx) => (
            <div key={q.id} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md space-y-4 relative">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                <span className="text-xs font-black text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-md">
                  Soalan #{qIdx + 1}
                </span>
                <button
                  onClick={() => handleDeleteQuestion(q.id)}
                  className="text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-700 p-1.5 rounded-lg text-xs font-bold transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Teks Soalan</label>
                <input
                  type="text"
                  value={getText(q.question)}
                  onChange={(e) => {
                    const questions = [...currentTopic.quiz.questions];
                    questions[qIdx].question = e.target.value;
                    const updated = { ...currentTopic.quiz, questions };
                    setTopics(topics.map((t) => (t.id === currentTopic.id ? { ...t, quiz: updated } : t)));
                  }}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-xl text-sm font-bold dark:text-white"
                />
              </div>

              {/* Options */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Pilihan Jawapan (4 Pilihan)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options?.map((opt, optIdx) => (
                    <input
                      key={optIdx}
                      type="text"
                      value={getText(opt)}
                      onChange={(e) => {
                        const questions = [...currentTopic.quiz.questions];
                        const opts = [...questions[qIdx].options];
                        opts[optIdx] = e.target.value;
                        questions[qIdx].options = opts;
                        const updated = { ...currentTopic.quiz, questions };
                        setTopics(topics.map((t) => (t.id === currentTopic.id ? { ...t, quiz: updated } : t)));
                      }}
                      className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 font-medium dark:text-white"
                    />
                  ))}
                </div>
              </div>

              {/* Correct Answer */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Jawapan Betul (Sama Tepat Dengan Pilihan di Atas)</label>
                <input
                  type="text"
                  value={q.correctAnswer}
                  onChange={(e) => {
                    const questions = [...currentTopic.quiz.questions];
                    questions[qIdx].correctAnswer = e.target.value;
                    const updated = { ...currentTopic.quiz, questions };
                    setTopics(topics.map((t) => (t.id === currentTopic.id ? { ...t, quiz: updated } : t)));
                  }}
                  className="w-full p-2 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200 font-bold rounded-xl text-xs"
                />
              </div>

              {/* Explanation */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Penerangan Langkah Penyelesaian</label>
                <textarea
                  rows={2}
                  value={getText(q.explanation)}
                  onChange={(e) => {
                    const questions = [...currentTopic.quiz.questions];
                    questions[qIdx].explanation = e.target.value;
                    const updated = { ...currentTopic.quiz, questions };
                    setTopics(topics.map((t) => (t.id === currentTopic.id ? { ...t, quiz: updated } : t)));
                  }}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-xl text-xs dark:text-white"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
