import { buildPersonaSystemPrompt } from "@/services/ai/personaBuilder";
import { createLLMProvider, MockProvider } from "@/services/ai/provider";
import type {
  AIChatRequest,
  AIResponseMetadata,
  ChatMessage,
  ChatMessageInput,
  LLMUsage,
  ProviderChatOptions,
  ProviderChatResult
} from "@/services/ai/types";
import type { ChatEmotion, ChatResponseMode } from "@/types/chat";
import type { ChatScenarioId } from "@/types/companion";

export type AIChatServiceResult = {
  reply: string;
  mode: ChatResponseMode;
  emotion: ChatEmotion;
  suggestions: string[];
  model: string;
  usage: LLMUsage;
  metadata: AIResponseMetadata;
};

const urgentSafetyPattern = /(?:想自杀|不想活了|结束生命|结束自己的生命|伤害自己|自残|轻生|杀了他|伤害别人)/i;
const artificialAnalysisPattern = /(?:我是\s*(?:一个)?\s*AI(?:助手)?|作为\s*(?:一个)?\s*AI|根据(?:你的)?(?:测试结果|MBTI\s*分析)|你的(?:选择|回答|行为)(?:体现|说明|表明)|行为得分|情绪理解评分|沟通得分)/i;

function sanitizeMessage(input: ChatMessageInput, allowSystem: boolean): ChatMessage | null {
  if (!allowSystem && input.role === "system") return null;
  if (!(["user", "assistant", "system"] as const).includes(input.role)) return null;
  const content = typeof input.content === "string" ? input.content.trim().slice(0, 4000) : "";
  if (!content) return null;
  return {
    role: input.role,
    content,
    timestamp: typeof input.timestamp === "number" && Number.isFinite(input.timestamp)
      ? input.timestamp
      : Date.now()
  };
}

export function normalizeConversationHistory(history: readonly ChatMessageInput[]) {
  return history
    .map((message) => sanitizeMessage(message, false))
    .filter((message): message is ChatMessage => Boolean(message))
    .slice(-24);
}

function inferEmotion(message: string, scenarioId?: string): ChatEmotion {
  if (scenarioId === "study" || scenarioId === "career" || /计划|工作|学习|考试|选择/.test(message)) return "focused";
  if (scenarioId === "interest" || /喜欢|开心|期待|有趣/.test(message)) return "energized";
  if (scenarioId === "emotion" || /难过|焦虑|委屈|失望|孤独|累/.test(message)) return "supportive";
  if (/为什么|怎么|可能|好奇/.test(message)) return "curious";
  return "calm";
}

function createSuggestions(scenarioId?: string) {
  const suggestions: Partial<Record<ChatScenarioId, string[]>> = {
    daily: ["继续听我说今天的事", "说说你会注意到什么", "换个轻松的话题"],
    emotion: ["帮我给这种感受起个名字", "先陪我待一会儿", "我想说说事情经过"],
    study: ["一起拆出第一步", "帮我找到卡住的原因", "先聊聊我的学习节奏"],
    career: ["梳理我最看重的条件", "比较两个现实选择", "先谈谈我害怕失去什么"],
    interest: ["听我继续安利", "从你的视角聊聊它", "分享一个相近的话题"]
  };
  return suggestions[scenarioId as ChatScenarioId] ?? ["继续聊下去", "换一个角度看看"];
}

function metadata(input: AIChatRequest, provider: string, model: string): AIResponseMetadata {
  return { mbti: input.mbti, provider, model, timestamp: Date.now() };
}

function safetyResponse(input: AIChatRequest): AIChatServiceResult {
  return {
    reply: "我很在意你现在的安全。如果你可能马上伤害自己或他人，请先远离危险物品，联系当地急救或危机干预服务，并让一位可信任的人立刻陪在你身边。请先告诉我：你现在是否有立即行动的计划，身边是否有人可以联系？",
    mode: "safety",
    emotion: "supportive",
    suggestions: ["告诉我你现在是否安全", "联系一位能立刻陪你的人"],
    model: "safety-response",
    usage: {},
    metadata: metadata(input, "safety", "safety-response")
  };
}

async function ensureNaturalReply(
  result: ProviderChatResult,
  messages: readonly ChatMessage[],
  options: ProviderChatOptions
) {
  if (!artificialAnalysisPattern.test(result.reply)) return { result, guarded: false };
  return {
    result: await new MockProvider().chat(messages, options),
    guarded: true
  };
}

export const chatService = {
  async sendMessage(input: AIChatRequest): Promise<AIChatServiceResult> {
    if (urgentSafetyPattern.test(input.userMessage)) return safetyResponse(input);

    const provider = createLLMProvider();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);
    const systemPrompt = buildPersonaSystemPrompt(input);
    const history = normalizeConversationHistory(input.conversationHistory);
    const messages: ChatMessage[] = [
      { role: "system", content: systemPrompt, timestamp: Date.now() },
      ...history,
      { role: "user", content: input.userMessage.trim().slice(0, 4000), timestamp: Date.now() }
    ];

    try {
      const options: ProviderChatOptions = {
        mbti: input.mbti,
        personaDefinition: input.personaDefinition,
        scenarioContext: input.scenarioContext,
        fallbackReply: input.fallbackReply,
        temperature: input.temperature,
        maxTokens: input.maxTokens,
        signal: controller.signal
      };
      const providerResult = await provider.chat(messages, options);
      const naturalResult = await ensureNaturalReply(providerResult, messages, options);
      const result = naturalResult.result;
      const responseProvider = naturalResult.guarded ? "mock-guard" : provider.id;

      return {
        reply: result.reply.slice(0, 4000),
        mode: responseProvider === "mock" || responseProvider === "mock-guard" ? "demo" : "live",
        emotion: inferEmotion(input.userMessage, input.scenarioContext?.id),
        suggestions: input.scenarioContext?.kind === "companion"
          ? createSuggestions(input.scenarioContext.id)
          : [],
        model: result.model,
        usage: result.usage ?? {},
        metadata: metadata(input, responseProvider, result.model)
      };
    } catch {
      return {
        reply: input.fallbackReply || "人格伙伴暂时无法回应，请稍后再试。",
        mode: "demo",
        emotion: "supportive",
        suggestions: [],
        model: provider.model,
        usage: {},
        metadata: metadata(input, provider.id, provider.model)
      };
    } finally {
      clearTimeout(timer);
    }
  }
};
