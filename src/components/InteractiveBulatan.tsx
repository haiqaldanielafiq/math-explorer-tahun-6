'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ActivityQuestion } from '@/types';
import { CheckCircle2, XCircle, Disc, CircleDot, MoveHorizontal } from 'lucide-react';

interface InteractiveBulatanProps {
  questions?: ActivityQuestion[];
}

export const InteractiveBulatan: React.FC<InteractiveBulatanProps> = ({ questions = [] }) => {
  const { language, tText } = useLanguage();
  const [radiusCm, setRadiusCm] = useState<number>(5);
  const [showCenter, setShowCenter] = useState<boolean>(true);
  const [showRadius, setShowRadius] = useState<boolean>(true);
  const [showDiameter, setShowDiameter] = useState<boolean>(true);

  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, { isCorrect: boolean; text: string }>>({});

  const diameterCm = radiusCm * 2;
  const svgRadius = radiusCm * 14; // Scale for display

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
          <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 mb-1">
            DSKP 6.2
          </span>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
            {language === 'ms' ? 'Aktiviti Interaktif: Bahagian & Lukisan Bulatan' : 'Interactive Activity: Circle Parts & Drawing'}
          </h3>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Disc className="w-5 h-5 text-sky-500 animate-spin-slow" />
          <span>{language === 'ms' ? 'Putaran Lengkap: 360°' : 'Full Rotation: 360°'}</span>
        </div>
      </div>

      {/* Main Interactive Circle Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Column: SVG Circle Diagram */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 space-y-6 flex flex-col items-center justify-center min-h-[320px]">
          <div className="relative flex justify-center items-center w-full bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-inner">
            <svg viewBox="0 0 300 300" className="w-full max-w-[260px] h-auto overflow-visible">
              {/* Outer Circle Boundary */}
              <circle
                cx="150"
                cy="150"
                r={svgRadius}
                fill="rgba(14, 165, 233, 0.08)"
                stroke="#0EA5E9"
                strokeWidth="3"
              />

              {/* Diameter Line (full width) */}
              {showDiameter && (
                <g>
                  <line
                    x1={150 - svgRadius}
                    y1="150"
                    x2={150 + svgRadius}
                    y2="150"
                    stroke="#F59E0B"
                    strokeWidth="3"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={150 - svgRadius / 2}
                    y="140"
                    className="text-[11px] font-bold fill-amber-600 dark:fill-amber-400"
                  >
                    {language === 'ms' ? 'Diameter' : 'Diameter'} ({diameterCm} cm)
                  </text>
                </g>
              )}

              {/* Radius Line (center to top) */}
              {showRadius && (
                <g>
                  <line
                    x1="150"
                    y1="150"
                    x2="150"
                    y2={150 - svgRadius}
                    stroke="#10B981"
                    strokeWidth="4"
                  />
                  <text
                    x="158"
                    y={150 - svgRadius / 2}
                    className="text-[11px] font-bold fill-emerald-600 dark:fill-emerald-400"
                  >
                    {language === 'ms' ? 'Jejari' : 'Radius'} ({radiusCm} cm)
                  </text>
                </g>
              )}

              {/* Center Point */}
              {showCenter && (
                <g>
                  <circle cx="150" cy="150" r="6" className="fill-rose-600 dark:fill-rose-400" />
                  <text
                    x="150"
                    y="170"
                    textAnchor="middle"
                    className="text-[10px] font-extrabold fill-rose-600 dark:fill-rose-400"
                  >
                    {language === 'ms' ? 'Pusat Bulatan (O)' : 'Center Point (O)'}
                  </text>
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* Right Column: Controls & Calculations */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 space-y-6">
          <h4 className="font-semibold text-slate-800 dark:text-white">
            {language === 'ms' ? 'Pelaras Jejari & Formula' : 'Radius Adjuster & Formula'}
          </h4>

          {/* Slider for Radius */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium text-slate-700 dark:text-slate-300">
              <span>{language === 'ms' ? 'Ukuran Jejari (r):' : 'Radius Size (r):'}</span>
              <span className="font-bold text-sky-600 dark:text-sky-400">{radiusCm} cm</span>
            </div>
            <input
              type="range"
              min="2"
              max="9"
              step="1"
              value={radiusCm}
              onChange={(e) => setRadiusCm(Number(e.target.value))}
              className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-600"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>2 cm</span>
              <span>5 cm</span>
              <span>9 cm</span>
            </div>
          </div>

          {/* Toggle Label Checkboxes */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {language === 'ms' ? 'Paparkan Label:' : 'Display Labels:'}
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setShowCenter(!showCenter)}
                className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all flex items-center justify-center gap-1 ${
                  showCenter
                    ? 'bg-rose-500 text-white border-rose-500'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <CircleDot className="w-3.5 h-3.5" />
                {language === 'ms' ? 'Pusat' : 'Center'}
              </button>
              <button
                onClick={() => setShowRadius(!showRadius)}
                className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all flex items-center justify-center gap-1 ${
                  showRadius
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <MoveHorizontal className="w-3.5 h-3.5" />
                {language === 'ms' ? 'Jejari' : 'Radius'}
              </button>
              <button
                onClick={() => setShowDiameter(!showDiameter)}
                className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all flex items-center justify-center gap-1 ${
                  showDiameter
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <MoveHorizontal className="w-3.5 h-3.5" />
                {language === 'ms' ? 'Diameter' : 'Diameter'}
              </button>
            </div>
          </div>

          {/* Dynamic Formula Display Box */}
          <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/50 space-y-2 text-xs text-sky-900 dark:text-sky-200">
            <p className="font-bold text-sm">
              {language === 'ms' ? 'Formula Hubungan:' : 'Relationship Formula:'}
            </p>
            <div className="font-mono text-sm bg-white dark:bg-slate-900 p-2 rounded-lg border border-sky-100 dark:border-sky-800">
              Diameter = 2 × Jejari <br />
              {diameterCm} cm = 2 × {radiusCm} cm
            </div>
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
                            ? 'bg-sky-600 text-white border-sky-600'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-sky-400'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => checkQuestion(q)}
                    disabled={!userAnswers[q.id]}
                    className="w-full py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors"
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
