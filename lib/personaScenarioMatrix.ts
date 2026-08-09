import { buildScenario, commonEndings, type ChapterScenarioSeed, type NodeSeed } from "@/lib/chapterScenarios";
import { mbtiTypes, type MbtiType } from "@/types/avatar";
import type {
  ChallengeLevel,
  PersonaMatrixLevelSlug,
  PersonaMatrixScenarioId,
  ScenarioDefinition
} from "@/types/lab";

type LevelContent = Record<ChallengeLevel, string>;

type PersonaRelationshipBlueprint = {
  mbti: MbtiType;
  coreNeed: string;
  trigger: string;
  communication: string;
  misunderstanding: string;
  challenge: string;
  strength: string;
  openingLine: string;
  pressureLine: string;
  repairLine: string;
  titles: LevelContent;
  events: LevelContent;
};

const chapterTitles = [
  "初始互动",
  "关系建立",
  "轻微摩擦",
  "观点冲突",
  "核心矛盾",
  "关系危机",
  "最终选择",
  "互动复盘"
] as const;

const levelMeta: Record<ChallengeLevel, {
  slug: PersonaMatrixLevelSlug;
  label: string;
  relationship: string;
  sceneType: ScenarioDefinition["sceneType"];
  stakes: string;
  initialRelationshipState: ScenarioDefinition["initialRelationshipState"];
}> = {
  1: {
    slug: "conversation",
    label: "普通交流",
    relationship: "新认识的伙伴",
    sceneType: "friendship",
    stakes: "关系能否从一次接触继续生长",
    initialRelationshipState: { trust: 35, emotionalConnection: 31, communication: 39, conflictLevel: 8, understanding: 30 }
  },
  2: {
    slug: "friction",
    label: "轻微冲突",
    relationship: "熟悉的朋友",
    sceneType: "friendship",
    stakes: "一次日常摩擦会成为理解入口还是持续别扭",
    initialRelationshipState: { trust: 46, emotionalConnection: 41, communication: 40, conflictLevel: 24, understanding: 37 }
  },
  3: {
    slug: "values",
    label: "价值冲突",
    relationship: "重要关系",
    sceneType: "value",
    stakes: "深层差异能否在关系中被真实容纳",
    initialRelationshipState: { trust: 49, emotionalConnection: 43, communication: 41, conflictLevel: 36, understanding: 37 }
  },
  4: {
    slug: "crisis",
    label: "关系危机",
    relationship: "亲密关系",
    sceneType: "love",
    stakes: "高压下双方是否仍能保留信任、边界和修复入口",
    initialRelationshipState: { trust: 41, emotionalConnection: 37, communication: 33, conflictLevel: 52, understanding: 33 }
  }
};

const blueprints = {
  INTJ: {
    mbti: "INTJ",
    coreNeed: "努力被理解，并在关系里获得稳定信任",
    trigger: "感受被当作即时任务，或自己的判断长期不被信任",
    communication: "先整理问题结构，再用简洁而明确的话表达",
    misunderstanding: "沉默和方案导向常被误解为冷淡",
    challenge: "在提出解决方案前，先确认对方此刻的情绪需要",
    strength: "能看见长期风险，并把承诺落实成可靠行动",
    openingLine: "我不太会用热闹证明在意，但答应的事我会认真放进计划。",
    pressureLine: "如果每次只讨论我表达得够不够温暖，真正的问题还是会留在那里。",
    repairLine: "我可以先听完，不急着修正。之后我们再一起决定怎么做。",
    titles: { 1: "并肩完成一件难事", 2: "计划外的一次失约", 3: "温度还是效率", 4: "信任被排除在计划外" },
    events: {
      1: "你和 INTJ 因一次共同项目认识，对方主动整理了所有复杂信息，却很少谈自己的感受。",
      2: "你临时改变约定，INTJ 没有发火，却开始重新评估这段关系是否可靠。",
      3: "你们对重要决定产生分歧：一方希望先照顾感受，一方坚持先解决根本问题。",
      4: "一个影响共同未来的决定被隐瞒，INTJ 发现自己从计划的参与者变成最后知情者。"
    }
  },
  INTP: {
    mbti: "INTP",
    coreNeed: "拥有思考空间，同时不因表达迟缓被判定为不在意",
    trigger: "被要求立刻给出情绪答案，或复杂问题被粗暴简化",
    communication: "通过提问、假设和反例逐步靠近真实想法",
    misunderstanding: "分析和停顿常被误解为回避或情感冷漠",
    challenge: "不等到完全想清楚，也能说出此刻有限但真实的感受",
    strength: "愿意修正判断，并能发现关系里被忽略的前提",
    openingLine: "我可能需要一点时间，但不是不想回应。我只是想把话说准确。",
    pressureLine: "越催我给结论，我越只能退回脑子里，这不是我想要的结果。",
    repairLine: "我还没想完，不过可以先告诉你：这件事确实影响到我了。",
    titles: { 1: "从冷门话题开始的友谊", 2: "迟迟没有说出口", 3: "真相与感受的争论", 4: "沉默让关系失去答案" },
    events: {
      1: "你和 INTP 因一个冷门话题聊到很晚，彼此欣赏，却不知道如何把思维默契变成日常联系。",
      2: "一次轻微误会后，INTP 反复分析原因，却一直没有回应你最在意的感受。",
      3: "你们对一件重要关系事件有完全不同的解释，事实、意义和感受开始互相竞争。",
      4: "长期没有说出口的情绪在一次去留决定中集中出现，关系已经不能继续等待完整答案。"
    }
  },
  ENTJ: {
    mbti: "ENTJ",
    coreNeed: "能力和投入被尊重，并拥有对等承担的伙伴",
    trigger: "责任模糊、决定反复，或真实异议被拖到最后才出现",
    communication: "直接抓重点，快速确认目标、责任和下一步",
    misunderstanding: "推动事情和明确标准容易被听成控制",
    challenge: "在推进结果前，为不同节奏和情绪信息留下位置",
    strength: "愿意承担后果，也能在混乱中建立行动方向",
    openingLine: "你可以不同意，越早说越好。我更在意我们能不能把问题放到桌面上。",
    pressureLine: "我语气变硬不是因为你不能反对，是因为我感觉所有人都在等问题自己消失。",
    repairLine: "先停一下。我想听清你的顾虑，再决定这件事怎样推进。",
    titles: { 1: "一起推进的默契", 2: "谁来做最后决定", 3: "目标与平等的拉扯", 4: "控制失效后的关系" },
    events: {
      1: "你和 ENTJ 在一次合作中认识，对方高效可靠，也很自然地承担了主导位置。",
      2: "一个小决定被 ENTJ 直接拍板，你认可效率，却感到自己没有真正参与。",
      3: "共同目标遭遇分歧：ENTJ 强调结果，你更在意过程中的平等和承受感。",
      4: "一次重大失败让 ENTJ 加强控制，其他人逐渐停止说真话，重要关系来到断裂边缘。"
    }
  },
  ENTP: {
    mbti: "ENTP",
    coreNeed: "保留思想自由，并在分歧中仍被当作值得靠近的人",
    trigger: "观点挑战被理解为人身否定，或话题被禁止继续讨论",
    communication: "用反问、联想和观点碰撞保持交流活力",
    misunderstanding: "好奇和辩论欲常被误解为只想赢",
    challenge: "察觉对方已经受伤时，先保护关系再继续讨论",
    strength: "能打开新角度，也愿意在证据变化时调整立场",
    openingLine: "不同意不代表我在否定你。恰恰是因为认真，我才想把这个问题聊透。",
    pressureLine: "我知道自己越说越像在比赛，可我不想用假装同意换和平。",
    repairLine: "先不辩了。你刚才真正被刺到的是哪一句？",
    titles: { 1: "从一次反问开始", 2: "玩笑越过了边界", 3: "讨论还是否定", 4: "赢下争论，失去关系" },
    events: {
      1: "你和 ENTP 从一次意外反问开始熟悉，观点差异反而让交流充满吸引力。",
      2: "ENTP 在朋友面前开的玩笑越过了你的边界，对方起初以为你只是没有接住幽默。",
      3: "一场价值讨论持续升级，双方开始把不同观点理解成对彼此的否定。",
      4: "ENTP 在关键争论中证明了自己的逻辑，却发现重要的人已经不愿再开口。"
    }
  },
  INFJ: {
    mbti: "INFJ",
    coreNeed: "深度理解、真实回应和不会因边界而消失的连接",
    trigger: "长期只被当作倾听者，或自己的隐性需要反复被忽略",
    communication: "先观察关系脉络，再温和表达更深层的意义",
    misunderstanding: "敏锐观察容易被误解为读心，沉默忍耐又容易被当作没有需要",
    challenge: "在失望累积前，直接说出需要和边界",
    strength: "能识别言外之意，并为复杂情绪保留安全空间",
    openingLine: "我愿意听你说，也想知道我们是不是能慢慢说到真正重要的地方。",
    pressureLine: "我不是突然变远，只是有些话等了太久，后来不知道还要不要再说。",
    repairLine: "我不想再靠你猜。让我把真正需要的部分说清楚。",
    titles: { 1: "一场逐渐深入的谈话", 2: "没有说出的期待", 3: "理解别人还是表达自己", 4: "沉默累积成距离" },
    events: {
      1: "你和 INFJ 在一次深谈中建立连接，对方认真记住了许多你没有刻意强调的细节。",
      2: "INFJ 期待你主动察觉一件小事，却在落空后只说没关系。",
      3: "关系里所有人的需要都被照顾，只有 INFJ 的真实边界始终没有被放进决定。",
      4: "多次未说出口的失望累积成疏离，INFJ 开始怀疑这段关系是否仍然真实。"
    }
  },
  INFP: {
    mbti: "INFP",
    coreNeed: "真实感受和核心价值被理解，而不是被快速纠正",
    trigger: "珍视的意义被嘲讽，或为了现实被要求背叛自己",
    communication: "从感受和价值出发，用温和但坚定的方式表达",
    misunderstanding: "理想和敏感常被误解为不成熟或无法面对现实",
    challenge: "守住价值的同时，也承担现实选择带来的具体责任",
    strength: "能看见选择对人的意义，并维持高度真诚的连接",
    openingLine: "我不需要你马上同意，只希望你先别把我在意的东西当成可笑。",
    pressureLine: "如果所谓现实只允许我不断缩小自己，那我不知道留下还有什么意义。",
    repairLine: "我愿意看现实代价，但也想一起守住那个不能轻易放弃的部分。",
    titles: { 1: "分享彼此珍惜的世界", 2: "一句无心的否定", 3: "理想与现实如何共存", 4: "价值被背叛以后" },
    events: {
      1: "你和 INFP 因一次创作分享认识，对方愿意带你进入很少展示给别人的内心世界。",
      2: "你随口否定了 INFP 珍视的选择，对方没有争辩，却明显收回了表达。",
      3: "你们面对一项现实决定：坚持理想会付出成本，妥协会让一方失去内在一致。",
      4: "一个被共同承诺保护的价值最终被放弃，INFP 认为关系背叛了最初相信的东西。"
    }
  },
  ENFJ: {
    mbti: "ENFJ",
    coreNeed: "付出获得双向回应，也能被允许不总是成熟和有用",
    trigger: "照顾被视为理所当然，或善意被误解为干涉",
    communication: "先确认各方需要，再推动一次能恢复连接的沟通",
    misunderstanding: "主动协调和帮助容易被理解为控制他人生活",
    challenge: "不替所有人承担情绪，并清楚表达自己的需要",
    strength: "能建立共同目标，让不同的人重新愿意彼此回应",
    openingLine: "我很自然会注意大家需要什么，不过我也在学着先问你愿不愿意。",
    pressureLine: "我一直在让所有人舒服，可好像没有人问过我还能不能继续。",
    repairLine: "这次我不替你决定，也不隐藏自己的需要。我们各自说清一部分。",
    titles: { 1: "被认真照顾的一天", 2: "替你决定的善意", 3: "帮助别人还是照顾自己", 4: "付出耗尽后的离开" },
    events: {
      1: "ENFJ 在一次共同活动中自然照顾到每个人，也让你第一次感到自己被具体看见。",
      2: "ENFJ 出于好意替你拒绝安排，你却感到自己的选择权被拿走。",
      3: "关系中的照顾责任不断落到 ENFJ 身上，对方开始在帮助别人和保护自己之间拉扯。",
      4: "长期过度承担后，ENFJ 第一次停止修复所有人的关系，并认真考虑离开。"
    }
  },
  ENFP: {
    mbti: "ENFP",
    coreNeed: "真实的情绪连接，以及在承诺中仍保有成长和自由",
    trigger: "稳定被变成控制，或热情分享长期得不到回应",
    communication: "用鲜明感受和新可能快速打开交流",
    misunderstanding: "兴趣变化和自发行动容易被误解为不可靠",
    challenge: "让自由包含告知、承担和持续回应",
    strength: "能为关系带来活力，也愿意把变化变成共同探索",
    openingLine: "我喜欢事情还有可能，也希望你知道，我的变化不等于把你留在原地。",
    pressureLine: "我不是害怕承诺，我害怕承诺最后只剩下一套不能呼吸的规则。",
    repairLine: "我会回来把话说完。自由不应该让你一直靠猜。",
    titles: { 1: "一起发现新的可能", 2: "临时改变的约定", 3: "自由是否意味着不承诺", 4: "热烈之后的失联" },
    events: {
      1: "你和 ENFP 因一次临时活动认识，对方很快把普通的一天变成共同探索。",
      2: "ENFP 因新机会临时改变约定，你理解兴奋，却感到原来的承诺被降级。",
      3: "你们对稳定关系的定义不同：一方需要明确计划，一方害怕计划消灭成长空间。",
      4: "热烈靠近之后，ENFP 在高压期突然减少联系，关系陷入自由与责任的最终考验。"
    }
  },
  ISTJ: {
    mbti: "ISTJ",
    coreNeed: "约定被认真对待，并在可预期关系里建立信任",
    trigger: "反复失约、事实被忽略，或重大变化没有准备时间",
    communication: "按发生顺序说明事实、责任和可执行步骤",
    misunderstanding: "坚持规则和历史经验常被误解为僵硬",
    challenge: "承认变化的合理性，并为弹性设计清楚边界",
    strength: "用长期一致的行动守住关系和共同责任",
    openingLine: "不用把每件事定死，但已经答应的部分，我希望它真的算数。",
    pressureLine: "我反对的不是变化，是每次变化都默认由别人承担后果。",
    repairLine: "把影响和新的时间点说清楚，我愿意重新调整计划。",
    titles: { 1: "从可靠小事建立信任", 2: "计划突然被打乱", 3: "规则与弹性的分歧", 4: "承诺反复失效" },
    events: {
      1: "你和 ISTJ 从一次准时、可靠的小合作开始熟悉，对方很少热烈表达，却始终记得约定。",
      2: "一个共同计划被临时打乱，ISTJ 看见的不只是变化，还有前期投入是否被尊重。",
      3: "你们对生活规则产生深层分歧：一方依靠稳定获得安全，一方希望随时调整。",
      4: "多次承诺未被履行，ISTJ 不再接受口头保证，并开始考虑退出共同计划和关系。"
    }
  },
  ISFJ: {
    mbti: "ISFJ",
    coreNeed: "长期付出被看见，也能安全地表达自己的需要",
    trigger: "重要细节被忘记，或照顾被当作默认责任",
    communication: "通过具体关心和温和提醒维持连接",
    misunderstanding: "不主动抱怨容易被误解为没有需求",
    challenge: "在委屈变成撤退前，明确请求和拒绝",
    strength: "能记住关系里的细节，并提供稳定而实际的支持",
    openingLine: "我愿意照顾这些小事，但也希望有一天不用等到累了才被发现。",
    pressureLine: "我说没关系太多次了，后来连自己都不知道还能怎么开口。",
    repairLine: "这次我直接说需要什么，也请你告诉我真正能做到什么。",
    titles: { 1: "日常细节里的靠近", 2: "被默认的那次付出", 3: "照顾别人还是表达自己", 4: "长期忽略后的收回" },
    events: {
      1: "ISFJ 从记住一件小事开始靠近，让你在普通日常中感到被认真照顾。",
      2: "ISFJ 默默补上了一次遗漏，却在付出被默认后第一次显出失望。",
      3: "家庭和关系责任长期落在 ISFJ 身上，对方必须在维持稳定与表达自己之间选择。",
      4: "多年照顾没有获得回应，ISFJ 开始收回所有主动付出，并重新判断关系是否值得继续。"
    }
  },
  ESTJ: {
    mbti: "ESTJ",
    coreNeed: "责任对等、标准清楚，并能看见可靠结果",
    trigger: "推诿、反复失约，或问题长期停在模糊情绪中",
    communication: "明确事实、责任、完成标准和时间点",
    misunderstanding: "务实直接的推进方式容易被听成训斥",
    challenge: "把情绪视为影响合作质量的真实信息",
    strength: "能建立秩序，并让共同承诺真正落地",
    openingLine: "把责任说清不是为了责怪谁，是为了下次不用再靠猜。",
    pressureLine: "我承认语气太硬，但问题一直没人承担，我很难假装一切正常。",
    repairLine: "先说这件事对你造成了什么，再一起确认下一步由谁负责。",
    titles: { 1: "把事情一起做成", 2: "效率压过了情绪", 3: "标准与人情的冲突", 4: "团队不再愿意说真话" },
    events: {
      1: "你和 ESTJ 在一次任务中建立默契，对方清晰可靠，让合作很快进入稳定节奏。",
      2: "ESTJ 为了尽快解决小问题跳过情绪回应，你感到自己只被当成执行环节。",
      3: "共同规则遇到特殊人情，一方坚持标准一致，一方认为关系需要例外。",
      4: "高压下 ESTJ 不断加强要求，团队和亲近的人逐渐不再暴露问题，信任接近崩塌。"
    }
  },
  ESFJ: {
    mbti: "ESFJ",
    coreNeed: "获得可感知回应，并在群体和重要关系中感到被接纳",
    trigger: "长期冷淡、公开否定，或自己的用心无人回应",
    communication: "关注互动温度，主动确认期待并安排具体连接",
    misunderstanding: "重视关系意见容易被误解为没有独立判断",
    challenge: "听见他人意见后，仍然为自己的选择负责",
    strength: "能让人进入共同生活，并维持持续的关系回应",
    openingLine: "我在意大家怎么想，但不代表我没有自己的答案。",
    pressureLine: "如果每次不同意都意味着关系会变冷，我很难知道自己到底能不能说真话。",
    repairLine: "我会听你的感受，也会把最后的选择留给自己。",
    titles: { 1: "进入彼此的生活圈", 2: "没有及时回应的邀请", 3: "关系意见与个人判断", 4: "群体离开后的选择" },
    events: {
      1: "ESFJ 主动把你介绍给熟悉的朋友圈，让一次认识很快拥有了共同生活的温度。",
      2: "你没有及时回应 ESFJ 精心准备的邀请，对方开始怀疑自己的用心是否造成了压力。",
      3: "重要选择遭到朋友群体反对，ESFJ 必须区分关系维护和个人判断。",
      4: "一次公开冲突让群体关系迅速冷却，ESFJ 面对迎合所有人或承担真实选择的危机。"
    }
  },
  ISTP: {
    mbti: "ISTP",
    coreNeed: "保有自主空间，同时自己的实际行动能够被理解",
    trigger: "被持续追问、微观管理，或能力长期不被信任",
    communication: "聚焦眼前事实，用简短回应和实际动作解决问题",
    misunderstanding: "需要空间和少说话常被误解为不在意或逃避",
    challenge: "在退出现场前，主动说明状态、需要和返回时间",
    strength: "能冷静定位问题，并用低成本行动快速验证修复",
    openingLine: "我可能不会马上说很多，但这不代表我没有放在心上。",
    pressureLine: "一直追着问只会让我更想关掉。我需要空间，也知道不能让你无限期等。",
    repairLine: "我先说清楚：我需要停一下，会在约定时间回来继续。",
    titles: { 1: "一起解决眼前问题", 2: "需要空间却没有说明", 3: "独立与亲密的边界", 4: "沉默成为最后通牒" },
    events: {
      1: "你和 ISTP 因一起解决现实问题而熟悉，对方不多解释，却用行动保持可靠。",
      2: "一次小摩擦后 ISTP 暂时退出交流，却没有说明什么时候回来。",
      3: "亲密关系需要更多共享信息，ISTP 则担心每一步都被管理，双方开始争夺空间定义。",
      4: "长期沉默和延迟沟通让对方发出最后通牒，ISTP 必须决定是否主动回到关系。"
    }
  },
  ISFP: {
    mbti: "ISFP",
    coreNeed: "真实表达被尊重，并在亲密中保有舒服的个人空间",
    trigger: "被强硬安排、比较，或感受被评价成不成熟",
    communication: "从当下体验出发，温和表达喜欢、不适和边界",
    misunderstanding: "不立即争辩容易被误解为默认同意或没有立场",
    challenge: "不靠突然退出保护自己，而是及时说出明确边界",
    strength: "能敏锐感知关系氛围，并用真实细节传递心意",
    openingLine: "我不需要所有选择都一样，只希望不舒服的时候可以真实说出来。",
    pressureLine: "你说是为我好，可我越来越感觉自己必须先变成另一个人才值得留下。",
    repairLine: "先问我愿不愿意，再谈改变。这样我反而更能认真考虑。",
    titles: { 1: "安静相处的舒服距离", 2: "被安排好的周末", 3: "改变自己还是守住真实", 4: "控制让关系失去呼吸" },
    events: {
      1: "你和 ISFP 在安静活动中自然熟悉，不需要很多话也能感到彼此舒服。",
      2: "你替 ISFP 安排了整个周末，对方配合到一半才承认自己从未真正同意。",
      3: "关系要求 ISFP 改变生活方式，一方称之为成长，一方感到真实自我正在被否定。",
      4: "持续未经同意的改变让 ISFP 准备退出关系，个人空间成为最后边界。"
    }
  },
  ESTP: {
    mbti: "ESTP",
    coreNeed: "被信任拥有行动自由，同时获得坦率而及时的反馈",
    trigger: "过度限制、冗长猜测，或所有机会都被风险提前否定",
    communication: "直接处理现场问题，根据真实反馈迅速调整",
    misunderstanding: "果断和追求体验容易被误解为只顾眼前",
    challenge: "在行动前把长期后果和共同承担者纳入决定",
    strength: "敢于面对现场，也能在僵局中快速创造真实进展",
    openingLine: "先看眼前能做什么。我愿意行动，也愿意把风险说清楚。",
    pressureLine: "我承认这次先做了再说，可我不想因此以后每个决定都失去自主。",
    repairLine: "先止住影响，再把共同底线定清楚。之后由行动证明。",
    titles: { 1: "一次说走就走的同行", 2: "冲动决定的后果", 3: "当下体验与长期责任", 4: "风险让信任破裂" },
    events: {
      1: "你和 ESTP 因一次临时行动成为搭档，对方果断鲜活，也愿意在现场照顾你的安全。",
      2: "ESTP 未经确认改变小安排，虽然迅速解决问题，却让你被动承担了后果。",
      3: "你们对重要机会产生分歧：一方要抓住当下，一方坚持先保护长期稳定。",
      4: "一次高风险决定影响共同生活，ESTP 必须面对结果之外已经破裂的信任。"
    }
  },
  ESFP: {
    mbti: "ESFP",
    coreNeed: "获得温暖而可感知的回应，并在关系中共享真实生活",
    trigger: "持续冷淡、重要时刻被忽略，或感受被评价为肤浅",
    communication: "用生活化表达、直接关心和共同体验维持连接",
    misunderstanding: "热情和关注当下容易被误解为缺少深度与责任",
    challenge: "让即时热情转化成长期、可持续的投入",
    strength: "能让情绪重新流动，也能在人最孤单时真实出现",
    openingLine: "我喜欢一起经历真实的生活，不只是把关系放在计划里谈。",
    pressureLine: "我不是只想开心，只是长期难过的时候，我也需要知道怎样继续留下。",
    repairLine: "我会把这次关心变成能持续的节奏，不只在情绪最强的时候出现。",
    titles: { 1: "热闹之后仍愿意留下", 2: "忘记后续的那次陪伴", 3: "快乐体验与深层责任", 4: "承诺只剩下气氛" },
    events: {
      1: "你和 ESFP 在热闹活动后继续单独散步，对方的热情第一次变成安静而真实的陪伴。",
      2: "ESFP 在你难过时第一时间出现，却忘了几天后答应继续联系。",
      3: "一方希望享受当下，一方需要长期投入，关系开始讨论快乐和责任是否能够共存。",
      4: "多次热烈承诺没有持续兑现，重要的人开始怀疑 ESFP 是否只在气氛里认真。"
    }
  }
} satisfies Record<MbtiType, PersonaRelationshipBlueprint>;

function node(
  beat: string,
  story: string,
  line: string,
  subject: string,
  resolution: string
): NodeSeed {
  return {
    beat,
    story,
    line,
    subject,
    resolution,
    prompt: `剧情来到“${beat}”，你准备怎样回应？`
  };
}

function createNodes(profile: PersonaRelationshipBlueprint, level: ChallengeLevel): readonly NodeSeed[] {
  const event = profile.events[level];
  const nodes = [
    node("事件发生", event, profile.openingLine, "第一次理解对方的表达习惯", "先回应眼前信息，再确认彼此期待"),
    node("第一次单独交流", "事件之后，你们第一次离开群体或日常任务，认真谈起刚才发生的事。", `“我通常会${profile.communication}，如果听起来和你习惯的不一样，可以直接问。”`, "沟通方式差异", "交换各自习惯的回应方式"),
    node("靠近的证据", `接下来的相处里，对方用${profile.strength}的方式主动为关系投入。`, "“这可能不是最显眼的表达，但我确实把这件事放在心上。”", "不同的在意证据", "具体说出自己看见了什么"),
    node("节奏开始形成", "几次顺利互动让关系变得自然，双方也开始默认一些没有明说的习惯。", `“${profile.coreNeed}，对我来说会让我更愿意继续靠近。”`, "关系中的核心需要", "把默认期待转成双方听得懂的话"),
    node("第一次托付", "对方把一件真正重要的事交给你回应，关系第一次有了信任的重量。", "“我不是需要完美答案，只是希望这件事不会被随手略过。”", "重要信息的承接", "确认自己能承担的回应和时间"),
    node("小摩擦出现", `一次普通互动碰到了对方的触发点：${profile.trigger}。`, "“刚才那一下让我有点退后。我还没想好怎么说，但不是完全没事。”", "轻微不适的及时表达", "允许停顿，同时保留继续谈的入口"),
    node("原意与影响", `你解释自己没有恶意，对方却指出：${profile.misunderstanding}。`, "“我相信原意可能不是这样，可刚才的影响仍然存在。”", "原意和实际影响", "先承认影响，再补充原本意图"),
    node("沟通越发错位", `你沿用自己的处理方式，对方也回到“${profile.communication}”的习惯，彼此都觉得没有被真正回应。`, "“我们好像都在认真说话，却一直回答对方没有问的问题。”", "回应重点错位", "复述对方真正的问题后再表达自己"),
    node("典型误解成形", `周围的人用一句简单评价解释对方，进一步强化了“${profile.misunderstanding}”这层误解。`, "“如果你也这样看我，我不知道还要不要继续解释。”", "人格标签带来的距离", "回到具体行为而非用标签定性"),
    node("第一次修复", "你们决定暂停争辩，只处理这次互动造成的具体距离。", profile.repairLine, "关系修复的顺序", "先确认感受与责任，再讨论方案"),
    node("更深的价值出现", `修复让关系暂时稳定，但你发现“${profile.coreNeed}”并不是偏好，而是对方判断关系是否安全的重要依据。`, "“我们可以不完全一样，可这件事如果长期缺席，我会慢慢失去连接感。”", "核心需要的长期意义", "确认能学习的部分和不能虚假承诺的部分"),
    node("你的需要也出现", "你说出自己的节奏和限制，第一次不只围绕对方的感受组织谈话。", "“我想听你的需要。关系不能只要求其中一个人不断适应。”", "双方需要的对等性", "把两边的需要都转成具体行为"),
    node("边界测试", `现实压力再次触发旧模式，对方需要练习：${profile.challenge}。`, "“我知道旧方式更熟悉，但这次我想试着不让它自动接管。”", "旧模式与新选择", "选一个可观察的小动作验证改变"),
    node("外部压力加入", "家人、朋友或工作安排开始影响你们的决定，双方更容易回到防御位置。", "“外面的意见可以听，但不能替我们决定这段关系怎么继续。”", "第三方与关系边界", "筛选有效信息并保留共同决定权"),
    node("核心矛盾说破", `${profile.misunderstanding}不再只是一次误会，而成为双方反复受伤的解释框架。`, profile.pressureLine, "长期误解的代价", "分别说清最害怕失去的东西"),
    node("关系来到临界点", `此前的选择累积成现实后果，${levelMeta[level].stakes}。`, "“我不想用威胁让你改变，但也不能继续假装这个模式没有伤害。”", "关系是否还能继续", "区分修复意愿、现实能力和不可接受项"),
    node("暂停还是退出", "一方提出需要空间，另一方担心暂停只是没有期限的离开。", "“可以停，但请给我一个明确会回来的时间；如果不想回来，也请直接说。”", "暂停的可预期性", "约定期限、联系信号和重启方式"),
    node("最终坦白", `再次见面时，对方不再用习惯方式隐藏需要，而是直接说出：${profile.coreNeed}。`, "“这不是要求你变成我，只是让你知道，怎样的关系我才能真实留下。”", "最低关系条件", "回应条件并说出自己的真实能力"),
    node("共同试行", `双方选择一个阶段方案，重点练习“${profile.challenge}”，并约定观察真实效果。`, profile.repairLine, "修复是否可验证", "明确行动、责任和复盘时间"),
    node("互动复盘", "一段时间后，你们回到最初事件，比较关系状态、旧模式和新的选择证据。", `“我还是会有原来的反应，但${profile.strength}不该只在顺利时出现。我们可以根据真实结果决定下一步。”`, "长期关系走向", "依据全过程决定继续、调整、暂停或结束")
  ];

  if (nodes.length !== 20) {
    throw new Error(`Persona matrix scenario ${profile.mbti}/${level} must contain 20 nodes.`);
  }
  return nodes;
}

function createScenario(profile: PersonaRelationshipBlueprint, level: ChallengeLevel) {
  const meta = levelMeta[level];
  const id = `${profile.mbti.toLowerCase()}-matrix-${meta.slug}` as PersonaMatrixScenarioId;
  const seed: ChapterScenarioSeed = {
    id,
    prefix: id,
    title: profile.titles[level],
    targetMbti: profile.mbti,
    sceneType: meta.sceneType,
    difficulty: level,
    difficultyLabel: meta.label,
    relationship: meta.relationship,
    theme: `${profile.coreNeed} vs ${profile.trigger}`,
    initialConflict: profile.events[level],
    summary: `围绕“${profile.titles[level]}”经历八章、二十个连续节点，重点练习${profile.challenge}。`,
    initialRelationshipState: { ...meta.initialRelationshipState },
    chapterTitles,
    nodes: createNodes(profile, level),
    endings: commonEndings({
      rupture: `${profile.misunderstanding}成为关系终点`,
      repair: `${profile.coreNeed}被真正放进关系`,
      clearButDistant: "问题说清，但连接仍需时间",
      pause: "按清楚边界暂停关系",
      open: "保留关系并继续验证改变"
    })
  };
  return buildScenario(seed);
}

export function buildMissingPersonaMatrixScenarios(
  existingScenarios: readonly ScenarioDefinition[]
): readonly ScenarioDefinition[] {
  const coverage = new Set<string>();
  for (const scenario of existingScenarios) {
    for (const mbti of scenario.targetMbtis) {
      coverage.add(`${mbti}:${scenario.difficulty}`);
    }
  }

  const scenarios: ScenarioDefinition[] = [];
  for (const mbti of mbtiTypes) {
    for (const level of [1, 2, 3, 4] as const) {
      if (!coverage.has(`${mbti}:${level}`)) {
        scenarios.push(createScenario(blueprints[mbti], level));
      }
    }
  }
  return scenarios;
}

export const personaRelationshipBlueprints = blueprints;
