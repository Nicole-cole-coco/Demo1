"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getCompanionCatalogProfile } from "@/lib/companionCatalog";
import { getLabScenario, labScenarios } from "@/lib/labScenarios";
import {
  applyRelationshipDelta,
  getRelationshipMood,
  normalizeRelationshipState,
  relationshipMetricMeta,
  resolveScenarioStage
} from "@/lib/labScoring";
import { useExplorationStore } from "@/store/explorationStore";
import { useLabStore } from "@/store/labStore";
import { mbtiTypes, type MbtiType } from "@/types/avatar";
import { getCompanionAvatar, type CompanionGender } from "@/types/companion";
import type {
  ChallengeLevel,
  LabScenarioId,
  RelationshipMetric,
  ScenarioOption
} from "@/types/lab";

const scenarioTone: Record<LabScenarioId, { border: string; badge: string }> = {
  "intp-everyday-connection": {
    border: "border-t-violet-400",
    badge: "border-violet-300/25 bg-violet-400/10 text-violet-200"
  },
  "isfj-roommate-friction": {
    border: "border-t-cyan-400",
    badge: "border-cyan-300/25 bg-cyan-400/10 text-cyan-200"
  },
  "enfp-future-values-journey": {
    border: "border-t-amber-400",
    badge: "border-amber-300/25 bg-amber-400/10 text-amber-200"
  },
  "infj-trust-journey": {
    border: "border-t-emerald-400",
    badge: "border-emerald-300/25 bg-emerald-400/10 text-emerald-200"
  },
  "enfp-love-freedom": {
    border: "border-t-emerald-500",
    badge: "border-emerald-300/25 bg-emerald-400/10 text-emerald-200"
  },
  "intj-emotional-needs": {
    border: "border-t-indigo-400",
    badge: "border-indigo-300/25 bg-indigo-400/10 text-indigo-200"
  },
  "intp-emotional-expression": {
    border: "border-t-violet-400",
    badge: "border-violet-300/25 bg-violet-400/10 text-violet-200"
  },
  "infp-values-reality": {
    border: "border-t-rose-400",
    badge: "border-rose-300/25 bg-rose-400/10 text-rose-200"
  },
  "enfj-care-boundary": {
    border: "border-t-emerald-400",
    badge: "border-emerald-300/25 bg-emerald-400/10 text-emerald-200"
  },
  "istj-plan-change": {
    border: "border-t-blue-400",
    badge: "border-blue-300/25 bg-blue-400/10 text-blue-200"
  },
  "isfj-unseen-care": {
    border: "border-t-cyan-400",
    badge: "border-cyan-300/25 bg-cyan-400/10 text-cyan-200"
  },
  "estj-management-conflict": {
    border: "border-t-sky-400",
    badge: "border-sky-300/25 bg-sky-400/10 text-sky-200"
  },
  "esfj-independent-choice": {
    border: "border-t-amber-400",
    badge: "border-amber-300/25 bg-amber-400/10 text-amber-200"
  },
  "istp-silent-conflict": {
    border: "border-t-slate-400",
    badge: "border-slate-300/25 bg-slate-400/10 text-slate-200"
  },
  "isfp-authenticity-pressure": {
    border: "border-t-pink-400",
    badge: "border-pink-300/25 bg-pink-400/10 text-pink-200"
  },
  "estp-impulsive-decision": {
    border: "border-t-orange-400",
    badge: "border-orange-300/25 bg-orange-400/10 text-orange-200"
  },
  "esfp-long-support": {
    border: "border-t-yellow-400",
    badge: "border-yellow-300/25 bg-yellow-400/10 text-yellow-200"
  },
  "intj-friend-misunderstanding": {
    border: "border-t-violet-500",
    badge: "border-violet-300/25 bg-violet-400/10 text-violet-200"
  },
  "infj-relationship-boundary": {
    border: "border-t-teal-500",
    badge: "border-teal-300/25 bg-teal-400/10 text-teal-200"
  },
  "entj-workplace-pressure": {
    border: "border-t-sky-500",
    badge: "border-sky-300/25 bg-sky-400/10 text-sky-200"
  },
  "entp-value-conflict": {
    border: "border-t-fuchsia-500",
    badge: "border-fuchsia-300/25 bg-fuchsia-400/10 text-fuchsia-200"
  },
  "isfp-first-date": {
    border: "border-t-amber-400",
    badge: "border-amber-300/25 bg-amber-400/10 text-amber-200"
  },
  "isfj-family-conflict": {
    border: "border-t-cyan-400",
    badge: "border-cyan-300/25 bg-cyan-400/10 text-cyan-200"
  },
  "estj-team-failure": {
    border: "border-t-blue-400",
    badge: "border-blue-300/25 bg-blue-400/10 text-blue-200"
  }
};

const scenarioBackdrop: Record<LabScenarioId, string> = {
  "intp-everyday-connection": "/scenes/rainy-cafe-v1.webp",
  "isfj-roommate-friction": "/scenes/botanical-room-v1.webp",
  "enfp-future-values-journey": "/scenes/night-city-v1.webp",
  "infj-trust-journey": "/scenes/night-city-v1.webp",
  "enfp-love-freedom": "/scenes/night-city-v1.webp",
  "intj-emotional-needs": "/scenes/night-city-v1.webp",
  "intp-emotional-expression": "/scenes/rainy-cafe-v1.webp",
  "infp-values-reality": "/scenes/botanical-room-v1.webp",
  "enfj-care-boundary": "/scenes/botanical-room-v1.webp",
  "istj-plan-change": "/scenes/future-office-v1.webp",
  "isfj-unseen-care": "/scenes/botanical-room-v1.webp",
  "estj-management-conflict": "/scenes/future-office-v1.webp",
  "esfj-independent-choice": "/scenes/rainy-cafe-v1.webp",
  "istp-silent-conflict": "/scenes/night-city-v1.webp",
  "isfp-authenticity-pressure": "/scenes/botanical-room-v1.webp",
  "estp-impulsive-decision": "/scenes/night-city-v1.webp",
  "esfp-long-support": "/scenes/rainy-cafe-v1.webp",
  "intj-friend-misunderstanding": "/scenes/rainy-cafe-v1.webp",
  "infj-relationship-boundary": "/scenes/botanical-room-v1.webp",
  "entj-workplace-pressure": "/scenes/future-office-v1.webp",
  "entp-value-conflict": "/scenes/rainy-cafe-v1.webp",
  "isfp-first-date": "/scenes/rainy-cafe-v1.webp",
  "isfj-family-conflict": "/scenes/botanical-room-v1.webp",
  "estj-team-failure": "/scenes/future-office-v1.webp"
};

const themeClass = {
  analyst: "persona-theme-analyst",
  diplomat: "persona-theme-diplomat",
  sentinel: "persona-theme-sentinel",
  explorer: "persona-theme-explorer"
} as const;

const relationshipMetrics: RelationshipMetric[] = [
  "trust",
  "emotionalConnection",
  "communication",
  "conflictLevel",
  "understanding"
];

const relationshipTone: Record<
  ReturnType<typeof getRelationshipMood>,
  { label: string; image: string; overlay: string; avatar: string }
> = {
  connected: {
    label: "连接回暖",
    image: "opacity-70 saturate-125",
    overlay: "bg-[linear-gradient(180deg,rgba(8,10,20,0.62),rgba(8,10,20,0.34)_35%,rgba(8,10,20,0.82))]",
    avatar: "saturate-110"
  },
  stable: {
    label: "仍可沟通",
    image: "opacity-55 saturate-100",
    overlay: "bg-[linear-gradient(180deg,rgba(8,10,20,0.74),rgba(8,10,20,0.5)_35%,rgba(8,10,20,0.9))]",
    avatar: "saturate-100"
  },
  strained: {
    label: "关系紧绷",
    image: "opacity-45 saturate-75",
    overlay: "bg-[linear-gradient(180deg,rgba(12,9,20,0.82),rgba(16,10,21,0.64)_35%,rgba(8,8,18,0.94))]",
    avatar: "saturate-75"
  },
  critical: {
    label: "临界状态",
    image: "opacity-35 saturate-50",
    overlay: "bg-[linear-gradient(180deg,rgba(18,7,14,0.88),rgba(22,8,16,0.72)_35%,rgba(6,7,15,0.96))]",
    avatar: "saturate-50 brightness-75"
  }
};

const difficultyLevels: Array<{ value: "all" | ChallengeLevel; label: string }> = [
  { value: "all", label: "全部" },
  { value: 1, label: "普通交流" },
  { value: 2, label: "轻微冲突" },
  { value: 3, label: "价值冲突" },
  { value: 4, label: "关系危机" }
];

function getRelationshipStateLabel(metric: RelationshipMetric, value: number) {
  if (metric === "conflictLevel") {
    if (value >= 65) return "压力很高";
    if (value >= 42) return "正在升温";
    return "相对平稳";
  }
  if (value >= 68) return "连接稳固";
  if (value >= 45) return "仍有空间";
  return "较为脆弱";
}

export default function LabExperience() {
  const [mounted, setMounted] = useState(false);
  const [gender, setGender] = useState<CompanionGender>("female");
  const [difficulty, setDifficulty] = useState<"all" | ChallengeLevel>("all");
  const [personalityFilter, setPersonalityFilter] = useState<"all" | MbtiType>("all");
  const [pendingOption, setPendingOption] = useState<ScenarioOption | null>(null);
  const [generatedReaction, setGeneratedReaction] = useState<string | null>(null);
  const [isGeneratingReaction, setIsGeneratingReaction] = useState(false);
  const router = useRouter();
  const companionGender = useExplorationStore((state) => state.selectedCompanion.gender);
  const activeSession = useLabStore((state) => state.activeSession);
  const startScenario = useLabStore((state) => state.startScenario);
  const chooseOption = useLabStore((state) => state.chooseOption);
  const resetSession = useLabStore((state) => state.resetSession);

  useEffect(() => {
    setMounted(true);
    setGender(companionGender);
  }, [companionGender]);

  useEffect(() => {
    setPendingOption(null);
    setGeneratedReaction(null);
    setIsGeneratingReaction(false);
  }, [activeSession?.currentStageId]);

  const activeData = useMemo(() => {
    if (!activeSession) return null;
    const scenario = getLabScenario(activeSession.scenarioId);
    const stage = scenario.stages.find((item) => item.id === activeSession.currentStageId);
    if (!stage) return null;
    return { scenario, stage };
  }, [activeSession]);

  const filteredScenarios = useMemo(
    () => labScenarios.filter((scenario) =>
      (difficulty === "all" || scenario.difficulty === difficulty) &&
      (personalityFilter === "all" || scenario.targetMbtis.includes(personalityFilter))
    ),
    [difficulty, personalityFilter]
  );

  if (!mounted) return <main className="v3-page" />;

  if (activeSession && activeData) {
    const { scenario, stage } = activeData;
    const targetMbti = activeSession.targetMbti ?? scenario.targetMbti;
    const profile = getCompanionCatalogProfile(targetMbti);
    const stageIndex = scenario.stages.findIndex((item) => item.id === stage.id);
    const progress = ((stageIndex + 1) / scenario.stages.length) * 100;
    const relationshipState = normalizeRelationshipState(
      activeSession.relationshipState ?? scenario.initialRelationshipState
    );
    const resolvedStage = resolveScenarioStage(stage, relationshipState, targetMbti);
    const previewRelationshipState = pendingOption
      ? applyRelationshipDelta(relationshipState, pendingOption.relationshipDelta)
      : relationshipState;
    const relationshipMood = getRelationshipMood(previewRelationshipState);
    const moodTone = relationshipTone[relationshipMood];
    const scriptedReaction = pendingOption
      ? pendingOption.reactions?.[targetMbti] ?? pendingOption.reaction
      : "";
    const resolvedReaction = generatedReaction ?? scriptedReaction;

    const selectStoryOption = async (option: ScenarioOption) => {
      setPendingOption(option);
      setGeneratedReaction(null);
      setIsGeneratingReaction(true);
      const fallback = option.reactions?.[targetMbti] ?? option.reaction;

      try {
        const nextRelationshipState = applyRelationshipDelta(
          relationshipState,
          option.relationshipDelta
        );
        const response = await fetch("/api/lab/reaction", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            scenarioId: scenario.id,
            stageId: stage.id,
            optionId: option.id,
            mbti: targetMbti,
            story: resolvedStage.story,
            characterMessage: resolvedStage.targetLine,
            relationshipState: nextRelationshipState,
            history: activeSession.choices.slice(-10).map((choice) => ({
              choice: choice.label,
              reaction: choice.resolvedReaction
            }))
          })
        });
        const payload = (await response.json()) as { reply?: string };
        setGeneratedReaction(response.ok && payload.reply ? payload.reply : fallback);
      } catch {
        setGeneratedReaction(fallback);
      } finally {
        setIsGeneratingReaction(false);
      }
    };

    const continueStory = () => {
      if (!pendingOption || isGeneratingReaction) return;
      const report = chooseOption(pendingOption.id, resolvedReaction);
      if (report) router.push("/report");
    };

    return (
      <main className={`v3-page persona-universe persona-atmosphere relative ${themeClass[profile.group]}`}>
        <div className="absolute inset-0 z-0">
          <Image
            src={scenarioBackdrop[scenario.id]}
            alt=""
            fill
            priority
            sizes="100vw"
            className={`object-cover transition duration-700 ${moodTone.image}`}
          />
          <div className={`absolute inset-0 transition duration-700 ${moodTone.overlay}`} />
        </div>
        <div className="v3-shell relative z-10 py-6 lg:py-8">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--line-strong)] pb-5">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="v3-kicker">
                  {stage.chapter ? `Chapter ${stage.chapter} · ${stage.chapterTitle ?? "剧情推进"} · ` : "关系实验 · "}节点 {stage.round}
                </p>
                <span className="rounded border border-white/15 bg-white/6 px-2 py-1 text-[10px] font-bold text-[var(--ink-soft)]">
                  Level {scenario.difficulty} · {scenario.difficultyLabel}
                </span>
              </div>
              <h1 className="v3-title mt-2 text-2xl sm:text-3xl">{scenario.title}</h1>
              <p className="mt-2 text-sm text-[var(--ink-soft)]">{scenario.relationship} · {scenario.theme}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setPendingOption(null);
                resetSession();
              }}
              className="v3-button-secondary"
            >
              退出本轮
            </button>
          </div>

          <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/10" aria-label={`实验进度 ${stage.round}/${scenario.stages.length}`}>
            <div className="h-full rounded-full bg-[linear-gradient(90deg,var(--persona-deep),var(--persona-accent),rgba(255,255,255,0.85))] transition-[width] duration-300" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-2 flex justify-between text-xs font-semibold text-[var(--ink-faint)]">
            <span>{stage.beat ?? `情节 ${stage.round}`}</span>
            <span>{stage.round} / {scenario.stages.length} 节点</span>
          </div>

          <div className="mt-6 grid items-end gap-5 lg:grid-cols-[18rem_minmax(0,1fr)]">
            <aside className="universe-glass hidden overflow-hidden rounded-lg lg:block lg:self-start">
              <div className="relative aspect-[4/5] max-h-[420px] bg-[var(--persona-soft)]">
                <Image
                  src={getCompanionAvatar(targetMbti, activeSession.targetGender)}
                  alt={`${targetMbti} ${profile.title}`}
                  fill
                  priority
                  sizes="288px"
                  className={`universe-avatar object-cover transition duration-700 ${moodTone.avatar}`}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent px-5 pb-4 pt-14 text-white">
                  <p className="text-xs font-semibold text-white/75">互动对象</p>
                  <h2 className="mt-1 text-xl font-semibold">{targetMbti} · {profile.universeTitle}</h2>
                </div>
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-2">
                  {profile.tags.map((tag) => <span key={tag} className="v3-chip">{tag}</span>)}
                </div>
                <p className="mt-4 text-sm leading-7 text-[var(--ink-soft)]">{scenario.initialConflict}</p>
                <div className="mt-5 border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-bold text-[var(--ink-soft)]">关系气候</p>
                    <span className="text-xs font-bold text-[var(--persona-accent)]">{moodTone.label}</span>
                  </div>
                  <div className="mt-4 space-y-3">
                    {relationshipMetrics.map((metric) => {
                      const value = previewRelationshipState[metric];
                      return (
                        <div key={metric}>
                          <div className="flex items-center justify-between gap-2 text-[11px]">
                            <span className="font-semibold text-[var(--ink-soft)]">{relationshipMetricMeta[metric].label}</span>
                            <span className="text-[var(--ink-faint)]">{getRelationshipStateLabel(metric, value)}</span>
                          </div>
                          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/10">
                            <div
                              className={`h-full rounded-full transition-[width] duration-500 ${metric === "conflictLevel" ? "bg-rose-400" : "bg-[var(--persona-accent)]"}`}
                              style={{ width: `${value}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </aside>

            <section className="universe-glass overflow-hidden rounded-lg">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-black/15 px-4 py-3 lg:hidden">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-white/20 bg-[var(--persona-soft)]">
                    <Image
                      src={getCompanionAvatar(targetMbti, activeSession.targetGender)}
                      alt=""
                      fill
                      sizes="56px"
                      className={`universe-avatar object-cover ${moodTone.avatar}`}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-white">{targetMbti} · {profile.universeTitle}</p>
                    <p className="mt-1 text-xs text-[var(--ink-soft)]">关系气候 · <span className="font-bold text-[var(--persona-accent)]">{moodTone.label}</span></p>
                  </div>
                </div>
                <span className="shrink-0 text-xs font-semibold text-[var(--ink-faint)]">{stage.round}/{scenario.stages.length}</span>
              </div>
              <div className="border-b border-white/10 bg-[var(--persona-soft)] px-5 py-6 sm:px-7">
                {resolvedStage.story && (
                  <p className="mb-5 border-l-2 border-white/20 pl-4 text-sm leading-7 text-[var(--ink-soft)]">
                    {resolvedStage.story}
                  </p>
                )}
                <p className="text-xs font-bold text-[var(--persona-accent)]">{targetMbti} 说</p>
                <p className="mt-3 text-lg font-medium leading-8 text-[var(--ink)] sm:text-xl">“{resolvedStage.targetLine}”</p>
              </div>
              <div className="px-5 py-6 sm:px-7 sm:py-7">
                <h3 className="text-base font-semibold text-[var(--ink)]">{resolvedStage.prompt}</h3>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {stage.options.map((option, index) => {
                    const selected = pendingOption?.id === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        disabled={Boolean(pendingOption)}
                        onClick={() => void selectStoryOption(option)}
                        className={`group min-h-20 rounded-md border p-4 text-left transition disabled:cursor-default sm:min-h-28 ${
                          selected
                            ? "border-[var(--persona-accent)] bg-[var(--persona-soft)] shadow-[0_0_0_3px_var(--persona-glow)]"
                            : pendingOption
                              ? "border-white/10 bg-white/4 opacity-40"
                              : "border-white/12 bg-white/5 hover:-translate-y-0.5 hover:border-[var(--persona-accent)] hover:bg-[var(--persona-soft)] hover:shadow-md"
                        }`}
                      >
                        <span className={`grid h-7 w-7 place-items-center rounded text-xs font-bold transition ${selected ? "bg-[var(--persona-deep)] text-white" : "bg-[var(--surface-muted)] text-[var(--ink-soft)] group-hover:bg-[var(--persona-deep)] group-hover:text-white"}`}>
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="mt-3 block text-sm font-semibold leading-6 text-[var(--ink)]">
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {pendingOption && (
                  <div className="v3-enter mt-5 border-t border-[var(--line)] pt-5">
                    <div className="border-l-2 border-[var(--persona-accent)] bg-[var(--persona-soft)] p-4">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-[var(--persona-accent)]">{targetMbti} 的回应</p>
                        {isGeneratingReaction && (
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--persona-accent)]" />
                        )}
                      </div>
                      <p className="mt-2 min-h-7 text-sm leading-7 text-[var(--ink)]">
                        {isGeneratingReaction ? "对方停了一下，像是在斟酌怎么开口……" : resolvedReaction}
                      </p>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap gap-2">
                        {pendingOption.intentTags.map((tag) => <span key={tag} className="v3-chip">{tag}</span>)}
                      </div>
                      <button
                        type="button"
                        onClick={continueStory}
                        disabled={isGeneratingReaction}
                        className="v3-button-primary disabled:cursor-wait disabled:opacity-55"
                      >
                        {isGeneratingReaction
                          ? "等待回应"
                          : pendingOption.nextStage
                            ? "继续剧情"
                            : "生成本轮报告"}
                      </button>
                    </div>
                  </div>
                )}

                {activeSession.choices.length > 0 && !pendingOption && (
                  <p className="mt-5 text-xs text-[var(--ink-faint)]">故事已推进 {activeSession.choices.length} 个关键节点</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="v3-page persona-universe">
      <div className="v3-shell py-9 sm:py-12">
        <div className="flex flex-col justify-between gap-5 border-b border-[var(--line-strong)] pb-7 sm:flex-row sm:items-end">
          <div className="max-w-3xl">
            <p className="v3-kicker">人格关系实验室</p>
            <h1 className="v3-title mt-3 text-3xl sm:text-5xl">在剧情里观察沟通如何发生</h1>
            <p className="v3-muted mt-4 text-base">
              16 种人格，{labScenarios.length} 条连续关系剧情。每个回应都会改变后续气氛与人物选择；分析只在故事结束后出现。
            </p>
          </div>
          <div className="inline-grid w-fit grid-cols-2 rounded-md border border-white/15 bg-white/5 p-1 shadow-sm" aria-label="实验角色头像性别">
            {(["female", "male"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setGender(option)}
                aria-pressed={gender === option}
                className={`h-9 min-w-20 rounded px-4 text-sm font-bold transition ${
                  gender === option
                    ? "bg-white/14 text-white"
                    : "text-[var(--ink-soft)] hover:bg-white/7 hover:text-white"
                }`}
              >
                {option === "female" ? "女性角色" : "男性角色"}
              </button>
            ))}
          </div>
        </div>

        <div className="mobile-snap-row mt-6 flex snap-x items-center gap-2 overflow-x-auto pb-2" aria-label="剧情挑战等级">
          <span className="mr-1 text-xs font-semibold text-[var(--ink-faint)]">挑战等级</span>
          {difficultyLevels.map((level) => (
            <button
              key={level.value}
              type="button"
              onClick={() => setDifficulty(level.value)}
              aria-pressed={difficulty === level.value}
              className={`min-h-10 shrink-0 snap-start rounded border px-3 text-xs font-bold transition ${
                difficulty === level.value
                  ? "border-[var(--persona-accent)] bg-[var(--persona-soft)] text-[var(--persona-accent)]"
                  : "border-white/10 bg-white/4 text-[var(--ink-soft)] hover:border-white/25 hover:text-white"
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>

        <div className="mobile-snap-row mt-3 flex snap-x items-center gap-2 overflow-x-auto pb-2" aria-label="按人格筛选剧情">
          <span className="mr-1 text-xs font-semibold text-[var(--ink-faint)]">人格</span>
          <button
            type="button"
            onClick={() => setPersonalityFilter("all")}
            aria-pressed={personalityFilter === "all"}
            className={`min-h-10 shrink-0 snap-start rounded border px-3 text-xs font-bold transition ${
              personalityFilter === "all"
                ? "border-[var(--persona-accent)] bg-[var(--persona-soft)] text-[var(--persona-accent)]"
                : "border-white/10 bg-white/4 text-[var(--ink-soft)] hover:border-white/25 hover:text-white"
            }`}
          >
            16 型全部
          </button>
          {mbtiTypes.map((mbti) => (
            <button
              key={mbti}
              type="button"
              onClick={() => setPersonalityFilter(mbti)}
              aria-pressed={personalityFilter === mbti}
              className={`min-h-10 shrink-0 snap-start rounded border px-3 text-xs font-bold transition ${
                personalityFilter === mbti
                  ? "border-[var(--persona-accent)] bg-[var(--persona-soft)] text-[var(--persona-accent)]"
                  : "border-white/10 bg-white/4 text-[var(--ink-soft)] hover:border-white/25 hover:text-white"
              }`}
            >
              {mbti}
            </button>
          ))}
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2">
          {filteredScenarios.map((scenario) => {
            const tone = scenarioTone[scenario.id];
            const flagship = scenario.stages.length >= 20;
            return (
              <article
                key={scenario.id}
                className={`universe-glass v3-interactive group overflow-hidden rounded-lg border-t-4 text-left ${tone.border} ${flagship ? "md:col-span-2" : ""}`}
              >
                <div className={`relative overflow-hidden bg-white/5 ${flagship ? "aspect-[4/3] sm:aspect-[16/7]" : "aspect-[4/3] sm:aspect-[16/8]"}`}>
                  <Image
                    src={scenarioBackdrop[scenario.id]}
                    alt={`${scenario.title}场景`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.025]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c18] via-[#0a0c18]/20 to-transparent" />
                  <div className="absolute bottom-3 left-4 flex -space-x-2">
                    {scenario.targetMbtis.map((target) => {
                      const targetProfile = getCompanionCatalogProfile(target);
                      return (
                      <div key={target} className="relative h-12 w-12 overflow-hidden rounded-md border border-white/35 bg-white/10 shadow-lg">
                        <Image
                          src={getCompanionAvatar(target, gender)}
                          alt={`${target} ${targetProfile.title}`}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      );
                    })}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-2">
                      <span className={`rounded border px-2.5 py-1 text-xs font-bold ${tone.badge}`}>
                        {scenario.relationship}
                      </span>
                      <span className="rounded border border-white/12 bg-white/5 px-2.5 py-1 text-xs font-bold text-[var(--ink-soft)]">
                        Level {scenario.difficulty}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-[var(--ink-faint)]">{flagship ? "八章体验 · " : ""}{scenario.difficultyLabel} · {scenario.stages.length} 节点</span>
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-[var(--ink)]">{scenario.title}</h2>
                  <p className="mt-1 text-sm font-semibold text-[var(--ink-soft)]">{scenario.theme}</p>
                  <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">{scenario.summary}</p>
                  <div className={`mt-4 grid gap-2 ${scenario.targetMbtis.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                    {scenario.targetMbtis.map((target) => (
                      <button
                        key={target}
                        type="button"
                        onClick={() => startScenario(scenario.id, gender, target)}
                        className="v3-button-primary min-h-10 px-3 text-xs"
                      >
                        与 {target} 进入
                      </button>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <Link href="/companion" className="v3-button-secondary">返回日常陪伴</Link>
        </div>
      </div>
    </main>
  );
}
