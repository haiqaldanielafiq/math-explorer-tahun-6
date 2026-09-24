'use client';

import { useState } from 'react';
import { QuizData, Question } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import {
  CheckCircle2,
  XCircle,
  Award,
  RotateCw,
  HelpCircle,
  Check,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizRunnerProps {
  quizData: QuizData;
  topicTitle: string;
  topicSlug: string;
}

export function QuizRunner({ quizData, topicTitle, topicSlug }: QuizRunnerProps) {
  const { tText } = useLanguage();
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const questions = quizData.questions || [];
  const currentQ: Question | undefined = questions[currentIdx];
  const totalQuestions = questions.length;

  const handleSelectOption = (optText: string) => {
    if (showExplanation || isSubmitted || !currentQ) return;
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: optText }));
  };

  const handleCheckAnswer = () => {
    if (!currentQ || !userAnswers[currentQ.id]) return;
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx((prev) => prev + 1);
      setShowExplanation(false);
    } else {
      setIsSubmitted(true);
      const score = calculateScore();
      const pct = Math.round((score / totalQuestions) * 100);

      if (pct >= 70) {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      }

      try {
        const stored = localStorage.getItem('math_explorer_progress');
        const list = stored ? JSON.parse(stored) : [];
        list.push({
          topicSlug,
          topicTitle,
          score,
          totalQuestions,
          percentage: pct,
          completedAt: new Date().toISOString(),
        });
        localStorage.setItem('math_explorer_progress', JSON.stringify(list));
      } catch {
        // empty
      }
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setUserAnswers({});
    setShowExplanation(false);
    setIsSubmitted(false);
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        score += 1;
      }
    });
    return score;
  };

  if (!currentQ && !isSubmitted) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 text-center space-y-2">
        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">Tiada Soalan Kuiz</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Modul kuiz sedang disediakan oleh guru.</p>
      </div>
    );
  }

  const totalScore = calculateScore();
  const percentage = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;

  let feedbackMessage = '';
  let feedbackBadgeColor = '';

  if (percentage >= 90) {
    feedbackMessage = 'Tahniah! Kamu sangat menguasai topik ini. Prestasi yang amat cemerlang!';
    feedbackBadgeColor = 'bg-emerald-500 text-white';
  } else if (percentage >= 70) {
    feedbackMessage = 'Bagus! Teruskan latihan untuk mengukuhkan kefahaman kamu.';
    feedbackBadgeColor = 'bg-blue-500 text-white';
  } else {
    feedbackMessage = 'Jangan risau. Cuba ulang semula bahagian pembelajaran dan cuba kuiz sekali lagi.';
    feedbackBadgeColor = 'bg-amber-500 text-white';
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-700 shadow-xl space-y-8">
      {!isSubmitted && currentQ ? (
        <div className="space-y-8 max-w-3xl mx-auto">
          {/* Header Progress Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-lg border border-indigo-100 dark:border-indigo-800">
                <HelpCircle className="w-4 h-4" /> Soalan {currentIdx + 1} daripada {totalQuestions}
              </span>
              <span>Kemajuan: {Math.round(((currentIdx + 1) / totalQuestions) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden border border-slate-200 dark:border-slate-600">
              <div
                className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300 bg-white/10 px-3 py-1 rounded-md">
                Soalan Matematik Tahun 6
              </span>
              {currentQ.difficulty && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                  Tahap: {currentQ.difficulty}
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-bold leading-snug">{tText(currentQ.question)}</h2>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentQ.options?.map((opt) => {
              const optText = tText(opt);
              const isSelected = userAnswers[currentQ.id] === optText;
              const isCorrect = optText === currentQ.correctAnswer;

              let style = 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100';

              if (showExplanation) {
                if (isCorrect) {
                  style = 'bg-emerald-500 text-white border-emerald-600 shadow-md';
                } else if (isSelected && !isCorrect) {
                  style = 'bg-rose-500 text-white border-rose-600';
                } else {
                  style = 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 opacity-60';
                }
              } else if (isSelected) {
                style = 'bg-indigo-600 text-white border-indigo-700 shadow-lg shadow-indigo-200';
              }

              return (
                <button
                  key={optText}
                  onClick={() => handleSelectOption(optText)}
                  disabled={showExplanation}
                  className={`p-5 rounded-2xl border font-bold text-sm sm:text-base text-left transition-all flex items-center justify-between ${style}`}
                >
                  <span>{optText}</span>
                  {showExplanation && isCorrect && <CheckCircle2 className="w-5 h-5 text-white" />}
                  {showExplanation && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-white" />}
                  {!showExplanation && isSelected && <Check className="w-5 h-5 text-white" />}
                </button>
              );
            })}
          </div>

          {/* Explanation Box when Checked */}
          {showExplanation && (
            <div className={`p-5 rounded-2xl border text-sm space-y-2 ${
              userAnswers[currentQ.id] === currentQ.correctAnswer
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                : 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-950 dark:text-rose-200'
            }`}>
              <div className="font-extrabold flex items-center gap-2">
                {userAnswers[currentQ.id] === currentQ.correctAnswer ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span>Jawapan Betul!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                    <span>Jawapan Kurang Tepat. Jawapan betul ialah: {currentQ.correctAnswer}</span>
                  </>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{tText(currentQ.explanation)}</p>
            </div>
          )}

          {/* Bottom Action Controls */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
            {!showExplanation ? (
              <button
                onClick={handleCheckAnswer}
                disabled={!userAnswers[currentQ.id]}
                className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Semak Jawapan
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <span>{currentIdx < totalQuestions - 1 ? 'Soalan Seterusnya' : 'Selesaikan Kuiz'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* QUIZ SUMMARY CARD */
        <div className="max-w-2xl mx-auto text-center space-y-8 py-6">
          <div className="w-20 h-20 bg-amber-400 text-slate-950 rounded-3xl flex items-center justify-center mx-auto shadow-xl">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-3">
            <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${feedbackBadgeColor}`}>
              Pencapaian: {percentage}% Markah
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Keputusan Kuiz: {topicTitle}</h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              {feedbackMessage}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div>
              <div className="text-2xl font-black text-indigo-900 dark:text-indigo-300">{totalScore} / {totalQuestions}</div>
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Soalan Betul</div>
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{percentage}%</div>
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Markah Peratusan</div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
                {percentage >= 70 ? 'LULUS' : 'MULA'}
              </div>
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Status Modul</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md transition-all"
            >
              <RotateCw className="w-4 h-4" /> Cuba Kuiz Sekali Lagi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
