import { Info, Sparkles, BookOpen, Target, CheckCircle } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      {/* Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
        <div className="space-y-4 relative z-10">
          <span className="bg-amber-400 text-slate-950 font-extrabold text-xs px-3.5 py-1.5 rounded-full">
            KSSR Semakan
          </span>
          <h1 className="text-3xl sm:text-4xl font-black">Mengenai Math Explorer Tahun 6</h1>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
            Platform pendidikan Matematik interaktif moden khusus untuk murid-murid Tahun 6 sekolah rendah di Malaysia.
          </p>
        </div>
      </div>

      {/* Main Info */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Target className="w-6 h-6 text-indigo-600" /> Objective Platform
          </h2>
          <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
            <strong>Math Explorer Tahun 6</strong> direka untuk membantu murid memahami konsep matematik secara visual dan praktikal. Dengan menyatukan nota ringkas, animasi interaktif carta pai, latihan manipulasi sudut, dan kuiz interaktif, platform ini menjadikan pembelajaran lebih menyeronokkan dan berkesan.
          </p>
        </div>

        <div className="space-y-4 border-t border-slate-100 pt-6">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600" /> Penjajaran Kurikulum KPM (DSKP)
          </h2>
          <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
            Kandungan pembelajaran disusun berpandukan dokumen Dokumen Standard Kurikulum dan Pentaksiran (DSKP) Matematik Tahun 6 KPM:
          </p>

          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 text-sm text-indigo-950 space-y-3">
            <div className="font-extrabold text-indigo-900 text-base">STANDARD KANDUNGAN: 8.1 Carta pai</div>
            <div className="font-semibold text-indigo-800">STANDARD PEMBELAJARAN 8.1.1:</div>
            <p className="text-slate-700">
              Murid boleh melengkapkan carta pai berdasarkan nilai sudut 45°, 90° dan 180° dengan kuantiti diberikan serta mentafsir data.
            </p>
            <div className="font-semibold text-indigo-800 pt-2">CADANGAN AKTIVITI:</div>
            <p className="text-slate-700">
              Menyediakan satu bulatan berserta pusat bulatan, jejari, dan sektor untuk manipulasi visual.
            </p>
          </div>
        </div>

        <div className="space-y-4 border-t border-slate-100 pt-6">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600" /> Ciri-ciri Utama
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700">
            <li className="flex items-start gap-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Akses Murid Percuma:</strong> Murid mengakses bahan tanpa sebarang pendaftaran.</span>
            </li>
            <li className="flex items-start gap-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Aktiviti Visual Manipulatif:</strong> Menyelaras sudut 45°, 90°, dan 180° secara masa nyata.</span>
            </li>
            <li className="flex items-start gap-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Sistem Pengurusan Guru:</strong> Guru boleh menyunting nota, kuiz, dan menerbit modul baharu.</span>
            </li>
            <li className="flex items-start gap-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Maklum Balas Serta Merta:</strong> Penyelesaian kuiz dengan penjelasan step-by-step.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
