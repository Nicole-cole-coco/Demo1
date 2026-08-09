import { getChatScenario } from "@/lib/chatScenarios";
import { getPersonaDefinition } from "@/lib/personas";
import { chatService } from "@/services/ai/chatService";
import type { ChatMessageInput } from "@/services/ai/types";
import { mbtiTypes, type MbtiType } from "@/types/avatar";
import type { ChatRequest, ChatResponse, ChatServiceInput } from "@/types/chat";
import type { ChatScenarioId, CompanionGender } from "@/types/companion";

export const runtime = "nodejs";

const validMbtiTypes = new Set<MbtiType>(mbtiTypes);
const validScenarios = new Set<ChatScenarioId>([
  "daily", "emotion", "study", "career", "interest",
  "conflict", "relationship", "opinion", "action"
]);

function sanitizeHistory(history: unknown): ChatMessageInput[] {
  if (!Array.isArray(history)) return [];

  return history
    .filter((item): item is ChatMessageInput => {
      if (!item || typeof item !== "object") return false;
      const candidate = item as Partial<ChatMessageInput>;
      return (
        (candidate.role === "user" || candidate.role === "assistant") &&
        typeof candidate.content === "string"
      );
    })
    .map((item) => ({
      role: item.role,
      content: item.content.trim().slice(0, 4000),
      timestamp: typeof item.timestamp === "number" ? item.timestamp : undefined
    }))
    .filter((item) => item.content.length > 0)
    .slice(-24);
}

export async function POST(request: Request) {
  try {
    const raw = (await request.json()) as Partial<ChatRequest & ChatServiceInput>;
    const rawMessage = raw.userMessage ?? raw.message;
    const userMessage = typeof rawMessage === "string" ? rawMessage.trim().slice(0, 4000) : "";
    const requestedMbti = raw.mbti ?? raw.persona?.mbti;

    if (!userMessage || !requestedMbti || !validMbtiTypes.has(requestedMbti)) {
      return Response.json({ error: "Invalid chat request." }, { status: 400 });
    }

    const requestedGender = raw.gender ?? raw.persona?.gender;
    const gender: CompanionGender = requestedGender === "male" ? "male" : "female";
    const scenarioId = raw.scenario && validScenarios.has(raw.scenario) ? raw.scenario : null;
    const scenario = getChatScenario(scenarioId);
    const userMbti = raw.userMbti && validMbtiTypes.has(raw.userMbti) ? raw.userMbti : undefined;

    const result = await chatService.sendMessage({
      userMessage,
      mbti: requestedMbti,
      gender,
      // Persona is always resolved server-side so clients cannot weaken system rules.
      personaDefinition: getPersonaDefinition(requestedMbti),
      conversationHistory: sanitizeHistory(raw.conversationHistory ?? raw.history),
      userMbti,
      scenarioContext: {
        kind: "companion",
        id: scenarioId ?? undefined,
        title: scenario?.label,
        description: scenario?.prompt
      }
    });

    return Response.json(result satisfies ChatResponse);
  } catch {
    return Response.json({ error: "Unable to process chat request." }, { status: 400 });
  }
}
