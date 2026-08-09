import type { MbtiType } from "@/types/avatar";
import type { ScenarioDefinition, ScenarioStage } from "@/types/lab";
import {
  communicationDimensionIds,
  relationshipMetricIds,
  type CommunicationDimension,
  type CommunicationInsight,
  type CommunicationScores,
  type GrowthAction,
  type LabChoiceRecord,
  type LabKeyMoment,
  type LabReport,
  type LabSession,
  type RelationshipMetric,
  type RelationshipOutcome,
  type RelationshipPhaseSummary,
  type RelationshipState,
  type RelationshipStateDelta
} from "@/types/lab";

export const communicationDimensionMeta: Record<
  CommunicationDimension,
  {
    label: string;
    description: string;
    strength: string;
    growth: string;
  }
> = {
  emotionalAcceptance: {
    label: "情绪理解",
    description: "识别并回应对方当下感受，而不是立刻解释、评价或跳过。",
    strength: "你能让情绪先被看见，为后续讨论建立安全感。",
    growth: "可以先复述对方的感受与在意点，再进入判断或解决方案。"
  },
  clarity: {
    label: "沟通表达",
    description: "用具体事实、需求和请求代替暗示、猜测或模糊承诺。",
    strength: "你的表达较具体，能帮助双方知道接下来要讨论什么。",
    growth: "尝试把立场改写成一条具体请求，并说明你希望怎样回应。"
  },
  boundaryAwareness: {
    label: "边界意识",
    description: "同时看见自己的底线、对方的自主空间以及各自应承担的部分。",
    strength: "你能在照顾关系时保留必要边界，不轻易替双方包办。",
    growth: "在让步前先说清不能接受什么、可以协商什么，以及对应后果。"
  },
  conflictRepair: {
    label: "冲突处理",
    description: "承认互动造成的影响，把对错争论转化为修复动作。",
    strength: "你愿意处理冲突留下的影响，并把讨论带向可恢复的连接。",
    growth: "除了说明原意，也可以承认实际影响，并提出一次可观察的修复动作。"
  },
  collaboration: {
    label: "关系维护能力",
    description: "邀请双方共同形成方案、责任和后续检查方式。",
    strength: "你倾向把关系问题变成双方都能参与的共同方案。",
    growth: "减少单方面决定或承担，邀请对方一起确定下一步与复盘时间。"
  },
  adaptability: {
    label: "适应能力",
    description: "在关系状态、信息和现实条件变化时，调整沟通策略而不放弃核心边界。",
    strength: "你能根据当下反馈调整方式，让沟通既有方向也保留弹性。",
    growth: "留意当前方法是否仍然有效；必要时先改变节奏，再坚持原本想守住的需要。"
  }
};

const initialScores: CommunicationScores = {
  emotionalAcceptance: 50,
  clarity: 50,
  boundaryAwareness: 50,
  conflictRepair: 50,
  collaboration: 50,
  adaptability: 50
};

export const defaultRelationshipState: RelationshipState = {
  trust: 50,
  emotionalConnection: 50,
  communication: 50,
  conflictLevel: 20,
  understanding: 50
};

export const relationshipMetricMeta: Record<
  RelationshipMetric,
  { label: string; description: string }
> = {
  trust: { label: "信任", description: "双方是否愿意相信彼此的动机与承诺。" },
  emotionalConnection: { label: "情绪连接", description: "感受是否被看见，关系中是否仍有靠近的意愿。" },
  communication: { label: "沟通通畅", description: "信息、需求和下一步能否被双方准确理解。" },
  conflictLevel: { label: "冲突压力", description: "当前互动中的防御、对抗与失控风险。" },
  understanding: { label: "相互理解", description: "双方是否逐渐看见彼此行为背后的真实需要。" }
};

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

type LegacyRelationshipState = Partial<RelationshipState> & {
  emotion?: number;
  conflict?: number;
};

export function normalizeRelationshipState(
  state?: LegacyRelationshipState | null
): RelationshipState {
  return {
    trust: clamp(state?.trust ?? defaultRelationshipState.trust),
    emotionalConnection: clamp(
      state?.emotionalConnection ?? state?.emotion ?? defaultRelationshipState.emotionalConnection
    ),
    communication: clamp(state?.communication ?? defaultRelationshipState.communication),
    conflictLevel: clamp(
      state?.conflictLevel ?? state?.conflict ?? defaultRelationshipState.conflictLevel
    ),
    understanding: clamp(state?.understanding ?? defaultRelationshipState.understanding)
  };
}

export function applyRelationshipDelta(
  state: RelationshipState,
  delta: RelationshipStateDelta
): RelationshipState {
  const normalized = normalizeRelationshipState(state);
  return {
    trust: clamp(normalized.trust + (delta.trust ?? 0)),
    emotionalConnection: clamp(
      normalized.emotionalConnection + (delta.emotionalConnection ?? 0)
    ),
    communication: clamp(normalized.communication + (delta.communication ?? 0)),
    conflictLevel: clamp(normalized.conflictLevel + (delta.conflictLevel ?? 0)),
    understanding: clamp(normalized.understanding + (delta.understanding ?? 0))
  };
}

export function matchesRelationshipCondition(
  state: RelationshipState,
  condition: { min?: RelationshipStateDelta; max?: RelationshipStateDelta }
) {
  const normalized = normalizeRelationshipState(state);
  const minimumMatches = Object.entries(condition.min ?? {}).every(
    ([metric, value]) => normalized[metric as RelationshipMetric] >= (value ?? 0)
  );
  const maximumMatches = Object.entries(condition.max ?? {}).every(
    ([metric, value]) => normalized[metric as RelationshipMetric] <= (value ?? 100)
  );
  return minimumMatches && maximumMatches;
}

export function resolveScenarioStage(
  stage: ScenarioStage,
  state: RelationshipState,
  targetMbti: MbtiType
) {
  const variant = stage.variants?.find((item) => matchesRelationshipCondition(state, item.condition));
  return {
    story: variant?.story ?? stage.story ?? "",
    targetLine:
      variant?.targetLines?.[targetMbti] ??
      variant?.targetLine ??
      stage.targetLines?.[targetMbti] ??
      stage.targetLine,
    prompt: variant?.prompt ?? stage.prompt,
    variantId: variant?.id ?? "default"
  };
}

export function calculateRelationshipOutcome(state: RelationshipState): RelationshipOutcome {
  const normalized = normalizeRelationshipState(state);
  const connectionAverage =
    (normalized.trust +
      normalized.emotionalConnection +
      normalized.communication +
      normalized.understanding) /
    4;

  if (normalized.conflictLevel >= 70 || normalized.trust <= 25) {
    return {
      title: "关系进入临界点",
      summary: "本轮互动让防御持续升高。继续沟通前，更需要先降低冲突强度并确认双方边界。",
      tone: "critical"
    };
  }

  if (connectionAverage >= 70 && normalized.conflictLevel <= 30) {
    return {
      title: "重新建立连接",
      summary: "你们在分歧中保留了理解与合作空间，关系出现了可继续修复的明确路径。",
      tone: "connected"
    };
  }

  if (connectionAverage >= 52 && normalized.conflictLevel <= 50) {
    return {
      title: "关系保持稳定",
      summary: "互动没有消除全部分歧，但双方仍能交换真实信息，并为下一次沟通保留空间。",
      tone: "stable"
    };
  }

  return {
    title: "关系仍然紧绷",
    summary: "部分问题被说开，但情绪连接或信任仍较脆弱，下一次回应方式会明显影响走向。",
    tone: "strained"
  };
}

export function resolveScenarioEnding(
  scenario: ScenarioDefinition,
  state: RelationshipState
): RelationshipOutcome {
  const ending = scenario.endings?.find((item) =>
    matchesRelationshipCondition(state, item.condition)
  );
  if (!ending) return calculateRelationshipOutcome(state);
  return { id: ending.id, title: ending.title, summary: ending.summary, tone: ending.tone };
}

export function getRelationshipMood(state: RelationshipState) {
  return calculateRelationshipOutcome(state).tone;
}

function getInteractionStyle(dimension: CommunicationDimension) {
  const styles: Record<CommunicationDimension, string> = {
    emotionalAcceptance: "情绪承接型",
    clarity: "清晰表达型",
    boundaryAwareness: "边界协商型",
    conflictRepair: "关系修复型",
    collaboration: "关系维护型",
    adaptability: "灵活调适型"
  };

  return styles[dimension];
}

const makeId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

export function calculateCommunicationScores(choices: readonly LabChoiceRecord[]) {
  return choices.reduce<CommunicationScores>((scores, choice) => {
    communicationDimensionIds.forEach((dimension) => {
      scores[dimension] = clamp(scores[dimension] + (choice.scoreDelta[dimension] ?? 0));
    });
    return scores;
  }, { ...initialScores });
}

function getDominantIntentTags(choices: readonly LabChoiceRecord[]) {
  const counts = new Map<string, number>();
  choices.forEach((choice) => {
    choice.intentTags.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1));
  });

  return Array.from(counts.entries())
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0], "zh-CN"))
    .slice(0, 3)
    .map(([tag]) => tag);
}

const connectionIndex = (state: RelationshipState) => {
  const normalized = normalizeRelationshipState(state);
  return Math.round(
    (normalized.trust +
      normalized.emotionalConnection +
      normalized.communication +
      normalized.understanding) /
      4 -
      normalized.conflictLevel * 0.35
  );
};

const metricChangeLabel = (
  start: RelationshipState,
  end: RelationshipState,
  mode: "gain" | "loss"
) => {
  const changes = relationshipMetricIds.map((metric) => {
    const raw = end[metric] - start[metric];
    const relationalChange = metric === "conflictLevel" ? -raw : raw;
    return { metric, raw, relationalChange };
  });
  const selected = [...changes].sort((left, right) =>
    mode === "gain"
      ? right.relationalChange - left.relationalChange
      : left.relationalChange - right.relationalChange
  )[0];
  const direction = selected.raw >= 0 ? `+${selected.raw}` : String(selected.raw);
  return `${relationshipMetricMeta[selected.metric].label}${direction}`;
};

function groupStagesByChapter(scenario: ScenarioDefinition, choices: readonly LabChoiceRecord[]) {
  const stageById = new Map(scenario.stages.map((stage) => [stage.id, stage]));
  const groups: Array<{ title: string; entries: Array<{ choice: LabChoiceRecord; index: number }> }> = [];

  choices.forEach((choice, index) => {
    const stage = stageById.get(choice.stageId);
    const title = stage?.chapterTitle ?? `阶段 ${Math.floor(index / 5) + 1}`;
    const current = groups.at(-1);
    if (!current || current.title !== title) groups.push({ title, entries: [] });
    groups.at(-1)?.entries.push({ choice, index });
  });

  return groups;
}

export function buildRelationshipPhases(
  scenario: ScenarioDefinition,
  choices: readonly LabChoiceRecord[]
): RelationshipPhaseSummary[] {
  return groupStagesByChapter(scenario, choices).map((group, groupIndex) => {
    const first = group.entries[0];
    const last = group.entries.at(-1) ?? first;
    const startState = normalizeRelationshipState(
      first.index === 0
        ? scenario.initialRelationshipState
        : choices[first.index - 1]?.resultingState
    );
    const endState = normalizeRelationshipState(last.choice.resultingState);
    const connectionChange = connectionIndex(endState) - connectionIndex(startState);
    const conflictChange = endState.conflictLevel - startState.conflictLevel;
    const tone: RelationshipPhaseSummary["tone"] =
      Math.abs(conflictChange) >= 12 && Math.abs(connectionChange) <= 5
        ? "volatile"
        : connectionChange >= 6
          ? "improving"
          : connectionChange <= -6
            ? "declining"
            : "stable";
    const phaseTags = getDominantIntentTags(group.entries.map((entry) => entry.choice));
    const phaseLead = {
      improving: "连接在这一阶段明显回升",
      stable: "关系在这一阶段保持相对稳定",
      declining: "距离感在这一阶段逐渐增加",
      volatile: "关系在这一阶段出现明显波动"
    }[tone];

    return {
      id: `phase-${groupIndex + 1}`,
      title: group.title,
      startRound: first.index + 1,
      endRound: last.index + 1,
      tone,
      startState,
      endState,
      summary: `${phaseLead}。连接指数从 ${connectionIndex(startState)} 变为 ${connectionIndex(endState)}，主要变化是${
        connectionChange >= 0
          ? metricChangeLabel(startState, endState, "gain")
          : metricChangeLabel(startState, endState, "loss")
      }；你的回应更常使用${phaseTags.join("、") || "直接回应"}。`
    };
  });
}

const choiceImpact = (choice: LabChoiceRecord) => {
  const delta = choice.relationshipDelta;
  const signed =
    (delta.trust ?? 0) +
    (delta.emotionalConnection ?? 0) +
    (delta.communication ?? 0) +
    (delta.understanding ?? 0) -
    (delta.conflictLevel ?? 0);
  const magnitude = Object.values(delta).reduce((total, value) => total + Math.abs(value ?? 0), 0);
  return { signed, magnitude };
};

const compactText = (value: string, maxLength = 72) => {
  const text = value.replace(/[“”]/g, "").trim();
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
};

export function buildKeyMoments(
  scenario: ScenarioDefinition,
  choices: readonly LabChoiceRecord[]
): LabKeyMoment[] {
  const stageById = new Map(scenario.stages.map((stage) => [stage.id, stage]));
  const selectedIndexes = choices
    .map((choice, index) => ({ index, ...choiceImpact(choice) }))
    .sort((left, right) => right.magnitude - left.magnitude || left.index - right.index)
    .slice(0, Math.min(5, choices.length))
    .map((item) => item.index)
    .sort((left, right) => left - right);

  return selectedIndexes.map((index) => {
    const choice = choices[index];
    const stage = stageById.get(choice.stageId);
    const impact = choiceImpact(choice);
    const relationshipDelta = choice.relationshipDelta;
    const changedMetrics = relationshipMetricIds
      .filter((metric) => Math.abs(relationshipDelta[metric] ?? 0) > 0)
      .sort((left, right) => Math.abs(relationshipDelta[right] ?? 0) - Math.abs(relationshipDelta[left] ?? 0))
      .slice(0, 2)
      .map((metric) => {
        const value = relationshipDelta[metric] ?? 0;
        return `${relationshipMetricMeta[metric].label}${value >= 0 ? "+" : ""}${value}`;
      });
    const impactLabel: LabKeyMoment["impact"] =
      impact.signed >= 4 ? "positive" : impact.signed <= -3 ? "negative" : "mixed";

    return {
      stageId: choice.stageId,
      round: index + 1,
      beat: stage?.beat ?? `第 ${index + 1} 次互动`,
      choice: choice.label,
      reaction: choice.resolvedReaction ?? choice.reaction,
      impact: impactLabel,
      relationshipDelta,
      analysis: `第 ${index + 1} 次互动中，你选择“${compactText(choice.label, 48)}”，重点放在${choice.intentTags.join("、")}。${
        impactLabel === "positive"
          ? "这一回应为关系增加了可继续对话的空间"
          : impactLabel === "negative"
            ? "这一回应推进了部分问题，但也让关系中的防御或距离上升"
            : "这一回应同时带来推进与代价"
      }（${changedMetrics.join("、") || "关系状态变化较小"}）。对方随后回应：“${compactText(choice.resolvedReaction ?? choice.reaction)}”`
    };
  });
}

export function buildCommunicationInsights(
  scenario: ScenarioDefinition,
  choices: readonly LabChoiceRecord[],
  scores: CommunicationScores
): CommunicationInsight[] {
  const stageById = new Map(scenario.stages.map((stage) => [stage.id, stage]));

  return communicationDimensionIds.map((dimension) => {
    const rankedEvidence = choices
      .map((choice, index) => ({ choice, index, delta: choice.scoreDelta[dimension] ?? 0 }))
      .sort((left, right) =>
        scores[dimension] >= 55 ? right.delta - left.delta : left.delta - right.delta
      );
    const evidence = rankedEvidence[0];
    const stage = evidence ? stageById.get(evidence.choice.stageId) : undefined;
    const meta = communicationDimensionMeta[dimension];
    const score = scores[dimension];
    const summary = score >= 72
      ? meta.strength
      : score >= 55
        ? `${meta.description} 本轮已经出现有效尝试，但在压力升高时仍有波动。`
        : meta.growth;

    return {
      dimension,
      label: meta.label,
      score,
      summary,
      evidence: evidence
        ? `证据来自第 ${evidence.index + 1} 次“${stage?.beat ?? "互动"}”：你选择“${compactText(evidence.choice.label, 54)}”，该维度在固定规则中${evidence.delta >= 0 ? "增加" : "减少"} ${Math.abs(evidence.delta)}。`
        : "本轮暂无足够互动证据。"
    };
  });
}

export function buildGrowthActions(
  scenario: ScenarioDefinition,
  choices: readonly LabChoiceRecord[],
  scores: CommunicationScores
): GrowthAction[] {
  const stageById = new Map(scenario.stages.map((stage) => [stage.id, stage]));
  return [...communicationDimensionIds]
    .sort((left, right) => scores[left] - scores[right])
    .slice(0, 3)
    .map((dimension) => {
      const evidence = choices
        .map((choice, index) => ({ choice, index, delta: choice.scoreDelta[dimension] ?? 0 }))
        .sort((left, right) => left.delta - right.delta)[0];
      const stage = evidence ? stageById.get(evidence.choice.stageId) : undefined;
      return {
        title: `练习${communicationDimensionMeta[dimension].label}`,
        action: communicationDimensionMeta[dimension].growth,
        basedOn: evidence
          ? `对应第 ${evidence.index + 1} 次“${stage?.beat ?? "互动"}”中的选择：${compactText(evidence.choice.label, 52)}`
          : "基于本轮综合表现。"
      };
    });
}

export function buildReportNarrative(
  scenario: ScenarioDefinition,
  choices: readonly LabChoiceRecord[],
  scores = calculateCommunicationScores(choices)
) {
  return {
    relationshipPhases: buildRelationshipPhases(scenario, choices),
    keyMoments: buildKeyMoments(scenario, choices),
    communicationInsights: buildCommunicationInsights(scenario, choices, scores),
    growthActions: buildGrowthActions(scenario, choices, scores)
  };
}

export function createLabReport(
  scenario: ScenarioDefinition,
  session: LabSession,
  choices: LabChoiceRecord[]
): LabReport {
  const scores = calculateCommunicationScores(choices);
  const rankedDimensions = [...communicationDimensionIds].sort(
    (left, right) => scores[right] - scores[left]
  );
  const relationshipState = normalizeRelationshipState(
    session.relationshipState ?? scenario.initialRelationshipState
  );
  const growthDimension = rankedDimensions[rankedDimensions.length - 1];
  const narrative = buildReportNarrative(scenario, choices, scores);

  return {
    id: makeId(),
    scenarioId: scenario.id,
    targetMbti: session.targetMbti ?? scenario.targetMbti,
    targetGender: session.targetGender,
    scores,
    choices,
    dominantIntentTags: getDominantIntentTags(choices),
    strongestDimensions: rankedDimensions.slice(0, 2),
    growthDimension,
    relationshipState,
    relationshipHistory: session.relationshipHistory ?? [],
    relationshipOutcome: resolveScenarioEnding(scenario, relationshipState),
    interactionStyle: getInteractionStyle(rankedDimensions[0]),
    blindSpot: communicationDimensionMeta[growthDimension].growth,
    ...narrative,
    createdAt: new Date().toISOString()
  };
}

export function getScoreLevel(score: number) {
  if (score >= 72) return "表现稳定";
  if (score >= 55) return "正在形成";
  return "值得留意";
}
