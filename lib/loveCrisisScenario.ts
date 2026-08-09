import type {
  CommunicationScoreDelta,
  RelationshipStateDelta,
  ScenarioDefinition,
  ScenarioOption,
  ScenarioStage,
  ScenarioStageVariant
} from "@/types/lab";

type ChoiceStyle =
  | "listen"
  | "explain"
  | "confront"
  | "pause"
  | "collaborate"
  | "boundary"
  | "repair"
  | "withdraw"
  | "vulnerable"
  | "solve";

const choiceStyle: Record<
  ChoiceStyle,
  {
    scoreDelta: CommunicationScoreDelta;
    relationshipDelta: RelationshipStateDelta;
    advantage: string;
    tradeoff: string;
  }
> = {
  listen: {
    scoreDelta: { emotionalAcceptance: 3, clarity: 0, conflictRepair: 2, collaboration: 1 },
    relationshipDelta: { trust: 2, emotionalConnection: 3, communication: 1, conflictLevel: -2, understanding: 3 },
    advantage: "让情绪和未说完的需要先获得位置。",
    tradeoff: "眼前问题不会立刻得到处理。"
  },
  explain: {
    scoreDelta: { emotionalAcceptance: -1, clarity: 3, boundaryAwareness: 1, collaboration: 1 },
    relationshipDelta: { emotionalConnection: -1, communication: 3, conflictLevel: 1, understanding: 1 },
    advantage: "帮助双方更快看清事实与动机。",
    tradeoff: "对方可能在情绪尚未被接住时感到被说服。"
  },
  confront: {
    scoreDelta: { emotionalAcceptance: -2, clarity: 2, boundaryAwareness: 2, conflictRepair: -2, collaboration: -2 },
    relationshipDelta: { trust: -2, emotionalConnection: -3, communication: 1, conflictLevel: 4, understanding: -1 },
    advantage: "把最尖锐的问题直接放上桌面。",
    tradeoff: "会显著提高防御和失控风险。"
  },
  pause: {
    scoreDelta: { emotionalAcceptance: 0, clarity: 1, boundaryAwareness: 3, conflictRepair: 1, collaboration: -1 },
    relationshipDelta: { trust: 0, emotionalConnection: -1, communication: 0, conflictLevel: -3, understanding: 0 },
    advantage: "给双方留出恢复判断力的时间。",
    tradeoff: "没有明确返回约定时，暂停会被体验成离开。"
  },
  collaborate: {
    scoreDelta: { emotionalAcceptance: 1, clarity: 2, boundaryAwareness: 1, conflictRepair: 2, collaboration: 3 },
    relationshipDelta: { trust: 2, emotionalConnection: 1, communication: 3, conflictLevel: -1, understanding: 2 },
    advantage: "让改变成为双方共同参与的方案。",
    tradeoff: "协商会减慢当下决策速度。"
  },
  boundary: {
    scoreDelta: { emotionalAcceptance: 0, clarity: 2, boundaryAwareness: 3, conflictRepair: 0, collaboration: 0 },
    relationshipDelta: { trust: 1, emotionalConnection: -1, communication: 2, conflictLevel: 0, understanding: 1 },
    advantage: "保护了不能通过挽回来牺牲的真实需要。",
    tradeoff: "边界变清楚时，短时间会出现距离。"
  },
  repair: {
    scoreDelta: { emotionalAcceptance: 2, clarity: 1, boundaryAwareness: 0, conflictRepair: 3, collaboration: 2 },
    relationshipDelta: { trust: 3, emotionalConnection: 2, communication: 1, conflictLevel: -2, understanding: 2 },
    advantage: "承认实际影响，并让修复落到行动。",
    tradeoff: "需要承担不舒服的责任感。"
  },
  withdraw: {
    scoreDelta: { emotionalAcceptance: -2, clarity: -2, boundaryAwareness: 1, conflictRepair: -2, collaboration: -2 },
    relationshipDelta: { trust: -2, emotionalConnection: -3, communication: -3, conflictLevel: 1, understanding: -2 },
    advantage: "暂时避免了正面碰撞。",
    tradeoff: "沉默会让对方用自己的担忧填补信息空白。"
  },
  vulnerable: {
    scoreDelta: { emotionalAcceptance: 2, clarity: 2, boundaryAwareness: 1, conflictRepair: 1, collaboration: 0 },
    relationshipDelta: { trust: 2, emotionalConnection: 3, communication: 2, conflictLevel: 1, understanding: 2 },
    advantage: "让对方看见防御背后的真实感受。",
    tradeoff: "如果双方都在高压中，坦白也可能带来新的情绪碰撞。"
  },
  solve: {
    scoreDelta: { emotionalAcceptance: -1, clarity: 3, boundaryAwareness: 1, conflictRepair: 1, collaboration: 2 },
    relationshipDelta: { trust: 1, emotionalConnection: -1, communication: 3, conflictLevel: 0, understanding: 1 },
    advantage: "快速形成可观察、可执行的下一步。",
    tradeoff: "方案先行可能再次跳过关系中的情绪意义。"
  }
};

const nextNode = (round: number) => (round === 20 ? null : `love-${round + 1}`);

function storyChoice(
  id: string,
  label: string,
  style: ChoiceStyle,
  intentTags: readonly string[],
  enfpReaction: string,
  intjReaction: string,
  round: number
): ScenarioOption {
  const profile = choiceStyle[style];
  return {
    id,
    label,
    intentTags,
    scoreDelta: profile.scoreDelta,
    relationshipDelta: profile.relationshipDelta,
    nextStage: nextNode(round),
    reaction: enfpReaction,
    reactions: { ENFP: enfpReaction, INTJ: intjReaction },
    advantage: profile.advantage,
    tradeoff: profile.tradeoff
  };
}

function storyNode(
  round: number,
  chapter: number,
  beat: string,
  story: string,
  enfpLine: string,
  intjLine: string,
  prompt: string,
  options: readonly ScenarioOption[],
  variants?: readonly ScenarioStageVariant[]
): ScenarioStage {
  return {
    id: `love-${round}`,
    round,
    chapter,
    beat,
    story,
    targetLine: enfpLine,
    targetLines: { ENFP: enfpLine, INTJ: intjLine },
    prompt,
    variants,
    options
  };
}

const nodes: readonly ScenarioStage[] = [
  storyNode(1, 1, "回复变少", "最近一周，对方回复消息的间隔越来越长。今晚，你终于等到了一条语音。", "我最近真的有点累，但更难受的是，你好像完全没有发现。", "我最近在处理很多事，但我们之间的信息越来越少，这不是一个好信号。", "你怎么回应这句久违的主动开口？", [
    storyChoice("a", "先问最近发生了什么，告诉对方你愿意认真听。", "listen", ["主动倾听", "接住疲惫"], "……我以为你又会问我到底想怎么解决。那你先别急，让我慢慢说。", "好。先把情况说完整，再决定问题在哪。", 1),
    storyChoice("b", "解释自己最近也很忙，并不是故意忽略。", "explain", ["解释处境", "澄清动机"], "我知道你忙，可我说的是你有没有看见我，不是谁更辛苦。", "原因我能理解，但这不能替代我们对现状的确认。", 1),
    storyChoice("c", "直接问对方是不是已经不爱了。", "confront", ["确认关系", "直面恐惧"], "你看，你又一下跳到最坏的结论。我现在连累都不敢说了。", "这个问题现在没有足够信息支持，只会让谈话失焦。", 1),
    storyChoice("d", "先不回复，等双方状态好一点再说。", "withdraw", ["延后回应", "避免冲突"], "屏幕一直没有亮。我想，也许不被回应本身就是答案。", "没有回应让我只能按现有信息判断：这件事并不优先。", 1)
  ]),
  storyNode(2, 1, "临时取消", "周末原本约好见面，对方却在出发前两个小时取消了。", "我知道很临时，可我今天真的不想再按计划走了。", "临时取消会影响后续安排。我需要知道这是一次例外，还是常态。", "你的失望已经冒出来了，你会怎么说？", [
    storyChoice("a", "先确认对方是否遇到困难，再谈自己被打乱的感受。", "listen", ["先问状态", "表达失望"], "谢谢你没有先怪我。可我也知道，这样改计划会让你很难受。", "先确认原因是合理的。之后我们需要处理这次变更的成本。", 2),
    storyChoice("b", "说明临时取消让你很被动，希望以后至少提前一天。", "boundary", ["时间边界", "具体请求"], "我能答应尽量早说，但我不想每次变化都像犯错。", "这个要求具体，也可以执行。我需要同样的弹性适用于双方。", 2),
    storyChoice("c", "告诉对方既然不想来，那以后也不用勉强。", "confront", ["表达不满", "推开关系"], "你明明在意，却总要装成无所谓。这样真的很伤人。", "如果这是你的真实决定，我会按它调整后续投入。", 2),
    storyChoice("d", "说没关系，独自消化失望。", "withdraw", ["压下感受", "维持表面"], "你说没关系，可语气完全不是。我不知道还能不能相信你说出口的话。", "表面同意和实际反应不一致，只会增加判断成本。", 2)
  ]),
  storyNode(3, 1, "餐桌上的手机", "几天后你们见面。对方一边吃饭，一边不断看手机。", "你是不是有话想说？你今天一直在观察我。", "你看起来在回避直接提问。有什么具体问题？", "你会如何说出此刻的不自在？", [
    storyChoice("a", "说自己期待这次见面，希望能有一段不看手机的时间。", "boundary", ["表达期待", "具体边界"], "可以。其实我一直看手机，也是怕我们突然没话说。", "明确时间段比泛泛要求关注更有效，我可以配合。", 3),
    storyChoice("b", "问是不是发生了急事，需要的话可以先处理。", "listen", ["善意确认", "保留空间"], "没有急事。你这样问，我反而有点不好意思一直躲在手机后面。", "没有紧急事项。我会把手机收起来。", 3),
    storyChoice("c", "讽刺对方看来和手机约会更开心。", "confront", ["讽刺表达", "释放不满"], "如果你想让我放下手机，可以直接说，不用让我猜这句话里有多少气。", "讽刺没有提供可执行信息，只会让我更防御。", 3),
    storyChoice("d", "也拿出手机，不再主动说话。", "withdraw", ["镜像回避", "停止投入"], "两个人坐在一起，却像在各自等这顿饭结束。", "互动已经停止。我会把它理解为你暂时不愿沟通。", 3)
  ]),
  storyNode(4, 1, "自由与计划", "回家路上，对方提到下个月想独自旅行，而你们原本讨论过共同假期。", "我不是不要和你旅行，我只是也想有一段完全属于自己的路。", "个人安排没有问题，但它与我们已经讨论的共同时间发生了冲突。", "你会怎样处理自由与承诺的第一次正面碰撞？", [
    storyChoice("a", "问这次独自旅行对对方意味着什么。", "listen", ["探索意义", "理解自由"], "我想确认自己不是只能活在‘我们’里面。不是为了逃离你。", "如果这是恢复个人状态的需要，我愿意把它纳入讨论。", 4),
    storyChoice("b", "拿出日程，讨论怎样同时保留两段旅行。", "solve", ["重排计划", "兼顾需求"], "你总能很快找到方案，可我还没确定自己为什么这么想。", "这是可行方向，但需要先确认时间和预算约束。", 4),
    storyChoice("c", "说伴侣本来就应该优先选择共同假期。", "confront", ["强调承诺", "关系优先"], "如果在一起就必须放弃每一次独自出发，那我会越来越不像自己。", "优先级不能靠身份自动决定，需要双方明确承诺。", 4),
    storyChoice("d", "表示随便，但决定以后不再主动规划。", "withdraw", ["撤回投入", "消极同意"], "你说随便的时候，我听见的其实是‘那以后都别期待我了’。", "撤回规划不是解决冲突，只是把后果推迟。", 4)
  ]),
  storyNode(5, 1, "第一次失控", "争论持续到深夜。对方突然说，这段关系越来越像一份需要完成的任务。", "我不是讨厌计划，我只是害怕我们的关系最后只剩下任务。", "如果每次只谈感受却不形成改变，这个问题以后还会重复。", "第一阶段结束前，你要把谈话带向哪里？", [
    storyChoice("a", "先承认关系确实变得紧绷，问对方最想找回什么。", "listen", ["承认变化", "寻找连接"], "我想找回那种可以很自然靠近你，不用先确认自己做得对不对的感觉。", "我想找回的是稳定信任，而不是每次冲突后重新猜测。", 5),
    storyChoice("b", "提出把问题拆成时间、自由和回应方式三部分。", "solve", ["结构分析", "问题拆解"], "可以拆，但你先答应我，不要把我的感受也变成一个待办项。", "这样更有效。先定义问题，再逐项确认变化。", 5),
    storyChoice("c", "反问对方是不是只有完全随心所欲才觉得被爱。", "confront", ["质疑需求", "情绪反击"], "你根本没有在听。你只是想证明我的需要不合理。", "把我的立场极端化不会帮助我们找到真实分歧。", 5),
    storyChoice("d", "说今晚都太累了，约定明天下午继续。", "pause", ["暂停降温", "明确返回"], "好。但明天别假装什么都没发生，我会等你来找我。", "可以。明确时间比继续低质量争论更合适。", 5)
  ]),
  storyNode(6, 2, "第二天", "第二天下午，你们重新坐下来。昨夜留下的情绪决定了这次开场的温度。", "我一整天都在想，我们是不是已经不会好好说话了。", "我整理了昨晚的分歧，但是否继续讨论取决于我们能否改变方式。", "这一次，你会怎样重新开场？", [
    storyChoice("a", "先说自己昨晚哪里伤到了对方，不加解释。", "repair", ["承担影响", "不急辩解"], "我没想到你会先说这个。至少我不用又证明自己真的受伤了。", "承认影响有助于降低重复争论，我听到了。", 6),
    storyChoice("b", "总结昨晚双方的三项分歧，请对方确认是否准确。", "explain", ["整理事实", "确认理解"], "大致是这样，但那种孤单感不在你的三条里面。", "总结基本准确。还需要补充情绪影响这一项。", 6),
    storyChoice("c", "说明自己也被指责伤到，希望先获得同等道歉。", "vulnerable", ["表达受伤", "要求对等"], "我可以听你的委屈，可为什么每次都要先交换，才能承认我的难过？", "我愿意承担我的部分，但不接受单向归责。", 6),
    storyChoice("d", "问对方到底还想不想继续，不想就别谈了。", "confront", ["逼近决定", "缩短拉扯"], "你每次害怕的时候，就把门直接关到只剩去或留。", "在问题未定义前逼迫二选一，只会制造错误决策。", 6)
  ], [
    { id: "heated", condition: { min: { conflictLevel: 58 } }, story: "第二天下午，对方迟到了二十分钟。昨夜的争吵没有冷却，反而在沉默里变得更硬。", targetLines: { ENFP: "我一路都在想，见面以后我们是不是又要证明谁更委屈。", INTJ: "昨晚的沟通效率很低。如果今天仍然如此，我会停止讨论。" } },
    { id: "repair", condition: { min: { understanding: 52, emotionalConnection: 50 }, max: { conflictLevel: 48 } }, story: "第二天下午，对方提前到了。桌上放着两杯饮料，气氛仍紧张，但至少双方都愿意回来。", targetLines: { ENFP: "我还是难过，但我愿意再试一次，不想让昨晚成为我们的结论。", INTJ: "我重新看了昨晚的问题。我们可以从确认彼此真正需要什么开始。" } },
    { id: "distance", condition: { max: { trust: 42 } }, story: "第二天下午，对方只发来一条文字消息，没有赴约。", targetLines: { ENFP: "我现在见到你会更乱。我们先在这里说吧。", INTJ: "我暂时不适合见面。请先用文字说明你希望讨论什么。" } }
  ]),
  storyNode(7, 2, "旧事重现", "谈话中，对方提起半年前一次被你遗忘的重要约定。", "那天我等了很久。你后来解释了，可你从来没问过我当时是什么感觉。", "那次失约已经解释过，但它显然没有真正被修复。", "旧事被重新带回，你会怎么接？", [
    storyChoice("a", "问对方那天最难受的不是等待，而是什么。", "listen", ["追问感受", "补回理解"], "最难受的是我不敢催你，怕自己显得太需要你。", "最主要的影响是信任下降，而不只是时间损失。", 7),
    storyChoice("b", "再次说明当时的客观原因，并强调不是故意。", "explain", ["补充原因", "澄清意图"], "这些我都知道。可知道原因，并没有让我当时不孤单。", "原因已知，但确实不足以修复影响。", 7),
    storyChoice("c", "指出对方也有忘记约定的时候，不该只记你的错。", "confront", ["对比责任", "抵抗归责"], "原来我一说受伤，就必须先接受审判自己够不够完美。", "列举对方失误不能抵消本次事件，需要分别处理。", 7),
    storyChoice("d", "承认这件事一直没处理完，提出今天把它说清。", "repair", ["承认遗留", "完成修复"], "好。那这次我想把那天没敢说的话都说完。", "同意。需要把影响和后续预防措施都明确。", 7)
  ]),
  storyNode(8, 2, "道歉的难题", "对方听完你的回应，沉默了一会儿。", "我不想只听‘对不起’，我想知道你到底懂了没有。", "道歉本身不够。我需要看到你理解了问题机制。", "你会如何让道歉不只是结束话题？", [
    storyChoice("a", "用自己的话复述这件事给对方造成的感受和影响。", "repair", ["复述影响", "确认理解"], "对，就是那种被排在最后、还不敢说的感觉。", "你的复述基本准确，这比重复道歉更有意义。", 8),
    storyChoice("b", "提出一个以后避免失联的具体约定。", "solve", ["预防机制", "行动承诺"], "方案有用，可我还想知道，你是不是终于明白我为什么难过。", "可执行。但理解原因与建立机制应同时完成。", 8),
    storyChoice("c", "说自己已经道歉很多次，不知道还要怎样。", "confront", ["表达疲惫", "拒绝重复"], "我不是要惩罚你。我只是到现在都没有被真正听见。", "重复次数不等于修复完成，但无限追问也需要边界。", 8),
    storyChoice("d", "坦白自己害怕承认影响，因为那会让你觉得自己很糟。", "vulnerable", ["揭示防御", "承认害怕"], "我不需要你变成坏人。我只需要你别为了证明自己不坏，就否认我的痛。", "这解释了防御来源。承认它有助于继续讨论。", 8)
  ]),
  storyNode(9, 2, "需要空间", "谈到一半，对方提出接下来想减少见面频率。", "我需要一点自己的空间，不想每次见面都在复盘关系。", "我需要减少低质量讨论，把时间留给真正能形成改变的对话。", "你会怎样回应这条距离请求？", [
    storyChoice("a", "询问空间具体意味着多久、怎样联系，而不是立刻猜测。", "boundary", ["澄清边界", "减少猜测"], "我想一周只见一次，但不是消失。我也会主动联系你。", "我建议明确频率、期限和恢复评估点。", 9),
    storyChoice("b", "答应给空间，但希望每天至少报一次平安。", "collaborate", ["保留连接", "协商频率"], "每天报平安有点像任务，不过我理解你会不安，我们可以再调。", "可以讨论，但需要确认这不是监控义务。", 9),
    storyChoice("c", "拒绝，认为真正爱一个人不会主动减少见面。", "confront", ["质疑爱意", "拒绝距离"], "你把我需要呼吸，直接翻译成了我不爱你。", "这个前提不成立。空间需求与关系承诺不是同一变量。", 9),
    storyChoice("d", "同意，并说在对方主动前你都不会联系。", "withdraw", ["彻底后退", "自我保护"], "我想要空间，不是想测试我不找你时你能消失多久。", "这不是协商后的空间，而是中断互动。", 9)
  ]),
  storyNode(10, 2, "冷战开始", "第三天晚上，双方都没有主动联系。聊天框停在一句生硬的“知道了”。", "我一直在等你，可我又不想每次都是我先低头。", "我们都在等待对方行动，这个僵局本身需要被打破。", "你是否要在冷战里先迈一步？", [
    storyChoice("a", "发一条不讨论对错的消息，只问对方今天过得怎样。", "listen", ["恢复回应", "低压靠近"], "看到你的消息那一刻，我其实松了口气。", "这是恢复通信的有效低成本动作。", 10),
    storyChoice("b", "直接发出明晚见面的邀请，说明想把问题谈完。", "solve", ["主动推进", "明确会面"], "我会去。但这次我不想一坐下就进入解决流程。", "可以。请提前说明讨论目标和时间。", 10),
    storyChoice("c", "继续等待，认为先联系的人会失去立场。", "withdraw", ["等待对方", "维持立场"], "第四天也没有消息。失望开始比愤怒更安静。", "沉默正在变成新的事实，而不是策略。", 10),
    storyChoice("d", "发长消息，把所有不满一次说完。", "confront", ["集中表达", "打破沉默"], "我读了三遍，只觉得自己又被一整页判决压住了。", "信息很多，但缺少优先级，也没有给回应留出空间。", 10)
  ]),
  storyNode(11, 3, "照片里的陌生人", "冷战期间，一张聚会照片出现在共同好友的动态里。对方和一个你不认识的人靠得很近。", "你是不是已经默认我会做什么，所以才一直不问我？", "如果你对照片有疑问，可以直接问，不要基于不完整信息推断。", "信任危机出现时，你会先相信什么？", [
    storyChoice("a", "描述自己看到照片后的不安，请对方说明当时情境。", "vulnerable", ["表达不安", "询问事实"], "那是朋友的同事。我更在意的是，你终于直接说你会害怕。", "背景很简单。我认可你先询问事实而不是定性。", 11),
    storyChoice("b", "要求看当晚聊天记录，证明没有隐瞒。", "confront", ["要求自证", "控制不确定"], "如果每次不安都要靠检查我来结束，我们会越来越不像恋人。", "我不会提供私人记录来替代基本信任。", 11),
    storyChoice("c", "假装没看到，观察对方会不会主动解释。", "withdraw", ["暗中观察", "避免暴露"], "你突然变得更冷，却什么都不说。我不知道自己又做错了什么。", "未知测试无法产生可靠信息，只会放大误差。", 11),
    storyChoice("d", "先询问共同好友，确认照片背后的情况。", "explain", ["外部核实", "降低误判"], "你宁愿问别人，也不愿意来问我。这比照片本身更让我难过。", "间接核实可能得到事实，但会损伤直接信任。", 11)
  ], [
    { id: "suspicion", condition: { max: { trust: 38 } }, story: "冷战第五天，一张聚会照片出现。因为信任已经很薄，这个模糊画面立刻变成了最坏猜测。", targetLines: { ENFP: "你已经不相信我了，对吗？所以一张照片就足够给我定罪。", INTJ: "如果基础信任已经低到需要外部取证，我们应该先讨论关系是否还成立。" } },
    { id: "repairing", condition: { min: { trust: 55, understanding: 58 }, max: { conflictLevel: 48 } }, story: "关系刚刚有一点修复迹象时，一张容易误解的聚会照片出现。它成了检验新沟通方式的第一道关。", targetLines: { ENFP: "你可以问我。只要你是真的想知道，不是已经决定我有问题。", INTJ: "这正好可以验证我们能否在信息不足时直接沟通。" } },
    { id: "heated", condition: { min: { conflictLevel: 62 } }, story: "争吵尚未结束，一张聚会照片又出现。新的信息让旧冲突瞬间失控。", targetLines: { ENFP: "你现在是不是终于找到理由，可以把所有问题都怪到我身上？", INTJ: "不要把新信息和旧冲突混在一起。先确定照片事实。" } }
  ]),
  storyNode(12, 3, "解释之后", "对方解释了照片，但你仍感觉有些事情没有被说透。", "我已经解释了。你还沉默，是因为不信，还是因为你还有别的话没说？", "事实已经说明。现在需要区分剩余的是证据问题还是信任问题。", "解释结束后，你会如何处理仍在的怀疑？", [
    storyChoice("a", "承认事实已清楚，但自己的安全感还没有跟上。", "vulnerable", ["区分事实感受", "承认不安"], "这句话我听得进去。至少你没有把不安继续变成我的罪名。", "合理。情绪更新通常慢于事实更新。", 12),
    storyChoice("b", "继续追问所有细节，直到没有任何不确定。", "confront", ["穷尽细节", "消除不确定"], "没有人能靠回答完所有问题，换来永远不被怀疑。", "信息无法消除全部不确定性，这个方法没有终点。", 12),
    storyChoice("c", "接受解释，并提议以后遇到类似情况直接互相询问。", "collaborate", ["接受事实", "建立规则"], "好。我也会尽量别让你从别人那里先看到重要信息。", "这是对称且可执行的规则。", 12),
    storyChoice("d", "说自己需要几天判断，不立刻决定是否相信。", "pause", ["延迟判断", "保护节奏"], "我可以等，但请告诉我你什么时候会回来，而不是让我无限期自证。", "可以暂停判断，但需要明确恢复时间。", 12)
  ]),
  storyNode(13, 3, "安全感的价格", "你们开始讨论以后是否需要更频繁共享行程。", "我愿意让你安心，可我不想每天证明自己没有做错事。", "共享信息可以降低误差，但不能无限扩大成持续审查。", "你会怎样定义安全感与隐私的边界？", [
    storyChoice("a", "只约定影响共同安排的行程需要提前告知。", "boundary", ["必要告知", "保留隐私"], "这样我会轻松很多。重要的事不瞒你，普通生活也还能属于自己。", "边界清晰，信息成本合理。", 13),
    storyChoice("b", "提出双方自愿共享实时位置，任何人都可随时关闭。", "collaborate", ["双向透明", "允许退出"], "我愿意试，但我希望关闭时不需要接受审问。", "可试行，但关闭权必须真实有效。", 13),
    storyChoice("c", "认为真正坦荡的人不该介意共享所有信息。", "confront", ["全面透明", "道德推断"], "隐私不是心虚。你越这样说，我越觉得自己正在被管理。", "把隐私等同隐瞒是错误前提，我不能接受。", 13),
    storyChoice("d", "拒绝任何行程共享，关系只能依靠完全信任。", "withdraw", ["拒绝机制", "强调信任"], "你把信任说得很漂亮，可这也让我的需要完全没有落点。", "完全不共享信息并不能自动产生信任。", 13)
  ]),
  storyNode(14, 3, "被遗忘的纪念日", "一周后，对方忘记了你们约好的纪念日晚餐。", "我真的忘了。可我现在最怕的，是你会把它当成之前所有问题的证据。", "这是我的失误。我会承担，但不接受它被扩展成对整段关系的结论。", "旧伤和新失误叠在一起，你会怎么回应？", [
    storyChoice("a", "只谈这次失约造成的影响，不把过去全部搬回来。", "repair", ["聚焦当下", "避免累加"], "谢谢你没有说‘你果然一直都不在乎’。我会把这次补回来。", "聚焦单一事件有利于形成有效修复。", 14),
    storyChoice("b", "说这证明对方从来没有真正重视过关系。", "confront", ["总体定性", "表达失望"], "一次忘记就把过去全部清零，我不知道还能怎么证明。", "这个结论超过现有证据范围。", 14),
    storyChoice("c", "压下失望，说纪念日本来就不重要。", "withdraw", ["否认需要", "避免冲突"], "可我知道它对你重要。你越说没关系，我越不敢靠近。", "否认已知偏好会让信息变得不可信。", 14),
    storyChoice("d", "表达失望，同时请对方自己提出补救方式。", "repair", ["真实表达", "邀请修复"], "我想重新安排一晚，而且这次由我把所有细节准备好。", "我会提出补救方案，并承担执行。", 14)
  ]),
  storyNode(15, 3, "第一次提到分手", "争执结束前，对方第一次说出“也许分开会轻松一点”。", "我不是在威胁你。我是真的不知道，我们这样继续还有没有意义。", "如果无法建立稳定改变，继续可能只是在延迟同一个结果。", "分手被认真提出时，你会先做什么？", [
    storyChoice("a", "问分开此刻想保护什么，不急着挽留。", "listen", ["理解去意", "降低拉扯"], "我想保护的是那个越来越不像自己的我。", "我想停止重复消耗，并恢复可预测的生活。", 15),
    storyChoice("b", "立即提出三项改变，证明关系还有方案。", "solve", ["方案挽回", "快速行动"], "我知道你能列方案，可我现在还没决定自己想不想留下。", "方案有价值，但需要先确认双方是否仍愿意投入。", 15),
    storyChoice("c", "说既然对方想走，那就现在结束。", "confront", ["抢先结束", "保护自尊"], "你总是在被抛下之前先把门关上。也许这次真的关上了。", "如果这是正式决定，我会停止继续协商。", 15),
    storyChoice("d", "坦白自己很害怕，也不想用恐惧逼对方留下。", "vulnerable", ["承认害怕", "不强迫挽留"], "我听见了。至少这一刻，我们不是在互相装得不在乎。", "我理解你的恐惧，也认可不把它转化为压力。", 15)
  ]),
  storyNode(16, 4, "关系边缘", "第二天，对方提出见最后一面。地点是你们第一次约会的咖啡馆。", "我还没有完全决定。我只是想看看，我们能不能不再重复原来的说法。", "这是最后一次评估。我希望讨论能产生真实结论。", "来到关系边缘，你会怎样开始这次见面？", [
    storyChoice("a", "先说自己这段时间真正理解到的一个变化。", "repair", ["总结理解", "重新看见"], "你说的不是承诺，而是你终于看见了我为什么会逃。", "这说明你识别到了问题机制，而不只是表面事件。", 16),
    storyChoice("b", "带来一份一个月试行计划，请对方逐项修改。", "collaborate", ["试行计划", "共同修改"], "我愿意看，但它不能变成我留下来的考试。", "试行方案可以讨论，前提是双方自愿。", 16),
    storyChoice("c", "要求对方先明确是否还爱你，否则谈什么都没用。", "confront", ["索要确认", "情感压力"], "我还有感情，可爱不是让我忽略所有问题的答案。", "情感存在与关系可持续性需要分别判断。", 16),
    storyChoice("d", "把决定权完全交给对方，表示你尊重任何结果。", "withdraw", ["交出决定", "避免施压"], "尊重不等于你什么都不说。我也想知道你真正想要什么。", "单方决定会掩盖你的真实立场，也不够公平。", 16)
  ], [
    { id: "breaking", condition: { min: { conflictLevel: 68 } }, story: "第二天，对方把你的东西装进一个纸袋，约在咖啡馆见面。这个动作让“最后一面”显得格外具体。", targetLines: { ENFP: "我把你的东西带来了。我怕如果不这样做，我们又会假装还有很多时间。", INTJ: "我带来了需要归还的物品。今天应该做出明确决定。" } },
    { id: "separating", condition: { max: { emotionalConnection: 38 } }, story: "第二天，你们平静地坐在第一次约会的咖啡馆。没有争吵，却也没有熟悉的靠近。", targetLines: { ENFP: "我不恨你，我只是好像已经找不到回去的感觉了。", INTJ: "情绪已经冷却，但核心问题仍然存在。我们需要诚实评估。" } },
    { id: "repairing", condition: { min: { understanding: 64, trust: 56 }, max: { conflictLevel: 48 } }, story: "第二天，对方约在第一次约会的咖啡馆。桌上仍放着你熟悉的那杯饮料，像是关系里还留着一点位置。", targetLines: { ENFP: "我没有完全放弃。我想知道，这次我们能不能真的换一种方式。", INTJ: "目前已经出现有效变化。我愿意讨论一次有限期试行。" } }
  ]),
  storyNode(17, 4, "改变是否真实", "对方听完后问：这些改变会持续，还是只发生在挽回期？", "我害怕你现在什么都愿意，等我留下来，一切又慢慢变回去。", "短期承诺没有统计意义。我需要知道如何验证改变会持续。", "你会怎样回应对行动诚意的怀疑？", [
    storyChoice("a", "承认无法保证永不反复，但可以约定复盘和提醒方式。", "collaborate", ["承认反复", "建立复盘"], "我能接受不完美。我怕的是每次提醒，都又变成我在找事。", "可接受。机制比绝对承诺更可靠。", 17),
    storyChoice("b", "承诺自己一定会彻底改变，不再犯同样问题。", "explain", ["绝对承诺", "表达决心"], "这听起来很动人，可也让我害怕，因为你做不到时我们会更失望。", "绝对承诺不可验证，也不现实。", 17),
    storyChoice("c", "请对方也说出需要改变的一项，不接受单向证明。", "boundary", ["双向责任", "拒绝单向"], "我愿意改。但我希望你先别把这句话用来跳过你自己的部分。", "关系改变必须双向，但责任需要分别确认。", 17),
    storyChoice("d", "提出先分开一个月，只观察彼此是否仍愿意主动靠近。", "pause", ["暂时分开", "观察行动"], "也许距离会让我们诚实一点。但我需要知道这一个月不是什么。", "可以作为观察期，但必须定义边界和结束点。", 17)
  ]),
  storyNode(18, 4, "暂停还是继续", "你们讨论是否需要一段暂时分开的时间。", "如果暂停，我不想它变成谁先联系谁就输了的测试。", "暂停必须有规则，否则只是延长不确定性。", "你会怎样定义这段关系暂停？", [
    storyChoice("a", "约定期限、联系频率和是否可以接触新的人。", "boundary", ["暂停边界", "减少猜测"], "说清楚会有点冷，可至少我不用每天猜自己还算不算你的恋人。", "这些变量必须明确，否则无法评估暂停结果。", 18),
    storyChoice("b", "不设规则，让双方完全按感觉决定是否回来。", "withdraw", ["完全自由", "不设规则"], "那听起来不像暂停，更像是不敢说出口的结束。", "没有规则就没有共同状态，实质接近结束。", 18),
    storyChoice("c", "拒绝暂停，认为问题必须在关系中解决。", "solve", ["坚持共同面对", "拒绝逃避"], "我明白，可如果我们现在都喘不过气，继续靠近也可能只是继续伤害。", "在关系中修复更直接，但当前负荷可能超过处理能力。", 18),
    storyChoice("d", "先暂停两周，只保留紧急联系，结束时必须见面决定。", "pause", ["限期冷静", "明确重启"], "两周很难，但至少它不是无期限的消失。", "期限和决策点明确，可以执行。", 18)
  ]),
  storyNode(19, 4, "最后的问题", "离开咖啡馆前，对方问了一个没有标准答案的问题。", "如果我们继续，你想要的是我，还是你想象中终于不会离开的伴侣？", "如果继续，你选择的是这段真实关系，还是避免一次失败？", "你会怎样回答这个关于关系动机的问题？", [
    storyChoice("a", "说出你欣赏对方的具体部分，也承认彼此确实不完全相容。", "vulnerable", ["具体看见", "承认差异"], "这次我觉得你说的是我，不是一个‘应该留下的人’。", "这个回答同时包含真实价值和现实约束。", 19),
    storyChoice("b", "说只要相爱，所有不合适最终都能克服。", "explain", ["相信爱情", "弱化差异"], "我也想相信，可这句话会不会又把所有代价交给未来的我们？", "感情不是充分条件，方法和资源仍然必要。", 19),
    storyChoice("c", "坦白自己更害怕失败和被离开，还没完全分清。", "vulnerable", ["承认混乱", "面对依恋"], "谢谢你没有给一个漂亮答案。至少这是真的。", "不确定但诚实，比虚假确定更适合当前判断。", 19),
    storyChoice("d", "认为这个问题没有意义，应该看行动而不是动机。", "solve", ["行动优先", "跳过动机"], "行动重要，可如果不知道为什么留下，我们还是会回到同一个地方。", "动机无法单独决定结果，但会影响行动能否持续。", 19)
  ]),
  storyNode(20, 4, "最终选择", "夜已经深了。你们站在咖啡馆门口，需要为这段关系做出一个诚实决定。", "我不想再用‘再看看’拖住彼此。今天，我们选一种真正能承担的方式。", "信息已经足够。现在需要选择，并接受对应后果。", "最后，你会选择怎样结束这次谈话？", [
    storyChoice("a", "共同开始一个月修复期，每周复盘一次具体行动和感受。", "collaborate", ["共同修复", "限期复盘"], "我愿意留下来试，但这一次我们都不假装改变会自动发生。", "可以。目标、责任和复盘点都需要记录。", 20),
    storyChoice("b", "暂时维持关系，减少承诺，让情绪先恢复稳定。", "pause", ["降低强度", "暂时稳定"], "我可以慢下来，但不想无限停在一个没有名字的中间地带。", "可作为过渡，但必须设定重新决策日期。", 20),
    storyChoice("c", "承认彼此需要不同，选择和平结束关系。", "boundary", ["和平分开", "尊重差异"], "我很难过，可这次我感觉我们不是在互相惩罚，而是在诚实告别。", "这是有代价但一致的决定。我会尊重它。", 20),
    storyChoice("d", "要求对方立刻承诺留下，否则就彻底断联。", "confront", ["最后通牒", "控制结果"], "如果留下的条件是失去选择，那我只能走。", "最后通牒不能建立有效承诺，我拒绝这个条件。", 20)
  ], [
    { id: "close", condition: { min: { trust: 68, understanding: 70, emotionalConnection: 66 }, max: { conflictLevel: 38 } }, story: "走到门口时，你们都没有急着离开。二十次选择没有消除差异，却让彼此第一次真正看见了冲突背后的需要。", targetLines: { ENFP: "我还是想要自由，但我也想和你一起学会，不把自由变成离开。", INTJ: "问题仍在，但我们已经证明可以改变处理机制。我愿意继续。" } },
    { id: "calm-separation", condition: { min: { understanding: 62 }, max: { emotionalConnection: 42, conflictLevel: 55 } }, story: "走到门口时，你们都明白，理解彼此并不必然意味着继续相爱。", targetLines: { ENFP: "原来好好说再见，也可以不是谁输掉了。", INTJ: "结束不代表这段关系没有价值，只代表当前方案不可持续。" } },
    { id: "rupture", condition: { min: { conflictLevel: 72 } }, story: "最后一次谈话仍被指责和防御占满。咖啡馆关灯时，双方都已经没有余力继续。", targetLines: { ENFP: "我不想再证明自己值得被爱了。就到这里吧。", INTJ: "继续只会扩大损耗。我将终止这段关系。" } }
  ])
];

const loveChapterTitles = [
  "事件发生",
  "矛盾出现",
  "第一次沟通",
  "误解升级",
  "核心冲突",
  "关系危机",
  "最终选择"
] as const;

export const loveCrisisScenario: ScenarioDefinition = {
  id: "enfp-love-freedom",
  title: "恋人争吵与分手危机",
  targetMbti: "ENFP",
  targetMbtis: ["ENFP"],
  sceneType: "love",
  difficulty: 4,
  difficultyLabel: "20 节点关系危机",
  relationship: "恋爱关系",
  theme: "情绪连接、自由与长期承诺",
  initialConflict: "回复变少、计划冲突和未被修复的失约，让这段关系从日常摩擦逐步走到去留边缘。",
  initialRelationshipState: {
    trust: 48,
    emotionalConnection: 46,
    communication: 44,
    conflictLevel: 34,
    understanding: 40
  },
  summary: "经历七章、二十个关键节点。你的选择会改变中后段剧情，并通向五种不同关系结局。",
  stages: nodes.map((stage) => {
    const chapter = Math.min(7, Math.ceil(stage.round / 3));
    return {
      ...stage,
      chapter,
      chapterTitle: loveChapterTitles[chapter - 1]
    };
  }),
  endings: [
    {
      id: "conflict-escalation",
      title: "冲突升级，关系中断",
      summary: "高压回应和持续防御让双方失去继续对话的空间。关系在没有充分修复的情况下中断。",
      tone: "critical",
      condition: { min: { conflictLevel: 72 } }
    },
    {
      id: "deep-repair",
      title: "深入理解并开始修复",
      summary: "你们没有假装差异消失，而是建立了更诚实的理解、边界和可验证的修复方式。",
      tone: "connected",
      condition: {
        min: { trust: 68, emotionalConnection: 66, communication: 64, understanding: 70 },
        max: { conflictLevel: 38 }
      }
    },
    {
      id: "peaceful-separation",
      title: "理解彼此后和平分开",
      summary: "双方能够理解关系为何走到这里，也承认核心需要不再适合继续用伴侣关系承载。",
      tone: "stable",
      condition: {
        min: { understanding: 62 },
        max: { emotionalConnection: 42, conflictLevel: 55 }
      }
    },
    {
      id: "mutual-growth",
      title: "双方成长后重新理解",
      summary: "关系尚未完全恢复，但你们已经离开旧有争执脚本，开始用新的方式理解彼此。",
      tone: "connected",
      condition: {
        min: { communication: 58, understanding: 62 },
        max: { conflictLevel: 58 }
      }
    },
    {
      id: "temporary-stability",
      title: "暂时稳定，问题仍在",
      summary: "本轮互动避免了立即决裂，但部分需要和边界仍未形成共同方案，需要后续行动验证。",
      tone: "strained",
      condition: {}
    }
  ],
  evaluationRules: [
    { dimension: "emotionalAcceptance", description: "是否在解决问题前回应对方真实感受。" },
    { dimension: "clarity", description: "是否把担忧、事实和请求说得具体可回应。" },
    { dimension: "collaboration", description: "是否把关系问题转化为双方可执行的共同方案。" },
    { dimension: "boundaryAwareness", description: "是否同时尊重自主空间与关系承诺。" },
    { dimension: "conflictRepair", description: "是否承认影响并持续完成修复动作。" },
    { dimension: "adaptability", description: "是否根据情绪强度和关系阶段调整沟通策略。" }
  ]
};
