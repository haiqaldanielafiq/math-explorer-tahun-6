'use client';

import { useState } from 'react';
import { PieChartActivityData } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import {
  CheckCircle2,
  XCircle,
  Award,
  RotateCw,
  Compass,
  Circle,
  Layers,
  ArrowRight,
  Sparkles,
  Play
} from 'lucide-react';
import { StarField } from '@/components/SpaceDecorations';
import confetti from 'canvas-confetti';

interface InteractiveBulatanActivityProps {
  activityData: PieChartActivityData;
}

export function InteractiveBulatanActivity({ activityData }: InteractiveBulatanActivityProps) {
  const { language, tText } = useLanguage();
  const [activeTab, setActiveTab] = useState<'parts' | 'drawer' | 'exercise'>('parts');

  // Circle Parts Explorer State
  const [highlightPart, setHighlightPart] = useState<'center' | 'radius' | 'diameter' | 'turn360'>('center');

  // Drawing Compass Tool State
  const [radiusValue, setRadiusValue] = useState<number>(5);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [drawProgress, setDrawProgress] = useState<number>(360);

  // Exercise State
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [userScore, setUserScore] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);

  const diameterValue = radiusValue * 2;

  const handleStartDrawAnimation = () => {
    setIsDrawing(true);
    setDrawProgress(0);
    let curr = 0;
    const interval = setInterval(() => {
      curr += 10;
      setDrawProgress(curr);
      if (curr >= 360) {
        clearInterval(interval);
        setIsDrawing(false);
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
      }
    }, 30);
  };

  const currentQ = activityData.questions?.[currentQuestionIdx];

  const handleAnswerQuestion = (opt: string) => {
    if (isAnswered) return;
    setSelectedOption(opt);
    setIsAnswered(true);

    if (opt === currentQ.correctAnswer) {
      setUserScore((prev) => prev + 1);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx < (activityData.questions?.length || 0) - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setCompleted(true);
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    }
  };

  const handleResetExercise = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setUserScore(0);
    setCompleted(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-700 shadow-xl space-y-8 relative overflow-hidden">
      <StarField />

      {/* Header Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-6 relative z-10">
        <div>
          <span className="bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {language === 'en' ? 'DSKP 6.2 Bulatan' : 'DSKP 6.2 Bulatan'}
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{tText(activityData.title)}</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">{tText(activityData.description)}</p>
        </div>

        <div className="flex flex-wrap bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shrink-0 gap-1">
          <button
            onClick={() => setActiveTab('parts')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'parts'
                ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 shadow border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'
            }`}
          >
            <Circle className="w-4 h-4" /> {language === 'en' ? 'Identify Parts' : 'Kenal Bahagian'}
          </button>
          <button
            onClick={() => setActiveTab('drawer')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'drawer'
                ? 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 shadow border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600'
            }`}
          >
            <Compass className="w-4 h-4" /> {language === 'en' ? 'Circle Drawer' : 'Melukis Bulatan'}
          </button>
          <button
            onClick={() => setActiveTab('exercise')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'exercise'
                ? 'bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-300 shadow border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-amber-600'
            }`}
          >
            <Layers className="w-4 h-4" /> {language === 'en' ? 'Practice' : 'Latihan'}
          </button>
        </div>
      </div>

      {/* TAB 1: CIRCLE PARTS IDENTIFICATION */}
      {activeTab === 'parts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-6 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-full h-full rounded-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 shadow-inner">
                {/* Full Circumference */}
                <circle
                  cx="100"
                  cy="100"
                  r="75"
                  fill="none"
                  stroke={highlightPart === 'turn360' ? '#10B981' : '#CBD5E1'}
                  strokeWidth={highlightPart === 'turn360' ? '5' : '2'}
                  strokeDasharray={highlightPart === 'turn360' ? '6,3' : 'none'}
                  className="transition-all duration-300"
                />

                {/* Diameter Line */}
                {(highlightPart === 'diameter' || highlightPart === 'turn360') && (
                  <line
                    x1="25"
                    y1="100"
                    x2="175"
                    y2="100"
                    stroke="#E11D48"
                    strokeWidth="4"
                    className="transition-all duration-300"
                  />
                )}

                {/* Radius Line */}
                {(highlightPart === 'radius' || highlightPart === 'turn360') && (
                  <line
                    x1="100"
                    y1="100"
                    x2="100"
                    y2="25"
                    stroke="#3B82F6"
                    strokeWidth="4"
                    className="transition-all duration-300"
                  />
                )}

                {/* Center Point */}
                <circle
                  cx="100"
                  cy="100"
                  r={highlightPart === 'center' ? '8' : '5'}
                  fill={highlightPart === 'center' ? '#F59E0B' : '#0F172A'}
                  className="transition-all duration-300"
                />

                {/* Center Point Text */}
                <text x="100" y="118" textAnchor="middle" fontSize="10" fontWeight="extrabold" fill="#0F172A" className="dark:fill-white">
                  Pusat (O)
                </text>

                {/* Diameter Text Label */}
                {highlightPart === 'diameter' && (
                  <text x="100" y="92" textAnchor="middle" fontSize="10" fontWeight="extrabold" fill="#E11D48">
                    Diameter (Merentasi Pusat O)
                  </text>
                )}

                {/* Radius Text Label */}
                {highlightPart === 'radius' && (
                  <text x="108" y="60" textAnchor="start" fontSize="10" fontWeight="extrabold" fill="#3B82F6">
                    Jejari (Pusat O ke Lilitan)
                  </text>
                )}

                {/* 360° Turn Text Label */}
                {highlightPart === 'turn360' && (
                  <text x="100" y="40" textAnchor="middle" fontSize="11" fontWeight="black" fill="#10B981">
                    Putaran Lengkap = 360°
                  </text>
                )}
              </svg>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <label className="block text-sm font-extrabold text-slate-900 dark:text-white">
                {language === 'en' ? 'Pilih Bahagian Bulatan Untuk Dilihat:' : 'Pilih Bahagian Bulatan Untuk Dilihat:'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setHighlightPart('center')}
                  className={`p-3.5 rounded-2xl text-xs font-extrabold border transition-all text-left ${
                    highlightPart === 'center'
                      ? 'bg-amber-500 text-white border-amber-500 shadow-md scale-105'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  📍 {language === 'en' ? 'Pusat Bulatan (Center)' : 'Pusat Bulatan'}
                </button>

                <button
                  onClick={() => setHighlightPart('radius')}
                  className={`p-3.5 rounded-2xl text-xs font-extrabold border transition-all text-left ${
                    highlightPart === 'radius'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  📏 {language === 'en' ? 'Jejari (Radius)' : 'Jejari'}
                </button>

                <button
                  onClick={() => setHighlightPart('diameter')}
                  className={`p-3.5 rounded-2xl text-xs font-extrabold border transition-all text-left ${
                    highlightPart === 'diameter'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-md scale-105'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  ↔️ {language === 'en' ? 'Diameter' : 'Diameter'}
                </button>

                <button
                  onClick={() => setHighlightPart('turn360')}
                  className={`p-3.5 rounded-2xl text-xs font-extrabold border transition-all text-left ${
                    highlightPart === 'turn360'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-105'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  🔄 {language === 'en' ? 'Putaran 360° (Full Turn)' : 'Putaran Lengkap 360°'}
                </button>
              </div>
            </div>

            <div className="bg-emerald-50/80 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5 space-y-3">
              <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                {language === 'en' ? 'Penerangan Bahagian Bulatan:' : 'Penerangan Bahagian Bulatan:'}
              </div>

              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                {highlightPart === 'center' && (
                  <p>
                    <strong>Pusat Bulatan (Center):</strong> Titik tetap di tengah-tengah bulatan. Jarak dari pusat bulatan ke mana-mana bahagian tepi bulatan (lilitan) sentiasa sama.
                  </p>
                )}
                {highlightPart === 'radius' && (
                  <p>
                    <strong>Jejari (Radius):</strong> Garis lurus yang menyambungkan pusat bulatan ke tepi lilitan bulatan. Nisbah jejari berbanding diameter ialah separuh daripada diameter (Jejari = Diameter ÷ 2).
                  </p>
                )}
                {highlightPart === 'diameter' && (
                  <p>
                    <strong>Diameter:</strong> Garis lurus yang melalui pusat bulatan dan menyambungkan dua titik bertentangan pada lilitan bulatan. Panjang diameter ialah dua kali panjang jejari (Diameter = 2 × Jejari).
                  </p>
                )}
                {highlightPart === 'turn360' && (
                  <p>
                    <strong>Putaran Lengkap 360°:</strong> Satu pusingan lengkap dari mana-mana titik pada bulatan kembali ke titik asal menghasilkan sudut penuh 360°.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CIRCLE DRAWING TOOL */}
      {activeTab === 'drawer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 max-w-4xl mx-auto">
          <div className="lg:col-span-6 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-full h-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-inner">
                {/* Drawn Circle Path based on radiusValue */}
                <path
                  d={`M 100,${100 - radiusValue * 8} A ${radiusValue * 8},${radiusValue * 8} 0 ${drawProgress > 180 ? 1 : 0},1 ${100 + radiusValue * 8 * Math.sin((drawProgress * Math.PI) / 180)},${100 - radiusValue * 8 * Math.cos((drawProgress * Math.PI) / 180)}`}
                  fill="rgba(59, 130, 246, 0.15)"
                  stroke="#3B82F6"
                  strokeWidth="3.5"
                />

                {/* Center Point */}
                <circle cx="100" cy="100" r="4.5" fill="#0F172A" className="dark:fill-white" />
                <text x="100" y="115" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#0F172A" className="dark:fill-white">
                  Pusat O
                </text>

                {/* Radius Line with Dynamic Label */}
                {drawProgress >= 90 && (
                  <g>
                    <line x1="100" y1="100" x2={100 + radiusValue * 8} y2="100" stroke="#3B82F6" strokeWidth="2.5" />
                    <text x={100 + radiusValue * 4} y="94" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#2563EB">
                      j = {radiusValue} cm
                    </text>
                  </g>
                )}

                {/* Diameter Line with Dynamic Label */}
                {drawProgress >= 270 && (
                  <g>
                    <line x1={100 - radiusValue * 8} y1="100" x2="100" y2="100" stroke="#E11D48" strokeWidth="2.5" strokeDasharray="3,2" />
                    <text x={100 - radiusValue * 4} y="94" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#E11D48">
                      d = {diameterValue} cm
                    </text>
                  </g>
                )}

                {/* Compass Pencil Head Visual */}
                {isDrawing && (
                  <g transform={`translate(${100 + radiusValue * 8 * Math.sin((drawProgress * Math.PI) / 180)}, ${100 - radiusValue * 8 * Math.cos((drawProgress * Math.PI) / 180)})`}>
                    <circle cx="0" cy="0" r="6" fill="#F59E0B" />
                  </g>
                )}
              </svg>

              <div className="absolute top-3 bg-slate-900 text-white font-extrabold text-xs px-3.5 py-1 rounded-full shadow">
                {language === 'en' ? `Radius: ${radiusValue} cm | Diameter: ${diameterValue} cm` : `Jejari: ${radiusValue} cm | Diameter: ${diameterValue} cm`}
              </div>
            </div>

            <button
              onClick={handleStartDrawAnimation}
              disabled={isDrawing}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isDrawing ? (language === 'en' ? 'Drawing Circle...' : 'Sedang Melukis Bulatan...') : (language === 'en' ? 'Simulate Compass Drawing (360°)' : 'Simulasi Melukis Jangka Lukis (360°)')}</span>
            </button>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {language === 'en' ? 'Set Radius Measurement (Jejari):' : 'Pelaras Ukuran Jejari (cm):'}
                </label>
                <span className="text-lg font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3.5 py-1 rounded-xl border border-blue-200 dark:border-blue-800">
                  {radiusValue} cm
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="10"
                step="1"
                value={radiusValue}
                onChange={(e) => {
                  setRadiusValue(Number(e.target.value));
                  setDrawProgress(360);
                }}
                className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-5 space-y-3">
              <div className="text-xs font-extrabold uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
                {language === 'en' ? 'Calculated Circle Measurements:' : 'Keputusan Ukuran Bulatan Dilukis:'}
              </div>

              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-slate-600 dark:text-slate-400">{language === 'en' ? 'Jejari (Radius):' : 'Ukuran Jejari (j):'}</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{radiusValue} cm</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-slate-600 dark:text-slate-400">{language === 'en' ? 'Diameter (2 × Jejari):' : 'Ukuran Diameter (d = 2 × j):'}</span>
                  <span className="font-mono font-bold text-rose-600 dark:text-rose-400">{diameterValue} cm</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="font-bold text-slate-900 dark:text-white">{language === 'en' ? 'Full Turn Angle:' : 'Sudut Putaran Lengkap:'}</span>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">360°</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PRACTICE EXERCISE */}
      {activeTab === 'exercise' && currentQ && (
        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          {!completed ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {language === 'en' ? `Question ${currentQuestionIdx + 1} of ${activityData.questions?.length || 0}` : `Soalan ${currentQuestionIdx + 1} daripada ${activityData.questions?.length || 0}`}
                </span>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1 rounded-full">
                  {language === 'en' ? `Score: ${userScore}` : `Markah: ${userScore}`}
                </span>
              </div>

              <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-md space-y-2">
                <div className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                  {language === 'en' ? 'Bulatan Practice Question:' : 'Soalan Latihan Bulatan:'}
                </div>
                <h3 className="text-lg font-bold">{tText(currentQ.prompt)}</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQ.options?.map((opt) => {
                  const optText = tText(opt);
                  const isSelected = selectedOption === optText;
                  const isCorrectOpt = optText === currentQ.correctAnswer;

                  let btnStyle = 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100';

                  if (isAnswered) {
                    if (isCorrectOpt) {
                      btnStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-md';
                    } else if (isSelected && !isCorrectOpt) {
                      btnStyle = 'bg-rose-500 text-white border-rose-600';
                    } else {
                      btnStyle = 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={optText}
                      onClick={() => handleAnswerQuestion(optText)}
                      disabled={isAnswered}
                      className={`p-4 rounded-2xl border font-bold text-sm text-left transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{optText}</span>
                      {isAnswered && isCorrectOpt && <CheckCircle2 className="w-5 h-5 text-white" />}
                      {isAnswered && isSelected && !isCorrectOpt && <XCircle className="w-5 h-5 text-white" />}
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div className={`p-4 rounded-2xl border text-sm space-y-2 ${
                  selectedOption === currentQ.correctAnswer
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                    : 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-950 dark:text-rose-200'
                }`}>
                  <div className="font-extrabold flex items-center gap-2">
                    {selectedOption === currentQ.correctAnswer ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        <span>{language === 'en' ? 'Correct! Syabas!' : 'Betul! Syabas!'}</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                        <span>{language === 'en' ? 'Try again!' : 'Cuba Lagi!'}</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{tText(currentQ.explanation)}</p>

                  <div className="pt-2">
                    <button
                      onClick={handleNextQuestion}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow transition-all flex items-center justify-center gap-2"
                    >
                      <span>
                        {currentQuestionIdx < (activityData.questions?.length || 0) - 1
                          ? (language === 'en' ? 'Next Question' : 'Soalan Seterusnya')
                          : (language === 'en' ? 'View Results' : 'Lihat Keputusan')}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 space-y-6 bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-700">
              <div className="w-16 h-16 bg-amber-400 text-slate-950 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Award className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  {language === 'en' ? 'Congratulations! Activity Complete' : 'Tahniah! Aktiviti Selesai'}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {language === 'en' ? 'You answered ' : 'Kamu mendapat '}
                  <strong className="text-indigo-600 dark:text-indigo-400">{userScore}</strong>
                  {language === 'en' ? ' out of ' : ' daripada '}
                  <strong className="text-indigo-600 dark:text-indigo-400">{activityData.questions?.length || 0}</strong>
                  {language === 'en' ? ' questions correctly.' : ' soalan dengan betul.'}
                </p>
              </div>

              <button
                onClick={handleResetExercise}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow transition-all"
              >
                <RotateCw className="w-4 h-4" /> {language === 'en' ? 'Retry Practice' : 'Cuba Semula Latihan'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
