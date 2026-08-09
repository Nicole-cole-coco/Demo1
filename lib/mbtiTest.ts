import type { MbtiType } from "@/types/avatar";
import type {
  ExplorationAxisResult,
  ExplorationDomain,
  ExplorationTrait,
  ExplorationTraitScores,
  MbtiLetter,
  MbtiPreferenceScores,
  MbtiTestResult,
  PersonalityExplorationReport
} from "@/types/companion";

export type MbtiDimension = "EI" | "SN" | "TF" | "JP";
type ExplorationScoreKey = MbtiLetter | ExplorationTrait;

export type MbtiTestChoice = {
  id: string;
  label: string;
  detail: string;
  scoreWeight: Partial<Record<ExplorationScoreKey, number>>;
};

export type MbtiTestQuestion = {
  id: number;
  domain: ExplorationDomain;
  domainLabel: string;
  dimension: string;
  scenario: string;
  context: string;
  choices: readonly [MbtiTestChoice, MbtiTestChoice];
};

const domainLabels: Record<ExplorationDomain, string> = {
  decision: "决策方式",
  information: "信息处理",
  emotion: "情绪处理",
  social: "社交模式",
  values: "价值取向",
  lifestyle: "生活方式"
};

function choice(
  id: "A" | "B",
  label: string,
  detail: string,
  scoreWeight: MbtiTestChoice["scoreWeight"]
): MbtiTestChoice {
  return { id, label, detail, scoreWeight };
}

function question(
  id: number,
  domain: ExplorationDomain,
  dimension: string,
  scenario: string,
  context: string,
  choices: readonly [MbtiTestChoice, MbtiTestChoice]
): MbtiTestQuestion {
  return { id, domain, domainLabel: domainLabels[domain], dimension, scenario, context, choices };
}

export const mbtiTestQuestions: readonly MbtiTestQuestion[] = [
  question(1, "decision", "分析与行动", "你收到一份很心动的工作邀请，但必须在两天内答复。", "时间有限时，你更自然的第一步是什么？", [
    choice("A", "列出关键变量再判断", "比较成长空间、风险和长期影响，宁愿先把结构看清。", { T: 2, J: 1, analysis: 3, planning: 1 }),
    choice("B", "先抓住机会再调整", "相信真实体验会提供更多信息，行动后再修正方向。", { P: 2, E: 1, action: 3, flexibility: 1 })
  ]),
  question(2, "decision", "确定性与试探", "一个重要项目没有现成做法，团队都在等第一个方案。", "你会怎样让事情开始运转？", [
    choice("A", "先搭出完整判断框架", "确认目标、限制和关键假设后，再给出较成熟的方案。", { I: 1, T: 2, analysis: 3, planning: 1 }),
    choice("B", "先做一个可验证原型", "用小范围尝试换取反馈，让下一步从结果中长出来。", { E: 1, P: 2, action: 3, possibility: 1 })
  ]),
  question(3, "decision", "风险判断", "朋友邀请你一起投入一个有潜力但不确定的副业。", "你最可能如何回应？", [
    choice("A", "先确认最坏情况是否可承受", "把投入、退出条件和机会成本算清，再决定是否加入。", { T: 2, J: 1, analysis: 3, stability: 1 }),
    choice("B", "先参与一小段看看", "保留退出空间，同时通过行动判断这件事是否值得。", { P: 2, S: 1, action: 3, flexibility: 1 })
  ]),
  question(4, "decision", "独立判断与协商", "家人强烈建议你选择一条更稳定、但你并不向往的路径。", "你会先处理哪一部分？", [
    choice("A", "厘清自己的长期理由", "先独立判断什么更符合目标，再带着结论沟通。", { I: 1, T: 2, analysis: 2, freedom: 2 }),
    choice("B", "先听懂彼此真正担心什么", "通过对话找到兼顾现实与期待的可能方案。", { E: 1, F: 2, connection: 2, possibility: 2 })
  ]),
  question(5, "decision", "压力下的节奏", "截止时间突然提前，你手里还有几个未解决的问题。", "压力升高时，你更可能采用哪种策略？", [
    choice("A", "重新排序，逐项收口", "牺牲部分想法也要确保关键结果可靠完成。", { J: 2, T: 1, planning: 3, analysis: 1 }),
    choice("B", "快速推进，边做边修", "先形成可用结果，再利用剩余时间迭代。", { P: 2, S: 1, action: 3, flexibility: 1 })
  ]),
  question(6, "decision", "共识与主张", "团队讨论很久仍没有结论，而你已经有明显倾向。", "你会怎样推动决定？", [
    choice("A", "陈述依据并提出明确选择", "让大家围绕可比较的标准尽快收敛。", { T: 2, E: 1, analysis: 2, action: 2 }),
    choice("B", "再问一轮尚未说出的顾虑", "确认不同立场被看见后，再寻找更容易共同承担的方案。", { F: 2, I: 1, emotionAwareness: 2, connection: 2 })
  ]),
  question(7, "decision", "复盘方式", "你做了一个后来证明不太理想的决定。", "你通常怎样从这次经历中恢复？", [
    choice("A", "还原判断链，找出失误点", "希望下次用更好的信息和规则避免重复。", { T: 2, J: 1, analysis: 3, growth: 1 }),
    choice("B", "接受当时限制，尽快再试", "不让一次结果困住自己，通过新的行动校准方向。", { F: 1, P: 2, action: 2, growth: 2 })
  ]),

  question(8, "information", "事实与可能", "你刚接手一个完全陌生的任务。", "哪类信息最能让你迅速进入状态？", [
    choice("A", "交付标准和真实案例", "先看清具体要求、步骤和过去怎样做成。", { S: 3, facts: 3, stability: 1 }),
    choice("B", "目标意义和发展空间", "先理解为什么做，以及还有哪些未被尝试的方向。", { N: 3, possibility: 3, growth: 1 })
  ]),
  question(9, "information", "学习入口", "你准备学习一项从未接触过的技能。", "第一周你更愿意怎样安排？", [
    choice("A", "跟着示范完成一个作品", "在具体操作和即时反馈中掌握要领。", { S: 3, action: 1, facts: 3 }),
    choice("B", "先理解原理和整体地图", "建立概念框架后，再探索不同用法。", { N: 3, analysis: 1, possibility: 3 })
  ]),
  question(10, "information", "叙事焦点", "朋友向你讲述一段复杂的人际经历。", "你更容易捕捉到什么？", [
    choice("A", "谁在何时做了什么", "具体措辞、行动和前后顺序会成为判断依据。", { S: 3, facts: 3, analysis: 1 }),
    choice("B", "关系为什么会走到这里", "你会注意言外之意、动机和未来可能的变化。", { N: 3, possibility: 3, emotionAwareness: 1 })
  ]),
  question(11, "information", "模糊信息", "会议上有人提出一个听起来很新颖、但细节很少的想法。", "你的第一反应更接近哪一种？", [
    choice("A", "追问证据和执行条件", "需要知道它怎样落地、资源从哪里来。", { S: 2, T: 1, facts: 3, analysis: 1 }),
    choice("B", "顺着想法继续延伸", "先看看它能打开哪些新方向，再讨论限制。", { N: 2, P: 1, possibility: 3, flexibility: 1 })
  ]),
  question(12, "information", "环境观察", "你第一次走进一家很有特色的店。", "什么最可能先留在你的记忆里？", [
    choice("A", "空间里的具体细节", "材质、声音、摆放和服务过程会让你形成印象。", { S: 3, facts: 3 }),
    choice("B", "整体氛围带来的联想", "它像什么故事、表达什么气质更容易吸引你。", { N: 3, possibility: 3 })
  ]),
  question(13, "information", "解释问题", "一个反复出现的小故障影响了大家。", "你会从哪里开始查找原因？", [
    choice("A", "检查最近发生的具体变化", "从可验证的记录、操作和异常点逐一排查。", { S: 2, J: 1, facts: 3, analysis: 1 }),
    choice("B", "寻找背后的系统模式", "尝试发现不同事件之间是否存在同一结构。", { N: 2, T: 1, possibility: 2, analysis: 2 })
  ]),
  question(14, "information", "表达想法", "你需要向别人介绍一个尚未成熟的创意。", "你会怎样组织内容？", [
    choice("A", "用可见场景说明它怎么用", "让对方先看到具体体验和现实价值。", { S: 2, E: 1, facts: 2, action: 1 }),
    choice("B", "从核心概念讲它会改变什么", "让对方先理解愿景，再进入细节。", { N: 2, I: 1, possibility: 3, growth: 1 })
  ]),

  question(15, "emotion", "情绪识别", "你一整天都提不起劲，却说不清发生了什么。", "你更可能怎样处理？", [
    choice("A", "停下来辨认身体和情绪", "给自己一点空间，弄清真正触发了什么。", { I: 1, F: 2, emotionAwareness: 3, solitude: 1 }),
    choice("B", "先做点事情改变状态", "通过运动、工作或外出让自己重新运转。", { E: 1, T: 2, action: 2, emotionExpression: 1 })
  ]),
  question(16, "emotion", "被冒犯后的回应", "朋友无意间开了一个让你不舒服的玩笑。", "你当下更自然的反应是什么？", [
    choice("A", "先观察自己为什么介意", "确认感受后，再决定这件事是否值得谈。", { I: 1, F: 1, emotionAwareness: 3, analysis: 1 }),
    choice("B", "直接说明这句话让我不舒服", "希望对方马上知道边界，避免误会继续。", { E: 1, T: 1, emotionExpression: 3, freedom: 1 })
  ]),
  question(17, "emotion", "支持他人", "亲近的人说自己今天很糟，但暂时不想讲原因。", "你会先怎样陪伴？", [
    choice("A", "安静在场，等对方准备好", "不追问，让对方知道随时可以开口。", { I: 1, F: 2, emotionAwareness: 3, connection: 1 }),
    choice("B", "主动提供几个可选的帮助", "用具体行动减轻眼前压力，也给对方回应入口。", { E: 1, T: 2, emotionExpression: 2, action: 2 })
  ]),
  question(18, "emotion", "冲突中的需求", "争执时，对方误解了你的出发点。", "你最想先做什么？", [
    choice("A", "解释事实和自己的本意", "先纠正错误信息，避免讨论建立在误解上。", { T: 2, J: 1, analysis: 2, emotionExpression: 1 }),
    choice("B", "说出误解带给你的感受", "先让对方知道这件事为什么会刺痛你。", { F: 2, P: 1, emotionExpression: 3, connection: 1 })
  ]),
  question(19, "emotion", "压力恢复", "一段高压期结束后，你终于有一个空闲晚上。", "什么最能帮助你恢复？", [
    choice("A", "独处并慢慢消化", "减少输入，等思绪和情绪自己沉下来。", { I: 2, emotionAwareness: 2, solitude: 3 }),
    choice("B", "找信任的人聊一聊", "在说出来和得到回应的过程中重新获得力量。", { E: 2, emotionExpression: 2, connection: 3 })
  ]),
  question(20, "emotion", "表达需求", "你发现自己最近承担太多，已经有些疲惫。", "你更可能怎样开口？", [
    choice("A", "整理清楚后提出具体调整", "说明哪些事情需要改变，以及可接受的方案。", { T: 1, J: 2, analysis: 1, emotionExpression: 2, planning: 1 }),
    choice("B", "先坦白自己真的撑不住了", "让对方先理解你的处境，再一起讨论办法。", { F: 2, P: 1, emotionAwareness: 2, emotionExpression: 2 })
  ]),
  question(21, "emotion", "面对低落", "你努力很久的事情没有得到期待的结果。", "你会如何与失落相处？", [
    choice("A", "允许自己难过一阵", "不急着把情绪变得合理，先承认它确实存在。", { F: 2, I: 1, emotionAwareness: 3, growth: 1 }),
    choice("B", "尽快寻找下一步", "把注意力转向能控制的部分，重新建立方向感。", { T: 2, E: 1, action: 2, growth: 2 })
  ]),

  question(22, "social", "能量恢复", "连续参加几天集体活动后，你可以自由安排一天。", "你会怎样使用这段时间？", [
    choice("A", "把大部分时间留给自己", "安静做喜欢的事，减少回应和社交安排。", { I: 3, solitude: 3, freedom: 1 }),
    choice("B", "约熟悉的人换一种轻松相处", "互动本身会带来新鲜感和能量。", { E: 3, connection: 3, flexibility: 1 })
  ]),
  question(23, "social", "陌生场合", "你来到一个大多是陌生人的聚会。", "你通常怎样进入现场？", [
    choice("A", "先观察，再选择少数人聊", "找到合适的话题和节奏后才会投入。", { I: 3, solitude: 2, analysis: 1 }),
    choice("B", "先打招呼，在互动中熟悉", "通过几段轻松交流判断自己想待在哪里。", { E: 3, connection: 3, action: 1 })
  ]),
  question(24, "social", "想法成形", "你脑中出现一个复杂但还不清晰的想法。", "哪种方式更容易帮你把它想明白？", [
    choice("A", "先独自写下来推演", "形成相对完整的结构后，再和别人讨论。", { I: 3, analysis: 2, solitude: 2 }),
    choice("B", "找人边聊边整理", "提问、碰撞和即时反馈会让思路变得清楚。", { E: 3, connection: 2, possibility: 1 })
  ]),
  question(25, "social", "关系维护", "一位很久没联系的朋友突然发来消息。", "你更接近哪种反应？", [
    choice("A", "先慢慢恢复彼此的节奏", "关系无需用频繁联系证明，真诚回应就好。", { I: 2, solitude: 2, stability: 1 }),
    choice("B", "很快提议找时间见面", "愿意用新的共同经历把连接重新建立起来。", { E: 2, connection: 3, action: 1 })
  ]),
  question(26, "social", "团队参与", "你加入一个尚未形成分工的新团队。", "你更可能从哪里开始？", [
    choice("A", "先找到自己能稳定贡献的位置", "通过可靠输出慢慢建立信任。", { I: 2, S: 1, solitude: 1, stability: 2 }),
    choice("B", "主动连接成员并推动协作", "先让信息流动起来，再一起形成分工。", { E: 2, N: 1, connection: 3, action: 1 })
  ]),
  question(27, "social", "分享好消息", "你刚得到一个期待已久的好消息。", "最自然的下一步是什么？", [
    choice("A", "先自己感受一会儿", "确认事情落定，也让喜悦在心里慢慢变得真实。", { I: 3, solitude: 2, emotionAwareness: 1 }),
    choice("B", "马上告诉重要的人", "分享和对方的反应会让快乐变得更完整。", { E: 3, connection: 3, emotionExpression: 1 })
  ]),

  question(28, "values", "稳定与自由", "你可以选择一份稳定清晰的工作，或一份方向开放但波动更大的工作。", "在其他条件相近时，你更容易被哪一边打动？", [
    choice("A", "可预期的积累路径", "稳定资源和清晰边界让我更能持续投入。", { J: 2, S: 1, stability: 3, planning: 1 }),
    choice("B", "可以不断改变的空间", "自主探索和新的可能比确定性更有吸引力。", { P: 2, N: 1, freedom: 3, possibility: 1 })
  ]),
  question(29, "values", "关系承诺", "伴侣希望你们提前规划未来两年的生活。", "你更自然的回应是什么？", [
    choice("A", "愿意把共同目标写得具体", "明确承诺能让我安心，也方便一起分配现实责任。", { J: 2, F: 1, stability: 3, planning: 2 }),
    choice("B", "愿意谈方向，但保留变化空间", "关系需要承诺，也需要允许彼此继续成长。", { P: 2, N: 1, freedom: 2, growth: 2 })
  ]),
  question(30, "values", "个人选择", "一个决定能让大多数人满意，却违背了你很重视的原则。", "你会怎样权衡？", [
    choice("A", "优先守住自己的底线", "即使需要承担不被理解，也不愿长期背离核心价值。", { I: 1, F: 2, freedom: 2, stability: 1 }),
    choice("B", "寻找对整体影响更好的做法", "原则重要，但我也会考虑现实后果和共同利益。", { E: 1, T: 2, connection: 2, analysis: 1 })
  ]),
  question(31, "values", "成长机会", "你获得一个需要从零开始、可能暴露短板的机会。", "你更可能怎样决定？", [
    choice("A", "确认基础条件后稳步进入", "我愿意成长，但希望风险和支持条件相对清楚。", { J: 2, S: 1, stability: 2, growth: 2 }),
    choice("B", "被挑战本身吸引", "即使暂时不擅长，也想看看自己能走到哪里。", { P: 2, N: 1, freedom: 2, growth: 3 })
  ]),
  question(32, "values", "成功定义", "你回看一段非常投入的人生阶段。", "什么更容易让你觉得这段时间值得？", [
    choice("A", "建立了可靠、可延续的成果", "它改善了现实，并且能持续支持之后的生活。", { S: 2, J: 1, stability: 2, facts: 1 }),
    choice("B", "成为了更接近理想的自己", "即使结果不完美，它也拓展了理解和可能性。", { N: 2, P: 1, growth: 3, freedom: 1 })
  ]),
  question(33, "values", "群体期待", "身边人都在走一条公认安全的路线，而你对另一条路更有兴趣。", "你通常怎样行动？", [
    choice("A", "先建立足够安全的基础", "等资源和退路更明确后，再尝试不同选择。", { J: 2, T: 1, stability: 3, planning: 1 }),
    choice("B", "为自己的兴趣承担不确定性", "不希望因为普遍期待错过真正想体验的生活。", { P: 2, F: 1, freedom: 3, growth: 1 })
  ]),
  question(34, "values", "帮助与边界", "朋友持续向你倾诉，但你最近也已经很疲惫。", "你更可能怎样处理？", [
    choice("A", "先维持这段重要连接", "我会尽量听完，之后再找时间恢复自己。", { F: 2, E: 1, connection: 3, stability: 1 }),
    choice("B", "诚实说明现在的容量", "愿意关心对方，但不会用耗尽自己来证明关系。", { T: 1, I: 2, freedom: 2, emotionExpression: 2 })
  ]),

  question(35, "lifestyle", "临时旅行", "朋友今晚邀请你周末去一个从未去过的城市。", "你最可能怎样回复？", [
    choice("A", "先确认交通、预算和安排", "细节可行后，我会更安心地享受旅程。", { J: 3, planning: 3, stability: 1 }),
    choice("B", "先答应，再一起边走边看", "未知本身很有吸引力，计划可以在路上补充。", { P: 3, flexibility: 3, freedom: 1 })
  ]),
  question(36, "lifestyle", "空闲周末", "一个没有任何既定安排的周末到来了。", "哪种状态更让你舒服？", [
    choice("A", "提前放入几件想完成的事", "有基本结构后，休息和行动都更踏实。", { J: 3, planning: 3, stability: 1 }),
    choice("B", "当天根据状态再决定", "保留空白让我更能回应真实兴趣和能量。", { P: 3, flexibility: 3, freedom: 1 })
  ]),
  question(37, "lifestyle", "截止日期", "你有三周完成一项重要任务。", "你最常见的工作节奏是什么？", [
    choice("A", "早拆分、持续推进", "阶段性完成会降低不确定感，也便于提前修正。", { J: 3, planning: 3, analysis: 1 }),
    choice("B", "先积累、集中冲刺", "保持开放更容易形成新想法，临近节点时效率最高。", { P: 3, flexibility: 2, possibility: 1, action: 1 })
  ]),
  question(38, "lifestyle", "计划改变", "你期待已久的安排在出发前一小时被取消。", "第一反应更接近哪一种？", [
    choice("A", "先确认新的时间和补救方案", "重新获得可预期性后，我才能放下这件事。", { J: 3, planning: 2, stability: 2 }),
    choice("B", "看看空出来的时间还能做什么", "变化令人遗憾，但也可能带来另一种体验。", { P: 3, flexibility: 3, possibility: 1 })
  ]),
  question(39, "lifestyle", "日常秩序", "生活进入一段任务很多、变化也很多的时期。", "你会怎样维持状态？", [
    choice("A", "建立固定节奏和清单", "把可控制的部分变得稳定，减少持续切换的消耗。", { J: 3, planning: 3, stability: 1 }),
    choice("B", "只保留最少的关键约束", "根据每天的优先级调整，不让计划反过来限制自己。", { P: 3, flexibility: 3, freedom: 1 })
  ]),
  question(40, "lifestyle", "共同安排", "旅行同伴希望每天都按详细行程行动，而你们还有不少未知情况。", "你更愿意怎样协调？", [
    choice("A", "先定关键节点，其余服从主线", "共同安排需要可靠，但可以为局部变化留出口。", { J: 2, T: 1, planning: 3, stability: 1, flexibility: 1 }),
    choice("B", "每天只确定下一段方向", "让真实体验决定节奏，同时及时和同伴同步。", { P: 2, F: 1, flexibility: 3, freedom: 1, connection: 1 })
  ])
] as const;

export const mbtiDimensionPairs = [
  { key: "EI", left: "E", right: "I", leftLabel: "外向", rightLabel: "内向" },
  { key: "SN", left: "S", right: "N", leftLabel: "实感", rightLabel: "直觉" },
  { key: "TF", left: "T", right: "F", leftLabel: "思考", rightLabel: "情感" },
  { key: "JP", left: "J", right: "P", leftLabel: "判断", rightLabel: "感知" }
] as const;

const createEmptyScores = (): MbtiPreferenceScores => ({
  E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0
});

const createEmptyExplorationScores = (): ExplorationTraitScores => ({
  analysis: 0,
  action: 0,
  facts: 0,
  possibility: 0,
  emotionAwareness: 0,
  emotionExpression: 0,
  solitude: 0,
  connection: 0,
  stability: 0,
  freedom: 0,
  growth: 0,
  planning: 0,
  flexibility: 0
});

function getPairPercent(left: number, right: number) {
  const total = left + right;
  return total === 0 ? 50 : Math.round((left / total) * 100);
}

function createAxis(
  id: ExplorationDomain,
  label: string,
  leftLabel: string,
  rightLabel: string,
  left: number,
  right: number
): ExplorationAxisResult {
  const leftPercent = getPairPercent(left, right);
  return { id, label, leftLabel, rightLabel, leftPercent, rightPercent: 100 - leftPercent };
}

function buildExplorationReport(scores: ExplorationTraitScores): PersonalityExplorationReport {
  const axes = [
    createAxis("decision", "决策方式", "深度分析", "快速行动", scores.analysis, scores.action),
    createAxis("information", "信息处理", "事实经验", "可能联想", scores.facts, scores.possibility),
    createAxis("emotion", "情绪处理", "内在觉察", "主动表达", scores.emotionAwareness, scores.emotionExpression),
    createAxis("social", "能量来源", "独处恢复", "关系连接", scores.solitude, scores.connection),
    createAxis("values", "价值取向", "稳定积累", "自由探索", scores.stability, scores.freedom),
    createAxis("lifestyle", "生活节奏", "计划结构", "灵活应变", scores.planning, scores.flexibility)
  ] as ExplorationAxisResult[];

  const patternCandidates = axes.flatMap((axis) => [
    { title: axis.leftLabel, strength: axis.leftPercent },
    { title: axis.rightLabel, strength: axis.rightPercent }
  ]).sort((a, b) => b.strength - a.strength);
  const primaryPattern = `${patternCandidates[0].title}型`;

  const coreTendencies = axes.map((axis) =>
    axis.leftPercent >= axis.rightPercent ? axis.leftLabel : axis.rightLabel
  );
  const decision = axes[0];
  const information = axes[1];
  const emotion = axes[2];
  const social = axes[3];
  const values = axes[4];
  const lifestyle = axes[5];

  const decisionStyle = decision.leftPercent >= 55
    ? `你倾向先建立判断框架，再把行动放进清晰的优先级中；处理信息时更依赖${information.leftPercent >= information.rightPercent ? "可验证的事实" : "整体模式与未来可能"}。`
    : `你倾向通过行动获得真实反馈，再逐步修正方向；处理信息时更依赖${information.leftPercent >= information.rightPercent ? "当下细节和经验" : "联想、趋势与新可能"}。`;

  const communicationStyle = emotion.rightPercent >= 55
    ? `你较愿意把感受和立场说出来，${social.rightPercent >= social.leftPercent ? "也会在互动反馈中确认彼此是否理解" : "但通常只对少数信任的人深入表达"}。`
    : `你通常先在内心辨认感受，再决定是否表达；${social.rightPercent >= social.leftPercent ? "关系回应能帮助你逐渐说清自己" : "充足的独处空间会让表达更准确"}。`;

  const stressResponse = lifestyle.leftPercent >= 55
    ? `压力升高时，你会尝试恢复秩序、拆分任务并减少不确定性。${emotion.leftPercent > 62 ? "需要留意别让整理问题替代了照顾自己的情绪。" : "明确表达当前容量会让这种策略更可持续。"}`
    : `压力升高时，你更可能快速调整、寻找新的出口。${emotion.rightPercent > 62 ? "表达能帮助你释放压力，但也需要给决定留一点沉淀时间。" : "在变化中保留一个稳定支点会更安心。"}`;

  const relationshipPattern = values.leftPercent >= values.rightPercent
    ? `你重视关系中的可靠、持续和可预期。${social.rightPercent >= 55 ? "你会用投入和回应维护连接" : "你更常用稳定行动而非高频表达证明在意"}。`
    : `你重视关系中的自主、真实和共同成长。${social.rightPercent >= 55 ? "新体验和及时交流会让你感到亲近" : "被允许保留个人空间，是你愿意持续靠近的重要前提"}。`;

  const growthSuggestions: string[] = [];
  if (decision.leftPercent >= 68) growthSuggestions.push("在信息尚不完整时，尝试先做一个成本可控的小行动。 ");
  if (decision.rightPercent >= 68) growthSuggestions.push("重大选择前暂停十分钟，写下风险、边界和退出条件。 ");
  if (emotion.leftPercent >= 68) growthSuggestions.push("把“我需要什么”说成一句具体请求，让他人有机会回应。 ");
  if (emotion.rightPercent >= 68) growthSuggestions.push("强烈情绪出现时，先辨认感受与事实，再决定表达强度。 ");
  if (values.leftPercent >= 68) growthSuggestions.push("给计划留出一小块不被安排的空间，练习与变化共处。 ");
  if (values.rightPercent >= 68) growthSuggestions.push("把重要关系中的承诺写成可持续的小行动，而不只是一种愿望。 ");
  if (lifestyle.leftPercent >= 68) growthSuggestions.push("计划变化时先寻找新的可能，再决定如何重排。 ");
  if (lifestyle.rightPercent >= 68) growthSuggestions.push("为长期目标设一个固定检查点，让灵活不等于失去积累。 ");
  if (growthSuggestions.length < 3) {
    growthSuggestions.push("下一次意见不同时，先复述对方真正重视的部分，再表达自己的选择。 ");
  }

  return {
    primaryPattern,
    coreTendencies,
    decisionStyle,
    communicationStyle,
    stressResponse,
    relationshipPattern,
    growthSuggestions: growthSuggestions.slice(0, 4).map((item) => item.trim()),
    axes
  };
}

export function calculateMbtiResult(answers: Record<number, string>): MbtiTestResult {
  const scores = createEmptyScores();
  const explorationScores = createEmptyExplorationScores();

  for (const testQuestion of mbtiTestQuestions) {
    const answerId = answers[testQuestion.id];
    const selectedChoice = testQuestion.choices.find((item) => item.id === answerId);
    if (!selectedChoice) {
      throw new Error(`Question ${testQuestion.id} has not been answered.`);
    }

    for (const [key, weight] of Object.entries(selectedChoice.scoreWeight)) {
      if (!weight) continue;
      if (key in scores) scores[key as MbtiLetter] += weight;
      else explorationScores[key as ExplorationTrait] += weight;
    }
  }

  const mbti = [
    scores.E > scores.I ? "E" : "I",
    scores.S > scores.N ? "S" : "N",
    scores.T > scores.F ? "T" : "F",
    scores.J > scores.P ? "J" : "P"
  ].join("") as MbtiType;

  return {
    mbti,
    scores,
    explorationScores,
    explorationReport: buildExplorationReport(explorationScores),
    answeredAt: new Date().toISOString()
  };
}

export function getPreferencePercent(scores: MbtiPreferenceScores, letter: MbtiLetter) {
  const pair: Record<MbtiLetter, MbtiLetter> = {
    E: "I", I: "E", S: "N", N: "S", T: "F", F: "T", J: "P", P: "J"
  };
  return getPairPercent(scores[letter], scores[pair[letter]]);
}
