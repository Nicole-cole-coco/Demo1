import type { MbtiType } from "@/types/avatar";
import { baseRelationshipScenarios } from "@/lib/baseRelationshipScenarios";
import { loveCrisisScenario } from "@/lib/loveCrisisScenario";
import { chapterScenarios } from "@/lib/chapterScenarios";
import { personalityScenarios } from "@/lib/personalityScenarios";
import { relationshipJourneyScenarios } from "@/lib/relationshipJourneyScenarios";
import type {
  CommunicationDimension,
  CommunicationScoreDelta,
  LabScenarioId,
  RelationshipStateDelta,
  ScenarioDefinition,
  ScenarioOption
} from "@/types/lab";

const delta = (
  emotionalAcceptance: number,
  clarity: number,
  boundaryAwareness: number,
  conflictRepair: number,
  collaboration: number
): CommunicationScoreDelta => ({
  emotionalAcceptance,
  clarity,
  boundaryAwareness,
  conflictRepair,
  collaboration
});

const feedback: Record<
  CommunicationDimension,
  { advantage: string; tradeoff: string; reaction: string }
> = {
  emotionalAcceptance: {
    advantage: "先给感受留出位置，有助于降低防御，让未说完的话继续出现。",
    tradeoff: "情绪铺陈会放慢推进速度，之后仍需要补上具体事实和方案。",
    reaction: "对方的语速慢了下来，愿意把刚才没有说完整的感受继续讲下去。"
  },
  clarity: {
    advantage: "表达足够具体，双方更容易确认分歧究竟发生在哪里。",
    tradeoff: "快速说清逻辑可能压缩感受空间，需要确认对方是否已经准备好讨论。",
    reaction: "对方开始回应你提出的具体问题，谈话从情绪拉扯转向了可讨论的重点。"
  },
  boundaryAwareness: {
    advantage: "保留了必要边界，避免一方为了维持和平而过度承担。",
    tradeoff: "边界变清楚时可能带来短时距离感，也可能让对方感到你正在后退。",
    reaction: "对方意识到你不会无限退让，停下来重新衡量彼此可以接受的范围。"
  },
  conflictRepair: {
    advantage: "把注意力放在互动造成的影响上，有助于让连接重新流动。",
    tradeoff: "修复需要回看不舒服的部分，也会增加当下的情绪成本。",
    reaction: "对方重新看向你，语气里的对抗减弱了一些，但仍在等待更具体的改变。"
  },
  collaboration: {
    advantage: "邀请双方共同参与，形成的方案更可能得到真实执行。",
    tradeoff: "共同设计需要更多协商时间，短期效率通常不如单方决定。",
    reaction: "对方开始补充自己的想法，谈话逐渐从谁对谁错转向下一步如何一起做。"
  },
  adaptability: {
    advantage: "根据当下反馈调整方式，能避免无效策略持续放大冲突。",
    tradeoff: "调整节奏可能暂时偏离原计划，也需要分清灵活与放弃边界的差别。",
    reaction: "对方注意到你不再重复同一种回应，愿意试着用新的节奏继续谈。"
  }
};

const reactionFocus: Record<CommunicationDimension, string> = {
  emotionalAcceptance: "你先接住了感受，而没有立刻把谈话推向结论。",
  clarity: "你把模糊的拉扯变成了一个可以具体回应的问题。",
  boundaryAwareness: "你没有用退让换和平，也给彼此留下了自主空间。",
  conflictRepair: "你愿意正视互动造成的影响，而不只解释自己的原意。",
  collaboration: "你把决定权留给双方，让关系不再由一个人独自推动。",
  adaptability: "你根据关系状态调整了回应方式，没有让一种策略反复失效。"
};

const personalityReactionTone: Partial<
  Record<MbtiType, { open: string; caution: string }>
> = {
  ENFP: {
    open: "对方的表情松动了一些。",
    caution: "不过只要感到空间再次被收紧，防御仍可能迅速回来。"
  },
  INTJ: {
    open: "对方开始认真评估你的回应。",
    caution: "但他们仍会观察这是否能转化为稳定、可执行的改变。"
  },
  INFJ: {
    open: "对方感受到你在留意话语背后的需要。",
    caution: "如果安全感不足，他们依然可能把真实不满收回沉默里。"
  },
  ENTJ: {
    open: "对方认可你愿意面对核心问题。",
    caution: "但缺少明确责任和下一步时，他们的耐心会很快下降。"
  },
  ENTP: {
    open: "对方对这条新的讨论路径产生了兴趣。",
    caution: "一旦感到观点被封死，他们就会重新挑战你的前提。"
  },
  ISFP: {
    open: "对方从你的语气里感到了一点真实和放松。",
    caution: "如果节奏过快或太像审问，他们会再次退回自己的感受里。"
  },
  ISFJ: {
    open: "对方注意到你没有忽略关系中的责任与照顾。",
    caution: "但如果自己的付出仍被视为理所当然，委屈会继续累积。"
  },
  ESTJ: {
    open: "对方看见你在推动问题向前。",
    caution: "不过责任归属不清时，他们仍可能用更强硬的方式接管局面。"
  }
};

const createPersonaReactions = (strongest: CommunicationDimension) =>
  Object.fromEntries(
    Object.entries(personalityReactionTone).map(([mbti, tone]) => [
      mbti,
      `${tone.open}${reactionFocus[strongest]}${tone.caution}`
    ])
  ) as Partial<Record<MbtiType, string>>;

const createRelationshipDelta = (
  scoreDelta: CommunicationScoreDelta
): RelationshipStateDelta => ({
  trust: Math.round(
    ((scoreDelta.conflictRepair ?? 0) + (scoreDelta.boundaryAwareness ?? 0)) / 2
  ),
  emotionalConnection: scoreDelta.emotionalAcceptance ?? 0,
  communication: Math.round(
    ((scoreDelta.clarity ?? 0) + (scoreDelta.collaboration ?? 0)) / 2
  ),
  conflictLevel: -Math.round(
    ((scoreDelta.emotionalAcceptance ?? 0) + (scoreDelta.conflictRepair ?? 0)) / 2
  ),
  understanding: Math.round(
    ((scoreDelta.emotionalAcceptance ?? 0) + (scoreDelta.clarity ?? 0)) / 2
  )
});

const choice = (
  id: string,
  label: string,
  intentTags: readonly string[],
  scoreDelta: CommunicationScoreDelta,
  nextStage: string | null,
  custom?: Partial<
    Pick<
      ScenarioOption,
      "reaction" | "reactions" | "advantage" | "tradeoff"
    >
  > & {
    relationshipDelta?: RelationshipStateDelta & { emotion?: number; conflict?: number };
  }
): ScenarioOption => {
  const scores = Object.entries(scoreDelta) as Array<[CommunicationDimension, number]>;
  const strongest = [...scores].sort((left, right) => right[1] - left[1])[0]?.[0] ?? "clarity";
  const weakest = [...scores].sort((left, right) => left[1] - right[1])[0]?.[0] ?? strongest;

  return {
    id,
    label,
    intentTags,
    scoreDelta,
    relationshipDelta: custom?.relationshipDelta
      ? {
          trust: custom.relationshipDelta.trust,
          emotionalConnection:
            custom.relationshipDelta.emotionalConnection ?? custom.relationshipDelta.emotion,
          communication: custom.relationshipDelta.communication,
          conflictLevel:
            custom.relationshipDelta.conflictLevel ?? custom.relationshipDelta.conflict,
          understanding: custom.relationshipDelta.understanding
        }
      : createRelationshipDelta(scoreDelta),
    nextStage,
    reaction: custom?.reaction ?? feedback[strongest].reaction,
    reactions: { ...createPersonaReactions(strongest), ...custom?.reactions },
    advantage: custom?.advantage ?? feedback[strongest].advantage,
    tradeoff: custom?.tradeoff ?? feedback[weakest].tradeoff
  };
};

const legacyLabScenarios = [
  {
    id: "enfp-love-freedom",
    title: "恋人争吵与分手危机",
    targetMbti: "ENFP",
    targetMbtis: ["ENFP", "INTJ"],
    sceneType: "love",
    difficulty: 4,
    difficultyLabel: "关系危机",
    relationship: "恋爱关系",
    theme: "自由感 vs 规划感",
    initialConflict: "一次反复出现的安排冲突，让对方第一次认真说出了“要不要继续”。",
    initialRelationshipState: { trust: 48, emotionalConnection: 44, communication: 40, conflictLevel: 46, understanding: 42 },
    summary: "在去留压力下，同时处理情绪回应、真实需求、关系边界与可执行的修复方案。",
    stages: [
      {
        id: "enfp-1",
        round: 1,
        beat: "第一次冲突",
        targetLine: "你每次都把问题拆得很清楚，可我说的难过好像从来没有真正到达你那里。",
        targetLines: {
          ENFP: "你每次都把问题拆得很清楚，可我说的难过好像从来没有真正到达你那里。",
          INTJ: "我们又回到同一个分歧。继续只表达不满，却不形成改变，对我来说很消耗。"
        },
        prompt: "冲突刚刚升温，你决定先把什么放进这次谈话？",
        options: [
          choice("a", "立即解释规划的逻辑，以及这些安排原本想保护什么。", ["说明逻辑", "澄清动机"], delta(-3, 8, 2, 0, 2), "enfp-2", {
            relationshipDelta: { trust: 1, emotion: -5, communication: 5, conflict: 4 }
          }),
          choice("b", "先复述对方的难过，询问哪个瞬间最让他们觉得没有被理解。", ["回应感受", "具体追问"], delta(9, 3, 0, 5, 2), "enfp-2", {
            relationshipDelta: { trust: 5, emotion: 9, communication: 2, conflict: -6 }
          }),
          choice("c", "说明自己情绪也在升高，暂停二十分钟后一定回来继续谈。", ["暂停降温", "约定返回"], delta(1, 5, 8, 2, -2), "enfp-2", {
            relationshipDelta: { trust: 0, emotion: -3, communication: 2, conflict: -7 }
          }),
          choice("d", "坦白这句话也刺痛了你，请对方同时听听你在关系里的委屈。", ["表达委屈", "双向看见"], delta(4, 7, 5, -1, -2), "enfp-2", {
            relationshipDelta: { trust: 2, emotion: 1, communication: 3, conflict: 6 }
          })
        ]
      },
      {
        id: "enfp-2",
        round: 2,
        beat: "冷战",
        targetLine: "这三天你没有找我，我开始怀疑你是不是觉得没有我也没关系。",
        targetLines: {
          ENFP: "这三天你没有找我，我开始怀疑你是不是觉得没有我也没关系。",
          INTJ: "我需要冷静，但三天没有有效沟通只会让问题继续恶化。"
        },
        prompt: "沉默已经产生新的伤害，你准备怎样打破冷战？",
        options: [
          choice("a", "主动发出一条同时包含事实、感受和见面请求的信息。", ["主动破冰", "清晰请求"], delta(6, 8, 2, 7, 5), "enfp-3", {
            relationshipDelta: { trust: 6, emotion: 5, communication: 8, conflict: -5 }
          }),
          choice("b", "继续给空间，但约定明晚之前必须确认是否愿意谈。", ["保留空间", "设置期限"], delta(1, 7, 9, 2, 1), "enfp-3", {
            relationshipDelta: { trust: 1, emotion: -3, communication: 4, conflict: -3 }
          }),
          choice("c", "直接询问对方现在是在冷静，还是已经准备退出关系。", ["确认状态", "直面风险"], delta(-2, 9, 6, 0, 1), "enfp-3", {
            relationshipDelta: { trust: 0, emotion: -4, communication: 7, conflict: 5 }
          }),
          choice("d", "先恢复日常问候，不碰冲突，等待气氛自然变好。", ["维持连接", "延后冲突"], delta(3, -2, 1, -4, 0), "enfp-3", {
            relationshipDelta: { trust: -2, emotion: 2, communication: -6, conflict: 1 }
          })
        ]
      },
      {
        id: "enfp-3",
        round: 3,
        beat: "提出分手",
        targetLine: "我不想再靠一次次和好证明我们还相爱。也许分开对彼此都轻松。",
        targetLines: {
          ENFP: "我不想再靠一次次和好证明我们还相爱。也许分开对彼此都轻松。",
          INTJ: "如果我们无法建立可执行的改变，继续关系只是在延迟同一个结果。"
        },
        prompt: "去留已经被放上桌面，你会怎样回应这次分手决定？",
        options: [
          choice("a", "先问“分开”此刻想保护什么，不急着说服对方留下。", ["理解决定", "降低拉扯"], delta(9, 4, 4, 6, 2), "enfp-4", {
            relationshipDelta: { trust: 5, emotion: 8, communication: 3, conflict: -6 }
          }),
          choice("b", "立即提出一个为期一个月的改变方案，用行动证明关系还有可能。", ["方案挽回", "行动承诺"], delta(0, 9, 3, 6, 7), "enfp-4", {
            relationshipDelta: { trust: 2, emotion: -3, communication: 7, conflict: 2 }
          }),
          choice("c", "说出自己也受伤和不舍，请对方不要把全部问题只归到你身上。", ["表达受伤", "分担责任"], delta(4, 7, 5, -2, 2), "enfp-4", {
            relationshipDelta: { trust: 1, emotion: 2, communication: 3, conflict: 6 }
          }),
          choice("d", "接受暂时分开，约定一周后再确认这是冷静期还是正式结束。", ["尊重决定", "保留期限"], delta(1, 7, 9, 1, -1), "enfp-4", {
            relationshipDelta: { trust: 2, emotion: -6, communication: 4, conflict: -5 }
          })
        ]
      },
      {
        id: "enfp-4",
        round: 4,
        beat: "挽回机会",
        targetLine: "我还没有完全离开，但我需要看到关系里真的能有新的空间。",
        targetLines: {
          ENFP: "我还没有完全离开，但我需要看到关系里真的能有新的空间。",
          INTJ: "我愿意评估最后一次尝试，但需要明确双方要改变什么。"
        },
        prompt: "最后一次回应将决定关系接下来以什么方式继续。",
        options: [
          choice("a", "进行一个月试行：固定相处、自由时段与临时变更各有明确规则。", ["弹性结构", "限期试行"], delta(3, 8, 7, 6, 9), null, {
            relationshipDelta: { trust: 6, emotion: 2, communication: 8, conflict: -5 }
          }),
          choice("b", "双方各选一项可观察的改变，一周后只复盘行动，不追问态度。", ["双向改变", "行动复盘"], delta(2, 8, 4, 8, 10), null, {
            relationshipDelta: { trust: 8, emotion: 2, communication: 7, conflict: -4 }
          }),
          choice("c", "先用几次低压力相处恢复连接，等情绪稳定后再谈长期方案。", ["连接优先", "延后方案"], delta(8, 2, 3, 7, 1), null, {
            relationshipDelta: { trust: 4, emotion: 9, communication: 0, conflict: -6 }
          }),
          choice("d", "承认核心方式可能不相容，约定最后决策日期，届时诚实决定去留。", ["面对差异", "决策期限"], delta(1, 9, 10, 2, -1), null, {
            relationshipDelta: { trust: 3, emotion: -5, communication: 7, conflict: -2 }
          })
        ]
      }
    ],
    evaluationRules: [
      { dimension: "emotionalAcceptance", description: "是否回应分手压力背后的感受，而不是只争论安排是否合理。" },
      { dimension: "clarity", description: "是否把自由、承诺与改变转化为具体可讨论的内容。" },
      { dimension: "boundaryAwareness", description: "是否在挽回关系时仍保留双方真实底线。" },
      { dimension: "conflictRepair", description: "是否承认过去影响，并提出能被观察的修复动作。" },
      { dimension: "collaboration", description: "是否让关系试行方案由双方共同承担。" }
    ]
  },
  {
    id: "infj-relationship-boundary",
    title: "异地恋信任危机",
    targetMbti: "INFJ",
    targetMbtis: ["INFJ"],
    sceneType: "boundary",
    difficulty: 3,
    difficultyLabel: "价值冲突",
    relationship: "异地恋爱",
    theme: "安全感 vs 自主边界",
    initialConflict: "一次长时间失联和一张聚会照片，让双方第一次认真质疑异地关系中的信任方式。",
    initialRelationshipState: { trust: 48, emotionalConnection: 42, communication: 35, conflictLevel: 38, understanding: 44 },
    summary: "在距离、信息缺口和不安中表达需求，同时避免把安全感变成监控或无限自证。",
    stages: [
      {
        id: "infj-1",
        round: 1,
        beat: "失联疑云",
        targetLine: "昨晚你一直没有回复，可我却在朋友照片里看见你。我不想查问行程，但那一刻真的很难相信自己仍然重要。",
        prompt: "不安和被质疑同时出现，你先处理哪一部分？",
        options: [
          choice("a", "先承认失联造成的影响，再解释当时发生了什么。", ["承担影响", "补充事实"], delta(6, 8, 2, 8, 3), "infj-2", {
            relationshipDelta: { trust: 7, emotionalConnection: 5, communication: 7, conflictLevel: -5, understanding: 5 }
          }),
          choice("b", "先问照片里哪个细节最触发不安，不急着证明自己没有问题。", ["探索不安", "延后辩解"], delta(9, 3, 1, 5, 4), "infj-2", {
            relationshipDelta: { trust: 4, emotionalConnection: 9, communication: 2, conflictLevel: -6, understanding: 6 }
          }),
          choice("c", "主动提供当晚完整行程和聊天记录，让误会先被排除。", ["证据澄清", "快速自证"], delta(-2, 9, -1, 2, 1), "infj-2", {
            relationshipDelta: { trust: 6, emotionalConnection: -3, communication: 6, conflictLevel: 0, understanding: 3 }
          }),
          choice("d", "说明被追问让自己感到受监控，要求先谈彼此可以接受的边界。", ["表达压力", "边界协商"], delta(0, 8, 10, 0, 2), "infj-2", {
            relationshipDelta: { trust: -1, emotionalConnection: -4, communication: 5, conflictLevel: 5, understanding: 1 }
          })
        ]
      },
      {
        id: "infj-2",
        round: 2,
        beat: "需求拉扯",
        targetLine: "我不想每天都知道你在哪里，可我也害怕自己一开口，就被说成太敏感、太不信任你。",
        prompt: "你会怎样让安全感需求可以被说出，却不变成查验？",
        options: [
          choice("a", "承认这种担心有依据，并询问过去哪次回应让对方最不安全。", ["确认经验", "追溯影响"], delta(9, 3, 1, 6, 4), "infj-3"),
          choice("b", "邀请对方只说一件最重要的事，你先复述确认，不急着解释。", ["缩小范围", "倾听协议"], delta(8, 6, 3, 7, 5), "infj-3"),
          choice("c", "提议用文字交流，让对方有时间组织，而你晚些时候再回应。", ["调整媒介", "保护节奏"], delta(4, 5, 8, 3, 4), "infj-3"),
          choice("d", "说明关系无法长期靠猜测维持，希望双方都承担说清需要的责任。", ["双向责任", "现实校准"], delta(-1, 8, 7, 1, 7), "infj-3")
        ]
      },
      {
        id: "infj-3",
        round: 3,
        beat: "边界碰撞",
        targetLine: "如果每一次不安都要我主动提醒，我会怀疑你是不是根本没有把这段关系放进生活里。",
        prompt: "你会怎样回应“被主动想起”的期待，同时说明自己的能力边界？",
        options: [
          choice("a", "承认被主动看见很重要，同时区分关心不足和信息没有被说出。", ["理解期待", "区分事实"], delta(8, 7, 3, 4, 4), "infj-4"),
          choice("b", "约定一个只有彼此知道的信号，表示“我需要你现在多问一句”。", ["低压信号", "共同约定"], delta(5, 6, 4, 5, 9), "infj-4"),
          choice("c", "建议固定每周一次关系检查，不把发现问题完全交给临场敏锐度。", ["稳定机制", "降低猜测"], delta(2, 8, 5, 4, 8), "infj-4"),
          choice("d", "坦白自己无法每次准确读懂沉默，但愿意在收到提示后认真回应。", ["能力边界", "真实承诺"], delta(3, 8, 9, 2, 4), "infj-4")
        ]
      },
      {
        id: "infj-4",
        round: 4,
        beat: "信任重建",
        targetLine: "如果继续异地，我需要的不是随时报告，而是知道失联、聚会和情绪低谷时我们有共同规则。",
        prompt: "最后一轮，你会建立怎样的异地信任约定？",
        options: [
          choice("a", "完成一次清晰表达，观察对方是否愿意理解和调整，再决定投入程度。", ["观察回应", "渐进判断"], delta(5, 7, 7, 8, 5), null),
          choice("b", "提前说清持续否定会带来的后果，并在发生时真正执行边界。", ["后果边界", "自我保护"], delta(1, 8, 10, 3, 1), null),
          choice("c", "邀请可信的第三方帮助双方翻译需求，但不替任何一方决定。", ["引入支持", "共同理解"], delta(5, 4, 3, 7, 8), null),
          choice("d", "暂停讨论和亲密互动一段时间，让行动而非继续解释提供答案。", ["暂停投入", "观察行动"], delta(0, 5, 8, 2, -2), null)
        ]
      }
    ],
    evaluationRules: [
      { dimension: "emotionalAcceptance", description: "是否识别沉默背后的感受，又不替 INFJ 强行下结论。" },
      { dimension: "clarity", description: "是否让需求从暗示和读心变成可表达的信息。" },
      { dimension: "boundaryAwareness", description: "是否尊重表达节奏，并明确持续否定后的边界。" },
      { dimension: "conflictRepair", description: "是否为过去影响和未来调整都留下修复机会。" },
      { dimension: "collaboration", description: "是否让看见需要与主动表达成为双向责任。" }
    ]
  },
  {
    id: "intj-friend-misunderstanding",
    title: "朋友决裂",
    targetMbti: "INTJ",
    targetMbtis: ["INTJ"],
    sceneType: "friendship",
    difficulty: 3,
    difficultyLabel: "价值冲突",
    relationship: "朋友关系",
    theme: "事实判断 vs 情绪背叛",
    initialConflict: "一次私下建议被转述成公开否定，多年的朋友关系突然走到决裂边缘。",
    initialRelationshipState: { trust: 32, emotionalConnection: 38, communication: 36, conflictLevel: 52, understanding: 38 },
    summary: "在事实澄清、动机误读和受伤情绪之间，判断这段友谊是否还有可修复的共同基础。",
    stages: [
      {
        id: "intj-1",
        round: 1,
        beat: "公开误解",
        targetLine: "我私下认真帮你分析，你却对别人说我冷漠又自以为是。现在我很难相信你尊重过我的好意。",
        prompt: "朋友认为自己遭到背叛，你会如何打开第一次解释？",
        options: [
          choice("a", "先肯定建议有价值，再说明自己当时需要先被理解，之后才听得进方案。", ["肯定贡献", "说明顺序"], delta(8, 7, 1, 6, 5), "intj-2"),
          choice("b", "直接描述那一刻自己的感受，并请对方不要把它理解成对能力的否定。", ["表达感受", "澄清评价"], delta(7, 6, 4, 4, 2), "intj-2"),
          choice("c", "请对方复盘他当时判断的目标，也说明自己期待的支持目标不同。", ["对齐目标", "分析差异"], delta(2, 8, 3, 3, 7), "intj-2"),
          choice("d", "承认自己现在仍有情绪，希望晚些时候用一条具体请求重新谈。", ["延迟沟通", "保护状态"], delta(3, 6, 8, 1, -1), "intj-2")
        ]
      },
      {
        id: "intj-2",
        round: 2,
        beat: "事实对质",
        targetLine: "我看过原话。无论你当时多难过，这段描述都会让别人对我形成错误判断。",
        prompt: "事实已经摆出，你会如何同时承担影响并说清当时的感受？",
        options: [
          choice("a", "说明稳定情绪是提高判断质量的一步，而不是放弃解决问题。", ["连接信息", "解释过程"], delta(7, 8, 2, 4, 5), "intj-3"),
          choice("b", "约定先听五分钟，再一起把问题拆成可执行的下一步。", ["两阶段沟通", "兼顾效率"], delta(6, 7, 3, 5, 8), "intj-3"),
          choice("c", "请对方先问一句“想要倾听还是建议”，自己也负责给出明确答案。", ["沟通协议", "双向责任"], delta(5, 9, 7, 4, 7), "intj-3"),
          choice("d", "先采用对方的一项建议，之后再单独讨论自己对支持方式的需要。", ["行动优先", "延后情绪"], delta(-2, 6, 4, 1, 5), "intj-3")
        ]
      },
      {
        id: "intj-3",
        round: 3,
        beat: "信任断点",
        targetLine: "我最不能接受的不是你不认同我，而是你没有直接告诉我，却让第三个人先听见。",
        prompt: "对方把直接沟通视为信任底线，你怎样回应？",
        options: [
          choice("a", "用一个具体时刻说明自己感到被跳过，不再推断对方的动机。", ["描述事实", "避免读心"], delta(5, 9, 7, 5, 4), "intj-4"),
          choice("b", "接受直接沟通，并询问怎样提示才不会让对方觉得被指责。", ["尊重边界", "协商表达"], delta(4, 7, 8, 4, 8), "intj-4"),
          choice("c", "承认自己用了“冷漠”这个结论，改为描述实际需要和影响。", ["修正标签", "承担表达"], delta(6, 7, 3, 8, 3), "intj-4"),
          choice("d", "提出情绪很强时先不讨论动机，双方只确认是否继续这个话题。", ["暂停判断", "对话边界"], delta(2, 6, 9, 2, 1), "intj-4")
        ]
      },
      {
        id: "intj-4",
        round: 4,
        beat: "是否继续",
        targetLine: "我还没有决定要不要继续这段友谊。除了一次道歉，我需要知道以后什么会真正不同。",
        prompt: "最后一轮，你会提出怎样的修复方式或退出边界？",
        options: [
          choice("a", "先问需要倾听还是方案，自己也会直接说出当下需要。", ["双向责任", "清晰协议"], delta(7, 9, 7, 6, 9), null),
          choice("b", "先复述一次听到的重点，确认准确后再决定是否进入分析。", ["确认理解", "降低误差"], delta(8, 7, 2, 6, 6), null),
          choice("c", "重要问题仍以方案为主，但先留出一个不被打断的情绪表达时段。", ["保留效率", "情绪窗口"], delta(5, 7, 5, 5, 7), null),
          choice("d", "约定无法支持时可以直接说明，并一起找更合适的人或资源。", ["能力边界", "转介支持"], delta(2, 8, 9, 3, 5), null)
        ]
      }
    ],
    evaluationRules: [
      { dimension: "emotionalAcceptance", description: "是否表达情绪需要，同时看见 INTJ 用解决问题表达在意。" },
      { dimension: "clarity", description: "是否使用具体事实和直接请求，减少动机猜测。" },
      { dimension: "boundaryAwareness", description: "是否尊重双方不同的支持能力和沟通边界。" },
      { dimension: "conflictRepair", description: "是否把冷漠标签转化为可以修复的互动问题。" },
      { dimension: "collaboration", description: "是否形成双方都需要承担的支持协议。" }
    ]
  },
  {
    id: "entj-workplace-pressure",
    title: "职场压力沟通",
    targetMbti: "ENTJ",
    targetMbtis: ["ENTJ"],
    sceneType: "workplace",
    difficulty: 2,
    difficultyLabel: "轻微冲突",
    relationship: "职场协作",
    theme: "结果压力 vs 沟通方式",
    initialConflict: "项目延期后，ENTJ 负责人要求立即给出结果，团队则认为目标、资源和沟通压力已经失衡。",
    initialRelationshipState: { trust: 52, emotionalConnection: 38, communication: 48, conflictLevel: 35, understanding: 46 },
    summary: "在承担结果、争取资源、保护边界与维持协作之间做出真实取舍。",
    stages: [
      {
        id: "entj-1",
        round: 1,
        beat: "公开追责",
        targetLine: "项目已经晚了。我现在需要的不是更多解释，而是结果。你准备怎么负责？",
        prompt: "面对直接的结果压力，你会先怎么回应？",
        options: [
          choice("a", "先承认延期影响，再给出当前状态、恢复动作和自己承担的部分。", ["承担影响", "立即推进"], delta(4, 9, 4, 6, 7), "entj-2"),
          choice("b", "说明可以对结果负责，但先确认你拥有的决策权限和可调配资源。", ["责任对等", "资源边界"], delta(0, 8, 9, 2, 4), "entj-2"),
          choice("c", "请求三十分钟整理依赖和风险，再提交一份完整恢复计划。", ["延迟承诺", "提高准确"], delta(-1, 8, 6, 1, 5), "entj-2"),
          choice("d", "先列出跨部门依赖，请负责人决定哪些问题由更高层级协调。", ["暴露依赖", "升级处理"], delta(-2, 7, 7, 2, 7), "entj-2")
        ]
      },
      {
        id: "entj-2",
        round: 2,
        beat: "资源取舍",
        targetLine: "我要明确负责人和时间点。没有这些，计划就只是愿望。",
        prompt: "你会如何把推进方案说清楚？",
        options: [
          choice("a", "列出负责人、里程碑、风险阈值和下一次检查时间。", ["明确责任", "过程管理"], delta(0, 9, 6, 4, 9), "entj-3"),
          choice("b", "先确认必须守住的优先级，并同步列出需要缩减的范围。", ["优先级协商", "范围边界"], delta(1, 9, 8, 3, 7), "entj-3"),
          choice("c", "提供快慢两套方案，让负责人明确选择时间、成本和质量的取舍。", ["呈现取舍", "决策支持"], delta(0, 8, 7, 2, 8), "entj-3"),
          choice("d", "先承诺一个最小可交付结果，其余事项等核心风险解除后再排期。", ["最小交付", "降低风险"], delta(-1, 8, 7, 3, 5), "entj-3")
        ]
      },
      {
        id: "entj-3",
        round: 3,
        beat: "团队反弹",
        targetLine: "团队说我的要求太强硬，但压力不会因为语气柔和就消失。你怎么看？",
        prompt: "你会怎样讨论领导方式与结果压力？",
        options: [
          choice("a", "把团队反馈视为执行信息，建议保留标准但改变反馈节奏和表达格式。", ["反馈校准", "保留标准"], delta(6, 7, 3, 7, 8), "entj-4"),
          choice("b", "区分紧迫和不尊重，明确团队可以接受高标准，但需要停止人身化评价。", ["行为边界", "直面压力"], delta(2, 8, 9, 5, 4), "entj-4"),
          choice("c", "建立私下异议渠道，让公开会议继续保持快速和直接。", ["渠道分层", "保护效率"], delta(1, 7, 6, 4, 7), "entj-4"),
          choice("d", "建议每次高压指令都同时说明目标依据、可用支持和反馈窗口。", ["信息透明", "支持配套"], delta(4, 9, 5, 5, 8), "entj-4")
        ]
      },
      {
        id: "entj-4",
        round: 4,
        beat: "重建机制",
        targetLine: "我既要结果，也不想每次都靠高压推动。下一轮项目应该怎么合作？",
        prompt: "最后一轮，你会提出什么协作机制？",
        options: [
          choice("a", "共同确定完成标准、风险升级机制和固定检查点，让问题更早暴露。", ["共同标准", "提前预警"], delta(3, 8, 6, 7, 10), null),
          choice("b", "明确不可妥协的结果，同时把资源、授权和时间写入同一份约定。", ["结果边界", "资源对等"], delta(1, 9, 10, 5, 7), null),
          choice("c", "由负责人定义目标，执行团队自主决定路径，只在触发风险阈值时升级。", ["结果授权", "减少干预"], delta(0, 8, 8, 3, 8), null),
          choice("d", "每个阶段结束做十五分钟复盘，同时检查结果偏差和团队负荷。", ["双重指标", "持续复盘"], delta(6, 7, 5, 8, 8), null)
        ]
      }
    ],
    evaluationRules: [
      { dimension: "emotionalAcceptance", description: "是否把压力对团队的影响视为有效执行信息。" },
      { dimension: "clarity", description: "是否明确责任、节点、优先级和完成标准。" },
      { dimension: "boundaryAwareness", description: "是否让目标与资源、授权和时间保持对等。" },
      { dimension: "conflictRepair", description: "是否把延期与高压沟通转化为可复盘的问题。" },
      { dimension: "collaboration", description: "是否建立提前暴露风险、共同承担结果的机制。" }
    ]
  },
  {
    id: "entp-value-conflict",
    title: "价值观冲突",
    targetMbti: "ENTP",
    targetMbtis: ["ENTP"],
    sceneType: "value",
    difficulty: 3,
    difficultyLabel: "价值冲突",
    relationship: "朋友关系",
    theme: "开放讨论 vs 价值边界",
    initialConflict: "ENTP 朋友把你很在意的价值立场当作辩题公开挑战，你感到被冒犯，对方却认为这只是观点交流。",
    initialRelationshipState: { trust: 55, emotionalConnection: 46, communication: 50, conflictLevel: 34, understanding: 48 },
    summary: "探索如何保留观点开放度，同时区分思想挑战、关系影响和不可协商的表达边界。",
    stages: [
      {
        id: "entp-1",
        round: 1,
        beat: "观点挑衅",
        targetLine: "我只是检验这个观点能不能站住，又不是在攻击你。为什么不能把人和观点分开？",
        prompt: "你会怎样回应“只是讨论”的说法？",
        options: [
          choice("a", "先请对方说清正在挑战的前提，再判断自己是否愿意继续讨论。", ["澄清命题", "保留选择"], delta(0, 8, 7, 2, 4), "entp-2"),
          choice("b", "说明观点可以讨论，但公开玩笑实际影响了你们的关系。", ["区分意图影响", "表达感受"], delta(7, 7, 5, 6, 3), "entp-2"),
          choice("c", "接受一次完整辩论，但约定双方先准确复述对方立场。", ["公平辩论", "准确理解"], delta(2, 8, 3, 3, 8), "entp-2"),
          choice("d", "告诉对方这个议题目前不适合讨论，并给出你愿意再谈的条件。", ["议题边界", "延后讨论"], delta(-1, 7, 9, 1, -1), "entp-2")
        ]
      },
      {
        id: "entp-2",
        round: 2,
        beat: "边界试探",
        targetLine: "如果一个观点不能接受玩笑和反例，它是不是本来就太脆弱？",
        prompt: "你会如何处理幽默、质疑和尊重之间的界线？",
        options: [
          choice("a", "同意观点可以被挑战，但请对方区分针对论证和针对身份的玩笑。", ["区分层次", "保留讨论"], delta(4, 9, 7, 4, 5), "entp-3"),
          choice("b", "邀请对方先替你的立场做最强版本，再提出反例。", ["善意理解", "高质量辩论"], delta(5, 7, 2, 4, 8), "entp-3"),
          choice("c", "明确不接受公开调侃，但愿意在私下继续严肃讨论观点。", ["场合边界", "关系保护"], delta(2, 8, 9, 5, 3), "entp-3"),
          choice("d", "承认自己暂时会把观点和自我联系在一起，需要先暂停而非勉强开放。", ["承认状态", "主动暂停"], delta(7, 5, 8, 2, -2), "entp-3")
        ]
      },
      {
        id: "entp-3",
        round: 3,
        beat: "需要澄清",
        targetLine: "那你希望我赞同你，还是只希望我别让你不舒服？这两件事可不一样。",
        prompt: "你会怎样说明自己真正需要的回应？",
        options: [
          choice("a", "说明不要求赞同，只要求对方先准确理解，再选择怎样反驳。", ["理解优先", "允许分歧"], delta(5, 9, 4, 5, 7), "entp-4"),
          choice("b", "坦白某些价值关系到安全感，因此讨论方式本身也是议题的一部分。", ["揭示意义", "讨论方式"], delta(8, 6, 5, 6, 4), "entp-4"),
          choice("c", "列出可以争论的判断和不接受被否定的个人经验。", ["内容分层", "经验边界"], delta(3, 9, 9, 4, 4), "entp-4"),
          choice("d", "承认自己也可能改变观点，但不会在被催促的状态下立即给出结论。", ["保留开放", "决策节奏"], delta(2, 7, 8, 3, 5), "entp-4")
        ]
      },
      {
        id: "entp-4",
        round: 4,
        beat: "保留分歧",
        targetLine: "我不想我们的关系只能靠回避分歧维持。以后怎么谈，才不会每次都变成关系危机？",
        prompt: "最后一轮，你会建立什么观点交流规则？",
        options: [
          choice("a", "敏感议题开始前先确认是否愿意辩论，以及可以投入多长时间。", ["讨论同意", "时间边界"], delta(3, 8, 9, 5, 7), null),
          choice("b", "约定先复述、再质疑、最后说明仍未改变的部分。", ["结构对话", "保留差异"], delta(5, 9, 4, 7, 9), null),
          choice("c", "保留少数不作为娱乐辩题的红线，其余议题继续自由挑战。", ["价值红线", "开放空间"], delta(2, 8, 10, 4, 5), null),
          choice("d", "发生情绪升级时允许任何一方暂停，并约定是否需要恢复话题。", ["暂停机制", "冲突修复"], delta(6, 6, 8, 9, 5), null)
        ]
      }
    ],
    evaluationRules: [
      { dimension: "emotionalAcceptance", description: "是否看见价值议题与安全感、身份经验之间的连接。" },
      { dimension: "clarity", description: "是否区分观点、身份、意图、影响和具体讨论命题。" },
      { dimension: "boundaryAwareness", description: "是否建立讨论同意、场合和不可娱乐化的红线。" },
      { dimension: "conflictRepair", description: "是否处理公开玩笑造成的关系影响，并允许暂停与恢复。" },
      { dimension: "collaboration", description: "是否形成双方都能使用的高质量分歧规则。" }
    ]
  },
  {
    id: "isfp-first-date",
    title: "第一次约会互动",
    targetMbti: "ISFP",
    targetMbtis: ["ENFP", "ISFP"],
    sceneType: "dating",
    difficulty: 1,
    difficultyLabel: "普通交流",
    relationship: "初次约会",
    theme: "自然连接 vs 关系节奏",
    initialConflict: "第一次约会比预期更有火花，但临时变化、沉默与亲密节奏也让双方不断判断彼此是否自在。",
    initialRelationshipState: { trust: 48, emotionalConnection: 52, communication: 50, conflictLevel: 16, understanding: 48 },
    summary: "在好奇、真实表达、个人边界与关系推进之间，观察你最自然的建立连接方式。",
    stages: [
      {
        id: "isfp-1",
        round: 1,
        beat: "临时变化",
        targetLine: "附近好像有个临时展览，我们要不要现在改计划去看看？按原来安排也可以。",
        targetLines: {
          ENFP: "附近有个只开放今晚的活动，我们现在改计划去看看吧？感觉会很有意思。",
          ISFP: "附近好像有个临时展览，我们要不要现在改计划去看看？按原来安排也可以。"
        },
        prompt: "面对第一次约会中的临时变化，你会怎么回应？",
        options: [
          choice("a", "接受新提议，把它当作观察彼此即兴相处方式的机会。", ["拥抱变化", "共同体验"], delta(3, 2, 1, 2, 8), "isfp-2"),
          choice("b", "问清距离和结束时间，再决定是否调整原来的安排。", ["确认信息", "保留节奏"], delta(1, 8, 7, 1, 4), "isfp-2"),
          choice("c", "坦白自己更喜欢按原计划，但愿意约定下次专门去看。", ["真实偏好", "延后满足"], delta(2, 7, 8, 3, 4), "isfp-2"),
          choice("d", "提议先完成原计划的一半，再一起决定是否转场。", ["折中试探", "共同决定"], delta(3, 6, 4, 3, 7), "isfp-2")
        ]
      },
      {
        id: "isfp-2",
        round: 2,
        beat: "沉默时刻",
        targetLine: "我有时候安静不是无聊，只是在感受当下。你会介意约会里有一点沉默吗？",
        targetLines: {
          ENFP: "我一兴奋就会说很多，但也担心自己把空间占满了。你现在感觉自在吗？",
          ISFP: "我有时候安静不是无聊，只是在感受当下。你会介意约会里有一点沉默吗？"
        },
        prompt: "你会如何回应彼此不同的交流节奏？",
        options: [
          choice("a", "说出自己对沉默的真实感受，并询问对方怎样的节奏最自在。", ["表达状态", "询问节奏"], delta(6, 7, 3, 3, 6), "isfp-3"),
          choice("b", "允许一段不需要填满的沉默，把注意力放回共同体验。", ["容纳沉默", "当下连接"], delta(8, 1, 3, 4, 5), "isfp-3"),
          choice("c", "准备几个轻松问题，在沉默太久时帮助对话重新流动。", ["主动维系", "降低尴尬"], delta(3, 6, 1, 2, 7), "isfp-3"),
          choice("d", "说明自己需要更多语言反馈，哪怕只是简单告诉你当下感受。", ["沟通需要", "反馈边界"], delta(2, 8, 8, 2, 3), "isfp-3")
        ]
      },
      {
        id: "isfp-3",
        round: 3,
        beat: "亲密试探",
        targetLine: "我今天很开心，但我不太想让第一次见面就推进得太快。希望你不会误会。",
        targetLines: {
          ENFP: "我今天真的很开心，但一开心就容易冲太快。我们要不要也确认一下彼此舒服的节奏？",
          ISFP: "我今天很开心，但我不太想让第一次见面就推进得太快。希望你不会误会。"
        },
        prompt: "面对亲密节奏的边界，你会怎样回应？",
        options: [
          choice("a", "明确表示尊重，并询问今天结束前怎样互动会让对方舒服。", ["确认边界", "具体询问"], delta(7, 7, 9, 4, 6), "isfp-4"),
          choice("b", "分享自己的节奏也偏慢，让关系通过几次真实相处自然形成。", ["自我揭示", "渐进连接"], delta(6, 5, 7, 5, 5), "isfp-4"),
          choice("c", "说明自己节奏可能更快，但不会把热情变成对方必须回应的压力。", ["承认差异", "不施加压力"], delta(5, 7, 8, 4, 4), "isfp-4"),
          choice("d", "提议先把今晚当作一次认识，不急着定义是否进入恋爱方向。", ["降低定义", "保留空间"], delta(3, 6, 8, 3, 2), "isfp-4")
        ]
      },
      {
        id: "isfp-4",
        round: 4,
        beat: "约会之后",
        targetLine: "今天之后，你希望我们怎样继续联系？我不太喜欢靠猜测判断对方是不是有兴趣。",
        targetLines: {
          ENFP: "今天之后你想怎么继续？我会很期待，但也不想因为太热情让你有压力。",
          ISFP: "今天之后，你希望我们怎样继续联系？我不太喜欢靠猜测判断对方是不是有兴趣。"
        },
        prompt: "最后一轮，你会怎样表达兴趣与后续安排？",
        options: [
          choice("a", "直接表达想再见，并提出一个具体但可拒绝的下次邀请。", ["清晰兴趣", "保留选择"], delta(5, 9, 7, 4, 7), null),
          choice("b", "说出今天最喜欢的一个瞬间，再问对方是否也愿意继续了解。", ["具体反馈", "双向确认"], delta(8, 7, 3, 5, 7), null),
          choice("c", "约定回去后各自感受一下，第二天再诚实回复是否想继续。", ["留出判断", "明确期限"], delta(3, 8, 8, 3, 4), null),
          choice("d", "保持轻量联系，不立刻安排见面，让下一次邀请在自然时机出现。", ["降低压力", "自然发展"], delta(5, 3, 6, 3, 1), null)
        ]
      }
    ],
    evaluationRules: [
      { dimension: "emotionalAcceptance", description: "是否接住兴奋、安静和不确定，而不是把它们快速解释为好感或拒绝。" },
      { dimension: "clarity", description: "是否清楚表达兴趣、交流偏好与后续意愿。" },
      { dimension: "boundaryAwareness", description: "是否尊重临时变化、身体亲密和关系推进的节奏。" },
      { dimension: "conflictRepair", description: "是否能及时校准误会，让不同节奏不必演变为否定。" },
      { dimension: "collaboration", description: "是否邀请双方共同决定约会安排与下一步。" }
    ]
  },
  {
    id: "isfj-family-conflict",
    title: "家庭责任冲突",
    targetMbti: "ISFJ",
    targetMbtis: ["ISFJ"],
    sceneType: "family",
    difficulty: 3,
    difficultyLabel: "价值冲突",
    relationship: "家庭关系",
    theme: "家庭责任 vs 自我需要",
    initialConflict: "长期承担照顾责任的 ISFJ 家人突然拒绝继续配合，隐藏多年的委屈集中爆发。",
    initialRelationshipState: { trust: 44, emotionalConnection: 38, communication: 34, conflictLevel: 43, understanding: 42 },
    summary: "面对家人付出、传统期待与个人边界，练习让责任从默认牺牲变成可以协商的分工。",
    stages: [
      {
        id: "isfj-1",
        round: 1,
        beat: "委屈爆发",
        targetLine: "每次家里有事，最后留下来处理的都是我。你们嘴上说辛苦了，可下一次还是默认我会做。",
        prompt: "面对积累已久的指责，你会先回应什么？",
        options: [
          choice("a", "先承认这种分工确实被当成了理所当然，请对方说出最难受的一次。", ["承认忽略", "回看经历"], delta(9, 4, 1, 7, 3), "isfj-2"),
          choice("b", "立即列出自己过去承担过的部分，说明并非只有对方在付出。", ["补充事实", "平衡责任"], delta(-3, 8, 3, -2, 1), "isfj-2"),
          choice("c", "提出先暂停争论，今晚把全部家庭事务和实际耗时列出来。", ["暂停降温", "任务盘点"], delta(1, 7, 7, 3, 5), "isfj-2"),
          choice("d", "坦白自己之前依赖了对方的可靠，也确实没有主动问过他们是否愿意。", ["自我反思", "承担影响"], delta(7, 6, 2, 9, 2), "isfj-2")
        ]
      },
      {
        id: "isfj-2",
        round: 2,
        beat: "传统压力",
        targetLine: "妈妈会说一家人不该算得这么清楚。我一拒绝，就好像变成了最自私的那个人。",
        prompt: "家庭传统开始施压，你会怎样支持责任协商？",
        options: [
          choice("a", "说明亲近不等于无限可用，并愿意和对方一起面对家人的不满。", ["共同承担", "重设边界"], delta(6, 6, 9, 5, 8), "isfj-3"),
          choice("b", "建议暂时不要惊动父母，兄弟姐妹先私下把轮值表定好。", ["降低冲突", "内部协调"], delta(2, 7, 4, 3, 8), "isfj-3"),
          choice("c", "请对方直接拒绝下一次安排，让家人自然看见没有他们会发生什么。", ["停止补位", "后果边界"], delta(-1, 6, 10, 1, -2), "isfj-3"),
          choice("d", "保留重要节日的共同责任，但把日常照顾改成按时间和能力分配。", ["保留传统", "分层责任"], delta(3, 8, 7, 4, 8), "isfj-3")
        ]
      },
      {
        id: "isfj-3",
        round: 3,
        beat: "关系反转",
        targetLine: "算了，我不想再求别人帮忙。以后我自己的事情也不会麻烦你们。",
        prompt: "对方从愤怒转向退出，你会怎样回应这层失望？",
        options: [
          choice("a", "不急着接受“算了”，先说清你听见的是失望而不只是任务分配。", ["看见失望", "保留连接"], delta(9, 4, 1, 7, 4), "isfj-4"),
          choice("b", "尊重对方暂时退出，并明确从今天起由你接手一项固定责任。", ["行动承担", "给予空间"], delta(3, 7, 7, 8, 4), "isfj-4"),
          choice("c", "提醒家人互相帮助本来就不是交换，不希望关系变成精确记账。", ["维护亲情", "反对计价"], delta(4, 5, 0, 1, 3), "isfj-4"),
          choice("d", "说明你也无法承担全部缺口，需要所有家庭成员共同进入这次讨论。", ["能力边界", "全员协商"], delta(1, 8, 9, 3, 8), "isfj-4")
        ]
      },
      {
        id: "isfj-4",
        round: 4,
        beat: "重新分工",
        targetLine: "我不是不愿意照顾家人。我只是不想每次都要先牺牲自己，才算是一个好家人。",
        prompt: "最后一轮，你会提出怎样的新家庭约定？",
        options: [
          choice("a", "建立轮值、替班和拒绝规则，每个人按可用时间承担而非按习惯分配。", ["透明分工", "拒绝规则"], delta(3, 9, 9, 6, 10), null),
          choice("b", "先接手未来一个月的主要任务，让对方休息后再一起讨论长期分工。", ["立即补位", "延后协商"], delta(7, 4, 2, 8, 3), null),
          choice("c", "保留对方最在意的照顾方式，同时把耗时事务交给其他人或外部服务。", ["尊重价值", "资源替代"], delta(6, 7, 5, 5, 8), null),
          choice("d", "约定任何新任务都必须先询问，沉默不再被视为默认同意。", ["主动询问", "同意边界"], delta(4, 9, 10, 5, 6), null)
        ]
      }
    ],
    evaluationRules: [
      { dimension: "emotionalAcceptance", description: "是否看见长期付出背后的委屈和对家人连接的珍惜。" },
      { dimension: "clarity", description: "是否把模糊的孝顺与责任转化为具体任务、时间和请求。" },
      { dimension: "boundaryAwareness", description: "是否允许家人在不被道德化指责的情况下拒绝或调整。" },
      { dimension: "conflictRepair", description: "是否用真实补位和持续行动修复被默认牺牲的影响。" },
      { dimension: "collaboration", description: "是否让家庭责任由所有相关成员共同协商和承担。" }
    ]
  },
  {
    id: "estj-team-failure",
    title: "团队合作失败",
    targetMbti: "ESTJ",
    targetMbtis: ["ESTJ"],
    sceneType: "teamwork",
    difficulty: 2,
    difficultyLabel: "轻微冲突",
    relationship: "团队协作",
    theme: "快速追责 vs 系统修复",
    initialConflict: "一次关键交付失败后，ESTJ 项目负责人准备当场追责，团队则因信息与职责混乱陷入防御。",
    initialRelationshipState: { trust: 45, emotionalConnection: 34, communication: 42, conflictLevel: 40, understanding: 40 },
    summary: "在时限压力下区分个人责任与系统问题，既不回避追责，也不让团队因恐惧停止提供真实信息。",
    stages: [
      {
        id: "estj-1",
        round: 1,
        beat: "交付失败",
        targetLine: "客户已经在等解释。我现在要知道是谁没有完成自己的部分，而不是听一堆环境原因。",
        prompt: "第一次复盘充满压力，你会怎样回应追责要求？",
        options: [
          choice("a", "先给出已确认的责任链和客户止损动作，再说明哪些事实还需核实。", ["快速止损", "事实边界"], delta(1, 9, 7, 5, 6), "estj-2"),
          choice("b", "请每个人分别说明承诺、实际完成和阻塞，暂时不评价动机。", ["结构复盘", "避免归因"], delta(3, 8, 4, 6, 8), "estj-2"),
          choice("c", "直接承担协调责任，承诺稍后提交完整复盘，先让团队恢复交付。", ["负责人承担", "延后追责"], delta(4, 7, 2, 7, 5), "estj-2"),
          choice("d", "指出公开点名会降低信息质量，要求把追责改到私下进行。", ["保护团队", "沟通边界"], delta(2, 7, 9, 2, 3), "estj-2")
        ]
      },
      {
        id: "estj-2",
        round: 2,
        beat: "责任争夺",
        targetLine: "如果每个人都说自己有阻塞，那是不是意味着最后根本没有人负责？",
        prompt: "责任与系统问题相互缠绕，你会怎么拆开？",
        options: [
          choice("a", "区分结果负责人、执行责任和依赖责任，分别记录缺口。", ["责任分层", "明确归属"], delta(0, 10, 7, 4, 8), "estj-3"),
          choice("b", "要求每个人只说自己下次会改变什么，避免复盘继续解释过去。", ["行动优先", "减少辩解"], delta(-2, 8, 2, 3, 6), "estj-3"),
          choice("c", "先检查目标、权限和资源是否对等，再决定哪些是个人失误。", ["系统校准", "公平追责"], delta(4, 8, 8, 6, 7), "estj-3"),
          choice("d", "由负责人先定义不能再次发生的结果，再邀请团队提出控制点。", ["结果底线", "共同控制"], delta(1, 8, 5, 5, 9), "estj-3")
        ]
      },
      {
        id: "estj-3",
        round: 3,
        beat: "团队沉默",
        targetLine: "现在没有人反对计划。我可以理解为大家都同意，并且能按时完成吗？",
        prompt: "表面的安静可能是同意，也可能是防御，你会怎样确认？",
        options: [
          choice("a", "逐项点名确认风险与承诺，让每个人给出明确答案。", ["明确确认", "责任可见"], delta(-1, 9, 3, 2, 7), "estj-4"),
          choice("b", "匿名收集最大风险，再让负责人公开回应资源和优先级。", ["降低压力", "真实信息"], delta(7, 6, 4, 5, 8), "estj-4"),
          choice("c", "允许会后两小时内提出异议，逾期则按当前方案执行。", ["异议窗口", "决策期限"], delta(2, 8, 8, 3, 6), "estj-4"),
          choice("d", "先由自己提出计划最可能失败的一点，示范质疑不等于不配合。", ["示范开放", "降低防御"], delta(7, 6, 2, 7, 7), "estj-4")
        ]
      },
      {
        id: "estj-4",
        round: 4,
        beat: "再次出发",
        targetLine: "我接受这次不只是个人失误。但下一轮必须更快暴露问题，也必须有人对结果负责。",
        prompt: "最后一轮，你会建立怎样的团队恢复机制？",
        options: [
          choice("a", "设置单一结果负责人、依赖清单和触发升级的明确阈值。", ["单点负责", "提前升级"], delta(1, 10, 7, 6, 9), null),
          choice("b", "每周检查交付与团队负荷，任何一项超限都必须重新排优先级。", ["双重指标", "动态调整"], delta(6, 8, 6, 7, 9), null),
          choice("c", "保留强追责，但只针对未上报风险和违反明确流程的行为。", ["追责边界", "规则一致"], delta(0, 9, 9, 5, 5), null),
          choice("d", "先用一个小周期验证新流程，成功后再扩展到整个项目。", ["小步试行", "降低风险"], delta(3, 7, 5, 6, 8), null)
        ]
      }
    ],
    evaluationRules: [
      { dimension: "emotionalAcceptance", description: "是否把压力和防御视为影响信息质量的真实因素。" },
      { dimension: "clarity", description: "是否明确结果负责人、执行责任、依赖和时间节点。" },
      { dimension: "boundaryAwareness", description: "是否让责任与权限、资源、流程保持对等。" },
      { dimension: "conflictRepair", description: "是否把失败转化为可复盘、可验证的团队机制。" },
      { dimension: "collaboration", description: "是否让成员能够暴露风险并共同形成下一轮方案。" }
    ]
  }
] as const;

export const labScenarios: readonly ScenarioDefinition[] = [
  ...relationshipJourneyScenarios,
  ...baseRelationshipScenarios,
  loveCrisisScenario,
  ...chapterScenarios,
  ...personalityScenarios
];

const scenarioIds = new Set<LabScenarioId>();

for (const scenario of labScenarios) {
  if (scenarioIds.has(scenario.id)) {
    throw new Error(`Duplicate lab scenario id: ${scenario.id}`);
  }
  if (scenario.stages.length < 20) {
    throw new Error(`Lab scenario ${scenario.id} must contain at least 20 stages.`);
  }
  scenarioIds.add(scenario.id);
}

for (const difficulty of [1, 2, 3, 4] as const) {
  const scenarioCount = labScenarios.filter((scenario) => scenario.difficulty === difficulty).length;
  if (scenarioCount < 3) {
    throw new Error(`Lab difficulty ${difficulty} requires at least 3 scenarios; received ${scenarioCount}.`);
  }
}

export const labScenarioMap = Object.fromEntries(
  labScenarios.map((scenario) => [scenario.id, scenario])
) as Record<LabScenarioId, ScenarioDefinition>;

export function getLabScenario(id: LabScenarioId) {
  return labScenarioMap[id];
}
