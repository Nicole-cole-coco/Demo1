import type { MbtiType } from "@/types/avatar";
import type { CompanionGender } from "@/types/companion";

export const communicationDimensionIds = [
  "emotionalAcceptance",
  "clarity",
  "boundaryAwareness",
  "conflictRepair",
  "collaboration",
  "adaptability"
] as const;

export type CommunicationDimension = (typeof communicationDimensionIds)[number];
export type CommunicationScores = Record<CommunicationDimension, number>;
export type CommunicationScoreDelta = Partial<Record<CommunicationDimension, number>>;

export const relationshipMetricIds = [
  "trust",
  "emotionalConnection",
  "communication",
  "conflictLevel",
  "understanding"
] as const;

export type RelationshipMetric = (typeof relationshipMetricIds)[number];
export type RelationshipState = Record<RelationshipMetric, number>;
export type RelationshipStateDelta = Partial<Record<RelationshipMetric, number>>;
export type ChallengeLevel = 1 | 2 | 3 | 4;

export type RelationshipSnapshot = {
  stageId: string;
  state: RelationshipState;
  delta: RelationshipStateDelta;
};

export type RelationshipCondition = {
  min?: RelationshipStateDelta;
  max?: RelationshipStateDelta;
};

export type ScenarioStageVariant = {
  id: string;
  condition: RelationshipCondition;
  story?: string;
  targetLine?: string;
  targetLines?: Partial<Record<MbtiType, string>>;
  prompt?: string;
};

export type LabScenarioId =
  | "intp-everyday-connection"
  | "isfj-roommate-friction"
  | "enfp-future-values-journey"
  | "infj-trust-journey"
  | "enfp-love-freedom"
  | "intj-emotional-needs"
  | "intp-emotional-expression"
  | "infp-values-reality"
  | "enfj-care-boundary"
  | "istj-plan-change"
  | "isfj-unseen-care"
  | "estj-management-conflict"
  | "esfj-independent-choice"
  | "istp-silent-conflict"
  | "isfp-authenticity-pressure"
  | "estp-impulsive-decision"
  | "esfp-long-support"
  | "intj-friend-misunderstanding"
  | "infj-relationship-boundary"
  | "entj-workplace-pressure"
  | "entp-value-conflict"
  | "isfp-first-date"
  | "isfj-family-conflict"
  | "estj-team-failure";

export type ScenarioOption = {
  id: string;
  label: string;
  intentTags: readonly string[];
  scoreDelta: CommunicationScoreDelta;
  relationshipDelta: RelationshipStateDelta;
  nextStage: string | null;
  reaction: string;
  reactions?: Partial<Record<MbtiType, string>>;
  advantage: string;
  tradeoff: string;
};

export type ScenarioStage = {
  id: string;
  round: number;
  beat?: string;
  chapter?: number;
  chapterTitle?: string;
  story?: string;
  targetLine: string;
  targetLines?: Partial<Record<MbtiType, string>>;
  prompt: string;
  variants?: readonly ScenarioStageVariant[];
  options: readonly ScenarioOption[];
};

export type ScenarioEvaluationRule = {
  dimension: CommunicationDimension;
  description: string;
};

export type ScenarioDefinition = {
  id: LabScenarioId;
  title: string;
  targetMbti: MbtiType;
  targetMbtis: readonly MbtiType[];
  sceneType:
    | "love"
    | "friendship"
    | "boundary"
    | "workplace"
    | "value"
    | "dating"
    | "family"
    | "teamwork";
  difficulty: ChallengeLevel;
  difficultyLabel: string;
  relationship: string;
  theme: string;
  initialConflict: string;
  initialRelationshipState: RelationshipState;
  summary: string;
  stages: readonly ScenarioStage[];
  endings?: readonly ScenarioEndingDefinition[];
  evaluationRules: readonly ScenarioEvaluationRule[];
};

export type LabChoiceRecord = {
  stageId: string;
  optionId: string;
  label: string;
  intentTags: readonly string[];
  scoreDelta: CommunicationScoreDelta;
  relationshipDelta: RelationshipStateDelta;
  reaction: string;
  resolvedReaction: string;
  advantage: string;
  tradeoff: string;
  resultingState: RelationshipState;
};

export type LabSession = {
  scenarioId: LabScenarioId;
  targetGender: CompanionGender;
  targetMbti?: MbtiType;
  currentStageId: string;
  choices: LabChoiceRecord[];
  relationshipState?: RelationshipState;
  relationshipHistory?: RelationshipSnapshot[];
  startedAt: string;
};

export type RelationshipOutcome = {
  id?: string;
  title: string;
  summary: string;
  tone: "connected" | "stable" | "strained" | "critical";
};

export type RelationshipPhaseSummary = {
  id: string;
  title: string;
  startRound: number;
  endRound: number;
  summary: string;
  tone: "improving" | "stable" | "declining" | "volatile";
  startState: RelationshipState;
  endState: RelationshipState;
};

export type LabKeyMoment = {
  stageId: string;
  round: number;
  beat: string;
  choice: string;
  reaction: string;
  analysis: string;
  impact: "positive" | "mixed" | "negative";
  relationshipDelta: RelationshipStateDelta;
};

export type CommunicationInsight = {
  dimension: CommunicationDimension;
  label: string;
  score: number;
  summary: string;
  evidence: string;
};

export type GrowthAction = {
  title: string;
  action: string;
  basedOn: string;
};

export type ScenarioEndingDefinition = RelationshipOutcome & {
  condition: RelationshipCondition;
};

export type LabReport = {
  id: string;
  scenarioId: LabScenarioId;
  targetMbti: MbtiType;
  targetGender: CompanionGender;
  scores: CommunicationScores;
  choices: LabChoiceRecord[];
  dominantIntentTags: string[];
  strongestDimensions: CommunicationDimension[];
  growthDimension: CommunicationDimension;
  relationshipState?: RelationshipState;
  relationshipHistory?: RelationshipSnapshot[];
  relationshipOutcome?: RelationshipOutcome;
  interactionStyle?: string;
  blindSpot?: string;
  relationshipPhases?: RelationshipPhaseSummary[];
  keyMoments?: LabKeyMoment[];
  communicationInsights?: CommunicationInsight[];
  growthActions?: GrowthAction[];
  createdAt: string;
};
