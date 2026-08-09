"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getPreferencePercent, mbtiDimensionPairs } from "@/lib/mbtiTest";
import { mbtiResultInsights } from "@/lib/mbtiResults";
import { mbtiPlaygroundProfiles } from "@/lib/mbtiPlayground";
import { getCompanionCatalogProfile } from "@/lib/companionCatalog";
import { useCompanionStore } from "@/store/companionStore";
import { getCompanionAvatar } from "@/types/companion";
import type { CompanionGender } from "@/types/companion";

const genderOptions: readonly { value: CompanionGender; label: string }[] = [
  { value: "female", label: "女性形象" },
  { value: "male", label: "男性形象" }
];

const themeClass = {
  analyst: "persona-theme-analyst",
  diplomat: "persona-theme-diplomat",
  sentinel: "persona-theme-sentinel",
  explorer: "persona-theme-explorer"
} as const;

export default function ResultPage() {
  const [mounted, setMounted] = useState(false);
  const profile = useCompanionStore((state) => state.profile);
  const testResult = useCompanionStore((state) => state.testResult);
  const setGender = useCompanionStore((state) => state.setGender);
  const syncLegacyProfile = useCompanionStore((state) => state.syncLegacyProfile);

  useEffect(() => {
    setMounted(true);
    syncLegacyProfile();
  }, [syncLegacyProfile]);

  if (!mounted) return <main className="v3-page persona-universe" />;

  if (!profile) {
    return (
      <main className="v3-page persona-universe px-4 py-20 text-center sm:px-6">
        <p className="v3-kicker">EXPLORATION REPORT</p>
        <h1 className="v3-title mt-3 text-3xl">还没有可展示的人格探索结果</h1>
        <p className="v3-muted mx-auto mt-4 max-w-xl text-sm">
          完成 40 个生活情景后，你会在这里看到六项行为倾向、成长画像与 MBTI 参考坐标。
        </p>
        <Link href="/test" className="v3-button-primary mt-8">开始自我探索</Link>
      </main>
    );
  }

  const playgroundProfile = mbtiPlaygroundProfiles[profile.mbti];
  const companionProfile = getCompanionCatalogProfile(profile.mbti);
  const insight = mbtiResultInsights[profile.mbti];
  const explorationReport = testResult?.explorationReport;

  return (
    <main className={`v3-page persona-universe persona-atmosphere ${themeClass[companionProfile.group]}`}>
      <section className="border-b border-white/10">
        <div className="v3-shell grid gap-8 py-9 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:py-14">
          <div>
            <p className="v3-kicker">PERSONALITY EXPLORATION · {companionProfile.groupLabel}</p>
            <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-2">
              <h1 className="v3-title text-5xl sm:text-7xl">{profile.mbti}</h1>
              <p className="text-xl font-semibold text-[var(--persona-accent)]">「{companionProfile.universeTitle}」</p>
            </div>
            <p className="mt-4 text-sm font-semibold text-[var(--ink)] sm:text-base">
              {explorationReport ? `你的主要倾向：${explorationReport.primaryPattern}` : "MBTI 参考坐标"}
            </p>
            <p className="v3-muted mt-3 max-w-2xl text-base sm:text-lg">{insight.summary}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {(explorationReport?.coreTendencies ?? playgroundProfile.keywords).map((keyword) => (
                <span key={keyword} className="v3-chip border-[var(--persona-glow)] bg-[var(--persona-soft)] text-[var(--persona-accent)]">{keyword}</span>
              ))}
            </div>

            <div className="mt-8 max-w-2xl border-t border-white/10 pt-6">
              <p className="text-xs font-bold text-[var(--ink-faint)]">MBTI 参考坐标</p>
              <div className="mt-5 space-y-4">
                {mbtiDimensionPairs.map((dimension) => {
                  const leftPercent = testResult ? getPreferencePercent(testResult.scores, dimension.left) : 50;
                  const rightPercent = 100 - leftPercent;
                  return (
                    <div key={dimension.key}>
                      <div className="flex items-center justify-between text-xs font-semibold text-[var(--ink-soft)] sm:text-sm">
                        <span>{dimension.left} · {dimension.leftLabel} {leftPercent}%</span>
                        <span>{rightPercent}% {dimension.rightLabel} · {dimension.right}</span>
                      </div>
                      <div className="mt-2 flex h-1.5 overflow-hidden rounded-full bg-white/10">
                        <span className="h-full bg-white/35" style={{ width: `${leftPercent}%` }} />
                        <span className="h-full bg-[var(--persona-accent)]" style={{ width: `${rightPercent}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              {!testResult && (
                <p className="mt-4 text-xs leading-5 text-[var(--ink-faint)]">
                  这是旧版本保留的人格类型；重新探索后可查看完整六项画像。
                </p>
              )}
            </div>
          </div>

          <div className="universe-glass relative min-h-[360px] overflow-hidden rounded-lg bg-[var(--persona-soft)] sm:min-h-[460px]">
            <div className="absolute inset-x-12 bottom-7 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" aria-hidden="true" />
            <Image
              src={getCompanionAvatar(profile.mbti, profile.gender)}
              alt={`${profile.mbti} ${companionProfile.universeTitle}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="universe-avatar object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#080a14]/90 to-transparent px-5 pb-5 pt-20">
              <p className="text-sm font-semibold text-white/80">{playgroundProfile.title}</p>
              <p className="mt-1 text-2xl font-semibold text-white">{companionProfile.universeTitle}</p>
            </div>
          </div>
        </div>
      </section>

      {explorationReport && (
        <section className="v3-shell border-b border-white/10 py-10 sm:py-14">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="v3-kicker">SIX EXPLORATION AXES</p>
              <h2 className="v3-title mt-2 text-2xl sm:text-3xl">六项真实选择倾向</h2>
            </div>
            <p className="v3-muted max-w-md text-sm">比例表示本次 40 个情景中的相对倾向，不是能力高低，也不是固定诊断。</p>
          </div>
          <div className="mt-8 grid gap-x-10 gap-y-6 lg:grid-cols-2">
            {explorationReport.axes.map((axis) => (
              <article key={axis.id} className="border-t border-white/12 pt-4">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-sm font-semibold text-[var(--ink)]">{axis.label}</h3>
                  <span className="text-xs text-[var(--ink-faint)]">
                    {axis.leftPercent >= axis.rightPercent ? axis.leftLabel : axis.rightLabel}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs font-semibold text-[var(--ink-soft)]">
                  <span>{axis.leftLabel} {axis.leftPercent}%</span>
                  <span>{axis.rightPercent}% {axis.rightLabel}</span>
                </div>
                <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-white/10">
                  <span className="h-full bg-white/30" style={{ width: `${axis.leftPercent}%` }} />
                  <span className="h-full bg-[var(--persona-accent)]" style={{ width: `${axis.rightPercent}%` }} />
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="v3-shell py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="v3-kicker">CHOOSE YOUR COMPANION</p>
            <h2 className="v3-title mt-2 text-2xl sm:text-3xl">选择陪你继续探索的形象</h2>
            <p className="v3-muted mt-3 text-sm">两种形象共享同一套 {profile.mbti} 人格逻辑，只改变伙伴的视觉表达。</p>

            <div className="mt-7 grid grid-cols-2 gap-3">
              {genderOptions.map((option) => {
                const selected = profile.gender === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setGender(option.value)}
                    aria-pressed={selected}
                    data-selected={selected}
                    className="persona-story-card overflow-hidden text-left"
                  >
                    <div className="relative aspect-square bg-[var(--persona-soft)]">
                      <Image src={getCompanionAvatar(profile.mbti, option.value)} alt={`${profile.mbti} ${option.label}`} fill sizes="(max-width: 640px) 46vw, 260px" className="object-cover" />
                    </div>
                    <div className="flex items-center justify-between gap-2 px-3 py-3">
                      <span className="text-sm font-semibold text-[var(--ink)]">{option.label}</span>
                      <span className={`h-3 w-3 rounded-full border ${selected ? "border-[var(--persona-accent)] bg-[var(--persona-accent)]" : "border-white/30"}`} aria-hidden="true" />
                    </div>
                  </button>
                );
              })}
            </div>

            <Link href={`/companion?mbti=${profile.mbti}&gender=${profile.gender}`} className="v3-button-primary mt-6 w-full">
              与 {profile.mbti} 人格伙伴开始对话
            </Link>
            <Link href="/test" className="mt-3 inline-flex min-h-11 w-full items-center justify-center text-sm font-semibold text-[var(--ink-faint)] hover:text-white">重新探索</Link>
          </div>

          <div className="border-y border-white/12">
            <article className="grid gap-4 border-b border-white/10 py-6 sm:grid-cols-[9rem_1fr]">
              <h3 className="text-sm font-bold text-[var(--persona-accent)]">核心倾向</h3>
              <div className="flex flex-wrap gap-2">
                {(explorationReport?.coreTendencies ?? insight.strengths).map((strength) => <span key={strength} className="v3-chip">{strength}</span>)}
              </div>
            </article>
            <article className="grid gap-3 border-b border-white/10 py-6 sm:grid-cols-[9rem_1fr]">
              <h3 className="text-sm font-bold text-[var(--ink)]">决策方式</h3>
              <p className="text-sm leading-7 text-[var(--ink-soft)]">{explorationReport?.decisionStyle ?? insight.summary}</p>
            </article>
            <article className="grid gap-3 border-b border-white/10 py-6 sm:grid-cols-[9rem_1fr]">
              <h3 className="text-sm font-bold text-[var(--ink)]">沟通模式</h3>
              <p className="text-sm leading-7 text-[var(--ink-soft)]">{explorationReport?.communicationStyle ?? insight.relationship}</p>
            </article>
            <article className="grid gap-3 border-b border-white/10 py-6 sm:grid-cols-[9rem_1fr]">
              <h3 className="text-sm font-bold text-[var(--ink)]">压力反应</h3>
              <p className="text-sm leading-7 text-[var(--ink-soft)]">{explorationReport?.stressResponse ?? insight.underPressure}</p>
            </article>
            <article className="grid gap-3 border-b border-white/10 py-6 sm:grid-cols-[9rem_1fr]">
              <h3 className="text-sm font-bold text-[var(--ink)]">关系特点</h3>
              <p className="text-sm leading-7 text-[var(--ink-soft)]">{explorationReport?.relationshipPattern ?? insight.relationship}</p>
            </article>
            <article className="grid gap-3 py-6 sm:grid-cols-[9rem_1fr]">
              <h3 className="text-sm font-bold text-[var(--ink)]">成长建议</h3>
              {explorationReport ? (
                <div className="space-y-3">
                  {explorationReport.growthSuggestions.map((suggestion, index) => (
                    <p key={suggestion} className="text-sm leading-7 text-[var(--ink-soft)]">
                      <span className="mr-2 font-semibold text-[var(--persona-accent)]">0{index + 1}</span>{suggestion}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-base font-semibold leading-7 text-[var(--ink)]">{insight.reflection}</p>
              )}
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
