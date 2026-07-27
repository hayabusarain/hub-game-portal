'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from "@/i18n/routing";
import { Sparkles, ArrowRight, RotateCcw, CheckCircle2 } from "lucide-react";

export default function MobaDiagnosticQuiz() {
  const t = useTranslations('Quiz');
  const [step, setStep] = useState(0); // 0: intro, 1-3: questions, 4: result
  const [score, setScore] = useState(0); // <0 means Hok, >0 means WR

  const questions = [
    {
      q: t('q1'),
      options: [
        { text: t('q1a1'), value: -1 },
        { text: t('q1a2'), value: 1 }
      ]
    },
    {
      q: t('q2'),
      options: [
        { text: t('q2a1'), value: -1 },
        { text: t('q2a2'), value: 1 }
      ]
    },
    {
      q: t('q3'),
      options: [
        { text: t('q3a1'), value: -1 },
        { text: t('q3a2'), value: 1 }
      ]
    }
  ];

  const handleAnswer = (val: number) => {
    setScore(s => s + val);
    setStep(s => s + 1);
  };

  const reset = () => {
    setScore(0);
    setStep(0);
  };

  if (step === 0) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 border border-indigo-100 shadow-sm relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-2 shadow-inner">
            <Sparkles size={24} />
          </div>
          <h3 className="text-xl font-black text-slate-800">{t('title')}</h3>
          <p className="text-sm text-slate-600 font-medium">{t('subtitle')}</p>
          <button 
            onClick={() => setStep(1)}
            className="mt-2 w-full py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {t('start')} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  if (step <= questions.length) {
    const q = questions[step - 1];
    const progress = (step / questions.length) * 100;
    
    return (
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-xs font-black text-slate-400">{step} / {questions.length}</span>
        </div>
        
        <h3 className="text-lg font-black text-slate-800 mb-6 text-center leading-snug">
          {q.q}
        </h3>
        
        <div className="flex flex-col gap-3">
          {q.options.map((opt, i) => (
            <button 
              key={i}
              onClick={() => handleAnswer(opt.value)}
              className="w-full p-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-700 font-bold text-sm text-left hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 transition-all active:scale-[0.98] flex items-center justify-between group"
            >
              {opt.text}
              <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-indigo-500 flex items-center justify-center transition-colors">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 scale-0 group-hover:scale-100 transition-transform"></div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Result
  const isHok = score < 0;
  
  return (
    <div className="bg-white rounded-3xl p-1 overflow-hidden border border-slate-200 shadow-xl shadow-indigo-100/50">
      <div className={`p-6 rounded-[22px] bg-gradient-to-br ${isHok ? 'from-amber-50 to-orange-50' : 'from-indigo-50 to-blue-50'} flex flex-col items-center text-center gap-5 relative`}>
        
        <div className={`absolute top-0 right-0 w-40 h-40 rounded-full mix-blend-overlay filter blur-3xl opacity-60 ${isHok ? 'bg-amber-400' : 'bg-indigo-400'}`}></div>
        
        <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg relative z-10 ${isHok ? 'bg-gradient-to-br from-amber-400 to-orange-500' : 'bg-gradient-to-br from-indigo-500 to-blue-600'} text-white`}>
          <CheckCircle2 size={32} />
        </div>
        
        <div className="relative z-10">
          <h3 className="text-xl font-black text-slate-900 mb-2">
            {isHok ? t('resultHok') : t('resultWr')}
          </h3>
          <p className="text-sm text-slate-600 font-medium leading-relaxed">
            {isHok ? t('resultHokDesc') : t('resultWrDesc')}
          </p>
        </div>
        
        <div className="flex flex-col w-full gap-3 relative z-10 mt-2">
          <Link 
            href={isHok ? "/guides/honor-of-kings" : "/guides/wild-rift"}
            className="w-full py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {t('readGuide')}
          </Link>
          <button 
            onClick={reset}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 py-2 flex items-center justify-center gap-1"
          >
            <RotateCcw size={14} /> もう一度やり直す
          </button>
        </div>
      </div>
    </div>
  );
}
