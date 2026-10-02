'use client';

import { useState } from 'react';
import { PieChartActivityData } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import {
  CheckCircle2,
  XCircle,
  Award,
  RotateCw,
  Sliders,
  Layers,
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';
import { StarField, StarIcon, SaturnPlanet } from '@/components/SpaceDecorations';
import confetti from 'canvas-confetti';

interface InteractiveNisbahActivityProps {
  activityData: PieChartActivityData;
}

export function InteractiveNisbahActivity({ activityData }: InteractiveNisbahActivityProps) {
  const { language, tText } = useLanguage();
  const [activeTab, setActiveTab] = useState<'simplifier' | 'matching' | 'exercise'>('simplifier');

  // Simplifier State
  const [qtyA, setQtyA] = useState<number>(6);
  const [qtyB, setQtyB] = useState<number>(8);

  // Matching Tool State
  const [matchSelection, setMatchSelection] = useState<Record<number, string>>({});
  const [matchScore, setMatchScore] = useState<number | null>(null);

  // Exercise State
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [userScore, setUserScore] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);

  // Helper for HCF (FSTB)
  const getHCF = (a: number, b: number): number => {
    let x = Math.abs(a);
    let y = Math.abs(b);
    while (y) {
      const t = y;
      y = x % y;
      x = t;
    }
    return x || 1;
  };

  const hcf = getHCF(qtyA, qtyB);
  const simpleA = qtyA / hcf;
  const simpleB = qtyB / hcf;

  const MATCHING_PAIRS = [
    { initial: '6 : 8', correct: '3 : 4', options: ['3 : 4', '2 : 3', '4 : 5'] },
    { initial: '10 : 15', correct: '2 : 3', options: ['1 : 2', '2 : 3', '3 : 5'] },
    { initial: '12 : 18', correct: '2 : 3', options: ['2 : 3', '3 : 4', '4 : 6'] },
    { initial: '15 : 20', correct: '3 : 4', options: ['3 : 4', '5 : 4', '2 : 3'] },
  ];

  const handleCheckMatching = () => {
    let correctCount = 0;
    MATCHING_PAIRS.forEach((item, idx) => {
      if (matchSelection[idx] === item.correct) {
        correctCount++;
      }
    });
    setMatchScore(correctCount);
    if (correctCount === MATCHING_PAIRS.length) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
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
          <span className="bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {language === 'en' ? 'DSKP 7.2 Nisbah' : 'DSKP 7.2 Nisbah'}
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{tText(activityData.title)}</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">{tText(activityData.description)}</p>
        </div>

        <div className="flex flex-wrap bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shrink-0 gap-1">
          <button
            onClick={() => setActiveTab('simplifier')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'simplifier'
                ? 'bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 shadow border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-purple-600'
            }`}
          >
            <Sliders className="w-4 h-4" /> {language === 'en' ? 'Ratio Simplifier' : 'Permudah Nisbah'}
          </button>
          <button
            onClick={() => setActiveTab('matching')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'matching'
                ? 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 shadow border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600'
            }`}
          >
            <Zap className="w-4 h-4" /> {language === 'en' ? 'Ratio Matcher' : 'Padankan Nisbah'}
          </button>
          <button
            onClick={() => setActiveTab('exercise')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'exercise'
                ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 shadow border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'
            }`}
          >
            <Layers className="w-4 h-4" /> {language === 'en' ? 'Practice' : 'Latihan'}
          </button>
        </div>
      </div>

      {/* TAB 1: RATIO SIMPLIFIER */}
      {activeTab === 'simplifier' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 max-w-4xl mx-auto">
          {/* Visual Quantities Box */}
          <div className="lg:col-span-6 flex flex-col bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-extrabold text-amber-600 dark:text-amber-400">
                <span>⭐ {language === 'en' ? 'Quantity A (Stars)' : 'Kuantiti A (Bintang)'}:</span>
                <span className="text-base font-black text-slate-900 dark:text-white">{qtyA}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 min-h-[50px] items-center">
                {Array.from({ length: qtyA }).map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-extrabold text-cyan-600 dark:text-cyan-400">
                <span>🪐 {language === 'en' ? 'Quantity B (Planets)' : 'Kuantiti B (Planet)'}:</span>
                <span className="text-base font-black text-slate-900 dark:text-white">{qtyB}</span>
              </div>
              <div className="flex flex-wrap gap-2 p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 min-h-[50px] items-center">
                {Array.from({ length: qtyB }).map((_, i) => (
                  <SaturnPlanet key={i} className="w-5 h-5" />
                ))}
              </div>
            </div>

            <div className="bg-slate-900 text-white p-4 rounded-2xl text-center space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {language === 'en' ? 'Initial Ratio (a : b)' : 'Nisbah Awal (a : b)'}
              </span>
              <div className="text-2xl font-black text-amber-300 font-mono">
                {qtyA} : {qtyB}
              </div>
            </div>
          </div>

          {/* Controls & Step-by-Step Simplification */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">{language === 'en' ? 'Adjust Quantity A:' : 'Pelaras Kuantiti A:'}</span>
                  <span className="font-extrabold text-amber-600">{qtyA}</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="24"
                  step="2"
                  value={qtyA}
                  onChange={(e) => setQtyA(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">{language === 'en' ? 'Adjust Quantity B:' : 'Pelaras Kuantiti B:'}</span>
                  <span className="font-extrabold text-cyan-600">{qtyB}</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="24"
                  step="2"
                  value={qtyB}
                  onChange={(e) => setQtyB(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>
            </div>

            {/* Simplification Steps Card */}
            <div className="bg-purple-50/80 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 rounded-2xl p-5 space-y-4">
              <div className="text-xs font-extrabold uppercase tracking-wider text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                {language === 'en' ? 'Langkah Mempermudahkan Nisbah:' : 'Langkah Mempermudahkan Nisbah:'}
              </div>

              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-purple-100 dark:border-purple-900 space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-slate-600 dark:text-slate-400">{language === 'en' ? 'Highest Common Factor (HCF / FSTB):' : 'Faktor Sepunya Terbesar (FSTB):'}</span>
                  <span className="font-mono font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950 px-2.5 py-0.5 rounded-md">
                    {hcf}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-slate-600 dark:text-slate-400">{language === 'en' ? 'Division Formula:' : 'Formula Pembahagian:'}</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    ({qtyA} ÷ {hcf}) : ({qtyB} ÷ {hcf})
                  </span>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span className="font-extrabold text-slate-900 dark:text-white">{language === 'en' ? 'Simplest Form:' : 'Bentuk Termudah:'}</span>
                  <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3.5 py-0.5 rounded-xl border border-emerald-200 dark:border-emerald-800 font-mono">
                    {simpleA} : {simpleB}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RATIO MATCHING TOOL */}
      {activeTab === 'matching' && (
        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-md space-y-2 text-center">
            <h3 className="text-xl font-bold">
              {language === 'en' ? 'Match Initial Ratios to Simplest Form' : 'Padankan Nisbah Awal ke Bentuk Termudah'}
            </h3>
            <p className="text-xs text-indigo-200">
              {language === 'en'
                ? 'Select the simplest form ratio for each given initial ratio.'
                : 'Pilih nisbah bentuk termudah yang tepat bagi setiap nisbah awal di bawah.'}
            </p>
          </div>

          <div className="space-y-4">
            {MATCHING_PAIRS.map((item, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center">
                    #{idx + 1}
                  </span>
                  <span className="text-lg font-black font-mono text-slate-900 dark:text-white">
                    {item.initial}
                  </span>
                </div>

                <div className="flex gap-2">
                  {item.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setMatchSelection((prev) => ({ ...prev, [idx]: opt }))}
                      className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                        matchSelection[idx] === opt
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center justify-center gap-3 pt-2">
            <button
              onClick={handleCheckMatching}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-md transition-all"
            >
              {language === 'en' ? 'Check Answers' : 'Semak Jawapan Pemadanan'}
            </button>

            {matchScore !== null && (
              <div className={`p-4 rounded-2xl border text-sm font-extrabold text-center w-full ${
                matchScore === MATCHING_PAIRS.length
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                {matchScore === MATCHING_PAIRS.length
                  ? (language === 'en' ? `Excellent! All ${matchScore}/${MATCHING_PAIRS.length} correct!` : `Syabas! Semua ${matchScore}/${MATCHING_PAIRS.length} betul!`)
                  : (language === 'en' ? `You scored ${matchScore}/${MATCHING_PAIRS.length}. Keep practicing!` : `Kamu mendapat ${matchScore}/${MATCHING_PAIRS.length}. Teruskan cuba!`)}
              </div>
            )}
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
                  {language === 'en' ? 'Nisbah Practice Question:' : 'Soalan Latihan Nisbah:'}
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
