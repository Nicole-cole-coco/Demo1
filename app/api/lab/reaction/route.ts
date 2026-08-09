import { getLabScenario } from "@/lib/labScenarios";
import { getPersonaDefinition } from "@/lib/personas";
import { chatService } from "@/services/ai/chatService";
import type { ChatMessageInput } from "@/services/ai/types";
import { mbtiTypes, type MbtiType } from "@/types/avatar";
import type { LabScenarioId, RelationshipMetric, RelationshipState } from "@/types/lab";

export const runtime = "nodejs";

const validMbtiTypes = new Set<MbtiType>(mbtiTypes);

type ReactionRequest = {
  scenarioId?: LabScenarioId;
  stageId?: string;
  optionId?: string;
  mbti?: MbtiType;
  story?: string;
  characterMessage?: string;
  history?: Array<{ choice?: string; reaction?: string }>;
  relationshipState?: Partial<RelationshipState>;
};

const relationshipMetrics: RelationshipMetric[] = [
  "trust", "emotionalConnection", "communication", "conflictLevel", "understanding"
];

const cleanText = (value: unknown, limit: number) =>
  typeof value === "string" ? value.trim().slice(0, limit) : "";

function cleanRelationshipState(raw: ReactionRequest["relationshipState"]) {
  return relationshipMetrics.reduce<Record<string, number>>((state, metric) => {
    const value = raw?.[metric];
    if (typeof value === "number" && Number.isFinite(value)) {
      state[metric] = Math.max(0, Math.min(100, Math.round(value)));
    }
    return state;
  }, {});
}

function historyToMessages(history: ReactionRequest["history"]): ChatMessageInput[] {
  if (!Array.isArray(history)) return [];
  const baseTime = Date.now() - history.length * 2000;

  return history.slice(-10).flatMap((item, index) => {
    const choice = cleanText(item.choice, 180);
    const reaction = cleanText(item.reaction, 260);
    const messages: ChatMessageInput[] = [];
    if (choice) messages.push({ role: "user", content: choice, timestamp: baseTime + index * 2000 });
    if (reaction) messages.push({ role: "assistant", content: reaction, timestamp: baseTime + index * 2000 + 1000 });
    return messages;
  });
}

function relationshipEmotionInstruction(raw: ReactionRequest["relationshipState"]) {
  const conflict = raw?.conflictLevel ?? 20;
  const trust = raw?.trust ?? 50;
  const connection = raw?.emotionalConnection ?? 50;

  if (conflict >= 68 || trust <= 28) {
    return "角色已经明显防御，对轻易承诺保持怀疑；语气更短、更谨慎，不要因为一句正确回应立刻恢复亲近。";
  }
  if (conflict >= 50 || connection <= 40) {
    return "角色仍有失望和犹豫，会回应但不会马上完全相信；让前几轮未解决的问题留在语气里。";
  }
  if (trust >= 65 && connection >= 60 && conflict <= 35) {
    return "角色感到关系正在回暖，可以更坦诚地说出真实需要，但仍记得此前发生过的伤害。";
  }
  return "角色愿意继续谈，但还在观察用户是否言行一致；保持克制的希望，不要突然热烈和解。";
}

export async function POST(request: Request) {
  try {
    const raw = (await request.json()) as ReactionRequest;
    if (!raw.scenarioId || !raw.stageId || !raw.optionId || !raw.mbti) {
      return Response.json({ error: "Invalid reaction request." }, { status: 400 });
    }
    if (!validMbtiTypes.has(raw.mbti)) {
      return Response.json({ error: "Invalid persona." }, { status: 400 });
    }

    const scenario = getLabScenario(raw.scenarioId);
    const stage = scenario?.stages.find((item) => item.id === raw.stageId);
    const option = stage?.options.find((item) => item.id === raw.optionId);
    if (!scenario || !stage || !option || !scenario.targetMbtis.includes(raw.mbti)) {
      return Response.json({ error: "Unknown story node." }, { status: 400 });
    }

    const canonicalReaction = option.reactions?.[raw.mbti] ?? option.reaction;
    const story = cleanText(raw.story, 500);
    const characterMessage = cleanText(raw.characterMessage, 300);
    const result = await chatService.sendMessage({
      userMessage: [
        story ? `当前剧情：${story}` : "",
        characterMessage ? `角色上一句：${characterMessage}` : "",
        `用户选择：${option.label}`,
        `标准反应方向：${canonicalReaction}`
      ].filter(Boolean).join("\n"),
      mbti: raw.mbti,
      gender: "female",
      personaDefinition: getPersonaDefinition(raw.mbti),
      conversationHistory: historyToMessages(raw.history),
      scenarioContext: {
        kind: "relationship-lab",
        id: scenario.id,
        title: scenario.title,
        relationship: scenario.relationship,
        description: scenario.theme,
        chapter: stage.chapter,
        chapterTitle: stage.chapterTitle,
        nodeId: stage.id,
        state: cleanRelationshipState(raw.relationshipState)
      },
      responseInstructions: [
        "只输出角色此刻说的话，1 到 3 句，最多 180 个汉字。",
        "记住最近互动中的承诺、失望和未解决问题，让情绪变化具有连续性。",
        relationshipEmotionInstruction(raw.relationshipState),
        "关系状态只用于决定信任、防御和亲近程度，不得说出数值或系统术语。",
        "不得分析用户、给沟通建议或总结选择优缺点。",
        "必须保留标准反应方向中的事实、情绪和剧情后果，不得创造新事件。"
      ],
      fallbackReply: canonicalReaction,
      temperature: 0.82,
      maxTokens: 300
    });

    return Response.json({
      reply: result.reply.slice(0, 220),
      mode: result.mode === "live" ? "live" : "scripted",
      model: result.model,
      usage: result.usage,
      metadata: result.metadata
    });
  } catch {
    return Response.json({ error: "Unable to process reaction request." }, { status: 400 });
  }
}
