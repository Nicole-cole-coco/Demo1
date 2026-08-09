import type { MbtiType } from "@/types/avatar";

export type CompanionGender = "female" | "male";

export type MbtiLetter = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";

export type MbtiPreferenceScores = Record<MbtiLetter, number>;

export type ExplorationDomain =
  | "decision"
  | "information"
  | "emotion"
  | "social"
  | "values"
  | "lifestyle";

export type ExplorationTrait =
  | "analysis"
  | "action"
  | "facts"
  | "possibility"
  | "emotionAwareness"
  | "emotionExpression"
  | "solitude"
  | "connection"
  | "stability"
  | "freedom"
  | "growth"
  | "planning"
  | "flexibility";

export type ExplorationTraitScores = Record<ExplorationTrait, number>;

export type ExplorationAxisResult = {
  id: ExplorationDomain;
  label: string;
  leftLabel: string;
  rightLabel: string;
  leftPercent: number;
  rightPercent: number;
};

export type PersonalityExplorationReport = {
  primaryPattern: string;
  coreTendencies: string[];
  decisionStyle: string;
  communicationStyle: string;
  stressResponse: string;
  relationshipPattern: string;
  growthSuggestions: string[];
  axes: ExplorationAxisResult[];
};

export type MbtiTestResult = {
  mbti: MbtiType;
  scores: MbtiPreferenceScores;
  explorationScores?: ExplorationTraitScores;
  explorationReport?: PersonalityExplorationReport;
  answeredAt: string;
};

export type CompanionProfile = {
  mbti: MbtiType;
  gender: CompanionGender;
  avatar: string;
  testResult?: MbtiTestResult;
};

export type CompanionChatRole = "user" | "assistant";

export type CompanionChatMessage = {
  id: string;
  role: CompanionChatRole;
  content: string;
  createdAt: string;
};

export type ChatScenarioId =
  | "daily"
  | "emotion"
  | "study"
  | "career"
  | "interest"
  | "conflict"
  | "relationship"
  | "opinion"
  | "action";

export function getCompanionAvatar(mbti: MbtiType, gender: CompanionGender) {
  return `/avatars/${mbti.toLowerCase()}-${gender}.webp`;
}

export function createCompanionProfile(
  mbti: MbtiType,
  gender: CompanionGender,
  testResult?: MbtiTestResult
): CompanionProfile {
  return {
    mbti,
    gender,
    avatar: getCompanionAvatar(mbti, gender),
    testResult
  };
}
