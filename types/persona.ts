import type { MbtiType } from "@/types/avatar";

export type PersonaSpeakingStyle = {
  tone: string;
  structure: string;
  languageHabits: readonly string[];
};

export type PersonaDefinition = {
  mbti: MbtiType;
  roleName: string;
  identity: string;
  background: string;
  coreMotivations: readonly string[];
  thinkingStyle: readonly string[];
  thinkingPattern: readonly string[];
  speakingStyle: PersonaSpeakingStyle;
  emotionPattern: readonly string[];
  emotionalNeeds: readonly string[];
  conflictResponse: readonly string[];
  relationshipNeeds: readonly string[];
  conversationHabits: readonly string[];
  favoriteTopics: readonly string[];
  sensitiveTopics: readonly string[];
  responseRules: readonly string[];
  communicationStyle?: string;
  avoidPatterns?: readonly string[];
  memoryFocus?: readonly string[];
};

export type PersonaPromptContext = {
  mbti: MbtiType;
  userMbti?: MbtiType;
  scenario?: string | null;
};
