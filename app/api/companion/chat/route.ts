import { companionChatService } from "@/services/chat/chatService";
import { getChatScenario } from "@/lib/chatScenarios";
import type {
  CompanionChatRequest,
  CompanionConversationMessage
} from "@/services/chat/types";
import { mbtiTypes, type MbtiType } from "@/types/avatar";
import type { ChatScenarioId, CompanionGender } from "@/types/companion";

export const runtime = "nodejs";

const validMbtiTypes = new Set<MbtiType>(mbtiTypes);

function sanitizeHistory(raw: unknown): CompanionConversationMessage[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const message = item as Partial<CompanionConversationMessage>;
    if (
      (message.role !== "user" && message.role !== "assistant") ||
      typeof message.content !== "string"
    ) return [];
    const content = message.content.trim().slice(0, 4000);
    if (!content) return [];
    return [{
      role: message.role,
      content,
      timestamp: typeof message.timestamp === "number" ? message.timestamp : undefined
    }];
  }).slice(-24);
}

export async function POST(request: Request) {
  try {
    const raw = (await request.json()) as Partial<CompanionChatRequest>;
    const mbti = raw.mbti;
    const userMessage = typeof raw.userMessage === "string"
      ? raw.userMessage.trim().slice(0, 4000)
      : "";

    if (!mbti || !validMbtiTypes.has(mbti) || !userMessage) {
      return Response.json({ error: "Invalid companion chat request." }, { status: 400 });
    }

    const gender: CompanionGender = raw.gender === "male" ? "male" : "female";
    const persona = typeof raw.persona === "string" && raw.persona.trim()
      ? raw.persona.trim().slice(0, 80)
      : typeof raw.personaId === "string" && raw.personaId.trim()
        ? raw.personaId.trim().slice(0, 80)
        : mbti;
    const scenario = typeof raw.scenario === "string"
      ? getChatScenario(raw.scenario as ChatScenarioId)?.id ?? null
      : null;
    const result = await companionChatService.sendMessage({
      persona,
      mbti,
      gender,
      scenario,
      userMessage,
      conversationHistory: sanitizeHistory(raw.conversationHistory)
    });

    return Response.json({ reply: result.reply });
  } catch {
    return Response.json({ error: "Unable to continue this conversation." }, { status: 400 });
  }
}
