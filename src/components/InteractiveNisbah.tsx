'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ActivityQuestion } from '@/types';
import { CheckCircle2, XCircle, Scale, ArrowRight } from 'lucide-react';

interface InteractiveNisbahProps {
  questions?: ActivityQuestion[];
}

export const InteractiveNisbah: React.FC<InteractiveNisbahProps> = ({ questions = [] }) => {
  const { language, tText } = useLanguage();
  const [countA, setCountA] = useState<number>(6);
  const [countB, setCountB] = useState<number>(9);

  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, { isCorrect: boolean; text: string }>>({});

  // GCD helper function
  const gcd = (x: number, y: number): number => {
    return y === 0 ? x : gcd(y, x % y);
  };

  const commonFactor = gcd(countA, countB);
  const simplifiedA = countA / commonFactor;
  const simplifiedB = countB / commonFactor;

  const handleAnswerSelect = (questionId: string, option: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const checkQuestion = (q: ActivityQuestion) => {
    const selected = userAnswers[q.id];
    if (!selected) return;

    const correctStr = String(q.correctAnswer);
    const isCorrect = selected === correctStr;
    const expText = tText(q.explanation);

    setFeedback((prev) => ({
      ...prev,
      [q.id]: {
        isCorrect,
        text: isCorrect
          ? language === 'ms'
            ? `Tahniah! Betul: ${expText}`
            : `Great job! Correct: ${expText}`
          : language === 'ms'
            ? `Cuba lagi. ${expText}`
            : `Try again. ${expText}`
      }
    }));
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 dark:border-slate-800 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 mb-1">
            DSKP 7.2
          </span>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
            {language === 'ms' ? 'Aktiviti Interaktif: Visual & Permudahan Nisbah' : 'Interactive Activity: Visual Ratio Simplification'}
          </h3>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Scale className="w-5 h-5 text-amber-500" />
          <span>{language === 'ms' ? 'Nombor Bulat (a : b)' : 'Whole Numbers (a : b)'}</span>
        </div>
      </div>

      {/* Main Ratio Builder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Visual Blocks Builder */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 space-y-6">
          <h4 className="font-semibold text-slate-800 dark:text-white">
            {language === 'ms' ? '1. Bina Kuantiti Objek' : '1. Build Object Quantities'}
          </h4>

          {/* Quantity A Control */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-purple-600 dark:text-purple-400 font-bold">
                {language === 'ms' ? 'Kuantiti A (Blok Ungu):' : 'Quantity A (Purple Blocks):'} {countA}
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="20"
              step="1"
              value={countA}
              onChange={(e) => setCountA(Number(e.target.value))}
              className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            {/* Visual Blocks Grid A */}
            <div className="flex flex-wrap gap-1.5 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 min-h-[50px] items-center">
              {Array.from({ length: countA }).map((_, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-md bg-purple-500 text-white font-extrabold text-[10px] flex items-center justify-center shadow-sm animate-fade-in"
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Quantity B Control */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-teal-600 dark:text-teal-400 font-bold">
                {language === 'ms' ? 'Kuantiti B (Blok Hijau Teal):' : 'Quantity B (Teal Blocks):'} {countB}
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="20"
              step="1"
              value={countB}
              onChange={(e) => setCountB(Number(e.target.value))}
              className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
            {/* Visual Blocks Grid B */}
            <div className="flex flex-wrap gap-1.5 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 min-h-[50px] items-center">
              {Array.from({ length: countB }).map((_, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-md bg-teal-500 text-white font-extrabold text-[10px] flex items-center justify-center shadow-sm animate-fade-in"
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Ratio Simplification Box */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 space-y-6">
          <h4 className="font-semibold text-slate-800 dark:text-white">
            {language === 'ms' ? '2. Permudahan kepada Bentuk Termudah' : '2. Simplify to Simplest Form'}
          </h4>

          {/* Ratio Transformation Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-inner flex flex-col items-center justify-center gap-4 text-center">
            <div className="flex items-center justify-center gap-3">
              <div className="text-2xl font-extrabold text-slate-700 dark:text-slate-200">
                {countA} : {countB}
              </div>
              <ArrowRight className="w-6 h-6 text-amber-500" />
              <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-4 py-2 rounded-xl border border-amber-200 dark:border-amber-800">
                {simplifiedA} : {simplifiedB}
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              {commonFactor > 1
                ? language === 'ms'
                  ? `Dibahagikan dengan Pembahagi Sepunya Terbesar (PST) = ${commonFactor}`
                  : `Divided by Greatest Common Divisor (GCD) = ${commonFactor}`
                : language === 'ms'
                  ? 'Nisbah ini sudah berada dalam bentuk termudah!'
                  : 'This ratio is already in its simplest form!'}
            </p>
          </div>

          {/* Step-by-Step Breakdown */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 space-y-2 text-xs text-amber-900 dark:text-amber-200">
            <p className="font-bold text-sm">
              {language === 'ms' ? 'Langkah Permudahan:' : 'Simplification Steps:'}
            </p>
            <ol className="list-decimal list-inside space-y-1 font-mono text-xs">
              <li>{countA} ÷ {commonFactor} = {simplifiedA}</li>
              <li>{countB} ÷ {commonFactor} = {simplifiedB}</li>
              <li className="font-bold pt-1">
                {language === 'ms' ? 'Bentuk Termudah' : 'Simplest Form'} = {simplifiedA} : {simplifiedB}
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* Interactive Practice Questions Section */}
      {questions.length > 0 && (
        <div className="border-t border-slate-100 dark:border-slate-800 pt-8 space-y-6">
          <h4 className="text-xl font-bold text-slate-800 dark:text-white">
            {language === 'ms' ? 'Soalan Latihan Interaktif' : 'Interactive Practice Questions'}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {questions.map((q, idx) => {
              const optionsList = q.options?.map((opt) => tText(opt)) || [];
              return (
                <div key={q.id} className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 space-y-4">
                  <p className="font-semibold text-slate-800 dark:text-white text-sm">
                    {idx + 1}. {tText(q.prompt)}
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    {optionsList.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleAnswerSelect(q.id, opt)}
                        className={`p-3 text-xs font-bold rounded-xl border text-center transition-all ${
                          userAnswers[q.id] === opt
                            ? 'bg-amber-600 text-white border-amber-600'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-400'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => checkQuestion(q)}
                    disabled={!userAnswers[q.id]}
                    className="w-full py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors"
                  >
                    {language === 'ms' ? 'Semak Jawapan' : 'Check Answer'}
                  </button>

                  {feedback[q.id] && (
                    <div
                      className={`p-3 rounded-xl text-xs font-medium flex items-start gap-2 ${
                        feedback[q.id].isCorrect
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                      }`}
                    >
                      {feedback[q.id].isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                      )}
                      <span>{feedback[q.id].text}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
