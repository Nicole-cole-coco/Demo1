import type { MbtiType } from "@/types/avatar";

export type MbtiResultInsight = {
  summary: string;
  strengths: readonly [string, string, string];
  relationship: string;
  underPressure: string;
  reflection: string;
};

export const mbtiResultInsights: Record<MbtiType, MbtiResultInsight> = {
  INTJ: { summary: "你倾向先看清结构和长期方向，再把复杂问题变成可执行的策略。", strengths: ["系统思考", "独立判断", "长期规划"], relationship: "你重视有内容的交流与彼此边界，信任通常来自稳定、诚实和能力感。", underPressure: "压力增大时，你可能把情绪收得更深，并试图独自控制所有变量。", reflection: "哪一件事值得先允许自己感受，而不是马上解决？" },
  INTP: { summary: "你对概念、规律和未知可能保持敏锐，喜欢在理解充分前保留答案。", strengths: ["逻辑推演", "开放探索", "发现盲点"], relationship: "你需要能够交换想法又不彼此束缚的关系，也常用分享见解表达在意。", underPressure: "信息过载时，你可能不断分析，却迟迟难以开始或表达真实需要。", reflection: "现在最小的验证动作是什么？" },
  ENTJ: { summary: "你自然关注目标、资源与推进节奏，擅长把模糊愿景转成明确行动。", strengths: ["果断推进", "组织资源", "承担责任"], relationship: "你欣赏坦率、有成长意愿的伙伴，并倾向用解决问题和兑现承诺表达重视。", underPressure: "你可能加快节奏、提高要求，却忽略自己和他人已经需要喘息。", reflection: "这次推进中，谁的感受值得被纳入方案？" },
  ENTP: { summary: "你容易捕捉新的连接与反例，在对话和试验中不断刷新问题的解法。", strengths: ["快速联想", "挑战惯例", "临场应变"], relationship: "你需要有来有回的交流、智识火花和足够自由，不喜欢关系只剩固定脚本。", underPressure: "你可能用新的可能逃开收尾，或把真正介意的事变成辩论。", reflection: "哪一个想法值得停止扩展，开始完成？" },
  INFJ: { summary: "你会同时读取人的感受与事情的走向，并努力让选择符合更深的意义。", strengths: ["洞察动机", "深度共情", "坚持价值"], relationship: "你向往真诚、稳定且有精神连接的关系，也需要自己的安静空间被尊重。", underPressure: "你可能吸收过多情绪，直到突然撤退或对自己提出过高要求。", reflection: "哪些感受属于别人，不需要由你负责？" },
  INFP: { summary: "你以真实感受和内在价值为坐标，对细微情绪、想象与意义格外敏感。", strengths: ["真诚表达", "丰富想象", "理解差异"], relationship: "你珍惜被认真看见的感觉，更愿意在安全、温柔的氛围里逐渐打开自己。", underPressure: "你可能反复检视自己的感受，因害怕违背内心而推迟现实决定。", reflection: "怎样用一个现实动作保护你在乎的价值？" },
  ENFJ: { summary: "你擅长感知群体氛围、鼓励他人，并主动让关系和共同目标向前。", strengths: ["连接他人", "清晰表达", "激发潜力"], relationship: "你愿意投入和照顾，也需要对方真实回应，而不是把你的付出视作理所当然。", underPressure: "你可能过度承担关系责任，把自己的疲惫放到最后。", reflection: "今天哪一个需要可以直接说出来？" },
  ENFP: { summary: "你被新可能、真实连接和自由探索点亮，常能让停滞的事情重新有生命力。", strengths: ["感染他人", "创造可能", "快速共鸣"], relationship: "你需要坦诚、变化与空间，也很看重彼此是否仍对这段关系怀有期待。", underPressure: "你可能同时打开太多方向，或用热闹绕开需要安静面对的感受。", reflection: "此刻最值得留下的一个可能是什么？" },
  ISTJ: { summary: "你相信事实、经验与可靠的承诺，习惯用稳定行动让复杂生活保持秩序。", strengths: ["认真负责", "关注细节", "稳定执行"], relationship: "你不一定频繁表达，但会通过记得约定、承担责任和长期在场建立信任。", underPressure: "变化失控时，你可能更紧抓原计划，并把所有责任先压到自己身上。", reflection: "哪一处计划可以留出一点弹性？" },
  ISFJ: { summary: "你敏锐注意到人的具体需要，并用细致、持续的行动守护重要关系。", strengths: ["细节照料", "稳定支持", "记忆经验"], relationship: "你看重体贴、回应和日常里的可靠，希望自己的付出被看见并得到珍惜。", underPressure: "你可能默默承担太久，等到疲惫累积才发现边界已经被越过。", reflection: "哪件事需要在委屈之前说清楚？" },
  ESTJ: { summary: "你依靠清楚标准、现实判断和执行效率，让事情按可控的方式落地。", strengths: ["明确决策", "落实计划", "维护秩序"], relationship: "你重视责任感和直接沟通，也常通过解决实际问题表达关心。", underPressure: "你可能把不确定感转化为更强控制，语气比本意更锋利。", reflection: "除了效率，这次决定还需要照顾什么？" },
  ESFJ: { summary: "你关注群体中的互动与需要，愿意主动创造让每个人都能参与的氛围。", strengths: ["热情周全", "协调关系", "实际关怀"], relationship: "你珍惜明确回应、共同仪式和有来有往的照顾，不喜欢长期猜测。", underPressure: "你可能过度在意他人的评价，或为了维持和谐忽略真实分歧。", reflection: "如果不用取悦所有人，你会怎样选择？" },
  ISTP: { summary: "你擅长冷静观察现实系统，在需要时用最直接的行动排除故障。", strengths: ["现场判断", "动手解决", "保持冷静"], relationship: "你重视信任和个人空间，通常以实际帮助而不是大量言语表达在意。", underPressure: "你可能迅速抽离情绪，只处理问题，却让重要的人不知道你的立场。", reflection: "哪一句简短表达能让对方更理解你？" },
  ISFP: { summary: "你贴近当下感受与美感，尊重个体差异，并以自然方式表达真实自己。", strengths: ["敏锐感受", "审美表达", "温和适应"], relationship: "你需要舒服、真诚且不过度控制的连接，细节往往比口号更能打动你。", underPressure: "你可能为了避免冲突先退让，直到自己的需要变得难以忽视。", reflection: "你可以温和但明确地拒绝什么？" },
  ESTP: { summary: "你对现场变化反应迅速，愿意直接尝试，并从真实反馈中判断下一步。", strengths: ["快速行动", "现实应变", "敢于尝试"], relationship: "你喜欢坦率、有活力的互动，希望问题能被当面处理，而不是留在猜测里。", underPressure: "你可能为了立即脱困而低估长期后果，或把脆弱藏在玩笑后面。", reflection: "这次行动在一周后还会带来什么？" },
  ESFP: { summary: "你敏锐感受当下的人和氛围，能用热情、表达与行动创造真实连接。", strengths: ["活力表达", "带动氛围", "关注当下"], relationship: "你珍惜可感知的回应、共同体验和真心流露，希望关系是活着的。", underPressure: "你可能急着让气氛变好，而没有给难过或冲突足够停留时间。", reflection: "哪一种不舒服值得被认真听完？" }
};
