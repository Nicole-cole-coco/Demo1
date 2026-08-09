"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import CommunicationRadar from "@/components/CommunicationRadar";
import { getCompanionCatalogProfile } from "@/lib/companionCatalog";
import { getLabScenario } from "@/lib/labScenarios";
import {
  buildReportNarrative,
  calculateRelationshipOutcome,
  communicationDimensionMeta,
  getScoreLevel,
  normalizeRelationshipState,
  relationshipMetricMeta
} from "@/lib/labScoring";
import { useLabStore } from "@/store/labStore";
import { getCompanionAvatar } from "@/types/companion";
import {
  communicationDimensionIds,
  type CommunicationDimension,
  type LabScenarioId,
  type RelationshipMetric
} from "@/types/lab";

const dimensionTone: Record<CommunicationDimension, string> = {
  emotionalAcceptance: "bg-emerald-500",
  clarity: "bg-sky-500",
  boundaryAwareness: "bg-violet-500",
  conflictRepair: "bg-rose-400",
  collaboration: "bg-amber-400",
  adaptability: "bg-cyan-400"
};

const themeClass = {
  analyst: "persona-theme-analyst",
  diplomat: "persona-theme-diplomat",
  sentinel: "persona-theme-sentinel",
  explorer: "persona-theme-explorer"
} as const;

const scenarioNextAction: Partial<Record<LabScenarioId, string>> = {
  "intp-everyday-connection": "下一次需要思考空间时，直接说出暂停原因和回来继续交流的时间，让沉默不必被猜测。",
  "isfj-roommate-friction": "选一项最常被默默补位的家务，明确负责人、完成时间和忙碌时的替班方式。",
  "enfp-future-values-journey": "把未来计划拆成不可放弃、可以试行和三个月后重谈三栏，让稳定与变化同时有位置。",
  "infj-trust-journey": "在下一次想说“没关系”时，改为说出一项真实感受和一条具体需要，减少对方靠猜测理解你。",
  "enfp-love-freedom": "把时间分为固定约定、自由时段和可变更事项，并提前约定临时变化如何告知。",
  "intj-emotional-needs": "下一次想立刻给方案时，先用一句话确认感受，再询问对方此刻更需要倾听还是共同解决。",
  "intp-emotional-expression": "下一次需要独处整理时，主动发送一条包含当前状态和返回时间的短消息。",
  "infp-values-reality": "把一项理想目标改写成六周试行：写清现实责任、不可牺牲的价值和退出条件。",
  "enfj-care-boundary": "下一次答应帮助前先确认自己的容量，并给出一个真实可承担的范围。",
  "istj-plan-change": "把共同安排分成关键承诺与可变事项，并约定变化发生时由谁、在何时同步。",
  "isfj-unseen-care": "选择一项默认由你承担的事务，明确提出轮换请求，并允许他人用不同方式完成。",
  "estj-management-conflict": "用一个风险触发点替代高频追问，同时明确结果、权限和升级责任。",
  "esfj-independent-choice": "听取建议前先说明你需要的是信息、陪伴还是反对意见，并保留最终决定权。",
  "istp-silent-conflict": "需要暂停时只说三件事：当前状态、需要的空间、下一次回来沟通的时间。",
  "isfp-authenticity-pressure": "下一次收到建议时，先确认是否愿意听，再区分个人偏好与真正影响共同生活的行为。",
  "estp-impulsive-decision": "为高风险决定设置金额或影响门槛，超过门槛时至少保留一次共同确认。",
  "esfp-long-support": "把陪伴分为日常联系、危机求助和个人休息三种节奏，避免每次都靠临场燃烧。",
  "intj-friend-misunderstanding": "把道歉落实为一项可观察的改变，并约定对朋友不满时先进行直接沟通。",
  "infj-relationship-boundary": "共同约定失联、聚会和情绪低谷时的最低告知方式，同时保留各自隐私。",
  "entj-workplace-pressure": "项目启动时同步确认目标、负责人、资源、风险升级方式和固定检查点。",
  "entp-value-conflict": "下次进入敏感议题前，先确认讨论意愿、时间和不接受被娱乐化的边界。",
  "isfp-first-date": "下一次联系时，表达一个具体感受和一个可拒绝的邀请，让兴趣与空间同时清楚。",
  "isfj-family-conflict": "把一项默认承担的家庭任务改成需要主动询问、可以拒绝并能安排替班的共同责任。",
  "estj-team-failure": "下一轮开始前明确结果负责人、依赖清单和风险升级阈值，让问题更早被看见。"
};

const relationshipMetrics: RelationshipMetric[] = [
  "trust",
  "emotionalConnection",
  "communication",
  "conflictLevel",
  "understanding"
];

const outcomeTone = {
  connected: "border-emerald-300/30 bg-emerald-400/8 text-emerald-200",
  stable: "border-sky-300/30 bg-sky-400/8 text-sky-200",
  strained: "border-amber-300/30 bg-amber-400/8 text-amber-200",
  critical: "border-rose-300/30 bg-rose-400/8 text-rose-200"
} as const;

const phaseTone = {
  improving: "border-emerald-300/35 text-emerald-200",
  stable: "border-sky-300/30 text-sky-200",
  declining: "border-rose-300/35 text-rose-200",
  volatile: "border-amber-300/35 text-amber-200"
} as const;

const phaseToneLabel = {
  improving: "连接上升",
  stable: "保持稳定",
  declining: "距离增加",
  volatile: "关系波动"
} as const;

const keyMomentTone = {
  positive: "border-emerald-300/30 bg-emerald-400/6",
  mixed: "border-amber-300/30 bg-amber-400/6",
  negative: "border-rose-300/30 bg-rose-400/6"
} as const;

export default function LabReportView() {
  const [mounted, setMounted] = useState(false);
  const report = useLabStore((state) => state.latestReport);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <main className="v3-page" />;

  if (!report) {
    return (
      <main className="v3-page persona-universe grid place-items-center px-4 py-12">
        <section className="universe-glass w-full max-w-xl rounded-lg p-8 text-center">
          <p className="v3-kicker">人格档案馆</p>
          <h1 className="v3-title mt-3 text-2xl">还没有本轮互动报告</h1>
          <p className="v3-muted mt-3 text-sm">完成一段关系剧情后，这里会生成基于全部互动节点的沟通分析。</p>
          <Link href="/lab" className="v3-button-primary mt-6">进入关系实验室</Link>
        </section>
      </main>
    );
  }

  const scenario = getLabScenario(report.scenarioId);
  const profile = getCompanionCatalogProfile(report.targetMbti);
  const strongest = report.strongestDimensions.map((dimension) => communicationDimensionMeta[dimension]);
  const growth = communicationDimensionMeta[report.growthDimension];
  const averageScore = Math.round(
    communicationDimensionIds.reduce((total, dimension) => total + report.scores[dimension], 0) /
      communicationDimensionIds.length
  );
  const starCount = Math.max(1, Math.min(5, Math.round(averageScore / 20)));
  const labels = communicationDimensionIds.reduce<Record<CommunicationDimension, string>>(
    (result, dimension) => {
      result[dimension] = communicationDimensionMeta[dimension].label;
      return result;
    },
    {} as Record<CommunicationDimension, string>
  );
  const finalChoiceState = report.choices.at(-1)?.resultingState;
  const relationshipState = normalizeRelationshipState(
    report.relationshipState ?? finalChoiceState ?? scenario.initialRelationshipState
  );
  const relationshipOutcome =
    report.relationshipOutcome ?? calculateRelationshipOutcome(relationshipState);
  const relationshipHistory =
    report.relationshipHistory ??
    report.choices.flatMap((choice) =>
      choice.resultingState
        ? [{ stageId: choice.stageId, state: choice.resultingState, delta: choice.relationshipDelta }]
        : []
    );
  const interactionStyle = report.interactionStyle ?? `${strongest[0]?.label ?? "沟通"}型`;
  const blindSpot = report.blindSpot ?? growth.growth;
  const generatedNarrative = buildReportNarrative(scenario, report.choices, report.scores);
  const relationshipPhases = report.relationshipPhases ?? generatedNarrative.relationshipPhases;
  const keyMoments = report.keyMoments ?? generatedNarrative.keyMoments;
  const communicationInsights = report.communicationInsights ?? generatedNarrative.communicationInsights;
  const growthActions = report.growthActions ?? generatedNarrative.growthActions;

  return (
    <main className={`v3-page persona-universe persona-atmosphere ${themeClass[profile.group]}`}>
      <div className="v3-shell py-7 sm:py-10">
        <section id="persona-dossier" className="persona-dossier universe-glass overflow-hidden rounded-lg">
          <div className="h-1.5 bg-[linear-gradient(90deg,var(--energy-blue),var(--energy-green),var(--energy-yellow),var(--energy-purple))]" />
          <div className="grid lg:grid-cols-[0.82fr_1.18fr]">
            <div className="border-b border-[var(--line)] p-5 sm:p-8 lg:border-b-0 lg:border-r">
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-[var(--persona-soft)] sm:h-24 sm:w-24">
                  <Image
                    src={getCompanionAvatar(report.targetMbti, report.targetGender)}
                    alt={`${report.targetMbti} ${profile.title}`}
                    fill
                    priority
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
                <div>
                   <p className="v3-kicker">CHAPTER 8 · 结果复盘</p>
                   <h1 className="v3-title mt-2 text-3xl">我的人格互动报告</h1>
                  <p className="mt-2 text-sm font-semibold text-[var(--ink-soft)]">
                    与 {report.targetMbti} ·「{profile.universeTitle}」
                  </p>
                </div>
              </div>

              <div className="mt-7 border-y border-[var(--line)] py-5">
                <p className="text-xs font-semibold text-[var(--ink-faint)]">互动情景</p>
                <h2 className="mt-1 text-lg font-semibold text-[var(--ink)]">{scenario.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">{scenario.theme}</p>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {report.dominantIntentTags.map((tag) => (
                  <span key={tag} className="v3-chip bg-[var(--persona-soft)] text-[var(--persona-accent)]">{tag}</span>
                ))}
              </div>
              <div className="mt-6 border-l-2 border-[var(--persona-accent)] bg-[var(--persona-soft)] py-2 pl-4 pr-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-[var(--ink-faint)]">你的互动风格</p>
                    <p className="mt-1 text-lg font-semibold text-[var(--ink)]">{interactionStyle}</p>
                    <p className="mt-1 text-xl text-[var(--persona-accent)]" aria-label={`${starCount} 星`}>
                      {Array.from({ length: 5 }, (_, index) => index < starCount ? "★" : "☆").join("")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[var(--ink-faint)]">档案编号</p>
                    <p className="mt-1 text-xs font-bold text-[var(--ink-soft)]">{report.id.slice(0, 8).toUpperCase()}</p>
                  </div>
                </div>
              </div>
              <p className="mt-6 text-xs leading-6 text-[var(--ink-faint)]">
                基于本轮 {report.choices.length} 次互动选择，由规则评分生成。结果描述的是这一次的沟通策略，不是固定人格诊断或匹配度。
              </p>
              <p className="mt-3 text-xs text-[var(--ink-faint)]">
                {new Date(report.createdAt).toLocaleString("zh-CN", { hour12: false })}
              </p>
            </div>

            <div className="grid items-center gap-4 p-5 sm:grid-cols-[minmax(260px,0.95fr)_minmax(240px,1.05fr)] sm:p-8">
              <div className="flex justify-center">
                <CommunicationRadar scores={report.scores} labels={labels} />
              </div>
              <div className="space-y-4">
                {communicationDimensionIds.map((dimension) => {
                  const score = report.scores[dimension];
                  const meta = communicationDimensionMeta[dimension];
                  return (
                    <div key={dimension}>
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="font-semibold text-[var(--ink)]">{meta.label}</span>
                        <span className="font-bold text-[var(--persona-accent)]">{score}</span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div className={`h-full rounded-full ${dimensionTone[dimension]}`} style={{ width: `${score}%` }} />
                      </div>
                      <p className="mt-1 text-[11px] text-[var(--ink-faint)]">{getScoreLevel(score)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="universe-glass mt-6 overflow-hidden rounded-lg">
          <div className="grid lg:grid-cols-[0.88fr_1.12fr]">
            <div className="border-b border-white/10 p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <p className="v3-kicker">关系模拟复盘</p>
              <div className={`mt-4 inline-flex rounded border px-3 py-1.5 text-xs font-bold ${outcomeTone[relationshipOutcome.tone]}`}>
                {relationshipOutcome.title}
              </div>
              <h2 className="v3-title mt-4 text-2xl">这段互动最后停在这里</h2>
              <p className="mt-4 text-sm leading-7 text-[var(--ink-soft)]">
                {relationshipOutcome.summary}
              </p>
              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-xs font-bold text-amber-200">本轮可能的盲点</p>
                <p className="mt-2 text-sm leading-7 text-[var(--ink-soft)]">{blindSpot}</p>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="v3-kicker">关系气候</p>
                  <h3 className="mt-2 text-lg font-semibold text-[var(--ink)]">最终状态</h3>
                </div>
                <span className="text-xs font-semibold text-[var(--ink-faint)]">不代表固定关系结论</span>
              </div>
              <div className="mt-6 grid gap-x-6 gap-y-5 sm:grid-cols-2">
                {relationshipMetrics.map((metric) => {
                  const value = relationshipState[metric];
                  return (
                    <div key={metric}>
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="font-semibold text-[var(--ink)]">{relationshipMetricMeta[metric].label}</span>
                        <span className="font-bold text-[var(--persona-accent)]">{value}</span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div
                          className={`h-full rounded-full ${metric === "conflictLevel" ? "bg-rose-400" : "bg-[var(--persona-accent)]"}`}
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-7 border-t border-white/10 pt-5">
                <p className="text-xs font-semibold text-[var(--ink-faint)]">完整关系轨迹</p>
                <div className="mt-4 overflow-x-auto pb-2">
                  <div
                    className="grid gap-2"
                    style={{
                      gridTemplateColumns: `repeat(${scenario.stages.length}, minmax(36px, 1fr))`,
                      minWidth: `${Math.max(360, scenario.stages.length * 44)}px`
                    }}
                  >
                    {scenario.stages.map((stage, index) => {
                    const snapshot = relationshipHistory[index];
                    const connection = snapshot
                      ? Math.round(
                          (normalizeRelationshipState(snapshot.state).trust +
                            normalizeRelationshipState(snapshot.state).emotionalConnection +
                            normalizeRelationshipState(snapshot.state).communication +
                            normalizeRelationshipState(snapshot.state).understanding) /
                            4 -
                            normalizeRelationshipState(snapshot.state).conflictLevel * 0.35
                        )
                      : 0;
                      return (
                        <div key={stage.id} className="min-w-0">
                        <div className="relative h-12 border-b border-white/12">
                          <span
                            className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 translate-y-1/2 rounded-full bg-[var(--persona-accent)] shadow-[0_0_12px_var(--persona-glow)]"
                            style={{ bottom: `${Math.max(8, Math.min(80, connection))}%` }}
                          />
                        </div>
                        <p className="mt-3 truncate text-center text-[10px] font-semibold text-[var(--ink-faint)]">
                          {stage.beat ?? `第 ${index + 1} 幕`}
                        </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="universe-glass mt-6 rounded-lg p-5 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-5">
            <div>
              <p className="v3-kicker">完整过程复盘</p>
              <h2 className="v3-title mt-2 text-2xl">关系发展轨迹</h2>
            </div>
            <p className="text-xs text-[var(--ink-faint)]">从第 1 次互动到最终选择，阶段变化均来自本轮记录</p>
          </div>

          <div className="mt-6 grid gap-3 lg:grid-cols-5">
            {relationshipPhases.map((phase, index) => (
              <article key={phase.id} className={`border-l-2 bg-white/[0.025] p-4 ${phaseTone[phase.tone]}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase text-[var(--ink-faint)]">阶段 {index + 1}</span>
                  <span className="text-[10px] font-bold">{phaseToneLabel[phase.tone]}</span>
                </div>
                <h3 className="mt-3 text-sm font-semibold text-[var(--ink)]">{phase.title}</h3>
                <p className="mt-1 text-[11px] text-[var(--ink-faint)]">第 {phase.startRound}-{phase.endRound} 次互动</p>
                <p className="mt-3 text-xs leading-6 text-[var(--ink-soft)]">{phase.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <div className="border-y border-[var(--line-strong)] py-5">
            <p className="v3-kicker">过程证据</p>
            <h2 className="v3-title mt-2 text-2xl">影响走向的关键节点</h2>
            <p className="mt-2 text-sm text-[var(--ink-soft)]">这些节点不是单独判分，而是因为它们对关系状态产生了较明显的综合影响。</p>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {keyMoments.map((moment) => (
              <article key={`${moment.stageId}-${moment.round}`} className={`universe-glass rounded-lg border p-5 ${keyMomentTone[moment.impact]}`}>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-[var(--persona-accent)]">第 {moment.round} 次 · {moment.beat}</span>
                  <span className="text-[10px] font-semibold text-[var(--ink-faint)]">
                    {moment.impact === "positive" ? "促进连接" : moment.impact === "negative" ? "增加距离" : "优势与代价并存"}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-7 text-[var(--ink)]">{moment.analysis}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="universe-glass mt-6 rounded-lg p-5 sm:p-8">
          <div className="grid gap-5 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="v3-kicker">沟通特点</p>
              <h2 className="v3-title mt-2 text-2xl">六个维度如何形成</h2>
              <p className="mt-4 text-sm leading-7 text-[var(--ink-soft)]">
                每个结论都回到一次真实选择，而不是只展示最后分数。分数描述的是本轮策略，遇到不同关系和压力时可能改变。
              </p>
            </div>
            <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
              {communicationInsights.map((insight) => (
                <article key={insight.dimension} className="border-t border-white/12 pt-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-[var(--ink)]">{insight.label}</h3>
                    <span className="text-sm font-bold text-[var(--persona-accent)]">{insight.score}</span>
                  </div>
                  <p className="mt-2 text-xs leading-6 text-[var(--ink-soft)]">{insight.summary}</p>
                  <p className="mt-2 text-[11px] leading-5 text-[var(--ink-faint)]">{insight.evidence}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-7 border-t border-white/10 pt-6">
            <p className="text-xs font-bold text-sky-200">下一次可以练习</p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {growthActions.map((action) => (
                <article key={action.title} className="bg-white/[0.025] p-4">
                  <h3 className="text-sm font-semibold text-[var(--ink)]">{action.title}</h3>
                  <p className="mt-2 text-xs leading-6 text-[var(--ink-soft)]">{action.action}</p>
                  <p className="mt-3 text-[10px] leading-5 text-[var(--ink-faint)]">{action.basedOn}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-3">
          <article className="universe-glass rounded-lg border-t-4 border-t-[var(--persona-accent)] p-6">
            <p className="v3-kicker">本轮优势</p>
            <h2 className="mt-2 text-xl font-semibold text-[var(--ink)]">
              {strongest.map((item) => item.label).join(" · ")}
            </h2>
            <div className="mt-4 space-y-3">
              {strongest.map((item) => (
                <p key={item.label} className="text-sm leading-7 text-[var(--ink-soft)]">{item.strength}</p>
              ))}
            </div>
          </article>

          <article className="universe-glass rounded-lg border-t-4 border-t-amber-400 p-6">
            <p className="text-xs font-bold text-amber-200">值得留意</p>
            <h2 className="mt-2 text-xl font-semibold text-[var(--ink)]">增强{growth.label}</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--ink-soft)]">{growth.growth}</p>
          </article>

          <article className="universe-glass rounded-lg border-t-4 border-t-sky-400 p-6">
            <p className="text-xs font-bold text-sky-200">下一次可尝试</p>
            <h2 className="mt-2 text-xl font-semibold text-[var(--ink)]">一个具体动作</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--ink-soft)]">
              {scenarioNextAction[report.scenarioId] ?? "把你最在意的事实、感受和请求分别说清楚，再邀请对方一起确定下一步。"}
            </p>
          </article>
        </section>

        <details className="group mt-10 [&>summary::-webkit-details-marker]:hidden">
          <summary className="flex min-h-16 cursor-pointer list-none flex-wrap items-end justify-between gap-3 border-y border-[var(--line-strong)] py-4">
            <div>
              <p className="v3-kicker">选择证据</p>
              <h2 className="v3-title mt-1 text-2xl">{report.choices.length} 节点互动轨迹</h2>
            </div>
            <p className="flex items-center gap-2 text-xs text-[var(--ink-faint)]">
              展开完整轨迹
              <span className="text-base transition group-open:rotate-180" aria-hidden="true">⌄</span>
            </p>
          </summary>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {report.choices.map((choice, index) => {
              const stage = scenario.stages.find((item) => item.id === choice.stageId);
              return (
                <article key={`${choice.stageId}-${choice.optionId}`} className="universe-glass rounded-lg p-5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs font-bold text-[var(--persona-accent)]">
                      {stage?.beat ?? `第 ${index + 1} 轮`}
                    </span>
                    <span className="max-w-[70%] text-right text-xs leading-5 text-[var(--ink-faint)]">{stage?.prompt}</span>
                  </div>
                  <p className="mt-3 text-sm font-semibold leading-7 text-[var(--ink)]">{choice.label}</p>
                  <p className="mt-3 border-l-2 border-[var(--persona-accent)] pl-3 text-xs leading-6 text-[var(--ink-soft)]">
                    {choice.resolvedReaction ?? choice.reaction}
                  </p>
                  <div className="mt-4 grid gap-3 border-t border-white/10 pt-3 sm:grid-cols-2">
                    <div>
                      <p className="text-[10px] font-bold text-emerald-200">这一选择的优势</p>
                      <p className="mt-1 text-[11px] leading-5 text-[var(--ink-soft)]">{choice.advantage}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-amber-200">同时付出的代价</p>
                      <p className="mt-1 text-[11px] leading-5 text-[var(--ink-soft)]">{choice.tradeoff}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {choice.intentTags.map((tag) => <span key={tag} className="v3-chip">{tag}</span>)}
                    {Object.entries(choice.relationshipDelta).map(([metric, value]) => (
                      <span key={metric} className="v3-chip border-white/10 text-[var(--ink-faint)]">
                        {relationshipMetricMeta[metric as RelationshipMetric].label} {Number(value) >= 0 ? "+" : ""}{value}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
          <p className="mt-4 text-xs leading-6 text-[var(--ink-faint)]">分数由以上选择的固定规则变化累计而成，不受角色回应措辞影响。</p>
        </details>

        <section className="mt-10 flex flex-col gap-3 border-t border-[var(--line-strong)] pt-6 sm:flex-row sm:justify-between">
          <div className="flex flex-wrap gap-3">
            <Link href="/lab" className="v3-button-primary">探索其他场景</Link>
            <Link href={`/companion?mbti=${report.targetMbti}&gender=${report.targetGender}`} className="v3-button-secondary">
              与 {report.targetMbti} 继续聊
            </Link>
            <button type="button" onClick={() => window.print()} className="v3-button-secondary">
              保存人格档案
            </button>
          </div>
          <Link href="/" className="v3-button-secondary self-start">返回人格宇宙</Link>
        </section>
      </div>
    </main>
  );
}
