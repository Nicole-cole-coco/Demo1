import type { ChatResponse, ChatServiceInput } from "@/types/chat";
import type { CompanionChatResponse } from "@/services/chat/types";

const inferEmotion = (input: ChatServiceInput): ChatResponse["emotion"] => {
  if (input.scenario === "study" || input.scenario === "career" || /工作|学习|计划|选择/.test(input.userMessage)) return "focused";
  if (input.scenario === "interest" || /喜欢|开心|期待|有趣/.test(input.userMessage)) return "energized";
  if (input.scenario === "emotion" || /难过|焦虑|委屈|失望|失落|孤独|累/.test(input.userMessage)) return "supportive";
  if (/为什么|怎么|可能|好奇/.test(input.userMessage)) return "curious";
  return "calm";
};

const followUpSuggestions = (input: ChatServiceInput) => {
  if (input.scenario === "emotion") return ["我想继续说说事情经过", "先陪我待一会儿"];
  if (input.scenario === "study") return ["聊聊我卡住的地方", "一起找一个能开始的小动作"];
  if (input.scenario === "career") return ["说说我最担心失去什么", "一起看看两个现实选择"];
  if (input.scenario === "interest") return ["听我继续分享", "说说你的真实看法"];
  return ["继续聊刚才的事", "换个轻松的话题"];
};

const fallbackResponse = (input: ChatServiceInput): ChatResponse => ({
  reply: "刚才连接没有成功，但这段话没有丢失。等连接恢复后，我们可以从这里继续。",
  mode: "demo",
  emotion: "supportive",
  suggestions: ["继续说说刚才的事", "换一个轻松的话题"],
  model: "unavailable",
  usage: {},
  metadata: {
    mbti: input.mbti,
    provider: "client-fallback",
    model: "unavailable",
    timestamp: Date.now()
  }
});

export const ChatService = {
  async send(input: ChatServiceInput): Promise<ChatResponse> {
    try {
      const response = await fetch("/api/companion/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona: input.mbti,
          mbti: input.mbti,
          gender: input.gender,
          userMessage: input.userMessage,
          conversationHistory: input.conversationHistory
        })
      });

      if (!response.ok) return fallbackResponse(input);
      const payload = (await response.json()) as Partial<CompanionChatResponse>;
      if (!payload.reply) return fallbackResponse(input);

      return {
        reply: payload.reply,
        mode: "demo",
        emotion: inferEmotion(input),
        model: "persona-conversation",
        usage: {},
        suggestions: followUpSuggestions(input),
        metadata: {
          mbti: input.mbti,
          provider: "companion-chat",
          model: "persona-conversation",
          timestamp: Date.now()
        }
      };
    } catch {
      return fallbackResponse(input);
    }
  }
};
