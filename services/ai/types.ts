import type { MbtiType } from "@/types/avatar";
import type { CompanionGender } from "@/types/companion";
import type { PersonaDefinition } from "@/types/persona";

export type ChatMessageRole = "user" | "assistant" | "system";

export type ChatMessage = {
  role: ChatMessageRole;
  content: string;
  timestamp: number;
};

export type ChatMessageInput = Omit<ChatMessage, "timestamp"> & {
  timestamp?: number;
};

export type AIScenarioContext = {
  kind: "companion" | "relationship-lab" | "report" | "memory";
  id?: string;
  title?: string;
  relationship?: string;
  description?: string;
  chapter?: number;
  chapterTitle?: string;
  nodeId?: string;
  state?: Readonly<Record<string, string | number>>;
};

export type AIChatRequest = {
  userMessage: string;
  mbti: MbtiType;
  gender: CompanionGender;
  personaDefinition: PersonaDefinition;
  conversationHistory: readonly ChatMessageInput[];
  scenarioContext?: AIScenarioContext;
  userMbti?: MbtiType;
  memoryContext?: readonly string[];
  responseInstructions?: readonly string[];
  fallbackReply?: string;
  temperature?: number;
  maxTokens?: number;
};

export type AIResponseMetadata = {
  mbti: MbtiType;
  provider: string;
  model: string;
  timestamp: number;
};

export type LLMUsage = {
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
};

export type ProviderChatOptions = {
  temperature?: number;
  maxTokens?: number;
  signal?: AbortSignal;
  mbti: MbtiType;
  personaDefinition: PersonaDefinition;
  scenarioContext?: AIScenarioContext;
  fallbackReply?: string;
};

export type ProviderChatResult = {
  reply: string;
  model: string;
  usage?: LLMUsage;
};

export interface LLMProvider {
  readonly id: string;
  readonly model: string;
  chat(
    messages: readonly ChatMessage[],
    options: ProviderChatOptions
  ): Promise<ProviderChatResult>;
}
