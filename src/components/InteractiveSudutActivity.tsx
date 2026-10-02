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
  Grid,
  Layers,
  ArrowRight,
  Sparkles,
  Eye
} from 'lucide-react';
import { StarField } from '@/components/SpaceDecorations';
import confetti from 'canvas-confetti';

interface InteractiveSudutActivityProps {
  activityData: PieChartActivityData;
}

interface PolygonInfo {
  sides: number;
  nameMs: string;
  nameEn: string;
  interiorAngle: number;
  sumAngle: number;
}

const POLYGONS: PolygonInfo[] = [
  { sides: 3, nameMs: 'Segi Tiga Sama Sisi', nameEn: 'Equilateral Triangle', interiorAngle: 60, sumAngle: 180 },
  { sides: 4, nameMs: 'Segi Empat Sama', nameEn: 'Square', interiorAngle: 90, sumAngle: 360 },
  { sides: 5, nameMs: 'Pentagon Sekata', nameEn: 'Regular Pentagon', interiorAngle: 108, sumAngle: 540 },
  { sides: 6, nameMs: 'Heksagon Sekata', nameEn: 'Regular Hexagon', interiorAngle: 120, sumAngle: 720 },
  { sides: 7, nameMs: 'Heptagon Sekata', nameEn: 'Regular Heptagon', interiorAngle: 128.57, sumAngle: 900 },
  { sides: 8, nameMs: 'Oktagon Sekata', nameEn: 'Regular Octagon', interiorAngle: 135, sumAngle: 1080 },
];

export function InteractiveSudutActivity({ activityData }: InteractiveSudutActivityProps) {
  const { language, tText } = useLanguage();
  const [activeTab, setActiveTab] = useState<'polygon' | 'angle_builder' | 'exercise'>('polygon');

  // Polygon Explorer State
  const [selectedSides, setSelectedSides] = useState<number>(4);
  const [gridType, setGridType] = useState<'square' | 'triangle'>('square');
  const [showProtractor, setShowProtractor] = useState<boolean>(true);

  // Angle Builder State (0° - 180°)
  const [targetAngle, setTargetAngle] = useState<number>(90);

  // Exercise State
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [userScore, setUserScore] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);

  const currentPolygon = POLYGONS.find((p) => p.sides === selectedSides) || POLYGONS[1];

  // Helper to generate polygon vertex coordinates
  const getPolygonPoints = (sides: number, radius: number = 80, cx: number = 100, cy: number = 100) => {
    const points: [number, number][] = [];
    const startAngle = sides === 3 ? -Math.PI / 2 : sides === 4 ? -Math.PI / 4 : -Math.PI / 2;
    for (let i = 0; i < sides; i++) {
      const angle = startAngle + (2 * Math.PI * i) / sides;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      points.push([x, y]);
    }
    return points;
  };

  const points = getPolygonPoints(selectedSides);
  const pointsString = points.map(([x, y]) => `${x},${y}`).join(' ');

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

  const angleTypeLabel = (angle: number) => {
    if (angle < 90) return language === 'en' ? 'Acute Angle (< 90°)' : 'Sudut Tirus (< 90°)';
    if (angle === 90) return language === 'en' ? 'Right Angle (90°)' : 'Sudut Tegak (90°)';
    if (angle < 180) return language === 'en' ? 'Obtuse Angle (> 90° & < 180°)' : 'Sudut Tumpul (> 90° & < 180°)';
    return language === 'en' ? 'Straight Angle (180°)' : 'Sudut Lurus (180°)';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-700 shadow-xl space-y-8 relative overflow-hidden">
      <StarField />

      {/* Header Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-6 relative z-10">
        <div>
          <span className="bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {language === 'en' ? 'DSKP 6.1 Sudut' : 'DSKP 6.1 Sudut'}
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{tText(activityData.title)}</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">{tText(activityData.description)}</p>
        </div>

        <div className="flex flex-wrap bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shrink-0 gap-1">
          <button
            onClick={() => setActiveTab('polygon')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'polygon'
                ? 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 shadow border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600'
            }`}
          >
            <Grid className="w-4 h-4" /> {language === 'en' ? 'Polygon Builder' : 'Bina Poligon'}
          </button>
          <button
            onClick={() => setActiveTab('angle_builder')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'angle_builder'
                ? 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 shadow border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600'
            }`}
          >
            <Compass className="w-4 h-4" /> {language === 'en' ? 'Angle Form Tool (≤180°)' : 'Bentuk Sudut (≤180°)'}
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

      {/* TAB 1: POLYGON BUILDER ON GRID */}
      {activeTab === 'polygon' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-6 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-full h-full rounded-2xl bg-white dark:bg-slate-900 shadow-inner border border-slate-200 dark:border-slate-700">
                {/* Grid Lines Pattern */}
                <defs>
                  {gridType === 'square' ? (
                    <pattern id="grid-sq" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E2E8F0" strokeWidth="1" className="dark:stroke-slate-800" />
                    </pattern>
                  ) : (
                    <pattern id="grid-tri" width="20" height="34.64" patternUnits="userSpaceOnUse">
                      <path d="M 0 0 L 20 0 L 10 17.32 Z M 10 17.32 L 20 34.64 L 0 34.64 Z" fill="none" stroke="#E2E8F0" strokeWidth="0.8" className="dark:stroke-slate-800" />
                    </pattern>
                  )}
                </defs>

                <rect width="200" height="200" fill={`url(#${gridType === 'square' ? 'grid-sq' : 'grid-tri'})`} />

                {/* Polygon Shape */}
                <polygon
                  points={pointsString}
                  fill="rgba(99, 102, 241, 0.2)"
                  stroke="#4F46E5"
                  strokeWidth="3"
                  className="transition-all duration-300"
                />

                {/* Draw Vertices */}
                {points.map(([x, y], idx) => (
                  <g key={idx}>
                    <circle cx={x} cy={y} r="5" fill="#4F46E5" className="transition-all duration-300" />
                    <text x={x} y={y - 8} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#312E81" className="dark:fill-indigo-300">
                      B{idx + 1}
                    </text>
                  </g>
                ))}

                {/* Protractor Visual Guide */}
                {showProtractor && points.length > 0 && (
                  <g transform={`translate(${points[0][0]}, ${points[0][1]})`} className="opacity-80">
                    <path d="M -30,0 A 30,30 0 0,1 30,0 Z" fill="rgba(245, 158, 11, 0.25)" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3,2" />
                    <circle cx="0" cy="0" r="2.5" fill="#D97706" />
                    <text x="0" y="15" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#B45309">
                      {currentPolygon.interiorAngle}°
                    </text>
                  </g>
                )}
              </svg>

              <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-700">
                {language === 'en' ? 'Grid' : 'Grid'}: {gridType === 'square' ? (language === 'en' ? 'Square Grid' : 'Grid Segi Empat') : (language === 'en' ? 'Equilateral Grid' : 'Grid Segi Tiga')}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setGridType(gridType === 'square' ? 'triangle' : 'square')}
                className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors"
              >
                {language === 'en' ? 'Switch Grid Mode' : 'Tukar Jenis Grid'}
              </button>
              <button
                onClick={() => setShowProtractor(!showProtractor)}
                className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-colors flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{showProtractor ? (language === 'en' ? 'Hide Protractor' : 'Sembunyi Protraktor') : (language === 'en' ? 'Show Protractor' : 'Papar Protraktor')}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <label className="block text-sm font-extrabold text-slate-900 dark:text-white">
                {language === 'en' ? 'Select Regular Polygon (3 to 8 Sides):' : 'Pilih Poligon Sekata (3 hingga 8 Sisi):'}
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {POLYGONS.map((poly) => (
                  <button
                    key={poly.sides}
                    onClick={() => setSelectedSides(poly.sides)}
                    className={`p-3 rounded-2xl text-xs font-extrabold border transition-all text-center ${
                      selectedSides === poly.sides
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-105'
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div>{poly.sides} {language === 'en' ? 'Sides' : 'Sisi'}</div>
                    <div className="text-[10px] font-normal opacity-85 mt-0.5">
                      {language === 'en' ? poly.nameEn : poly.nameMs}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  {language === 'en' ? 'Polygon & Interior Angle Calculation:' : 'Pengiraan Poligon & Sudut Pedalaman:'}
                </span>
                <span className="bg-indigo-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full">
                  {selectedSides} {language === 'en' ? 'Vertices' : 'Bucu'}
                </span>
              </div>

              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-slate-600 dark:text-slate-400">{language === 'en' ? 'Polygon Name:' : 'Nama Poligon:'}</span>
                  <span className="font-bold text-indigo-700 dark:text-indigo-300">{language === 'en' ? currentPolygon.nameEn : currentPolygon.nameMs}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-slate-600 dark:text-slate-400">{language === 'en' ? 'Sum of Interior Angles:' : 'Jumlah Sudut Pedalaman:'}</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">({selectedSides} - 2) × 180° = {currentPolygon.sumAngle}°</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="font-bold text-slate-900 dark:text-white">{language === 'en' ? 'Angle at Each Vertex:' : 'Sudut Pedalaman Setiap Bucu:'}</span>
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    {currentPolygon.interiorAngle}°
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ANGLE FORMATION TOOL (≤ 180°) */}
      {activeTab === 'angle_builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 max-w-4xl mx-auto">
          <div className="lg:col-span-6 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-full h-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-inner">
                {/* Semi-circle Protractor Base */}
                <path d="M 20,130 A 80,80 0 0,1 180,130 Z" fill="rgba(217, 119, 6, 0.12)" stroke="#D97706" strokeWidth="1.5" strokeDasharray="3,3" />
                <line x1="20" y1="130" x2="180" y2="130" stroke="#0F172A" strokeWidth="3" className="dark:stroke-slate-200" />

                {/* Base Arm */}
                <line x1="100" y1="130" x2="180" y2="130" stroke="#4F46E5" strokeWidth="4" />

                {/* Rotating Arm */}
                <line
                  x1="100"
                  y1="130"
                  x2={100 + 80 * Math.cos((-targetAngle * Math.PI) / 180)}
                  y2={130 + 80 * Math.sin((-targetAngle * Math.PI) / 180)}
                  stroke="#E11D48"
                  strokeWidth="4"
                  className="transition-all duration-150"
                />

                {/* Angle Arc Fill */}
                <path
                  d={`M 130,130 A 30,30 0 ${targetAngle > 180 ? 1 : 0},0 ${100 + 30 * Math.cos((-targetAngle * Math.PI) / 180)},${130 + 30 * Math.sin((-targetAngle * Math.PI) / 180)} L 100,130 Z`}
                  fill="rgba(225, 29, 72, 0.25)"
                  stroke="#E11D48"
                  strokeWidth="1.5"
                />

                {/* Vertex Center Dot */}
                <circle cx="100" cy="130" r="5" fill="#0F172A" className="dark:fill-white" />
              </svg>

              <div className="absolute top-4 bg-indigo-900 text-white font-extrabold text-sm px-4 py-1.5 rounded-full shadow-lg border border-indigo-700">
                {targetAngle}° - {angleTypeLabel(targetAngle)}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {language === 'en' ? 'Adjust Angle Value (0° to 180°):' : 'Pelaras Nilai Sudut (0° hingga 180°):'}
                </label>
                <span className="text-lg font-black text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-3.5 py-1 rounded-xl border border-rose-200 dark:border-rose-800">
                  {targetAngle}°
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="180"
                step="5"
                value={targetAngle}
                onChange={(e) => setTargetAngle(Number(e.target.value))}
                className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[30, 45, 60, 90, 120, 180].map((ang) => (
                <button
                  key={ang}
                  onClick={() => setTargetAngle(ang)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border transition-all ${
                    targetAngle === ang
                      ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {ang}° ({ang === 90 ? (language === 'en' ? 'Right' : 'Tegak') : ang === 180 ? (language === 'en' ? 'Straight' : 'Lurus') : ang < 90 ? (language === 'en' ? 'Acute' : 'Tirus') : (language === 'en' ? 'Obtuse' : 'Tumpul')})
                </button>
              ))}
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 text-xs text-amber-950 dark:text-amber-200 space-y-1">
              <span className="font-extrabold block">{language === 'en' ? 'Protractor Note:' : 'Nota Protraktor & Pembaris:'}</span>
              <p className="leading-relaxed">
                {language === 'en'
                  ? 'DSKP Year 6 standard focuses on constructing and measuring angles up to 180° using a protractor and straight ruler.'
                  : 'Standard DSKP Tahun 6 berfokus kepada membina dan mengukur sudut sehingga 180° menggunakan protraktor dan pembaris lurus.'}
              </p>
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
                  {language === 'en' ? 'Sudut Practice Question:' : 'Soalan Latihan Sudut:'}
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
