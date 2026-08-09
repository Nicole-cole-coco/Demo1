"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { calculateMbtiResult, mbtiTestQuestions } from "@/lib/mbtiTest";
import { useCompanionStore } from "@/store/companionStore";

export default function TestPage() {
  const router = useRouter();
  const setTestResult = useCompanionStore((state) => state.setTestResult);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);

  const question = mbtiTestQuestions[questionIndex];
  const progress = ((questionIndex + 1) / mbtiTestQuestions.length) * 100;

  const choose = (choiceId: string) => {
    if (selectedChoiceId) return;

    const nextAnswers = { ...answers, [question.id]: choiceId };
    setAnswers(nextAnswers);
    setSelectedChoiceId(choiceId);

    window.setTimeout(() => {
      if (questionIndex === mbtiTestQuestions.length - 1) {
        setTestResult(calculateMbtiResult(nextAnswers));
        router.push("/result");
        return;
      }

      setQuestionIndex((current) => current + 1);
      setSelectedChoiceId(null);
    }, 220);
  };

  const goBack = () => {
    if (questionIndex === 0 || selectedChoiceId) return;
    setQuestionIndex((current) => current - 1);
    setSelectedChoiceId(null);
  };

  return (
    <main className="v3-page persona-universe persona-theme-diplomat px-4 py-8 sm:px-6 sm:py-12">
      <section className="mx-auto max-w-4xl">
        <div className="flex items-end justify-between gap-5 border-b border-white/15 pb-5">
          <div>
            <p className="v3-kicker">PERSONALITY EXPLORATION</p>
            <h1 className="v3-title mt-2 text-2xl sm:text-3xl">走进生活情景，看见真实的选择倾向</h1>
          </div>
          <p className="shrink-0 text-sm font-semibold text-[var(--ink-faint)]">
            {String(questionIndex + 1).padStart(2, "0")} / {mbtiTestQuestions.length}
          </p>
        </div>

        <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/10" aria-label={`探索进度 ${Math.round(progress)}%`}>
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,var(--energy-blue),var(--energy-green),var(--energy-yellow),var(--energy-purple))] transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div key={question.id} className="universe-glass persona-atmosphere v3-enter mt-8 min-h-[31rem] overflow-hidden rounded-lg px-5 py-7 sm:px-10 sm:py-10">
          <p className="text-xs font-bold text-[var(--persona-accent)]">
            {question.domainLabel} · {question.dimension}
          </p>
          <h2 className="mt-4 max-w-3xl text-2xl font-semibold leading-9 text-[var(--ink)] sm:text-3xl sm:leading-10">
            {question.scenario}
          </h2>
          <p className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">{question.context}</p>

          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            {question.choices.map((option, index) => {
              const isSelected = selectedChoiceId === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  data-choice={option.id}
                  onClick={() => choose(option.id)}
                  disabled={Boolean(selectedChoiceId)}
                  className={`persona-story-card min-h-36 p-5 text-left sm:min-h-44 sm:p-6 ${
                    isSelected
                      ? "border-[var(--persona-accent)] bg-[var(--persona-soft)]"
                      : "hover:border-white/30"
                  }`}
                >
                  <span className="text-xs font-bold text-[var(--persona-accent)]">0{index + 1}</span>
                  <span className="mt-4 block text-lg font-semibold text-[var(--ink)]">{option.label}</span>
                  <span className="mt-2 block text-sm leading-6 text-[var(--ink-soft)]">{option.detail}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex items-center justify-between gap-4 border-t border-white/10 pt-5">
            <button
              type="button"
              onClick={goBack}
              disabled={questionIndex === 0 || Boolean(selectedChoiceId)}
              className="min-h-11 text-sm font-semibold text-[var(--ink-soft)] transition hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              ← 上一幕
            </button>
            <span className="text-right text-xs text-[var(--ink-faint)]">约 8-10 分钟 · 结果仅用于自我探索</span>
          </div>
        </div>
      </section>
    </main>
  );
}
