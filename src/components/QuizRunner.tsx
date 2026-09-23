'use client';

import { useState } from 'react';
import { QuizData, Question } from '@/types';
import {
  CheckCircle2,
  XCircle,
  Award,
  RotateCw,
  HelpCircle,
  Sparkles,
  ArrowRight,
  BarChart3,
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
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const currentQ: Question = quizData.questions[currentIdx];
  const totalQuestions = quizData.questions.length;

  const handleSelectOption = (opt: string) => {
    if (showExplanation || isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: opt }));
  };

  const handleCheckAnswer = () => {
    if (!userAnswers[currentQ.id]) return;
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx((prev) => prev + 1);
      setShowExplanation(false);
    } else {
      // Finish quiz
      setIsSubmitted(true);
      const score = calculateScore();
      const pct = Math.round((score / totalQuestions) * 100);

      if (pct >= 70) {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      }

      // Save progress to local storage
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
    quizData.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        score += 1;
      }
    });
    return score;
  };

  const totalScore = calculateScore();
  const percentage = Math.round((totalScore / totalQuestions) * 100);

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
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl space-y-8">
      {!isSubmitted ? (
        <div className="space-y-8 max-w-3xl mx-auto">
          {/* Header Progress Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span className="flex items-center gap-1.5 text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">
                <HelpCircle className="w-4 h-4" /> Soalan {currentIdx + 1} daripada {totalQuestions}
              </span>
              <span>Kemajuan: {Math.round(((currentIdx + 1) / totalQuestions) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
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
            <h2 className="text-lg sm:text-xl font-bold leading-snug">{currentQ.question}</h2>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentQ.options?.map((opt) => {
              const isSelected = userAnswers[currentQ.id] === opt;
              const isCorrect = opt === currentQ.correctAnswer;

              let style = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-slate-300';

              if (showExplanation) {
                if (isCorrect) {
                  style = 'bg-emerald-500 text-white border-emerald-600 shadow-md';
                } else if (isSelected && !isCorrect) {
                  style = 'bg-rose-500 text-white border-rose-600';
                } else {
                  style = 'bg-slate-100 border-slate-200 text-slate-400 opacity-60';
                }
              } else if (isSelected) {
                style = 'bg-indigo-600 text-white border-indigo-700 shadow-lg shadow-indigo-200';
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleSelectOption(opt)}
                  disabled={showExplanation}
                  className={`p-5 rounded-2xl border font-bold text-sm sm:text-base text-left transition-all flex items-center justify-between ${style}`}
                >
                  <span>{opt}</span>
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
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-rose-50 border-rose-200 text-rose-950'
            }`}>
              <div className="font-extrabold flex items-center gap-2">
                {userAnswers[currentQ.id] === currentQ.correctAnswer ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Jawapan Betul!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-600" />
                    <span>Jawapan Kurang Tepat. Jawapan betul ialah: {currentQ.correctAnswer}</span>
                  </>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{currentQ.explanation}</p>
            </div>
          )}

          {/* Bottom Action Controls */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
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
            <h2 className="text-3xl font-black text-slate-900">Keputusan Kuiz: {topicTitle}</h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              {feedbackMessage}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <div>
              <div className="text-2xl font-black text-indigo-900">{totalScore} / {totalQuestions}</div>
              <div className="text-xs font-bold text-slate-500">Soalan Betul</div>
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-600">{percentage}%</div>
              <div className="text-xs font-bold text-slate-500">Markah Peratusan</div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <div className="text-2xl font-black text-amber-600">
                {percentage >= 70 ? 'LULUS' : 'MULA'}
              </div>
              <div className="text-xs font-bold text-slate-500">Status Modul</div>
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
