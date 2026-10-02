'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ActivityQuestion } from '@/types';
import { CheckCircle2, XCircle, RefreshCw, Compass } from 'lucide-react';

interface InteractiveSudutProps {
  questions?: ActivityQuestion[];
}

export const InteractiveSudut: React.FC<InteractiveSudutProps> = ({ questions = [] }) => {
  const { language, tText } = useLanguage();
  const [angle, setAngle] = useState<number>(60);
  const [selectedPolygonSides, setSelectedPolygonSides] = useState<number>(3);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, { isCorrect: boolean; text: string }>>({});

  const polygons = [
    { sides: 3, name: { ms: 'Segi Tiga Sama Sisi', en: 'Equilateral Triangle' }, interiorAngle: 60 },
    { sides: 4, name: { ms: 'Segi Empat Sama', en: 'Square' }, interiorAngle: 90 },
    { sides: 5, name: { ms: 'Pentagon Sekata', en: 'Regular Pentagon' }, interiorAngle: 108 },
    { sides: 6, name: { ms: 'Heksagon Sekata', en: 'Regular Hexagon' }, interiorAngle: 120 },
    { sides: 8, name: { ms: 'Oktagon Sekata', en: 'Regular Octagon' }, interiorAngle: 135 }
  ];

  const currentPolygon = polygons.find((p) => p.sides === selectedPolygonSides) || polygons[0];

  const getAngleType = (deg: number) => {
    if (deg < 90) return { ms: 'Sudut Tirus', en: 'Acute Angle', color: 'text-emerald-500' };
    if (deg === 90) return { ms: 'Sudut Tegak (90°)', en: 'Right Angle (90°)', color: 'text-indigo-500' };
    if (deg < 180) return { ms: 'Sudut Cakar', en: 'Obtuse Angle', color: 'text-amber-500' };
    return { ms: 'Sudut Garis Lurus (180°)', en: 'Straight Line Angle (180°)', color: 'text-rose-500' };
  };

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

  // Polygon geometry calculation
  const generatePolygonPoints = (sides: number, radius: number = 80, cx: number = 100, cy: number = 100) => {
    const points: [number, number][] = [];
    for (let i = 0; i < sides; i++) {
      const a = (i * 2 * Math.PI) / sides - Math.PI / 2;
      const x = cx + radius * Math.cos(a);
      const y = cy + radius * Math.sin(a);
      points.push([x, y]);
    }
    return points.map((pt) => pt.join(',')).join(' ');
  };

  // Protractor arc path
  const rad = (angle * Math.PI) / 180;
  const rayX = 150 + 110 * Math.cos(-rad);
  const rayY = 150 + 110 * Math.sin(-rad);
  const arcX = 150 + 40 * Math.cos(-rad);
  const arcY = 150 + 40 * Math.sin(-rad);
  const largeArc = angle > 180 ? 1 : 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 dark:border-slate-800 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 mb-1">
            DSKP 6.1
          </span>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
            {language === 'ms' ? 'Aktiviti Interaktif: Protraktor & Poligon Sekata' : 'Interactive Activity: Protractor & Regular Polygons'}
          </h3>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Compass className="w-5 h-5 text-indigo-500 animate-spin-slow" />
          <span>{language === 'ms' ? 'Julat Sudut: 0° - 180°' : 'Angle Range: 0° - 180°'}</span>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Interactive Protractor */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-slate-800 dark:text-white">
              {language === 'ms' ? '1. Meneroka Sudut dengan Protraktor' : '1. Explore Angle with Protractor'}
            </h4>
            <span className={`text-sm font-bold ${getAngleType(angle).color}`}>
              {getAngleType(angle)[language]}
            </span>
          </div>

          {/* SVG Protractor Visualization */}
          <div className="relative flex justify-center items-center bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-inner">
            <svg viewBox="0 0 300 180" className="w-full max-w-sm h-auto overflow-visible">
              {/* Semi-circle protractor background */}
              <path d="M 30 150 A 120 120 0 0 1 270 150 Z" fill="rgba(99, 102, 241, 0.08)" stroke="#818CF8" strokeWidth="2" strokeDasharray="3 3" />

              {/* Protractor marks */}
              {[0, 30, 45, 60, 90, 120, 135, 150, 180].map((deg) => {
                const r = (deg * Math.PI) / 180;
                const mx1 = 150 + 112 * Math.cos(-r);
                const my1 = 150 + 112 * Math.sin(-r);
                const mx2 = 150 + 120 * Math.cos(-r);
                const my2 = 150 + 120 * Math.sin(-r);
                const lx = 150 + 132 * Math.cos(-r);
                const ly = 150 + 132 * Math.sin(-r);
                return (
                  <g key={deg}>
                    <line x1={mx1} y1={my1} x2={mx2} y2={my2} stroke="#6366F1" strokeWidth="2" />
                    <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" className="text-[9px] font-bold fill-slate-500 dark:fill-slate-400">
                      {deg}°
                    </text>
                  </g>
                );
              })}

              {/* Baseline */}
              <line x1="30" y1="150" x2="270" y2="150" stroke="#475569" strokeWidth="3" strokeLinecap="round" />

              {/* Center vertex point */}
              <circle cx="150" cy="150" r="5" className="fill-indigo-600 dark:fill-indigo-400" />

              {/* Angle Ray line */}
              <line x1="150" y1="150" x2={rayX} y2={rayY} stroke="#EC4899" strokeWidth="4" strokeLinecap="round" />

              {/* Angle Arc */}
              {angle > 0 && (
                <path
                  d={`M 190 150 A 40 40 0 ${largeArc} 0 ${arcX} ${arcY}`}
                  fill="none"
                  stroke="#EC4899"
                  strokeWidth="3"
                />
              )}

              {/* Angle Label */}
              <text x="150" y="125" textAnchor="middle" className="text-sm font-extrabold fill-indigo-600 dark:fill-indigo-300">
                {angle}°
              </text>
            </svg>
          </div>

          {/* Angle Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium text-slate-700 dark:text-slate-300">
              <span>{language === 'ms' ? 'Nilai Sudut:' : 'Angle Value:'}</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{angle}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="180"
              step="5"
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>0°</span>
              <span>45°</span>
              <span>90°</span>
              <span>135°</span>
              <span>180°</span>
            </div>
          </div>
        </div>

        {/* Right Column: Regular Polygons Interior Angle */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-slate-800 dark:text-white">
              {language === 'ms' ? '2. Sudut Pedalaman Poligon Sekata' : '2. Interior Angles of Regular Polygons'}
            </h4>
          </div>

          {/* Polygon Selector Buttons */}
          <div className="flex flex-wrap gap-2">
            {polygons.map((poly) => (
              <button
                key={poly.sides}
                onClick={() => {
                  setSelectedPolygonSides(poly.sides);
                  setAngle(poly.interiorAngle);
                }}
                className={`px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
                  selectedPolygonSides === poly.sides
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {poly.name[language]} ({poly.sides} {language === 'ms' ? 'sisi' : 'sides'})
              </button>
            ))}
          </div>

          {/* SVG Polygon Visualization */}
          <div className="relative flex justify-center items-center bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-inner">
            <svg viewBox="0 0 200 200" className="w-48 h-48 overflow-visible">
              <polygon
                points={generatePolygonPoints(currentPolygon.sides, 75, 100, 100)}
                fill="rgba(99, 102, 241, 0.15)"
                stroke="#6366F1"
                strokeWidth="3"
                strokeLinejoin="round"
              />
            </svg>
            <div className="absolute bottom-3 right-3 bg-indigo-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-indigo-200 dark:border-slate-700 text-xs font-bold text-indigo-700 dark:text-indigo-300">
              {language === 'ms' ? 'Sudut Pedalaman:' : 'Interior Angle:'} {currentPolygon.interiorAngle}°
            </div>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-xs text-indigo-900 dark:text-indigo-200 space-y-1">
            <p className="font-bold">
              {currentPolygon.name[language]} ({currentPolygon.sides} {language === 'ms' ? 'sisi' : 'sides'})
            </p>
            <p>
              {language === 'ms'
                ? `Setiap sudut pedalaman poligon sekata ini ialah ${currentPolygon.interiorAngle}°.`
                : `Each interior angle of this regular polygon measures ${currentPolygon.interiorAngle}°.`}
            </p>
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
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => checkQuestion(q)}
                    disabled={!userAnswers[q.id]}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors"
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
