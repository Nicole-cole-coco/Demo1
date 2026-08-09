import { getPersonaDefinition } from "@/lib/personas";
import { chatService as modelChatService } from "@/services/ai/chatService";
import { buildCompanionPersonaPrompt } from "@/services/chat/personaPrompt";
import type {
  CompanionChatRequest,
  CompanionChatResponse
} from "@/services/chat/types";

export const companionChatService = {
  async sendMessage(input: CompanionChatRequest): Promise<CompanionChatResponse> {
    const persona = getPersonaDefinition(input.mbti);
    const personaGuide = buildCompanionPersonaPrompt({
      mbti: input.mbti,
      personality: persona.coreMotivations,
      speakingStyle: persona.speakingStyle.tone,
      relationshipStyle: persona.relationshipNeeds
    });

    const result = await modelChatService.sendMessage({
      userMessage: input.userMessage,
      mbti: input.mbti,
      gender: input.gender ?? "female",
      personaDefinition: persona,
      conversationHistory: input.conversationHistory,
      scenarioContext: {
        kind: "companion",
        id: "daily",
        title: "日常人格交流"
      },
      responseInstructions: [personaGuide],
      temperature: 0.82,
      maxTokens: 700
    });

    return {
      reply: result.reply
    };
  }
};
