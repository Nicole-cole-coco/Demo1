import { getPersonaDefinition } from "@/lib/personas";
import { getChatScenario } from "@/lib/chatScenarios";
import { chatService as modelChatService } from "@/services/ai/chatService";
import {
  buildCompanionModePrompt,
  buildCompanionPersonaPrompt
} from "@/services/chat/personaPrompt";
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
    const scenario = getChatScenario(input.scenario) ?? getChatScenario("daily");
    const scenarioId = scenario?.id ?? "daily";

    const result = await modelChatService.sendMessage({
      userMessage: input.userMessage,
      mbti: input.mbti,
      gender: input.gender ?? "female",
      personaDefinition: persona,
      conversationHistory: input.conversationHistory,
      scenarioContext: {
        kind: "companion",
        id: scenarioId,
        title: scenario?.label ?? "日常人格交流",
        description: scenario?.prompt
      },
      responseInstructions: [personaGuide, buildCompanionModePrompt(scenarioId)],
      temperature: 0.82,
      maxTokens: 700
    });

    return {
      reply: result.reply
    };
  }
};
