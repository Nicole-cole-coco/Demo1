import type { MbtiType } from "@/types/avatar";
import type { CompanionGender } from "@/types/companion";

export type CompanionConversationMessage = {
  role: "user" | "assistant";
  content: string;
  timestamp?: number;
};

export type CompanionChatRequest = {
  persona: string;
  personaId?: string;
  mbti: MbtiType;
  gender?: CompanionGender;
  userMessage: string;
  conversationHistory: readonly CompanionConversationMessage[];
};

export type CompanionChatResponse = {
  reply: string;
};

export type PersonaPromptInput = {
  mbti: MbtiType;
  personality: readonly string[];
  speakingStyle: string;
  relationshipStyle: readonly string[];
};
