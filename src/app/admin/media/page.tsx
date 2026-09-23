'use client';

import { useState } from 'react';
import { Image as ImageIcon, Plus, Trash2, ExternalLink, Link as LinkIcon } from 'lucide-react';

export default function MediaManagerPage() {
  const [mediaList, setMediaList] = useState<string[]>([
    'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=60',
  ]);

  const [newUrl, setNewUrl] = useState('');

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;
    setMediaList((prev) => [newUrl, ...prev]);
    setNewUrl('');
  };

  const handleDeleteMedia = (url: string) => {
    setMediaList((prev) => prev.filter((item) => item !== url));
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-2xl font-black text-slate-900">Pengurus Media & Pautan</h1>
        <p className="text-slate-600 text-sm">Pautan imej, rajah, dan video luar untuk disertakan dalam nota.</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Tambah Pautan Media Baharu</h3>
        <form onSubmit={handleAddMedia} className="flex gap-3">
          <input
            type="url"
            required
            placeholder="Masukkan URL imej (https://...)"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" /> Tambah URL
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {mediaList.map((url, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm space-y-2 group">
            <div className="h-40 bg-slate-100 overflow-hidden relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="Media" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            </div>
            <div className="p-3 flex items-center justify-between text-xs text-slate-600">
              <a href={url} target="_blank" rel="noreferrer" className="truncate flex items-center gap-1 hover:text-indigo-600 max-w-[80%]">
                <LinkIcon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{url}</span>
              </a>
              <button
                onClick={() => handleDeleteMedia(url)}
                className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-colors"
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
