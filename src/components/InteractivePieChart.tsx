'use client';

import { useState } from 'react';
import { PieChartActivityData } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  Award,
  RotateCw,
  Compass,
  Layers,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface InteractivePieChartProps {
  activityData: PieChartActivityData;
}

export function InteractivePieChart({ activityData }: InteractivePieChartProps) {
  const { language, tText } = useLanguage();
  const [activeTab, setActiveTab] = useState<'explorer' | 'exercise'>('explorer');

  // Explorer State
  const [selectedAngle, setSelectedAngle] = useState<number>(180);
  const [customTotal, setCustomTotal] = useState<number>(20);

  // Exercise State
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [userScore, setUserScore] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);

  const calculateSlicePath = (startAngle: number, angleSize: number, radius: number = 80) => {
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (startAngle + angleSize - 90) * (Math.PI / 180);

    const x1 = 100 + radius * Math.cos(startRad);
    const y1 = 100 + radius * Math.sin(startRad);

    const x2 = 100 + radius * Math.cos(endRad);
    const y2 = 100 + radius * Math.sin(endRad);

    const largeArcFlag = angleSize > 180 ? 1 : 0;

    return `M 100,100 L ${x1},${y1} A ${radius},${radius} 0 ${largeArcFlag},1 ${x2},${y2} Z`;
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

  const calculatedQuantity = Math.round((selectedAngle / 360) * customTotal * 10) / 10;
  const fractionText = selectedAngle === 180 ? '1/2' : selectedAngle === 90 ? '1/4' : selectedAngle === 45 ? '1/8' : `${selectedAngle}°/360°`;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-700 shadow-xl space-y-8">
      {/* Header Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-6">
        <div>
          <span className="bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {language === 'en' ? 'DSKP Activity' : 'Aktiviti DSKP'}
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{tText(activityData.title)}</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">{tText(activityData.description)}</p>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shrink-0">
          <button
            onClick={() => setActiveTab('explorer')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'explorer'
                ? 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 shadow border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600'
            }`}
          >
            <Compass className="w-4 h-4" /> {language === 'en' ? 'Angle Explorer' : 'Penerokaan Sudut'}
          </button>
          <button
            onClick={() => setActiveTab('exercise')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'exercise'
                ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 shadow border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'
            }`}
          >
            <Layers className="w-4 h-4" /> {language === 'en' ? 'Interpretation Practice' : 'Latihan Mentafsir'}
          </button>
        </div>
      </div>

      {/* TAB 1: PENEROKAAN SUDUT INTERAKTIF */}
      {activeTab === 'explorer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-full h-full shadow-inner rounded-full bg-white dark:bg-slate-800">
                <circle cx="100" cy="100" r="80" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
                <line x1="100" y1="100" x2="100" y2="20" stroke="#94A3B8" strokeWidth="2" strokeDasharray="3,3" />

                <path
                  d={calculateSlicePath(0, selectedAngle, 80)}
                  fill={selectedAngle === 180 ? '#3B82F6' : selectedAngle === 90 ? '#10B981' : '#F59E0B'}
                  className="transition-all duration-300 opacity-90 hover:opacity-100"
                />

                {selectedAngle < 360 && (
                  <path
                    d={calculateSlicePath(selectedAngle, 360 - selectedAngle, 80)}
                    fill="#CBD5E1"
                    className="transition-all duration-300 opacity-50"
                  />
                )}

                <circle cx="100" cy="100" r="5" fill="#0F172A" />
                <line x1="100" y1="100" x2="100" y2="20" stroke="#0F172A" strokeWidth="3" />
                <line
                  x1="100"
                  y1="100"
                  x2={100 + 80 * Math.cos((selectedAngle - 90) * (Math.PI / 180))}
                  y2={100 + 80 * Math.sin((selectedAngle - 90) * (Math.PI / 180))}
                  stroke="#0F172A"
                  strokeWidth="3"
                />
              </svg>

              <div className="absolute top-2 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow">
                {language === 'en' ? 'Radius' : 'Jejari'}
              </div>
              <div className="absolute center bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 text-xs font-black px-3 py-1 rounded-full shadow-lg">
                {language === 'en' ? 'Circle Centre (100,100)' : 'Pusat Bulatan (100,100)'}
              </div>
            </div>

            <div className="text-center space-y-1">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {language === 'en' ? 'Circle Centre & Radius' : 'Pusat Bulatan & Jejari'}
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {language === 'en' ? 'Full circle = ' : 'Bulatan penuh = '}<strong>360°</strong> | {language === 'en' ? 'Selected sector = ' : 'Sektor dipilih = '}
                <strong className="text-indigo-600 dark:text-indigo-400 font-extrabold">{selectedAngle}°</strong> ({fractionText})
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <label className="block text-sm font-extrabold text-slate-900 dark:text-white">
                {language === 'en' ? 'Select DSKP Angle Value:' : 'Pilih Nilai Sudut DSKP:'}
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[180, 90, 45].map((ang) => (
                  <button
                    key={ang}
                    onClick={() => setSelectedAngle(ang)}
                    className={`py-3 px-4 rounded-2xl text-sm font-black border transition-all ${
                      selectedAngle === ang
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200 scale-105'
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {ang}°
                    <span className="block text-[10px] font-normal opacity-80">
                      ({ang === 180 ? (language === 'en' ? 'Half / 1/2' : 'Separuh / 1/2') : ang === 90 ? (language === 'en' ? 'Quarter / 1/4' : 'Suku / 1/4') : (language === 'en' ? '1/8 Circle' : '1/8 Bulatan')})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {language === 'en' ? 'Adjust Total Data Quantity:' : 'Ubah Kuantiti Keseluruhan Data:'}
                </label>
                <span className="text-base font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-xl border border-indigo-200 dark:border-indigo-800">
                  {customTotal} {language === 'en' ? 'Students' : 'Murid'}
                </span>
              </div>
              <input
                type="range"
                min="8"
                max="40"
                step="4"
                value={customTotal}
                onChange={(e) => setCustomTotal(Number(e.target.value))}
                className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div className="bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-5 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>{language === 'en' ? `Sector Quantity Calculation (${selectedAngle}°):` : `Pengiraan Kuantiti Sektor (${selectedAngle}°):`}</span>
              </div>

              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-slate-600 dark:text-slate-400">{language === 'en' ? 'Quantity Formula:' : 'Formula Kuantiti:'}</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">({selectedAngle}° / 360°) × {customTotal}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="font-bold text-slate-900 dark:text-white">{language === 'en' ? 'Sector Student Quantity:' : 'Kuantiti Murid Dalam Sektor:'}</span>
                  <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    {calculatedQuantity} {language === 'en' ? 'Students' : 'Murid'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LATIHAN MENTAFSIR */}
      {activeTab === 'exercise' && currentQ && (
        <div className="max-w-2xl mx-auto space-y-6">
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
                  {language === 'en' ? 'Practice Question:' : 'Soalan Latihan:'}
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
                        <span>{language === 'en' ? 'Correct! Excellent!' : 'Betul! Syabas!'}</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                        <span>{language === 'en' ? 'Try again! Remember a full circle is 360°.' : 'Cuba Lagi! Ingat bahawa satu bulatan penuh ialah 360°.'}</span>
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
                          : (language === 'en' ? 'View Activity Results' : 'Lihat Keputusan Aktiviti')}
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
                <RotateCw className="w-4 h-4" /> {language === 'en' ? 'Retry Activity' : 'Cuba Semula Aktiviti'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
