import type { MbtiType } from "@/types/avatar";
import type {
  CommunicationDimension,
  LabScenarioId,
  ScenarioDefinition,
  ScenarioEndingDefinition,
  ScenarioOption,
  ScenarioStage
} from "@/types/lab";

type ChoiceStyle = "listen" | "clarify" | "boundary" | "repair";

export type NodeSeed = {
  beat: string;
  story: string;
  line: string;
  prompt: string;
  subject: string;
  resolution: string;
};

export type ChapterScenarioSeed = {
  id: LabScenarioId;
  prefix: string;
  title: string;
  targetMbti: MbtiType;
  sceneType: ScenarioDefinition["sceneType"];
  relationship: string;
  theme: string;
  initialConflict: string;
  summary: string;
  initialRelationshipState: ScenarioDefinition["initialRelationshipState"];
  difficulty?: ScenarioDefinition["difficulty"];
  difficultyLabel?: string;
  journeyStructure?: boolean;
  nodes: readonly NodeSeed[];
  endings: readonly ScenarioEndingDefinition[];
};

const chapterTitles = [
  "事件发生",
  "矛盾出现",
  "第一次沟通",
  "误解升级",
  "核心冲突",
  "关系危机",
  "最终选择"
] as const;

const journeyChapterTitles = [
  "初识与建立关系",
  "日常相处",
  "轻微摩擦",
  "价值冲突",
  "最终走向"
] as const;

const styleOrder: readonly ChoiceStyle[] = ["listen", "clarify", "boundary", "repair"];

const styleMeta: Record<ChoiceStyle, Omit<ScenarioOption, "id" | "label" | "nextStage" | "reaction" | "reactions">> = {
  listen: {
    intentTags: ["倾听感受", "延后判断"],
    scoreDelta: { emotionalAcceptance: 4, clarity: -1, conflictRepair: 1, collaboration: 0, adaptability: 1 },
    relationshipDelta: { trust: 1, emotionalConnection: 3, communication: -1, conflictLevel: -2, understanding: 2 },
    advantage: "让未说完的感受有机会出现，能够降低当下防御。",
    tradeoff: "事实与行动暂时没有推进，长期只倾听也可能让问题悬置。"
  },
  clarify: {
    intentTags: ["澄清事实", "减少猜测"],
    scoreDelta: { emotionalAcceptance: -1, clarity: 4, boundaryAwareness: 1, collaboration: 1, adaptability: 0 },
    relationshipDelta: { trust: 1, emotionalConnection: -2, communication: 3, conflictLevel: 1, understanding: 2 },
    advantage: "把事实、推测和责任分开，能快速减少信息误差。",
    tradeoff: "如果对方仍在情绪高点，直接澄清可能被听成辩解或审问。"
  },
  boundary: {
    intentTags: ["说明边界", "保护自主"],
    scoreDelta: { emotionalAcceptance: -1, clarity: 2, boundaryAwareness: 4, conflictRepair: -1, adaptability: -1 },
    relationshipDelta: { trust: -1, emotionalConnection: -2, communication: 1, conflictLevel: 2, understanding: 0 },
    advantage: "避免用过度承诺换取短期和平，也让责任范围更清楚。",
    tradeoff: "边界出现时会产生距离感，若缺少解释可能被理解为拒绝靠近。"
  },
  repair: {
    intentTags: ["承担影响", "共同修复"],
    scoreDelta: { emotionalAcceptance: 1, clarity: 1, conflictRepair: 3, collaboration: 4, adaptability: 3 },
    relationshipDelta: { trust: 2, emotionalConnection: 1, communication: 2, conflictLevel: -1, understanding: -1 },
    advantage: "把谈话转成可验证的共同动作，关系能获得现实支点。",
    tradeoff: "过早进入方案可能跳过更深的情绪或价值分歧。"
  }
};

const labelTemplates: Record<ChoiceStyle, readonly ((node: NodeSeed) => string)[]> = {
  listen: [
    (node) => `先问清“${node.subject}”背后最难受的部分。`,
    (node) => `暂不解释，请对方把关于“${node.subject}”的话说完。`,
    (node) => `复述你听见的“${node.subject}”，确认自己有没有理解错。`
  ],
  clarify: [
    (node) => `把“${node.subject}”中的事实、猜测和责任分别说清。`,
    (node) => `直接核对“${node.subject}”究竟从哪个环节开始失真。`,
    (node) => `说明你对“${node.subject}”的原意，并请对方指出具体差异。`
  ],
  boundary: [
    (node) => `坦白你在“${node.subject}”上可以承担什么、不能承担什么。`,
    (node) => `先暂停拉扯，为“${node.subject}”设一个双方都要遵守的边界。`,
    (node) => `拒绝用单方妥协解决“${node.subject}”，要求责任对等。`
  ],
  repair: [
    (node) => `承认“${node.subject}”造成的影响，并提议${node.resolution}。`,
    (node) => `不再争论原意，先用“${node.resolution}”验证改变。`,
    (node) => `邀请对方共同修改“${node.resolution}”，再约定复盘时间。`
  ]
};

function personaReaction(mbti: MbtiType, style: ChoiceStyle, node: NodeSeed) {
  const reactions: Record<MbtiType, Record<ChoiceStyle, string>> = {
    INTJ: {
      listen: `“好，你愿意先听，我会把关于${node.subject}的真实判断说完整。”`,
      clarify: `“这样更有效。关于${node.subject}，我们先只处理能够确认的部分。”`,
      boundary: `“边界可以谈，但必须对双方一致。${node.resolution}也需要明确条件。”`,
      repair: `“方案可以试。${node.resolution}必须有时间点，否则仍然只是意愿。”`
    },
    INFJ: {
      listen: `“谢谢你没有马上解释。关于${node.subject}，我其实忍了很久才说出来。”`,
      clarify: `“事实说清楚有帮助，可我希望你也别把${node.subject}里的感受留在外面。”`,
      boundary: `“我尊重边界，只是想确认它不是另一种消失。我们可以慢一点说。”`,
      repair: `“${node.resolution}让我看到一点认真，但我需要先确定我们理解的是同一个问题。”`
    },
    ENTJ: {
      listen: `“我可以把话说完，但听完之后我们需要决定${node.subject}怎么处理。”`,
      clarify: `“对，先把${node.subject}的事实和责任对齐，别再让模糊消耗时间。”`,
      boundary: `“边界合理，前提是权限、资源和责任一起调整。”`,
      repair: `“${node.resolution}是可执行的。确认负责人和截止点，我们就往前走。”`
    },
    ENTP: {
      listen: `“你真的想听，而不是等着反驳？那我愿意把${node.subject}背后的想法说完。”`,
      clarify: `“这个拆法有意思。关于${node.subject}，至少先别把不同意见等同于否定彼此。”`,
      boundary: `“可以有边界，但别让边界变成禁止讨论。我们还可以换个角度。”`,
      repair: `“${node.resolution}值得试，不过要给双方保留推翻旧方案的空间。”`
    },
    ENFP: { listen: "“你愿意听，我就还愿意继续说。”", clarify: "“可以说清楚，但先别把我的感受变成一项待办。”", boundary: "“我需要空间，也需要知道你不会突然离开。”", repair: "“我愿意一起试，只要它不是新的控制方式。”" },
    INTP: { listen: "“我需要一点时间把它说准确。”", clarify: "“先把假设分开，这样比较公平。”", boundary: "“这个范围我可以接受。”", repair: "“可以把它当成一次小实验。”" },
    INFP: { listen: "“谢谢你没有否定我在意的东西。”", clarify: "“我愿意说事实，也希望意义没有被略过。”", boundary: "“边界说清楚反而让我安心一点。”", repair: "“我想试试，但别催我马上变好。”" },
    ENFJ: { listen: "“被认真听见以后，我更愿意面对问题。”", clarify: "“我们把彼此的需要都放进来吧。”", boundary: "“边界应该保护双方，不是惩罚谁。”", repair: "“好，我们一起把这个动作做下去。”" },
    ISTJ: { listen: "“我会把发生过的事按顺序说清。”", clarify: "“先核对事实和约定。”", boundary: "“规则明确，我就能接受。”", repair: "“需要具体步骤和检查点。”" },
    ISFJ: { listen: "“你记得这些细节，我已经没那么委屈了。”", clarify: "“我会说清楚，只是不想被责怪。”", boundary: "“我也需要一个不会一直勉强自己的范围。”", repair: "“这个改变如果能持续，我愿意再试。”" },
    ESTJ: { listen: "“我会听，但之后要把事情落实。”", clarify: "“把责任和时间点列清楚。”", boundary: "“权责对等，这个边界合理。”", repair: "“可以，从下一步开始验证。”" },
    ESFJ: { listen: "“你愿意听，我就不必一直猜关系还在不在。”", clarify: "“说清楚之后，也请给我一点回应。”", boundary: "“我能尊重，只是不想被冷处理。”", repair: "“一起做会比口头保证让我安心。”" },
    ISTP: { listen: "“让我先把关键部分说完。”", clarify: "“先处理眼前能确认的问题。”", boundary: "“给我一点空间，我会回来。”", repair: "“先试一个最小动作，看结果。”" },
    ISFP: { listen: "“这样说话让我舒服一点。”", clarify: "“我会告诉你事实，但别逼我立刻定论。”", boundary: "“有空间，我才更愿意靠近。”", repair: "“可以慢慢试，不要变成任务。”" },
    ESTP: { listen: "“行，你先听我把现场说完。”", clarify: "“直接说重点，这样最好。”", boundary: "“规则别太多，底线清楚就行。”", repair: "“可以，先做起来再看反馈。”" },
    ESFP: { listen: "“你有在听，我的情绪就没那么堵了。”", clarify: "“可以说事实，但别忽略我们现在的感受。”", boundary: "“我能接受，只要不是冷冰冰地推开。”", repair: "“一起做点真实的改变吧。”" }
  };
  return reactions[mbti][style];
}

function createOptions(seed: ChapterScenarioSeed, node: NodeSeed, round: number): ScenarioOption[] {
  const rotatedStyles = styleOrder.map((_, index) => styleOrder[(index + round - 1) % styleOrder.length]);
  return rotatedStyles.map((style, index) => ({
    id: String.fromCharCode(97 + index),
    label: labelTemplates[style][(round + index) % labelTemplates[style].length](node),
    ...styleMeta[style],
    nextStage: round < seed.nodes.length ? `${seed.prefix}-${round + 1}` : null,
    reaction: personaReaction(seed.targetMbti, style, node),
    reactions: { [seed.targetMbti]: personaReaction(seed.targetMbti, style, node) }
  }));
}

function createStageVariants(node: NodeSeed, round: number) {
  if (![6, 10, 13, 16, 19, 20].includes(round)) return undefined;
  return [
    {
      id: "trust-fracture",
      condition: { max: { trust: 38 } },
      story: `${node.story} 前面几次沟通没有建立起足够信任，这一刻首先出现的是防备。`,
      targetLine: `${node.line} 但我现在很难再默认你会理解。`
    },
    {
      id: "repair-route",
      condition: { min: { trust: 57, emotionalConnection: 55, understanding: 56 }, max: { conflictLevel: 44 } },
      story: `${node.story} 此前逐渐形成的坦诚让这次事件没有立刻变成新的指责。`,
      targetLine: `${node.line} 至少这一次，我相信我们可以把话说完。`
    },
    {
      id: "conflict-route",
      condition: { min: { conflictLevel: 58 } },
      story: `${node.story} 尚未消散的冲突让双方都带着旧账进入了这一幕。`,
      targetLine: `${node.line} 我不想再重复上一轮的拉扯。`
    }
  ];
}

export function buildScenario(seed: ChapterScenarioSeed): ScenarioDefinition {
  const stages: ScenarioStage[] = seed.nodes.map((node, index) => {
    const round = index + 1;
    const chapter = seed.journeyStructure
      ? Math.min(5, Math.ceil(round / 5))
      : Math.min(7, Math.ceil(round / 3));
    return {
      id: `${seed.prefix}-${round}`,
      round,
      chapter,
      chapterTitle: seed.journeyStructure
        ? journeyChapterTitles[chapter - 1]
        : chapterTitles[chapter - 1],
      beat: node.beat,
      story: node.story,
      targetLine: node.line,
      prompt: node.prompt,
      variants: createStageVariants(node, round),
      options: createOptions(seed, node, round)
    };
  });

  return {
    id: seed.id,
    title: seed.title,
    targetMbti: seed.targetMbti,
    targetMbtis: [seed.targetMbti],
    sceneType: seed.sceneType,
    difficulty: seed.difficulty ?? 4,
    difficultyLabel: seed.difficultyLabel ?? "章节式关系挑战",
    relationship: seed.relationship,
    theme: seed.theme,
    initialConflict: seed.initialConflict,
    initialRelationshipState: seed.initialRelationshipState,
    summary: seed.summary,
    stages,
    endings: seed.endings,
    evaluationRules: [
      { dimension: "emotionalAcceptance", description: "是否在推进问题前给对方感受留下位置。" },
      { dimension: "clarity", description: "是否区分事实、推测、立场和具体请求。" },
      { dimension: "boundaryAwareness", description: "是否在维持关系时仍保留对等边界。" },
      { dimension: "conflictRepair", description: "是否承认互动影响并完成可验证的修复。" },
      { dimension: "collaboration", description: "是否邀请双方共同承担下一步。" },
      { dimension: "adaptability", description: "是否根据关系状态调整回应方式，而不是重复单一策略。" }
    ]
  };
}

export const commonEndings = (labels: {
  rupture: string; repair: string; clearButDistant: string; pause: string; open: string;
}): readonly ScenarioEndingDefinition[] => [
  { id: "rupture", title: labels.rupture, summary: "冲突与防御持续累积，双方暂时失去了继续交换真实信息的空间。", tone: "critical", condition: { min: { conflictLevel: 68 } } },
  { id: "deep-repair", title: labels.repair, summary: "差异没有消失，但双方建立了更可信的表达、边界与后续行动。", tone: "connected", condition: { min: { trust: 62, emotionalConnection: 58, communication: 58, understanding: 62 }, max: { conflictLevel: 42 } } },
  { id: "clear-but-distant", title: labels.clearButDistant, summary: "问题得到澄清，但情绪连接仍较薄，需要时间验证这次理解能否持续。", tone: "stable", condition: { min: { communication: 62, understanding: 55 }, max: { emotionalConnection: 48, conflictLevel: 56 } } },
  { id: "pause", title: labels.pause, summary: "双方避免了立即决裂，也承认当前信任不足以支撑强行推进。", tone: "strained", condition: { max: { trust: 42 } } },
  { id: "open", title: labels.open, summary: "本轮保留了继续沟通的入口，部分核心问题仍需要在现实行动中继续验证。", tone: "stable", condition: {} }
];

const intjEmotionalNeeds = buildScenario({
  id: "intj-emotional-needs",
  prefix: "intj-emotion",
  title: "理性规划与情绪需求",
  targetMbti: "INTJ",
  sceneType: "love",
  relationship: "亲密伴侣",
  theme: "长期规划、情绪回应与爱的可感知性",
  initialConflict: "你们看似稳定地执行着共同计划，伴侣却突然说：这段关系越来越像一份运行良好的项目。",
  summary: "从一次被忽略的情绪信号走到关系去留，经历二十个连续节点，练习让可靠规划与真实感受同时存在。",
  initialRelationshipState: { trust: 52, emotionalConnection: 42, communication: 46, conflictLevel: 32, understanding: 41 },
  endings: commonEndings({
    rupture: "方案还在，关系已经离场",
    repair: "规划有了温度，亲密重新可见",
    clearButDistant: "问题说清，心仍有距离",
    pause: "暂停共同计划，重新确认关系",
    open: "保留关系，进入情绪练习期"
  }),
  nodes: [
    { beat: "被跳过的叹气", story: "晚餐时伴侣几次欲言又止，你仍按原计划讨论下个月的安排。", line: "你把每件事都安排得很好，可刚才我难过的时候，你好像根本没有看见。", prompt: "第一次情绪信号被点明，你先回应什么？", subject: "被忽略的情绪信号", resolution: "先确认感受，再决定是否讨论安排" },
    { beat: "解决方案太快", story: "你给出三个改进方案，对方却把餐具放下。", line: "我知道这些办法都合理，但我现在不是来参加复盘会的。", prompt: "有效方案为什么没有让对方靠近？", subject: "过早进入解决方案", resolution: "询问此刻需要倾听还是一起想办法" },
    { beat: "爱是否需要证明", story: "对方问你上一次主动表达想念是什么时候，你一时想不起来。", line: "我相信你没有恶意，可总让我靠推理确认你爱我，真的很累。", prompt: "可靠行动与可感知表达出现落差。", subject: "爱需要被对方感知", resolution: "说出一件具体在意和一次主动表达" },
    { beat: "临时取消约会", story: "一个临时工作问题让你取消了期待已久的约会。", line: "你每次都有充分理由，可为什么被调整的总是我们？", prompt: "现实优先级正在被理解为关系排序。", subject: "工作总是优先于共同时间", resolution: "说明取舍并共同确定不可轻易取消的时间" },
    { beat: "解释反而更远", story: "你详细解释项目风险，对方沉默许久。", line: "我听懂了原因，但你还是没有问这对我意味着什么。", prompt: "事实完整，情绪信息仍然缺席。", subject: "解释没有回应实际影响", resolution: "复述失约带来的失望和不安全感" },
    { beat: "沉默的夜晚", story: "争执后，伴侣背对着你躺下，没有再说话。", line: "我不是想惩罚你。我只是不知道再说什么，才能不被你变成一个待解决的问题。", prompt: "沉默可能是撤退，也可能是最后的等待。", subject: "冲突后的情绪撤退", resolution: "允许暂停并约定何时回来继续谈" },
    { beat: "未来图里的空白", story: "对方翻出你做的两年规划，里面有城市、预算和职业，却没有关系体验。", line: "你的未来里有我负责的部分，但我看不到我们想怎样生活。", prompt: "长期规划第一次被质疑没有温度。", subject: "未来规划只包含任务", resolution: "补充共同期待而不只列责任" },
    { beat: "自发性的要求", story: "伴侣希望你偶尔主动制造惊喜，你担心这种要求无法衡量。", line: "我不是要昂贵惊喜。我只是想知道，你会在计划之外想到我。", prompt: "不可量化的需要该怎样被接住？", subject: "计划之外的主动靠近", resolution: "约定保留自发空间而不把惊喜变成考核" },
    { beat: "被管理的感觉", story: "你提醒对方最近没有按共同预算行动，对方突然变得防御。", line: "你可以和我讨论风险，但别像审核下属一样审核我。", prompt: "共同规则与平等关系发生摩擦。", subject: "用管理语气讨论共同规则", resolution: "先确认共同目标，再讨论各自自主额度" },
    { beat: "情绪是否有逻辑", story: "对方承认自己的不安未必完全合理，但仍希望被理解。", line: "我知道感觉不是证据，可它出现的时候，我需要的不是被纠正。", prompt: "不合理的感受是否仍值得回应？", subject: "情绪与事实不完全一致", resolution: "承认感受真实，同时不把猜测当事实" },
    { beat: "生病的那一天", story: "伴侣生病时你安排好了药、外卖和医院，却一直在处理工作。", line: "你把所有事都做对了，可我那天最想要的是你坐在旁边十分钟。", prompt: "照顾行为与陪伴体验再次错位。", subject: "实际照顾缺少情绪陪伴", resolution: "询问对方对照顾的优先需要" },
    { beat: "道歉还是说明", story: "你准备解释自己并非不关心，对方打断了你。", line: "我不怀疑你的动机。我想知道你是否承认，我确实一直在孤单。", prompt: "原意与影响需要被分别承担。", subject: "良好动机造成的孤单", resolution: "先承认影响，再补充原意" },
    { beat: "表达练习失败", story: "你按建议说出一句温柔的话，对方却觉得像在执行话术。", line: "我不需要标准答案。哪怕你说得笨一点，只要那真的是你的话。", prompt: "学习表达为何仍可能显得机械？", subject: "为了修复而练习表达", resolution: "用具体经历代替抽象承诺" },
    { beat: "自己的委屈", story: "你也感到疲惫：持续承担现实责任，却好像从未被算作爱。", line: "我愿意听你的委屈，但别在我说难过时才把它拿出来抵消。", prompt: "双方需求都真实，但时机正在冲突。", subject: "现实付出没有被看见", resolution: "为双方各自的委屈安排独立表达时间" },
    { beat: "第一次提到分开", story: "一次争执后，对方说，也许你们需要的关系根本不同。", line: "我不想用分手逼你改变。我只是怕继续下去，我们都会越来越不像自己。", prompt: "关系危机从方式分歧变成去留问题。", subject: "双方需要的亲密方式不同", resolution: "分别说清可学习与不能长期牺牲的部分" },
    { beat: "没有议程的见面", story: "你们约在深夜散步，并同意这次不带清单、不急着下结论。", line: "你可以先不用给答案。我想听你说，这段时间你到底在害怕什么。", prompt: "没有方案保护时，你怎样进入真实表达？", subject: "理性背后没有说出的担心", resolution: "说出失控、失败或失去关系的具体恐惧" },
    { beat: "情绪词的距离", story: "你发现自己能描述事件，却很难准确说出感受。", line: "不知道怎么说也可以。至少别用沉默让我猜自己是不是太多。", prompt: "表达能力不足时，关系还能得到什么信息？", subject: "难以命名自己的情绪", resolution: "说明不知道，并给出愿意继续理解的时间" },
    { beat: "修复机制", story: "双方尝试建立新的冲突流程，却担心亲密被再次程序化。", line: "机制可以保护我们，但它不该代替真正的在场。", prompt: "结构怎样服务关系，而不是接管关系？", subject: "冲突修复流程", resolution: "先连接、再澄清、最后共同决定下一步" },
    { beat: "为什么还想继续", story: "伴侣问你，除了共同生活成本和多年投入，还有什么让你想留下。", line: "请告诉我你珍惜的是我，不只是这段关系已经运行了很久。", prompt: "关系价值不能只用沉没成本回答。", subject: "继续关系的真实动机", resolution: "说出具体欣赏、共同记忆和仍想经历的未来" },
    { beat: "亲密的新版本", story: "谈话接近结束，你们需要决定继续、暂停，还是承认差异无法长期承担。", line: "我不需要你变成另一个人，但我需要知道，靠近我会不会成为你愿意学习的事。", prompt: "你为这段关系选择怎样的下一步？", subject: "理性与情绪能否共同存在", resolution: "开始六周练习期并设一次真实复盘" }
  ]
});

const friendMisunderstanding = buildScenario({
  id: "intj-friend-misunderstanding",
  prefix: "intj-chapter",
  title: "朋友误会修复",
  targetMbti: "INTJ",
  sceneType: "friendship",
  relationship: "重要朋友",
  theme: "事实澄清、情绪回应与信任重建",
  initialConflict: "一段被截取的聊天截图，让多年友情突然进入互相怀疑。",
  summary: "从群聊误会到面对面复盘，经历七章二十个连续节点，决定这段友情如何继续。",
  initialRelationshipState: { trust: 47, emotionalConnection: 44, communication: 42, conflictLevel: 36, understanding: 40 },
  endings: commonEndings({ rupture: "友情中断，各自离场", repair: "事实与情绪都被重新看见", clearButDistant: "误会澄清，距离仍在", pause: "暂时停联，等待信任恢复", open: "保留联系，进入观察期" }),
  nodes: [
    { beat: "被截取的截图", story: "你发现朋友把你在私聊里的一句话转发到了群里，语气像在讽刺 INTJ。", line: "这句话是你说的。上下文是什么，我想直接听你解释。", prompt: "面对截图，你先回应哪一层？", subject: "截图与原始上下文", resolution: "一起还原完整对话" },
    { beat: "迟来的解释", story: "你发出完整记录后，对方看了很久，只回了一句“知道了”。", line: "事实比截图复杂，但你为什么不是第一时间来找我？", prompt: "解释没有结束失望，你怎么继续？", subject: "没有及时直接沟通", resolution: "约定出现疑问时先私下确认" },
    { beat: "群聊里的沉默", story: "共同朋友开始打圆场，INTJ 却退出了群聊。", line: "我不想在一群人面前处理私人信任问题。", prompt: "对方退出公共场域后，你会怎么做？", subject: "公开讨论私人冲突", resolution: "把沟通转回一对一空间" },
    { beat: "第一次通话", story: "深夜通话接通，双方都试图保持冷静。", line: "我需要知道你是在解释事实，还是在证明自己没有责任。", prompt: "第一次直接沟通开始，你选择怎样回答？", subject: "解释与承担的区别", resolution: "分别确认原意和实际影响" },
    { beat: "玩笑的边界", story: "对方提到，你近来常用玩笑评价他的决定。", line: "你觉得那只是玩笑，可我已经不止一次感到自己被当成素材。", prompt: "旧的不舒服浮出水面，你怎么回应？", subject: "以朋友为素材的玩笑", resolution: "确认哪些内容不能公开调侃" },
    { beat: "另一个版本", story: "共同朋友发来语音，称 INTJ 也曾私下批评你。", line: "我说过不同意见，但没有把你的私事拿去取笑。你想先相信哪一个版本？", prompt: "新的信息让冲突转向互相审视。", subject: "共同朋友转述的另一个版本", resolution: "只核对当事人能够确认的内容" },
    { beat: "被忽略的邀约", story: "谈话中你想起，上个月对方连续拒绝了三次见面。", line: "我拒绝是因为项目失控，不是因为不想见你。我以为你知道。", prompt: "事实解释了行为，但情绪仍在。", subject: "连续被拒绝的邀约", resolution: "提前说明忙碌与可联系时间" },
    { beat: "需要怎样的道歉", story: "你们开始讨论是否需要正式道歉。", line: "我不需要漂亮的话。我需要你知道具体哪一步破坏了信任。", prompt: "你怎样让道歉不只停在态度？", subject: "道歉应承担的具体影响", resolution: "说清影响并提出可观察改变" },
    { beat: "隐私被谁拥有", story: "争论转向朋友之间能否转述彼此分享的内容。", line: "信任不是默认授权。我的事不应该因为关系好就自动变成共同话题。", prompt: "你会怎样定义朋友间的信息边界？", subject: "朋友私事的转述权限", resolution: "建立转述前必须征得同意的规则" },
    { beat: "第二次沉默", story: "你发出一段长消息，对方整整一天没有回应。", line: "我在整理，不是在惩罚你。但我承认，没有告知会让你继续猜。", prompt: "沉默再次出现，你如何理解和回应？", subject: "冲突后的回应时限", resolution: "约定需要独处时给出返回时间" },
    { beat: "纪念日缺席", story: "你们原定一起庆祝认识五周年，对方临时取消。", line: "我不想用一次聚餐假装我们已经没事，但我也不想让它变成最后一次。", prompt: "这个象征性时刻该如何处理？", subject: "取消友情纪念安排", resolution: "换成一次只讨论彼此期待的见面" },
    { beat: "信任是否能计算", story: "INTJ 问，你需要什么才会重新相信这段友情。", line: "如果答案只是‘看以后’，我们会一直处在无法验证的状态。", prompt: "你如何把模糊期待变成可回应内容？", subject: "重新建立信任的条件", resolution: "各自提出一项可观察的改变" },
    { beat: "公开澄清", story: "群里仍有人误解那张截图，是否公开解释成为新分歧。", line: "我支持纠正事实，但不想把我们的修复过程也公开展示。", prompt: "事实澄清与隐私保护需要同时发生。", subject: "在群聊中公开澄清", resolution: "只纠正事实，不披露私人谈话" },
    { beat: "又一次失约", story: "约好的见面当天，对方因工作晚到四十分钟。", line: "这是我的失误。你可以生气，但别把它自动归入‘你从不在乎’。", prompt: "新失误碰到旧伤，你怎么处理？", subject: "迟到与旧有失望叠加", resolution: "只处理本次影响并确认补救" },
    { beat: "第一次提到绝交", story: "争执中，你听见对方说“也许我们不再适合做亲近朋友”。", line: "我不是威胁你。我在判断这段关系的维护成本是否还合理。", prompt: "关系去留被摆上桌面。", subject: "是否继续亲近往来", resolution: "分别说清想保留与想停止的部分" },
    { beat: "咖啡馆见面", story: "你们约在第一次长谈的咖啡馆，桌上没有人先拿出手机。", line: "今天我不想重演辩论。我想知道我们是否还能诚实地相处。", prompt: "最后一次完整沟通如何开始？", subject: "友情是否仍能容纳真实分歧", resolution: "各自说出最想被改变的一件事" },
    { beat: "修复如何验证", story: "对方问，改变如何避免只发生在这次危机中。", line: "我更相信机制，而不是危机时的承诺。", prompt: "你如何回应对持续性的怀疑？", subject: "改变是否能够持续", resolution: "设定一个月后的复盘节点" },
    { beat: "共同朋友圈", story: "你们需要决定是否继续参加同一群朋友的活动。", line: "我不想逼任何人站队，也不想假装我们马上恢复原样。", prompt: "社交空间如何不再扩大冲突？", subject: "共同朋友圈中的相处方式", resolution: "暂时降低互动强度并拒绝站队" },
    { beat: "为什么还要继续", story: "离开前，对方问了一个比截图更难回答的问题。", line: "你想修复的是我这个朋友，还是你无法接受一段长期关系失败？", prompt: "你会如何回答关系动机？", subject: "修复友情的真实动机", resolution: "用具体经历说明你珍惜的部分" },
    { beat: "友情的新位置", story: "夜色落下，你们必须决定这段友情接下来处在什么位置。", line: "我们可以重新靠近、降低亲密度，或者停在这里。不要再用含糊拖住彼此。", prompt: "你选择怎样结束这次谈话？", subject: "友情接下来的真实位置", resolution: "选择一个月修复期并定期复盘" }
  ]
});

const longDistanceTrust = buildScenario({
  id: "infj-relationship-boundary",
  prefix: "infj-distance",
  title: "异地关系信任危机",
  targetMbti: "INFJ",
  sceneType: "boundary",
  relationship: "异地恋人",
  theme: "安全感、真实表达与隐私边界",
  initialConflict: "回复频率下降、一次取消见面和一张陌生合照，让异地关系的安全感迅速变薄。",
  summary: "穿过失联、猜测与边界协商的七章剧情，观察你如何在距离中建立可信连接。",
  initialRelationshipState: { trust: 45, emotionalConnection: 48, communication: 40, conflictLevel: 35, understanding: 42 },
  endings: commonEndings({ rupture: "猜测吞没连接，关系中断", repair: "距离仍在，信任开始落地", clearButDistant: "规则清楚，亲密仍待恢复", pause: "进入限期冷静期", open: "继续异地，并保留复盘入口" }),
  nodes: [
    { beat: "错过的视频电话", story: "连续第三晚，约好的视频通话没有接通。", line: "我知道你忙，可每次只剩一句‘晚点说’，我会怀疑自己是不是已经不重要。", prompt: "距离第一次变成不安，你如何回应？", subject: "连续错过视频通话", resolution: "重新约定可兑现的联系窗口" },
    { beat: "时差里的等待", story: "你醒来时看到凌晨三点发来的长消息。", line: "我删了好几次。怕说多了像控制，什么都不说又像我不在乎。", prompt: "对方的隐忍终于出现。", subject: "压下需要后独自等待", resolution: "允许直接表达需要而不先道歉" },
    { beat: "取消的见面", story: "计划两个月的见面因你的工作临时取消。", line: "我理解原因，但理解不等于我不失望。你只说了‘下次补上’。", prompt: "现实限制与情绪损失同时存在。", subject: "临时取消见面", resolution: "共同确定新的日期和补偿安排" },
    { beat: "陌生的合照", story: "社交平台上出现你与一位陌生人的聚会合照。", line: "我不想审问你，可我从照片里认识你的生活，这种感觉很糟。", prompt: "信息差把想象推向最坏方向。", subject: "陌生合照与信息差", resolution: "直接说明关系并补充聚会背景" },
    { beat: "解释为何无效", story: "你解释合照只是同事聚会，对方却没有明显放松。", line: "我不是只在问那个人。我在问，我还知道多少你的真实生活。", prompt: "表面事实背后是更深的距离感。", subject: "对彼此日常生活的陌生", resolution: "固定分享一件当天真实发生的小事" },
    { beat: "定位分享", story: "你提出共享实时位置，希望快速消除猜测。", line: "我想安心，但不想靠查看坐标确认你还爱我。", prompt: "技术透明与亲密边界发生碰撞。", subject: "共享实时位置", resolution: "只在安全或行程变化时主动报平安" },
    { beat: "谁先联系", story: "你们发现最近总在计算谁先发消息。", line: "每次主动都像在证明我更需要这段关系，久了会很累。", prompt: "联系频率开始变成权力感。", subject: "谁应该主动联系", resolution: "停止计数并约定最低回应方式" },
    { beat: "未来没有日期", story: "INFJ 问起结束异地的计划，你只能说“以后会想办法”。", line: "我能忍受距离，但很难忍受没有方向的距离。", prompt: "长期承诺第一次需要具体形状。", subject: "结束异地的时间方向", resolution: "列出决定城市前需要验证的条件" },
    { beat: "家庭里的空白", story: "对方家人还不知道你的存在，这件事一直没有被解释。", line: "我不是要求你现在公开，只是想知道我为什么一直被放在故事外面。", prompt: "公开程度触碰到关系身份。", subject: "是否向家人公开关系", resolution: "说明现实顾虑并约定重新讨论时间" },
    { beat: "四十八小时失联", story: "一次争吵后，对方四十八小时没有任何消息。", line: "我需要退开，可我知道完全消失也会伤害你。", prompt: "边界与冷处理只差一个说明。", subject: "冲突后的长时间失联", resolution: "约定暂停时长和恢复沟通时间" },
    { beat: "共同朋友的提醒", story: "朋友告诉你，INFJ 最近常独自失眠，却没有向你提起。", line: "我不想每次联系都变成负担汇报，所以有些事我选择自己消化。", prompt: "体贴正在变成隔离。", subject: "隐藏压力以免成为负担", resolution: "区分陪伴分享与要求解决" },
    { beat: "临时探访", story: "你想突然飞去见对方，作为一次浪漫补救。", line: "我会感动，但也害怕你用一个大动作跳过我们还没谈完的问题。", prompt: "惊喜与尊重安排如何平衡？", subject: "未经确认的临时探访", resolution: "先询问意愿，再共同安排见面" },
    { beat: "隐私密码", story: "为了证明坦荡，你提出交换手机密码。", line: "我不想用互相检查换安全感。真正让我怕的是，我们不敢直接问。", prompt: "透明是否等于没有隐私？", subject: "交换密码与检查手机", resolution: "保留设备隐私并允许直接提问" },
    { beat: "新的工作机会", story: "对方得到一个更远城市的工作机会，却迟了两周才告诉你。", line: "我怕你失望，也怕你马上要求我为了关系放弃。", prompt: "重大决定暴露了关系里的恐惧。", subject: "延迟告知重要职业机会", resolution: "先共享决定过程而非要求立即取舍" },
    { beat: "第一次说累了", story: "争执结束前，INFJ 轻声说“我真的有点撑不住了”。", line: "我不是不爱你。我只是越来越不知道，靠什么确认我们还在一起。", prompt: "关系危机不再只是一次事件。", subject: "异地关系带来的长期消耗", resolution: "分别列出继续关系需要的最低条件" },
    { beat: "见面后的陌生", story: "终于见面时，你们却在车站短暂地不知道该说什么。", line: "我想念你很久，可真的见到时，我发现我们都变了一些。", prompt: "想念与陌生同时出现。", subject: "重逢后的陌生感", resolution: "先一起度过普通一天而非立刻谈结论" },
    { beat: "同城的代价", story: "讨论同城时，意味着至少一人可能放弃现有机会。", line: "我不想成为你未来后悔时唯一能责怪的人。", prompt: "承诺开始出现现实价格。", subject: "为同城迁移承担的代价", resolution: "比较双方资源、时间与可逆性" },
    { beat: "试行计划", story: "你们提出三个月试行方案，却对联系频率再次分歧。", line: "计划可以帮我们，但我不想亲密被变成完成次数。", prompt: "稳定机制如何不吞掉自然连接？", subject: "三个月试行计划", resolution: "保留固定联系与自由互动两部分" },
    { beat: "留下的理由", story: "返程前，对方问你为什么还想继续。", line: "请别只说因为舍不得。我想知道你愿意和真实的我继续，还是只是不想失去。", prompt: "去留动机需要被诚实回答。", subject: "继续异地的真实动机", resolution: "说出具体欣赏与无法回避的困难" },
    { beat: "距离的新规则", story: "列车到站广播响起，你们需要决定下一阶段。", line: "我可以继续，也可以暂停，但不想再回到没有方向的等待。", prompt: "你会为关系选择怎样的下一步？", subject: "异地关系的下一阶段", resolution: "开始三个月试行并设明确复盘点" }
  ]
});

const workplaceConflict = buildScenario({
  id: "entj-workplace-pressure",
  prefix: "entj-work",
  title: "职场沟通冲突",
  targetMbti: "ENTJ",
  sceneType: "workplace",
  relationship: "直属负责人",
  theme: "结果压力、权责边界与团队信任",
  initialConflict: "关键项目突然提前，公开质疑与资源不足让你和 ENTJ 负责人进入高压对抗。",
  summary: "从目标变更到项目复盘，经历二十个决策节点，平衡执行效率、表达安全与责任承担。",
  initialRelationshipState: { trust: 46, emotionalConnection: 40, communication: 47, conflictLevel: 38, understanding: 42 },
  endings: commonEndings({ rupture: "合作破裂，项目进入强制接管", repair: "权责重建，团队恢复推进", clearButDistant: "项目可执行，合作仍然冰冷", pause: "职责暂停，等待管理调整", open: "保留合作并进入观察周期" }),
  nodes: [
    { beat: "截止期提前", story: "客户突然要求将交付提前两周，ENTJ 在会上直接宣布新日期。", line: "时间不会因为我们不舒服就停下来。先告诉我怎样能交付。", prompt: "高压目标刚刚落下，你先回应什么？", subject: "未经评估的新截止期", resolution: "用依赖清单重新估算可交付范围" },
    { beat: "公开质疑", story: "你指出资源不足，对方当众问“这是不是能力问题”。", line: "我需要区分资源风险和执行借口，你也应该给我证据。", prompt: "公开压力触碰到尊重边界。", subject: "在会议中公开质疑能力", resolution: "会后核对资源证据与表达影响" },
    { beat: "无人回应", story: "会议室一片沉默，其他成员低头看电脑。", line: "没有反对，我会按已经达成一致推进。", prompt: "沉默可能不是同意，你如何打破？", subject: "把团队沉默视为同意", resolution: "逐项匿名收集风险与承诺" },
    { beat: "任务重新分配", story: "负责人把两项关键任务临时交给你，却没有移除原工作。", line: "你最了解核心链路，所以这两项由你接手最有效。", prompt: "信任与过载同时出现。", subject: "增加任务却不调整原职责", resolution: "同步确认优先级和被移除事项" },
    { beat: "第一次延期", story: "一个外部依赖延迟，里程碑没有按时完成。", line: "风险为什么今天才到我这里？提前暴露比解释延期更重要。", prompt: "失败的责任如何被讨论？", subject: "风险上报过晚", resolution: "建立触发升级的明确阈值" },
    { beat: "私下谈话", story: "ENTJ 把你叫进会议室，询问你是否还能承担核心角色。", line: "我可以调整资源，但不能在最后一刻才知道真实负荷。", prompt: "能力、负荷与信任一起被审视。", subject: "是否继续承担核心角色", resolution: "公开真实容量并重新确认职责" },
    { beat: "加班成为默认", story: "连续一周深夜消息让团队把加班当成默认。", line: "危机阶段需要额外投入，但我同意这不能无限持续。", prompt: "短期冲刺如何避免长期透支？", subject: "危机期持续加班", resolution: "设定冲刺结束点和补偿安排" },
    { beat: "跳过流程", story: "为赶进度，对方要求暂时跳过一项质量检查。", line: "我接受可控风险，不接受没有替代方案的流程崇拜。", prompt: "效率与质量底线发生冲突。", subject: "跳过关键质量检查", resolution: "定义可跳过范围与补测时间" },
    { beat: "团队成员崩溃", story: "一位同事在会议后哭了，称自己不敢再报告坏消息。", line: "如果压力让信息消失，那就是管理失效。我需要知道具体发生了什么。", prompt: "情绪不再只是个人问题。", subject: "团队不敢暴露坏消息", resolution: "建立无责风险复盘与公开升级渠道" },
    { beat: "客户再次变更", story: "客户又增加需求，ENTJ 倾向先答应再内部消化。", line: "机会窗口很短，但新增范围必须对应新的取舍。", prompt: "外部承诺如何不转化为内部透支？", subject: "新增需求与范围蔓延", resolution: "要求客户在范围、时间和成本中取舍" },
    { beat: "绩效谈话", story: "季度反馈中，对方肯定结果，却只字未提团队承受的代价。", line: "结果必须被认可。至于过程代价，我愿意听你给出可量化的改进点。", prompt: "你如何让隐性成本被看见？", subject: "绩效只看结果忽略过程", resolution: "增加返工率、负荷与风险暴露指标" },
    { beat: "越级沟通", story: "为争取资源，你考虑直接联系更高层。", line: "越级不是禁区，但如果我最后才知道，会直接破坏协作。", prompt: "争取资源与汇报边界如何平衡？", subject: "是否越级争取资源", resolution: "先同步诉求并共同准备升级材料" },
    { beat: "责任归属", story: "项目出现严重缺陷，客户要求明确负责人。", line: "我会承担管理责任，但执行失误也必须被具体识别。", prompt: "追责如何不变成寻找替罪者？", subject: "重大缺陷的责任归属", resolution: "区分决策责任、执行责任和系统缺口" },
    { beat: "你想退出", story: "长期压力让你提出离开项目。", line: "如果退出是经过评估的决定，我尊重；如果只是逃离今天，我们应该再谈一次。", prompt: "个人边界与团队承诺碰撞。", subject: "退出高压项目", resolution: "确认退出原因、交接范围和替代资源" },
    { beat: "关键演示失败", story: "演示当天系统崩溃，会议现场陷入沉默。", line: "现在先恢复服务。责任和复盘留到系统稳定之后。", prompt: "危机现场需要怎样配合？", subject: "关键演示现场故障", resolution: "先明确现场指挥与恢复优先级" },
    { beat: "危机后的怒气", story: "服务恢复后，ENTJ 的语气明显变得强硬。", line: "我们差一点失去客户。我不会假装这只是一次普通失误。", prompt: "高情绪的领导仍需要真实信息。", subject: "危机后的强硬追责", resolution: "先承认损失，再要求基于证据复盘" },
    { beat: "团队是否还能信任", story: "成员开始私下寻找转岗机会，负责人第一次意识到团队可能散掉。", line: "留住人不是靠降低标准，但标准也不能建立在持续恐惧上。", prompt: "效率与心理安全如何重新对齐？", subject: "团队信任与人员流失", resolution: "重建反馈方式并公开资源限制" },
    { beat: "新的工作机制", story: "你们提出新的项目节奏，却对检查频率意见不同。", line: "我需要高频事实，不需要高频表演。检查点必须能暴露风险。", prompt: "管理机制怎样既透明又不过度控制？", subject: "项目检查频率", resolution: "只在关键依赖点同步事实与决策" },
    { beat: "是否继续合作", story: "项目进入收尾，ENTJ 问你是否愿意继续加入下一阶段。", line: "我认可你的价值，也需要知道我们是否能用新的方式合作。", prompt: "你如何评估下一次合作？", subject: "是否继续下一阶段合作", resolution: "说明继续合作所需的三个前提" },
    { beat: "最终复盘", story: "最后一场复盘会上，所有人等待你们给出结论。", line: "不要包装成功，也不要沉溺失败。今天要留下能改变下一轮的机制。", prompt: "你会如何结束这次高压合作？", subject: "项目复盘与下一轮机制", resolution: "确认负责人、风险阈值和团队负荷指标" }
  ]
});

const valueConflict = buildScenario({
  id: "entp-value-conflict",
  prefix: "entp-value",
  title: "价值观争论",
  targetMbti: "ENTP",
  sceneType: "value",
  relationship: "亲密朋友",
  theme: "观点自由、情绪尊重与关系边界",
  initialConflict: "一次玩笑式反驳触碰到你非常重视的价值，原本有趣的讨论逐渐变成关系冲突。",
  summary: "经历从观点碰撞到公开争论的二十个节点，探索不同立场能否继续共享一段关系。",
  initialRelationshipState: { trust: 49, emotionalConnection: 43, communication: 48, conflictLevel: 34, understanding: 41 },
  endings: commonEndings({ rupture: "讨论变成攻击，关系决裂", repair: "保留分歧，也保住关系", clearButDistant: "观点说清，亲密度下降", pause: "敏感议题暂时封存", open: "继续讨论，并建立新边界" }),
  nodes: [
    { beat: "一句玩笑", story: "聚会中，ENTP 用一句玩笑反驳了你很重视的观点，其他人笑了。", line: "我是在挑战观点，不是在否定你。可我看得出你真的不舒服。", prompt: "公开场合的第一反应会改变后续气氛。", subject: "把重要观点当作玩笑", resolution: "先离开人群再讨论影响" },
    { beat: "意图与影响", story: "对方强调自己没有恶意，你仍觉得被轻视。", line: "如果没有恶意也造成伤害，那我想知道边界到底在哪里。", prompt: "意图无法自动取消影响。", subject: "无恶意但造成冒犯", resolution: "分别确认意图、影响与未来边界" },
    { beat: "是否太敏感", story: "共同朋友说你可能太敏感，ENTP 没有立刻反驳。", line: "我不想替你定义感受，但我也不想所有尖锐问题都因此不能讨论。", prompt: "敏感与讨论自由同时被摆上桌面。", subject: "被评价为太敏感", resolution: "区分议题挑战和人身评价" },
    { beat: "私聊继续", story: "聚会后，对方发来一篇长文章，试图证明自己的观点。", line: "我知道现在发论据可能很烦，可这确实是我理解世界的方式。", prompt: "论据与情绪时机发生冲突。", subject: "情绪未平时继续发送论据", resolution: "先确认是否愿意继续讨论" },
    { beat: "核心价值", story: "你说明这个议题和自己的经历有关，不只是抽象观点。", line: "这改变了上下文。我之前把它当成纯粹命题了。", prompt: "个人经验进入讨论后，规则需要变化。", subject: "抽象议题背后的个人经历", resolution: "允许经验作为事实之外的重要信息" },
    { beat: "公开辩论邀请", story: "ENTP 邀请你参加一个公开讨论，希望把分歧讲透。", line: "公开讨论会迫使我们说得更准确，但我不想拿你当辩论素材。", prompt: "表达机会也可能扩大伤害。", subject: "把私人分歧带到公开讨论", resolution: "共同决定可公开内容与退出权" },
    { beat: "观点被转述", story: "你发现对方在另一个群里转述了你的立场，却省略了关键前提。", line: "那是我的概括，不是故意曲解。你指出哪里失真，我会改。", prompt: "观点所有权与准确性需要被讨论。", subject: "未经确认转述你的立场", resolution: "更正失真内容并注明是个人理解" },
    { beat: "谁更开放", story: "争论中，对方说“真正开放的人不会害怕被挑战”。", line: "这句话可能不公平。开放也不等于必须随时接受任何讨论方式。", prompt: "讨论自由开始变成道德评价。", subject: "用开放程度评价对方", resolution: "停止给人格定性，只讨论具体行为" },
    { beat: "暂停议题", story: "你提议暂时不谈这个主题，ENTP 担心关系变得小心翼翼。", line: "我可以暂停，但不想我们以后只能聊安全答案。", prompt: "暂停如何不变成永久回避？", subject: "暂时封存敏感议题", resolution: "设定重新讨论的条件和时间" },
    { beat: "社交媒体发言", story: "对方发布了一条相似观点，没有提你，但你仍感觉在影射。", line: "那是我一直在想的问题，不是暗中回应你。可我理解时间点会让你这样感觉。", prompt: "公共表达与私人冲突重叠。", subject: "冲突期间发布相似观点", resolution: "直接确认是否相关而不公开对线" },
    { beat: "朋友开始站队", story: "共同朋友逐渐分成两边，聊天群里的语气越来越尖锐。", line: "一旦所有人站队，观点就不再重要，只剩身份防御。", prompt: "关系冲突正在扩散成群体冲突。", subject: "共同朋友被迫站队", resolution: "共同声明不要求任何人选边" },
    { beat: "道歉是否等于认输", story: "你希望对方为公开玩笑道歉，ENTP 担心这被理解为撤回观点。", line: "我可以为表达方式道歉，但不想假装自己的立场改变了。", prompt: "道歉与立场如何被分开？", subject: "为表达方式道歉", resolution: "明确道歉不等于撤回观点" },
    { beat: "不可讨论的底线", story: "你提出有些价值不接受被娱乐化，对方追问范围。", line: "边界越具体，我越能尊重；如果所有不舒服都不能碰，我们会失去真实交流。", prompt: "底线需要足够清楚才能被遵守。", subject: "哪些价值不能被娱乐化", resolution: "列出具体表达方式而非禁谈议题" },
    { beat: "事实核验", story: "双方各自引用的数据出现冲突，讨论重新升温。", line: "我们至少可以同意，事实来源需要一起检查，而不是选对自己有利的。", prompt: "事实准确性不应被人格或立场改变。", subject: "相互冲突的事实来源", resolution: "共同使用同一标准核验来源" },
    { beat: "第一次说不想再聊", story: "你感到精疲力尽，第一次说不想再和对方讨论任何价值话题。", line: "我听见的是你不想再被这样对待，不一定是你不想和我交流。对吗？", prompt: "关系危机藏在议题疲劳里。", subject: "停止所有价值讨论", resolution: "区分停止方式和停止关系" },
    { beat: "线下见面", story: "你们约在安静的书店咖啡区，不带资料也不查手机。", line: "今天我不想赢。我想知道我们为什么会从好奇走到防御。", prompt: "没有论据掩护后，关系本身出现。", subject: "争论如何演变成关系防御", resolution: "各自承认一次把对方当成对手的时刻" },
    { beat: "表达规则", story: "双方尝试制定以后讨论敏感议题的规则。", line: "规则不能保证舒服，但应该保证任何人都能暂停，而且回来后不会被嘲讽。", prompt: "怎样的规则能保护真实讨论？", subject: "敏感议题的讨论规则", resolution: "约定同意、暂停、复述和核验四步" },
    { beat: "仍然不同意", story: "充分沟通后，你们在核心立场上仍没有改变。", line: "我现在更理解你，但理解没有让我赞同。这会让你觉得失败吗？", prompt: "理解与认同需要被分开。", subject: "充分理解后仍然不同意", resolution: "确认差异不会自动取消尊重" },
    { beat: "关系的价值", story: "对方问，如果不能彼此说服，这段关系还提供什么。", line: "我珍惜的是你让我看见盲点，不是你最终变得和我一样。", prompt: "你会怎样回答关系为何值得继续？", subject: "分歧关系仍然存在的价值", resolution: "说出被改变的理解而非被改变的立场" },
    { beat: "最终选择", story: "离开书店前，你们决定是否继续把彼此留在亲密朋友圈。", line: "我们可以继续争论、只保留安全话题，或者降低关系强度。请选择真实能承担的方式。", prompt: "你选择怎样容纳这份差异？", subject: "关系与价值分歧的最终位置", resolution: "继续关系并执行新的讨论规则" }
  ]
});

export const chapterScenarios: readonly ScenarioDefinition[] = [
  intjEmotionalNeeds,
  friendMisunderstanding,
  longDistanceTrust,
  workplaceConflict,
  valueConflict
];
