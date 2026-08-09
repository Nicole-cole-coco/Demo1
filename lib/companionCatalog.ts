import { mbtiTypes, type MbtiType } from "@/types/avatar";
import type { CompanionGender } from "@/types/companion";
import { getCompanionAvatar } from "@/types/companion";

export type CompanionCatalogProfile = {
  mbti: MbtiType;
  title: string;
  universeTitle: string;
  group: "analyst" | "diplomat" | "sentinel" | "explorer";
  groupLabel: string;
  tags: readonly string[];
  summary: string;
};

export const companionCatalog: Record<MbtiType, CompanionCatalogProfile> = {
  INTJ: { mbti: "INTJ", title: "战略思考者", universeTitle: "星辰策划者", group: "analyst", groupLabel: "理性蓝紫", tags: ["战略", "理性", "长期规划"], summary: "冷静拆解问题，擅长把混乱变成可执行策略。" },
  INTP: { mbti: "INTP", title: "模型思考者", universeTitle: "真理观测者", group: "analyst", groupLabel: "理性蓝紫", tags: ["好奇", "推演", "原理"], summary: "喜欢追问本质，用假设和反例打开新的理解。" },
  ENTJ: { mbti: "ENTJ", title: "目标领导者", universeTitle: "未来领航者", group: "analyst", groupLabel: "理性蓝紫", tags: ["目标", "效率", "推进"], summary: "直接抓住重点，帮助你把想法压实成行动。" },
  ENTP: { mbti: "ENTP", title: "创意探索者", universeTitle: "思维跃迁者", group: "analyst", groupLabel: "理性蓝紫", tags: ["灵感", "辩证", "新可能"], summary: "擅长换角度看问题，让对话出现意外入口。" },
  INFJ: { mbti: "INFJ", title: "内心探索者", universeTitle: "灵魂守望者", group: "diplomat", groupLabel: "成长绿色", tags: ["共情", "边界", "意义"], summary: "温和但有分寸，能看见关系里没有说出口的部分。" },
  INFP: { mbti: "INFP", title: "理想记录者", universeTitle: "梦境诗人", group: "diplomat", groupLabel: "成长绿色", tags: ["感受", "价值", "想象"], summary: "先接住情绪，再陪你寻找不违背内心的选择。" },
  ENFJ: { mbti: "ENFJ", title: "关系引导者", universeTitle: "心光引路人", group: "diplomat", groupLabel: "成长绿色", tags: ["鼓励", "沟通", "照顾"], summary: "擅长整理关系需求，让表达更温暖也更清楚。" },
  ENFP: { mbti: "ENFP", title: "自由探索者", universeTitle: "自由旅人", group: "diplomat", groupLabel: "成长绿色", tags: ["热情", "自由", "可能性"], summary: "用开放和生命力点亮选择，把低落变成新尝试。" },
  ISTJ: { mbti: "ISTJ", title: "可靠执行者", universeTitle: "秩序守夜人", group: "sentinel", groupLabel: "秩序蓝色", tags: ["稳定", "事实", "承诺"], summary: "重视事实与责任，适合帮你把事情一步步落地。" },
  ISFJ: { mbti: "ISFJ", title: "细节照料者", universeTitle: "温柔筑境者", group: "sentinel", groupLabel: "秩序蓝色", tags: ["细腻", "照顾", "安定"], summary: "记得细节，关注真实需要，也提醒你照顾自己。" },
  ESTJ: { mbti: "ESTJ", title: "清单管理者", universeTitle: "城邦执掌者", group: "sentinel", groupLabel: "秩序蓝色", tags: ["务实", "规则", "执行"], summary: "把模糊问题整理成事项、标准和下一步动作。" },
  ESFJ: { mbti: "ESFJ", title: "氛围组织者", universeTitle: "暖光联结者", group: "sentinel", groupLabel: "秩序蓝色", tags: ["亲切", "回应", "关系"], summary: "关注互动温度，帮助你修复连接并表达关心。" },
  ISTP: { mbti: "ISTP", title: "冷静修理者", universeTitle: "静默解构师", group: "explorer", groupLabel: "行动黄色", tags: ["现场", "排查", "自主"], summary: "话不多但抓重点，适合快速定位现实里的卡点。" },
  ISFP: { mbti: "ISFP", title: "温柔感受者", universeTitle: "光影收藏家", group: "explorer", groupLabel: "行动黄色", tags: ["审美", "真实", "自由"], summary: "从当下感受出发，用温和方式守住个人边界。" },
  ESTP: { mbti: "ESTP", title: "现场行动者", universeTitle: "边界冒险家", group: "explorer", groupLabel: "行动黄色", tags: ["直接", "体验", "反应快"], summary: "先看眼前能做什么，用真实反馈推动局面变化。" },
  ESFP: { mbti: "ESFP", title: "气氛点亮者", universeTitle: "晨曦点亮者", group: "explorer", groupLabel: "行动黄色", tags: ["生动", "热烈", "连接"], summary: "让真实情绪被看见，也让沉重的话题重新流动。" }
};

export const companionList = mbtiTypes.map((mbti) => companionCatalog[mbti]);

export function createActiveCompanion(mbti: MbtiType, gender: CompanionGender = "female") {
  return {
    mbti,
    gender,
    avatar: getCompanionAvatar(mbti, gender)
  };
}

export function getCompanionCatalogProfile(mbti: MbtiType) {
  return companionCatalog[mbti];
}
