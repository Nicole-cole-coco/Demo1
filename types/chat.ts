import type { MbtiType } from "@/types/avatar";
import type { PersonaDefinition } from "@/types/persona";
import type { AIResponseMetadata, LLMUsage } from "@/services/ai/types";
import type {
  ChatScenarioId,
  CompanionChatRole,
  CompanionGender
} from "@/types/companion";

export type ChatHistoryMessage = {
  role: CompanionChatRole;
  content: string;
};

// Legacy outfit and room pages remain buildable while they stay outside the V2 flow.
export type ChatMessage = ChatHistoryMessage & {
  id: string;
  createdAt: string;
};

export type ChatRequest = {
  userMessage?: string;
  message?: string;
  persona?: {
    mbti: MbtiType;
    gender?: CompanionGender;
  };
  mbti?: MbtiType;
  gender?: CompanionGender;
  personaDefinition?: PersonaDefinition;
  userMbti?: MbtiType;
  conversationHistory?: ChatHistoryMessage[];
  history?: ChatHistoryMessage[];
  scenario?: ChatScenarioId | null;
};

export type ChatResponseMode = "live" | "demo" | "safety";
export type ChatEmotion = "calm" | "curious" | "supportive" | "focused" | "energized";

export type ChatServiceInput = {
  mbti: MbtiType;
  gender: CompanionGender;
  personaDefinition: PersonaDefinition;
  conversationHistory: ChatHistoryMessage[];
  userMessage: string;
  userMbti?: MbtiType;
  scenario?: ChatScenarioId | null;
};

export type ChatResponse = {
  reply: string;
  mode: ChatResponseMode;
  emotion: ChatEmotion;
  suggestions: string[];
  model: string;
  usage: LLMUsage;
  metadata: AIResponseMetadata;
};
