import type { MbtiType } from "@/types/avatar";

export type SceneId = "argument" | "breakup" | "opinion" | "reminder";

export type SceneDefinition = {
  id: SceneId;
  label: string;
  prompt: string;
  placeholder: string;
  defaultContext: string;
};

export type MbtiPlaygroundProfile = {
  title: string;
  group: string;
  keywords: readonly string[];
  attention: string;
  voice: string;
  action: string;
  care: string;
};

export type ScenarioResult = {
  title: string;
  summary: string;
  sections: Array<{ label: string; content: string }>;
  shareText: string;
};

export const sceneDefinitions: readonly SceneDefinition[] = [
  {
    id: "argument",
    label: "吵架现场",
    prompt: "看看它会怎么接住一场争执",
    placeholder: "例如：对方临时取消了约好的周末计划",
    defaultContext: "对方临时取消了约好的周末计划"
  },
  {
    id: "breakup",
    label: "分手挽回",
    prompt: "看看它会不会挽回，以及怎么表达",
    placeholder: "例如：两个人因为沟通变少，决定先冷静一段时间",
    defaultContext: "两个人因为沟通变少，决定先冷静一段时间"
  },
  {
    id: "opinion",
    label: "观点碰撞",
    prompt: "把同一个问题交给它来判断",
    placeholder: "例如：毕业后应该留在大城市还是回家乡",
    defaultContext: "毕业后应该留在大城市还是回家乡"
  },
  {
    id: "reminder",
    label: "督促记事",
    prompt: "看它会用什么方式催你行动",
    placeholder: "例如：今晚完成作品集的第一版",
    defaultContext: "今晚完成作品集的第一版"
  }
];

export const mbtiPlaygroundProfiles: Record<MbtiType, MbtiPlaygroundProfile> = {
  INTJ: { title: "战略规划师", group: "分析家", keywords: ["有计划", "独立", "高标准"], attention: "先看目标、路径和长期代价", voice: "冷静直接，先给结论再解释逻辑", action: "迅速拆解问题，安排一个可执行的下一步", care: "希望自己的判断被认真对待" },
  INTP: { title: "好奇研究者", group: "分析家", keywords: ["好奇", "灵活", "爱推演"], attention: "先确认概念、证据和有没有别的可能", voice: "边思考边修正，喜欢抛出一个反问", action: "把问题拆成假设，先找最有意思的变量", care: "希望保留探索和改变答案的空间" },
  ENTJ: { title: "行动指挥官", group: "分析家", keywords: ["果断", "目标感", "推进力"], attention: "先看结果、效率和谁能推动事情前进", voice: "有节奏、有要求，习惯把话题拉回重点", action: "直接确定方案、负责人和时间点", care: "希望关系和合作都能持续向前" },
  ENTP: { title: "灵感辩手", group: "分析家", keywords: ["机敏", "好辩", "新鲜"], attention: "先找盲点、反例和更好玩的解法", voice: "机灵带梗，喜欢用问题打开新的方向", action: "提出一个意外方案，观察对方的反应", care: "希望对话有来有回，而不是被简单定论" },
  INFJ: { title: "洞察守护者", group: "外交家", keywords: ["深度", "共情", "有边界"], attention: "先读懂情绪、关系的走向和没说出口的需要", voice: "温和但有分寸，会把重点说得很准确", action: "先让情绪落地，再寻找双方都能接受的表达", care: "希望真诚被看见，也希望边界被尊重" },
  INFP: { title: "理想记录者", group: "外交家", keywords: ["敏感", "真诚", "重意义"], attention: "先确认这件事是否违背了内心重要的价值", voice: "柔软具体，常用感受和画面表达自己", action: "先独处整理感受，再决定要不要开口", care: "希望自己的真心不被轻易否定" },
  ENFJ: { title: "关系发动机", group: "外交家", keywords: ["体贴", "感染力", "会照顾人"], attention: "先看每个人的感受，以及怎样让关系继续流动", voice: "温暖清晰，会给出照顾彼此的建议", action: "主动召集沟通，把模糊的情绪说清楚", care: "希望大家都被照顾到，而不是只有一个人妥协" },
  ENFP: { title: "热烈探索者", group: "外交家", keywords: ["热情", "自由", "会联想"], attention: "先看可能性、真实感受和有没有新的出口", voice: "有感染力，想到什么就想和你分享", action: "先释放情绪，再提出一个重新开始的可能", care: "希望关系里还有真诚、空间和期待" },
  ISTJ: { title: "可靠执行者", group: "守护者", keywords: ["靠谱", "负责", "重承诺"], attention: "先看事实、约定和已经被影响的安排", voice: "克制具体，不喜欢把问题说得太戏剧化", action: "核对事实，按照约定补救并重新排期", care: "希望彼此说过的话算数" },
  ISFJ: { title: "细节照料者", group: "守护者", keywords: ["细腻", "稳定", "记得住"], attention: "先看对方真正需要什么，以及哪些细节被忽略了", voice: "轻声但具体，会记得你之前说过的话", action: "先照顾当下，再用小而稳定的行动修复", care: "希望自己的付出被珍惜，而不是被当成理所当然" },
  ESTJ: { title: "清单管理者", group: "守护者", keywords: ["务实", "利落", "执行强"], attention: "先看事实、责任和下一步怎么落地", voice: "直白有条理，喜欢把问题变成任务", action: "给出明确要求，立刻处理最影响结果的部分", care: "希望大家都对自己的选择负责" },
  ESFJ: { title: "热心组织者", group: "守护者", keywords: ["亲切", "周全", "重关系"], attention: "先看谁被冷落了、关系如何恢复舒服", voice: "亲切外向，会把关心说出来", action: "主动确认感受，再安排一次让大家安心的沟通", care: "希望关系里有回应、有礼貌、有来有往" },
  ISTP: { title: "冷静修理师", group: "探险家", keywords: ["冷静", "动手", "自由"], attention: "先看实际故障、可用资源和最短解决路径", voice: "话不多但很精准，必要时用行动代替解释", action: "先解决眼前最具体的问题，再决定要不要复盘", care: "希望被信任，也希望有自己的处理空间" },
  ISFP: { title: "温柔感受派", group: "探险家", keywords: ["审美", "温和", "随心"], attention: "先看当下感受、氛围和有没有伤到谁", voice: "自然柔和，喜欢用真实体验说话", action: "先给彼此一点空间，用细节表达在意", care: "希望关系保持舒服，不必被迫表演成熟" },
  ESTP: { title: "现场行动派", group: "探险家", keywords: ["直接", "敏捷", "敢试"], attention: "先看现场发生了什么，以及现在能做什么", voice: "直接鲜活，常常先行动再解释", action: "马上处理最紧急的点，用结果打破僵局", care: "希望事情别停在原地，关系也别只靠猜" },
  ESFP: { title: "气氛点亮者", group: "探险家", keywords: ["可爱", "热烈", "感染力"], attention: "先看现场的情绪温度和怎样让人重新有连接", voice: "生动有感染力，会用一句话把气氛拉回来", action: "先靠近、先表达，再把难题变得没那么吓人", care: "希望彼此仍然愿意分享当下" }
};

function getContext(scene: SceneId, context: string) {
  const definition = sceneDefinitions.find((item) => item.id === scene);
  return context.trim() || definition?.defaultContext || "眼前这件小事";
}

export function generateScenario(mbti: MbtiType, scene: SceneId, context: string, version = 0): ScenarioResult {
  const profile = mbtiPlaygroundProfiles[mbti];
  const event = getContext(scene, context);
  const alternate = version % 2 === 1;
  const tone = alternate ? `如果再给它一次机会，它会把话说得更${profile.keywords[1]}一点。` : profile.voice;
  const sceneLabel = sceneDefinitions.find((item) => item.id === scene)?.label ?? "人格情景";

  const sceneCopy: Record<SceneId, { title: string; sections: Array<{ label: string; content: string }>; summary: string }> = {
    argument: {
      title: `${mbti} 在这场争执里，先处理自己的重点`,
      summary: `${profile.title} 不一定马上认错，但会先用自己的方式确认：这件事到底影响了什么。`,
      sections: [
        { label: "第一反应", content: `${profile.action}。面对“${event}”，它可能先说：“我想先把发生了什么讲清楚。”` },
        { label: "会怎么说", content: `“我在意的不是输赢，而是${profile.care.replace("希望", "我们能") }。” ${tone}` },
        { label: "真正介意", content: `它更容易被${profile.attention.replace("先看", "忽略了") }刺痛，而不是被一句重话本身击中。` },
        { label: "缓和建议", content: `先承认对方的感受，再只讨论一件事。给${mbti}一点组织语言的时间，沟通通常会更有效。` }
      ]
    },
    breakup: {
      title: `${mbti} 分手后，会先把自己的需要想明白`,
      summary: `${profile.title} 的挽回不是标准答案，更像是在确认这段关系是否还有真实、平等的可能。`,
      sections: [
        { label: "第一动作", content: `${profile.action}。面对“${event}”，它可能先停下来整理，而不是马上连续发很多消息。` },
        { label: "没说出口", content: `“我其实很怕失去${profile.care.replace("希望", "的感觉") }，但我不想用委屈换你留下。”` },
        { label: "如果选择挽回", content: `它会倾向于重新确认${profile.attention.replace("先看", "") }，用一次清楚、具体、不逼迫对方的沟通开启可能性。` },
        { label: "自我保护", content: `挽回之前先问自己：这段关系有没有回应、边界和共同承担，而不是只问自己够不够努力。` }
      ]
    },
    opinion: {
      title: `${mbti} 对“${event}”的第一判断`,
      summary: `${profile.title} 会从自己的关注点出发，不代表所有这个类型的人都会做出同样选择。`,
      sections: [
        { label: "核心判断", content: `“我倾向于${profile.action.replace("先", "先去") }，再决定答案。”` },
        { label: "思考依据", content: `因为它会优先考虑${profile.attention.replace("先看", "") }，而不是只看别人已经给出的标准答案。` },
        { label: "一句话立场", content: `“${profile.care}，这件事才值得继续。”` },
        { label: "容易被误解的地方", content: `${profile.voice} 可能让人误以为它已经下定论，其实它只是习惯用自己的节奏消化信息。` }
      ]
    },
    reminder: {
      title: `${mbti} 会这样催你完成“${event}”`,
      summary: `${profile.title} 不一定用最大的声音催人，但会把行动变得更贴近它相信的方式。`,
      sections: [
        { label: "督促语气", content: `“先别想全部，现在${profile.action.replace("先", "先去") }。”` },
        { label: "第一步", content: `先把${profile.attention.replace("先看", "") }写成一个 10 分钟内能完成的小动作。` },
        { label: "完成标准", content: `做到“有结果就算开始”，不要把一次行动的标准抬到让人无法启动。` },
        { label: "打卡口令", content: alternate ? "先做一个小版本，做完再优化。" : "今天只做第一步，完成比完美更重要。" }
      ]
    }
  };

  const copy = sceneCopy[scene];
  return {
    title: copy.title,
    summary: copy.summary,
    sections: copy.sections,
    shareText: `人格剧场｜${mbti} · ${sceneLabel}\n${copy.title}\n${copy.summary}`
  };
}

const groupAccent: Record<string, string> = {
  分析家: "#7759a8",
  外交家: "#4b8969",
  守护者: "#477da8",
  探险家: "#b67935"
};

export function getGroupAccent(group: string) {
  return groupAccent[group] ?? "#24484b";
}

