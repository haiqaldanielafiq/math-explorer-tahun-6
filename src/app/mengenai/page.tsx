'use client';

import { Info, Sparkles, BookOpen, Target, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AboutPage() {
  const { language } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      {/* Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
        <div className="space-y-4 relative z-10">
          <span className="bg-amber-400 text-slate-950 font-extrabold text-xs px-3.5 py-1.5 rounded-full">
            KSSR Semakan KPM
          </span>
          <h1 className="text-3xl sm:text-4xl font-black">
            {language === 'en' ? 'About Math Explorer Year 6' : 'Mengenai Math Explorer Tahun 6'}
          </h1>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
            {language === 'en'
              ? 'Modern interactive Mathematics educational platform tailored for Year 6 primary school students in Malaysia.'
              : 'Platform pendidikan Matematik interaktif moden khusus untuk murid-murid Tahun 6 sekolah rendah di Malaysia.'}
          </p>
        </div>
      </div>

      {/* Main Info */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-700 shadow-md space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            {language === 'en' ? 'Platform Objective' : 'Objektif Platform'}
          </h2>
          <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            <strong>Math Explorer Tahun 6</strong> {language === 'en'
              ? 'is designed to help students understand mathematical concepts visually and practically. By integrating lesson notes, interactive pie chart animations, angle manipulation exercises, and quizzes, this platform makes learning engaging and effective.'
              : 'direka untuk membantu murid memahami konsep matematik secara visual dan praktikal. Dengan menyatukan nota ringkas, animasi interaktif carta pai, latihan manipulasi sudut, dan kuiz interaktif, platform ini menjadikan pembelajaran lebih menyeronokkan dan berkesan.'}
          </p>
        </div>

        <div className="space-y-4 border-t border-slate-100 dark:border-slate-700 pt-6">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            {language === 'en' ? 'MOE DSKP Curriculum Alignment' : 'Penjajaran Kurikulum KPM (DSKP)'}
          </h2>
          <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            {language === 'en'
              ? 'Learning content is structured according to the Ministry of Education Malaysia Year 6 Mathematics DSKP standard:'
              : 'Kandungan pembelajaran disusun berpandukan dokumen Dokumen Standard Kurikulum dan Pentaksiran (DSKP) Matematik Tahun 6 KPM:'}
          </p>

          <div className="bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-6 text-sm text-indigo-950 dark:text-indigo-200 space-y-3">
            <div className="font-extrabold text-indigo-900 dark:text-indigo-300 text-base">
              {language === 'en' ? 'CONTENT STANDARD: 8.1 Pie chart' : 'STANDARD KANDUNGAN: 8.1 Carta pai'}
            </div>
            <div className="font-semibold text-indigo-800 dark:text-indigo-400">
              {language === 'en' ? 'LEARNING STANDARD 8.1.1:' : 'STANDARD PEMBELAJARAN 8.1.1:'}
            </div>
            <p className="text-slate-700 dark:text-slate-300">
              {language === 'en'
                ? 'Pupils can complete pie charts based on angle values of 45°, 90°, and 180° with given quantities and interpret data.'
                : 'Murid boleh melengkapkan carta pai berdasarkan nilai sudut 45°, 90° dan 180° dengan kuantiti diberikan serta mentafsir data.'}
            </p>
            <div className="font-semibold text-indigo-800 dark:text-indigo-400 pt-2">
              {language === 'en' ? 'SUGGESTED ACTIVITY:' : 'CADANGAN AKTIVITI:'}
            </div>
            <p className="text-slate-700 dark:text-slate-300">
              {language === 'en'
                ? 'Prepare a circle along with circle centre, radius, and sectors for visual manipulation.'
                : 'Menyediakan satu bulatan berserta pusat bulatan, jejari, dan sektor untuk manipulasi visual.'}
            </p>
          </div>
        </div>

        <div className="space-y-4 border-t border-slate-100 dark:border-slate-700 pt-6">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            {language === 'en' ? 'Key Features' : 'Ciri-ciri Utama'}
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700 dark:text-slate-300">
            <li className="flex items-start gap-2 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>{language === 'en' ? 'Free Student Access:' : 'Akses Murid Percuma:'}</strong> {language === 'en' ? 'Students access all materials without registration.' : 'Murid mengakses bahan tanpa sebarang pendaftaran.'}</span>
            </li>
            <li className="flex items-start gap-2 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>{language === 'en' ? 'Interactive Visual Activities:' : 'Aktiviti Visual Manipulatif:'}</strong> {language === 'en' ? 'Real-time adjustment for 45°, 90°, and 180° angles.' : 'Menyelaras sudut 45°, 90°, dan 180° secara masa nyata.'}</span>
            </li>
            <li className="flex items-start gap-2 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>{language === 'en' ? 'Teacher Content Management:' : 'Sistem Pengurusan Guru:'}</strong> {language === 'en' ? 'Teachers can edit notes, quizzes, and publish new modules.' : 'Guru boleh menyunting nota, kuiz, dan menerbit modul baharu.'}</span>
            </li>
            <li className="flex items-start gap-2 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>{language === 'en' ? 'Instant Feedback:' : 'Maklum Balas Serta Merta:'}</strong> {language === 'en' ? 'Immediate quiz grading with step-by-step explanations.' : 'Penyelesaian kuiz dengan penjelasan step-by-step.'}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
