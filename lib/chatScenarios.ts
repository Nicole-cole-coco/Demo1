import type { ChatScenarioId } from "@/types/companion";

export type ChatScenario = {
  id: ChatScenarioId;
  label: string;
  shortLabel: string;
  prompt: string;
};

export const chatScenarios: readonly ChatScenario[] = [
  {
    id: "daily",
    label: "聊聊今天发生的小事",
    shortLabel: "随便聊聊",
    prompt: "想和你随便聊聊今天。先别急着分析或给建议，像熟悉的朋友一样听我说说吧。"
  },
  {
    id: "emotion",
    label: "我有一些情绪想说",
    shortLabel: "心情时刻",
    prompt: "我现在有一些说不清楚的情绪。先陪我把感受慢慢说出来，不需要立刻把它解决。"
  },
  {
    id: "study",
    label: "一起讨论学习问题",
    shortLabel: "学习讨论",
    prompt: "我最近在学习上有点卡住。请先了解具体情况，再和我一起找到一个不那么难开始的方法。"
  },
  {
    id: "career",
    label: "讨论一次职业选择",
    shortLabel: "职业方向",
    prompt: "我最近在想一个职业选择。请不要直接替我决定，陪我看清目标、现实限制和真正重视的东西。"
  },
  {
    id: "interest",
    label: "分享最近喜欢的事",
    shortLabel: "兴趣交换",
    prompt: "我想和你分享最近很喜欢的一件事。先好奇地听我讲，也可以从你的人格视角和我交换想法。"
  }
] as const;

export function getChatScenario(id?: ChatScenarioId | null) {
  return chatScenarios.find((scenario) => scenario.id === id);
}
