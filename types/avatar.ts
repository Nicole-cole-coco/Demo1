export const mbtiTypes = [
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP"
] as const;

export type MbtiType = (typeof mbtiTypes)[number];

export type Gender = "female" | "male";

export type MbtiVisualGroup = "nt" | "nf" | "sj" | "sp";

export type MbtiMeta = {
  type: MbtiType;
  title: string;
  clan: string;
  group: string;
  temperament: string;
  accent: string;
};

export const mbtiMeta: Record<MbtiType, MbtiMeta> = {
  INTJ: {
    type: "INTJ",
    title: "星图策士",
    clan: "星轨族",
    group: "紫人组",
    temperament: "清醒、独立、目标感",
    accent: "from-violet-100 to-purple-200"
  },
  INTP: {
    type: "INTP",
    title: "云端思辨家",
    clan: "星轨族",
    group: "紫人组",
    temperament: "好奇、松弛、爱推演",
    accent: "from-fuchsia-100 to-violet-200"
  },
  ENTJ: {
    type: "ENTJ",
    title: "晨星指挥官",
    clan: "星轨族",
    group: "紫人组",
    temperament: "果断、热烈、有章法",
    accent: "from-purple-200 to-indigo-200"
  },
  ENTP: {
    type: "ENTP",
    title: "灵感游侠",
    clan: "星轨族",
    group: "紫人组",
    temperament: "机敏、跳跃、爱新鲜",
    accent: "from-purple-100 to-fuchsia-200"
  },
  INFJ: {
    type: "INFJ",
    title: "月灯守护者",
    clan: "花信族",
    group: "绿人组",
    temperament: "温柔、深邃、有边界",
    accent: "from-emerald-100 to-green-200"
  },
  INFP: {
    type: "INFP",
    title: "软云做梦家",
    clan: "花信族",
    group: "绿人组",
    temperament: "敏感、浪漫、重意义",
    accent: "from-teal-100 to-emerald-200"
  },
  ENFJ: {
    type: "ENFJ",
    title: "暖光主持人",
    clan: "花信族",
    group: "绿人组",
    temperament: "明亮、体贴、会照顾场面",
    accent: "from-teal-100 to-emerald-200"
  },
  ENFP: {
    type: "ENFP",
    title: "花火探险家",
    clan: "花信族",
    group: "绿人组",
    temperament: "鲜活、自由、爱联想",
    accent: "from-lime-100 to-teal-200"
  },
  ISTJ: {
    type: "ISTJ",
    title: "晨钟记录员",
    clan: "晨序族",
    group: "蓝人组",
    temperament: "可靠、安静、守承诺",
    accent: "from-sky-100 to-blue-200"
  },
  ISFJ: {
    type: "ISFJ",
    title: "棉灯照护者",
    clan: "晨序族",
    group: "蓝人组",
    temperament: "细腻、稳定、很会记得",
    accent: "from-cyan-100 to-sky-200"
  },
  ESTJ: {
    type: "ESTJ",
    title: "清单管家",
    clan: "晨序族",
    group: "蓝人组",
    temperament: "利落、务实、执行强",
    accent: "from-blue-100 to-indigo-200"
  },
  ESFJ: {
    type: "ESFJ",
    title: "茶会召集人",
    clan: "晨序族",
    group: "蓝人组",
    temperament: "亲切、周全、重关系",
    accent: "from-sky-100 to-cyan-200"
  },
  ISTP: {
    type: "ISTP",
    title: "风铃修理师",
    clan: "海风族",
    group: "黄人组",
    temperament: "冷静、动手派、自由",
    accent: "from-amber-100 to-orange-200"
  },
  ISFP: {
    type: "ISFP",
    title: "露台画师",
    clan: "海风族",
    group: "黄人组",
    temperament: "审美好、温柔、顺着心走",
    accent: "from-yellow-100 to-amber-200"
  },
  ESTP: {
    type: "ESTP",
    title: "晴日行动派",
    clan: "海风族",
    group: "黄人组",
    temperament: "直接、鲜活、反应快",
    accent: "from-orange-100 to-yellow-200"
  },
  ESFP: {
    type: "ESFP",
    title: "果冻舞台星",
    clan: "海风族",
    group: "黄人组",
    temperament: "可爱、会玩、感染力强",
    accent: "from-orange-100 to-amber-200"
  }
};

export const hairStyles = [
  { id: "soft-bob", label: "柔软短发" },
  { id: "long-wave", label: "长卷发" },
  { id: "twin-tail", label: "双束发" },
  { id: "low-bun", label: "低丸子" }
] as const;

export const hairColors = [
  { id: "mocha", label: "摩卡棕" },
  { id: "milk-tea", label: "奶茶金" },
  { id: "rose", label: "玫瑰粉" },
  { id: "mist", label: "雾蓝灰" }
] as const;

export const eyeStyles = [
  { id: "gentle", label: "温柔眼" },
  { id: "bright", label: "亮晶眼" },
  { id: "calm", label: "清冷眼" },
  { id: "sleepy", label: "困困眼" }
] as const;

export const expressions = [
  { id: "smile", label: "微笑" },
  { id: "spark", label: "开心" },
  { id: "shy", label: "害羞" },
  { id: "focus", label: "专注" }
] as const;

export const outfits = [
  { id: "nt-oracle", label: "星盘紫外套", visualGroup: "nt" },
  { id: "nt-lavender", label: "薰衣草学院装", visualGroup: "nt" },
  { id: "nt-night", label: "紫夜短披肩", visualGroup: "nt" },
  { id: "nt-crystal", label: "晶紫针织衫", visualGroup: "nt" },
  { id: "nf-sage", label: "鼠尾草开衫", visualGroup: "nf" },
  { id: "nf-mint", label: "薄荷花边裙", visualGroup: "nf" },
  { id: "nf-forest", label: "森林绿斗篷", visualGroup: "nf" },
  { id: "nf-cream", label: "奶油绿衬衣", visualGroup: "nf" },
  { id: "sj-blue", label: "晴蓝制服衫", visualGroup: "sj" },
  { id: "sj-navy", label: "海军蓝开衫", visualGroup: "sj" },
  { id: "sj-ribbon", label: "蓝白丝带裙", visualGroup: "sj" },
  { id: "sj-check", label: "浅蓝格纹装", visualGroup: "sj" },
  { id: "sp-honey", label: "蜂蜜黄夹克", visualGroup: "sp" },
  { id: "sp-peach", label: "蜜桃橙短衫", visualGroup: "sp" },
  { id: "sp-sun", label: "暖阳连衣装", visualGroup: "sp" },
  { id: "sp-spark", label: "橙黄活力装", visualGroup: "sp" }
] as const;

export const accessories = [
  { id: "none", label: "无配饰" },
  { id: "ribbon", label: "丝带" },
  { id: "beret", label: "贝雷帽" },
  { id: "glasses", label: "圆框眼镜" },
  { id: "earring", label: "耳饰" },
  { id: "necklace", label: "项链" }
] as const;

export const roomBackgrounds = [
  { id: "morning", label: "晨光卧室" },
  { id: "greenhouse", label: "玻璃花房" },
  { id: "studio", label: "香薰工作室" },
  { id: "night", label: "星夜阁楼" }
] as const;

export type HairStyle = (typeof hairStyles)[number]["id"];
export type HairColor = (typeof hairColors)[number]["id"];
export type EyeStyle = (typeof eyeStyles)[number]["id"];
export type Expression = (typeof expressions)[number]["id"];
export type Outfit = (typeof outfits)[number]["id"];
export type Accessory = (typeof accessories)[number]["id"];
export type RoomBackground = (typeof roomBackgrounds)[number]["id"];

export type AvatarOptions = {
  hairStyle: HairStyle;
  hairColor: HairColor;
  eyeStyle: EyeStyle;
  expression: Expression;
  outfit: Outfit;
  accessory: Accessory;
  roomBackground: RoomBackground;
};

export type OutfitVisual = {
  base: string;
  soft: string;
  deep: string;
  glow: string;
  motif: string;
  texture: "starlight" | "petal" | "ribbon" | "sun";
  cut: "coat" | "dress" | "cape" | "knit";
  note: string;
};

export type Mood = "平静" | "开心" | "害羞" | "元气" | "困困" | "灵感闪烁";

export type AvatarStats = {
  intimacy: number;
  energy: number;
  inspiration: number;
};

export type AvatarProfile = {
  id: string;
  name: string;
  gender: Gender;
  mbti: MbtiType;
  clan: string;
  mood: Mood;
  options: AvatarOptions;
};

export type MbtiStyleNote = {
  posture: string;
  detail: string;
  roomBackground: RoomBackground;
  hairColor: HairColor;
  eyeStyle: EyeStyle;
};

export const mbtiStyleNotes: Record<MbtiType, MbtiStyleNote> = {
  INTJ: {
    posture: "安静执卷，目光像在排布星图",
    detail: "星盘书、紫夜长裙、冷静高智感",
    roomBackground: "night",
    hairColor: "mist",
    eyeStyle: "calm"
  },
  INTP: {
    posture: "抱着笔记本，像刚从脑内宇宙回来",
    detail: "松弛针织、微乱发丝、研究员气质",
    roomBackground: "night",
    hairColor: "mocha",
    eyeStyle: "sleepy"
  },
  ENTJ: {
    posture: "站姿利落，像下一秒要推进计划",
    detail: "深紫外套、清晰线条、指挥官气场",
    roomBackground: "studio",
    hairColor: "mocha",
    eyeStyle: "calm"
  },
  ENTP: {
    posture: "歪头微笑，眼里带一点挑战和玩心",
    detail: "紫色学院感、闪亮配饰、灵感辩手感",
    roomBackground: "studio",
    hairColor: "rose",
    eyeStyle: "bright"
  },
  INFJ: {
    posture: "轻轻抱书，温柔但保留一点距离",
    detail: "鼠尾草开衫、月灯氛围、安静共情感",
    roomBackground: "greenhouse",
    hairColor: "mocha",
    eyeStyle: "gentle"
  },
  INFP: {
    posture: "微微低头，像把愿望藏进口袋",
    detail: "薄荷花裙、柔软长发、做梦家的透明感",
    roomBackground: "greenhouse",
    hairColor: "milk-tea",
    eyeStyle: "gentle"
  },
  ENFJ: {
    posture: "面向你微笑，像在认真接住你的情绪",
    detail: "清新绿衫、花枝细节、暖光主持感",
    roomBackground: "morning",
    hairColor: "milk-tea",
    eyeStyle: "bright"
  },
  ENFP: {
    posture: "身体前倾，像准备拉你去看新世界",
    detail: "明亮薄荷、花火发饰、自由探索感",
    roomBackground: "greenhouse",
    hairColor: "rose",
    eyeStyle: "bright"
  },
  ISTJ: {
    posture: "端正抱板，像把今天安排得很安心",
    detail: "蓝白制服、记录夹、可靠秩序感",
    roomBackground: "morning",
    hairColor: "mocha",
    eyeStyle: "calm"
  },
  ISFJ: {
    posture: "温柔侧身，像记得每个小细节",
    detail: "浅蓝开衫、柔软发髻、棉灯照护感",
    roomBackground: "morning",
    hairColor: "milk-tea",
    eyeStyle: "gentle"
  },
  ESTJ: {
    posture: "握笔看向前方，干净利落不拖泥带水",
    detail: "海军蓝格纹、清单夹、执行力气场",
    roomBackground: "studio",
    hairColor: "mocha",
    eyeStyle: "calm"
  },
  ESFJ: {
    posture: "亲切招呼，像刚把茶会布置好",
    detail: "蓝色丝带、甜美制服、周全社交感",
    roomBackground: "morning",
    hairColor: "milk-tea",
    eyeStyle: "bright"
  },
  ISTP: {
    posture: "松弛站着，像随手就能修好小物件",
    detail: "暖黄夹克、轻便鞋、冷静动手感",
    roomBackground: "studio",
    hairColor: "mist",
    eyeStyle: "calm"
  },
  ISFP: {
    posture: "自然微笑，像刚完成一幅很喜欢的画",
    detail: "柔黄裙摆、花形细节、审美自由感",
    roomBackground: "greenhouse",
    hairColor: "milk-tea",
    eyeStyle: "gentle"
  },
  ESTP: {
    posture: "轻快前倾，像现在就要出门行动",
    detail: "橙黄运动感、星星发夹、晴日行动力",
    roomBackground: "morning",
    hairColor: "mocha",
    eyeStyle: "bright"
  },
  ESFP: {
    posture: "明亮抬手，像把房间气氛点亮",
    detail: "蜜桃黄短裙、闪亮笑眼、舞台感染力",
    roomBackground: "studio",
    hairColor: "rose",
    eyeStyle: "bright"
  }
};

export const defaultAvatarOptions: AvatarOptions = {
  hairStyle: "soft-bob",
  hairColor: "milk-tea",
  eyeStyle: "gentle",
  expression: "smile",
  outfit: "nf-sage",
  accessory: "ribbon",
  roomBackground: "morning"
};

export const defaultStats: AvatarStats = {
  intimacy: 8,
  energy: 72,
  inspiration: 46
};

export function getMbtiMeta(type: MbtiType) {
  return mbtiMeta[type];
}

export const mbtiVisualGroups: Record<MbtiType, MbtiVisualGroup> = {
  INTJ: "nt",
  INTP: "nt",
  ENTJ: "nt",
  ENTP: "nt",
  INFJ: "nf",
  INFP: "nf",
  ENFJ: "nf",
  ENFP: "nf",
  ISTJ: "sj",
  ISFJ: "sj",
  ESTJ: "sj",
  ESFJ: "sj",
  ISTP: "sp",
  ISFP: "sp",
  ESTP: "sp",
  ESFP: "sp"
};

export const mbtiGroupLabels: Record<MbtiVisualGroup, string> = {
  nt: "紫人组",
  nf: "绿人组",
  sj: "蓝人组",
  sp: "黄人组"
};

export const mbtiGroupColorNotes: Record<MbtiVisualGroup, string> = {
  nt: "紫色、薰衣草、星夜紫",
  nf: "绿色、薄荷、鼠尾草",
  sj: "蓝色、粉蓝、海军蓝",
  sp: "黄色、蜜桃、暖橙"
};

export type MbtiPersona = {
  archetype: string;
  aura: string;
  socialStyle: string;
  innerNeed: string;
  careHint: string;
  defaultExpression: Expression;
  recommendedHair: HairStyle;
  recommendedAccessory: Accessory;
};

export const mbtiPersonas: Record<MbtiType, MbtiPersona> = {
  INTJ: {
    archetype: "冷静策划者",
    aura: "像把星图藏在袖口里，安静但很有掌控感。",
    socialStyle: "慢热、观察力强，不轻易表态但会给出关键判断。",
    innerNeed: "需要被尊重边界，也需要有人看见她/他的长期计划。",
    careHint: "适合用具体问题和她/他讨论目标。",
    defaultExpression: "focus",
    recommendedHair: "low-bun",
    recommendedAccessory: "glasses"
  },
  INTP: {
    archetype: "云端解谜人",
    aura: "松弛、游离、脑内一直有小宇宙在转。",
    socialStyle: "好奇但不爱被催，喜欢从奇怪角度拆问题。",
    innerNeed: "需要自由探索，也需要被允许慢半拍。",
    careHint: "适合抛一个有趣问题，让她/他慢慢展开。",
    defaultExpression: "focus",
    recommendedHair: "soft-bob",
    recommendedAccessory: "glasses"
  },
  ENTJ: {
    archetype: "晨星指挥官",
    aura: "明亮、果断、站在那里就像要把计划推进。",
    socialStyle: "直接、有组织感，喜欢高效也愿意保护自己人。",
    innerNeed: "需要被信任能力，也需要偶尔不用强撑。",
    careHint: "适合给她/他明确反馈和下一步任务。",
    defaultExpression: "focus",
    recommendedHair: "low-bun",
    recommendedAccessory: "beret"
  },
  ENTP: {
    archetype: "灵感游侠",
    aura: "眼睛里有火花，像随时会发现一个新玩法。",
    socialStyle: "机敏、爱辩、会把沉闷话题点亮。",
    innerNeed: "需要新鲜感，也需要有人接住跳跃的想法。",
    careHint: "适合用轻松挑战和她/他互动。",
    defaultExpression: "spark",
    recommendedHair: "twin-tail",
    recommendedAccessory: "ribbon"
  },
  INFJ: {
    archetype: "月灯守护者",
    aura: "温柔但有距离感，像一盏只给重要的人亮的灯。",
    socialStyle: "敏锐、克制，能读懂情绪但不会轻易暴露自己。",
    innerNeed: "需要精神共鸣，也需要安静恢复能量。",
    careHint: "适合认真倾听，不要逼她/他立刻回答。",
    defaultExpression: "smile",
    recommendedHair: "long-wave",
    recommendedAccessory: "ribbon"
  },
  INFP: {
    archetype: "软云做梦家",
    aura: "柔软、浪漫，像把很多小愿望藏在口袋里。",
    socialStyle: "真诚、敏感，熟悉后会露出很可爱的想象力。",
    innerNeed: "需要被理解价值感，也需要情绪被温柔对待。",
    careHint: "适合夸她/他的细腻和独特想法。",
    defaultExpression: "shy",
    recommendedHair: "long-wave",
    recommendedAccessory: "ribbon"
  },
  ENFJ: {
    archetype: "暖光主持人",
    aura: "像温暖聚光灯，会自然照顾每个人的位置。",
    socialStyle: "亲和、会鼓励，也容易把责任往自己身上揽。",
    innerNeed: "需要被感谢，也需要被允许先照顾自己。",
    careHint: "适合回应她/他的付出，提醒她/他休息。",
    defaultExpression: "smile",
    recommendedHair: "soft-bob",
    recommendedAccessory: "beret"
  },
  ENFP: {
    archetype: "花火探险家",
    aura: "热烈、跳脱，像一串会自己发光的灵感。",
    socialStyle: "外放、爱联想，喜欢和人一起把世界变好玩。",
    innerNeed: "需要被支持热情，也需要有人帮她/他收束。",
    careHint: "适合先肯定灵感，再一起挑最想做的一件。",
    defaultExpression: "spark",
    recommendedHair: "twin-tail",
    recommendedAccessory: "ribbon"
  },
  ISTJ: {
    archetype: "晨钟记录员",
    aura: "干净、可靠，像把生活整理得很安心。",
    socialStyle: "踏实、守时，话不多但承诺很重。",
    innerNeed: "需要稳定秩序，也需要努力被看见。",
    careHint: "适合给她/他清晰安排和真诚肯定。",
    defaultExpression: "focus",
    recommendedHair: "low-bun",
    recommendedAccessory: "glasses"
  },
  ISFJ: {
    archetype: "棉灯照护者",
    aura: "柔和细腻，像会记得你喜欢哪杯热饮。",
    socialStyle: "体贴、谨慎，不争抢但很会守护日常。",
    innerNeed: "需要安全感，也需要付出被珍惜。",
    careHint: "适合主动表达感谢和陪伴。",
    defaultExpression: "smile",
    recommendedHair: "soft-bob",
    recommendedAccessory: "ribbon"
  },
  ESTJ: {
    archetype: "清单管家",
    aura: "利落、有精神，像能把混乱一键排好序。",
    socialStyle: "务实、直接，喜欢规则清楚、行动到位。",
    innerNeed: "需要效率与责任感被认可，也需要柔软出口。",
    careHint: "适合给明确结果，不要模糊拖延。",
    defaultExpression: "focus",
    recommendedHair: "low-bun",
    recommendedAccessory: "glasses"
  },
  ESFJ: {
    archetype: "茶会召集人",
    aura: "明亮亲切，像一张会让人放松的圆桌。",
    socialStyle: "热情、周到，擅长维系关系和氛围。",
    innerNeed: "需要回应和连接，也怕自己不被需要。",
    careHint: "适合多给反馈，让她/他知道被喜欢。",
    defaultExpression: "smile",
    recommendedHair: "twin-tail",
    recommendedAccessory: "ribbon"
  },
  ISTP: {
    archetype: "风铃修理师",
    aura: "清爽、冷静，像随手就能修好一件小机器。",
    socialStyle: "独立、少废话，喜欢用行动解决问题。",
    innerNeed: "需要空间和自主，也需要被信任判断。",
    careHint: "适合少施压，多给可操作的互动。",
    defaultExpression: "focus",
    recommendedHair: "soft-bob",
    recommendedAccessory: "glasses"
  },
  ISFP: {
    archetype: "露台画师",
    aura: "安静有审美，像把心情调成了柔和滤镜。",
    socialStyle: "随和、感受力强，喜欢自然流动的关系。",
    innerNeed: "需要美感和自由，也需要情绪不被粗暴评价。",
    careHint: "适合用漂亮细节和温柔陪伴打动她/他。",
    defaultExpression: "shy",
    recommendedHair: "long-wave",
    recommendedAccessory: "beret"
  },
  ESTP: {
    archetype: "晴日行动派",
    aura: "鲜活、利落，像一句“走啊现在就去”。",
    socialStyle: "反应快、爱体验，喜欢真实刺激的互动。",
    innerNeed: "需要行动感和即时反馈，也需要被允许试错。",
    careHint: "适合给她/他小挑战和及时鼓励。",
    defaultExpression: "spark",
    recommendedHair: "soft-bob",
    recommendedAccessory: "beret"
  },
  ESFP: {
    archetype: "果冻舞台星",
    aura: "甜亮、有感染力，像把房间气氛调到晴天。",
    socialStyle: "外向、会玩，擅长把普通日子变得热闹。",
    innerNeed: "需要被欣赏，也需要真诚而不扫兴的陪伴。",
    careHint: "适合夸她/他的可爱和现场感。",
    defaultExpression: "spark",
    recommendedHair: "twin-tail",
    recommendedAccessory: "ribbon"
  }
};

export const characterAssets: Record<Gender, Record<MbtiVisualGroup, string>> = {
  female: {
    nt: "/characters/cutouts/female-nt.png",
    nf: "/characters/cutouts/female-nf.png",
    sj: "/characters/cutouts/female-sj.png",
    sp: "/characters/cutouts/female-sp.png"
  },
  male: {
    nt: "/characters/cutouts/male-nt.png",
    nf: "/characters/cutouts/male-nf.png",
    sj: "/characters/cutouts/male-sj.png",
    sp: "/characters/cutouts/male-sp.png"
  }
};

export const mbtiCharacterAssets: Record<MbtiType, string> = {
  INTJ: "/characters/mbti-v2/intj.webp",
  INTP: "/characters/mbti-v2/intp.webp",
  ENTJ: "/characters/mbti-v2/entj.webp",
  ENTP: "/characters/mbti-v2/entp.webp",
  INFJ: "/characters/mbti-v2/infj.webp",
  INFP: "/characters/mbti-v2/infp.webp",
  ENFJ: "/characters/mbti-v2/enfj.webp",
  ENFP: "/characters/mbti-v2/enfp.webp",
  ISTJ: "/characters/mbti-v2/istj.webp",
  ISFJ: "/characters/mbti-v2/isfj.webp",
  ESTJ: "/characters/mbti-v2/estj.webp",
  ESFJ: "/characters/mbti-v2/esfj.webp",
  ISTP: "/characters/mbti-v2/istp.webp",
  ISFP: "/characters/mbti-v2/isfp.webp",
  ESTP: "/characters/mbti-v2/estp.webp",
  ESFP: "/characters/mbti-v2/esfp.webp"
};

export type CharacterAssetSize = {
  width: number;
  height: number;
};

export const characterImageSizes: Record<Gender, Record<MbtiVisualGroup, CharacterAssetSize>> = {
  female: {
    nt: { width: 640, height: 960 },
    nf: { width: 640, height: 960 },
    sj: { width: 640, height: 960 },
    sp: { width: 640, height: 960 }
  },
  male: {
    nt: { width: 640, height: 960 },
    nf: { width: 640, height: 960 },
    sj: { width: 640, height: 1280 },
    sp: { width: 640, height: 960 }
  }
};

export type AnchorPoint = {
  x: number;
  y: number;
};

export type CharacterAnchors = {
  headTop: AnchorPoint;
  headCenter: AnchorPoint;
  leftEar?: AnchorPoint;
  rightEar?: AnchorPoint;
  neck?: AnchorPoint;
  chest?: AnchorPoint;
  waist?: AnchorPoint;
  leftFoot?: AnchorPoint;
  rightFoot?: AnchorPoint;
  headWidth: number;
  headHeight: number;
  headRotation: number;
  bodyWidth: number;
  bodyHeight: number;
};

export type CharacterAnchorName =
  | "headTop"
  | "headCenter"
  | "leftEar"
  | "rightEar"
  | "neck"
  | "chest"
  | "waist"
  | "leftFoot"
  | "rightFoot";

export type CharacterAssetKey = `${Gender}-${MbtiVisualGroup}`;

export type WearableCategory =
  | "hat"
  | "glasses"
  | "earring"
  | "necklace"
  | "top"
  | "bottom"
  | "shoes";

export type WearableCharacterOverride = {
  scale?: number;
  offsetX?: number;
  offsetY?: number;
  rotation?: number;
  widthToHeadRatio?: number;
};

export type WearableItem = {
  id: string;
  category: WearableCategory;
  src: string;
  targetAnchor: CharacterAnchorName;
  anchorX: number;
  anchorY: number;
  widthRatio: number;
  heightRatio?: number;
  visibleBounds?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  anchor?: {
    x: number;
    y: number;
  };
  fit?: {
    widthToHeadRatio: number;
    offsetX: number;
    offsetY: number;
    rotation: number;
  };
  offsetX?: number;
  offsetY?: number;
  rotationOffset?: number;
  zIndex?: number;
  backSrc?: string;
  frontSrc?: string;
  supportsLayering?: boolean;
  characterOverrides?: Partial<Record<CharacterAssetKey, WearableCharacterOverride>>;
};

export type WearableCalibration = {
  scale: number;
  offsetX: number;
  offsetY: number;
  rotation: number;
  widthToHeadRatio?: number;
  anchorX?: number;
  anchorY?: number;
};

export const wearableDesignCanvas = {
  designWidth: 640,
  designHeight: 960
} as const;

export const characterAnchors: Record<Gender, Record<MbtiVisualGroup, CharacterAnchors>> = {
  female: {
    nt: {
      headTop: { x: 0.5, y: 0.062 },
      headCenter: { x: 0.5, y: 0.156 },
      leftEar: { x: 0.405, y: 0.158 },
      rightEar: { x: 0.595, y: 0.158 },
      neck: { x: 0.5, y: 0.252 },
      chest: { x: 0.5, y: 0.37 },
      waist: { x: 0.5, y: 0.52 },
      leftFoot: { x: 0.43, y: 0.91 },
      rightFoot: { x: 0.56, y: 0.91 },
      headWidth: 0.235,
      headHeight: 0.19,
      headRotation: -3,
      bodyWidth: 0.42,
      bodyHeight: 0.78
    },
    nf: {
      headTop: { x: 0.5, y: 0.064 },
      headCenter: { x: 0.5, y: 0.158 },
      leftEar: { x: 0.405, y: 0.16 },
      rightEar: { x: 0.595, y: 0.16 },
      neck: { x: 0.5, y: 0.255 },
      chest: { x: 0.5, y: 0.39 },
      waist: { x: 0.5, y: 0.545 },
      leftFoot: { x: 0.435, y: 0.91 },
      rightFoot: { x: 0.565, y: 0.91 },
      headWidth: 0.238,
      headHeight: 0.19,
      headRotation: -2,
      bodyWidth: 0.43,
      bodyHeight: 0.78
    },
    sj: {
      headTop: { x: 0.495, y: 0.06 },
      headCenter: { x: 0.495, y: 0.152 },
      leftEar: { x: 0.407, y: 0.154 },
      rightEar: { x: 0.585, y: 0.154 },
      neck: { x: 0.498, y: 0.248 },
      chest: { x: 0.5, y: 0.368 },
      waist: { x: 0.5, y: 0.52 },
      leftFoot: { x: 0.435, y: 0.91 },
      rightFoot: { x: 0.56, y: 0.91 },
      headWidth: 0.225,
      headHeight: 0.185,
      headRotation: -2,
      bodyWidth: 0.4,
      bodyHeight: 0.78
    },
    sp: {
      headTop: { x: 0.55, y: 0.064 },
      headCenter: { x: 0.55, y: 0.156 },
      leftEar: { x: 0.46, y: 0.158 },
      rightEar: { x: 0.64, y: 0.158 },
      neck: { x: 0.53, y: 0.252 },
      chest: { x: 0.515, y: 0.37 },
      waist: { x: 0.505, y: 0.51 },
      leftFoot: { x: 0.43, y: 0.9 },
      rightFoot: { x: 0.565, y: 0.9 },
      headWidth: 0.235,
      headHeight: 0.188,
      headRotation: -5,
      bodyWidth: 0.45,
      bodyHeight: 0.76
    }
  },
  male: {
    nt: {
      headTop: { x: 0.5, y: 0.06 },
      headCenter: { x: 0.5, y: 0.153 },
      leftEar: { x: 0.405, y: 0.156 },
      rightEar: { x: 0.595, y: 0.156 },
      neck: { x: 0.5, y: 0.25 },
      chest: { x: 0.5, y: 0.37 },
      waist: { x: 0.5, y: 0.525 },
      leftFoot: { x: 0.44, y: 0.91 },
      rightFoot: { x: 0.565, y: 0.91 },
      headWidth: 0.24,
      headHeight: 0.19,
      headRotation: -2,
      bodyWidth: 0.44,
      bodyHeight: 0.78
    },
    nf: {
      headTop: { x: 0.5, y: 0.063 },
      headCenter: { x: 0.5, y: 0.156 },
      leftEar: { x: 0.405, y: 0.158 },
      rightEar: { x: 0.595, y: 0.158 },
      neck: { x: 0.5, y: 0.252 },
      chest: { x: 0.5, y: 0.382 },
      waist: { x: 0.5, y: 0.535 },
      leftFoot: { x: 0.44, y: 0.91 },
      rightFoot: { x: 0.565, y: 0.91 },
      headWidth: 0.24,
      headHeight: 0.19,
      headRotation: -2,
      bodyWidth: 0.44,
      bodyHeight: 0.78
    },
    sj: {
      headTop: { x: 0.5, y: 0.057 },
      headCenter: { x: 0.5, y: 0.15 },
      leftEar: { x: 0.405, y: 0.153 },
      rightEar: { x: 0.595, y: 0.153 },
      neck: { x: 0.5, y: 0.246 },
      chest: { x: 0.5, y: 0.365 },
      waist: { x: 0.5, y: 0.52 },
      leftFoot: { x: 0.44, y: 0.91 },
      rightFoot: { x: 0.565, y: 0.91 },
      headWidth: 0.238,
      headHeight: 0.188,
      headRotation: -1,
      bodyWidth: 0.43,
      bodyHeight: 0.78
    },
    sp: {
      headTop: { x: 0.535, y: 0.062 },
      headCenter: { x: 0.535, y: 0.154 },
      leftEar: { x: 0.445, y: 0.156 },
      rightEar: { x: 0.625, y: 0.156 },
      neck: { x: 0.525, y: 0.25 },
      chest: { x: 0.515, y: 0.37 },
      waist: { x: 0.505, y: 0.515 },
      leftFoot: { x: 0.435, y: 0.9 },
      rightFoot: { x: 0.565, y: 0.9 },
      headWidth: 0.24,
      headHeight: 0.19,
      headRotation: -4,
      bodyWidth: 0.45,
      bodyHeight: 0.76
    }
  }
};

export const wearableItems: Record<Exclude<Accessory, "none">, WearableItem> = {
  ribbon: {
    id: "ribbon",
    category: "hat",
    src: "css:ribbon",
    targetAnchor: "leftEar",
    anchorX: 0.52,
    anchorY: 0.48,
    widthRatio: 0.58,
    visibleBounds: { x: 0.08, y: 0.11, width: 0.84, height: 0.79 },
    anchor: { x: 0.52, y: 0.48 },
    fit: {
      widthToHeadRatio: 0.58,
      offsetX: -0.06,
      offsetY: -0.06,
      rotation: -5
    },
    offsetX: -0.014,
    offsetY: -0.012,
    rotationOffset: -8,
    zIndex: 62,
    supportsLayering: false,
    characterOverrides: {
      "female-sp": { offsetX: -0.02, offsetY: -0.006, rotation: -3 },
      "male-sp": { offsetX: -0.018, offsetY: -0.006, rotation: -2 }
    }
  },
  beret: {
    id: "beret",
    category: "hat",
    src: "css:beret",
    targetAnchor: "headTop",
    anchorX: 0.5,
    anchorY: 0.78,
    widthRatio: 1.02,
    visibleBounds: { x: 0.05, y: 0.1, width: 0.87, height: 0.74 },
    anchor: { x: 0.5, y: 1 },
    fit: {
      widthToHeadRatio: 1.22,
      offsetX: -0.04,
      offsetY: 0.02,
      rotation: -3
    },
    offsetX: 0,
    offsetY: 0,
    rotationOffset: 0,
    zIndex: 58,
    supportsLayering: true,
    characterOverrides: {
      "female-nt": { offsetX: 0, offsetY: 0, scale: 1, rotation: 0 },
      "female-nf": { offsetX: 0, offsetY: 0.01, scale: 1 },
      "female-sj": { offsetX: 0.02, offsetY: 0, scale: 0.98, rotation: 1 },
      "female-sp": { offsetX: -0.04, offsetY: 0, scale: 1, rotation: -1 },
      "male-sp": { offsetX: -0.03, offsetY: 0, scale: 1, rotation: -1 }
    }
  },
  glasses: {
    id: "glasses",
    category: "glasses",
    src: "css:glasses",
    targetAnchor: "headCenter",
    anchorX: 0.5,
    anchorY: 0.48,
    widthRatio: 0.88,
    visibleBounds: { x: 0, y: 0.21, width: 1, height: 0.56 },
    anchor: { x: 0.5, y: 0.48 },
    fit: {
      widthToHeadRatio: 0.88,
      offsetX: 0,
      offsetY: 0.12,
      rotation: 0
    },
    offsetX: 0,
    offsetY: 0.022,
    rotationOffset: 0,
    zIndex: 72,
    supportsLayering: false,
    characterOverrides: {
      "female-sp": { offsetX: 0.005, offsetY: 0.018 },
      "male-sp": { offsetX: 0.004, offsetY: 0.018 }
    }
  },
  earring: {
    id: "earring",
    category: "earring",
    src: "css:earring",
    targetAnchor: "rightEar",
    anchorX: 0.5,
    anchorY: 0.5,
    widthRatio: 0.28,
    heightRatio: 0.7,
    visibleBounds: { x: 0.2, y: 0.05, width: 0.6, height: 0.9 },
    anchor: { x: 0.5, y: 0.5 },
    fit: {
      widthToHeadRatio: 0.24,
      offsetX: 0.36,
      offsetY: 0.12,
      rotation: 5
    },
    offsetX: 0,
    offsetY: 0,
    rotationOffset: 0,
    zIndex: 74,
    supportsLayering: false
  },
  necklace: {
    id: "necklace",
    category: "necklace",
    src: "css:necklace",
    targetAnchor: "chest",
    anchorX: 0.5,
    anchorY: 0.38,
    widthRatio: 0.28,
    heightRatio: 0.3,
    visibleBounds: { x: 0.1, y: 0.08, width: 0.8, height: 0.84 },
    anchor: { x: 0.5, y: 0.38 },
    fit: {
      widthToHeadRatio: 0.6,
      offsetX: 0,
      offsetY: 1.05,
      rotation: 0
    },
    offsetX: 0,
    offsetY: 0,
    rotationOffset: 0,
    zIndex: 63,
    supportsLayering: false
  }
};

export const outfitVisuals: Record<Outfit, OutfitVisual> = {
  "nt-oracle": {
    base: "#8d6bc5",
    soft: "#eee6ff",
    deep: "#4f327c",
    glow: "rgba(141, 107, 197, 0.28)",
    motif: "星盘",
    texture: "starlight",
    cut: "coat",
    note: "星盘刺绣和长外套感，适合冷静策划气质。"
  },
  "nt-lavender": {
    base: "#b29be0",
    soft: "#f4efff",
    deep: "#6d4c9c",
    glow: "rgba(178, 155, 224, 0.32)",
    motif: "学院",
    texture: "ribbon",
    cut: "dress",
    note: "薰衣草学院感，柔和但有聪明的书卷气。"
  },
  "nt-night": {
    base: "#6e559e",
    soft: "#e7e0ff",
    deep: "#382464",
    glow: "rgba(91, 69, 145, 0.3)",
    motif: "夜幕",
    texture: "starlight",
    cut: "cape",
    note: "紫夜短披肩感，让角色更神秘、疏离。"
  },
  "nt-crystal": {
    base: "#9f7ed6",
    soft: "#f0e9ff",
    deep: "#5d3c95",
    glow: "rgba(159, 126, 214, 0.3)",
    motif: "晶石",
    texture: "starlight",
    cut: "knit",
    note: "晶紫针织质感，更像温柔版理性小人。"
  },
  "nf-sage": {
    base: "#9fbd8e",
    soft: "#eef8e9",
    deep: "#577345",
    glow: "rgba(159, 189, 142, 0.28)",
    motif: "鼠尾草",
    texture: "petal",
    cut: "coat",
    note: "鼠尾草开衫感，温柔、克制、很会倾听。"
  },
  "nf-mint": {
    base: "#9fd6c2",
    soft: "#ecfbf5",
    deep: "#4d8c75",
    glow: "rgba(139, 210, 189, 0.3)",
    motif: "薄荷",
    texture: "petal",
    cut: "dress",
    note: "薄荷花边裙感，轻、软、带一点梦。"
  },
  "nf-forest": {
    base: "#6fa276",
    soft: "#e8f7eb",
    deep: "#365f3d",
    glow: "rgba(111, 162, 118, 0.28)",
    motif: "森林",
    texture: "petal",
    cut: "cape",
    note: "森林绿斗篷感，适合更安静、更有边界的类型。"
  },
  "nf-cream": {
    base: "#bdd6a6",
    soft: "#f7f9ea",
    deep: "#73884b",
    glow: "rgba(189, 214, 166, 0.3)",
    motif: "奶油叶",
    texture: "petal",
    cut: "knit",
    note: "奶油绿衬衣感，亲近、明亮、不会过分甜。"
  },
  "sj-blue": {
    base: "#8ab4dc",
    soft: "#edf6ff",
    deep: "#446d9b",
    glow: "rgba(138, 180, 220, 0.3)",
    motif: "晴蓝",
    texture: "ribbon",
    cut: "coat",
    note: "晴蓝制服感，干净、可靠、生活被整理好。"
  },
  "sj-navy": {
    base: "#496c9d",
    soft: "#e8f0ff",
    deep: "#263e6f",
    glow: "rgba(73, 108, 157, 0.28)",
    motif: "海军蓝",
    texture: "ribbon",
    cut: "knit",
    note: "海军蓝开衫感，稳重、清晰、很有秩序。"
  },
  "sj-ribbon": {
    base: "#9bbfe8",
    soft: "#f0f7ff",
    deep: "#557fb1",
    glow: "rgba(155, 191, 232, 0.32)",
    motif: "蓝白丝带",
    texture: "ribbon",
    cut: "dress",
    note: "蓝白丝带裙感，更甜、更会照顾氛围。"
  },
  "sj-check": {
    base: "#7fa9d8",
    soft: "#ebf5ff",
    deep: "#315f93",
    glow: "rgba(127, 169, 216, 0.28)",
    motif: "格纹",
    texture: "ribbon",
    cut: "coat",
    note: "浅蓝格纹装，带一点学院清单感。"
  },
  "sp-honey": {
    base: "#e9b34f",
    soft: "#fff5d8",
    deep: "#a26a1d",
    glow: "rgba(233, 179, 79, 0.3)",
    motif: "蜂蜜",
    texture: "sun",
    cut: "coat",
    note: "蜂蜜黄夹克感，行动力强但不粗糙。"
  },
  "sp-peach": {
    base: "#f2a15f",
    soft: "#fff0df",
    deep: "#b56328",
    glow: "rgba(242, 161, 95, 0.32)",
    motif: "蜜桃",
    texture: "sun",
    cut: "dress",
    note: "蜜桃橙短衫感，明亮、外放、很有现场感。"
  },
  "sp-sun": {
    base: "#f0c45c",
    soft: "#fff7d8",
    deep: "#a67922",
    glow: "rgba(240, 196, 92, 0.3)",
    motif: "暖阳",
    texture: "sun",
    cut: "cape",
    note: "暖阳连衣装，像随时准备出门晒太阳。"
  },
  "sp-spark": {
    base: "#f08b43",
    soft: "#fff0dc",
    deep: "#a84d18",
    glow: "rgba(240, 139, 67, 0.32)",
    motif: "橙黄火花",
    texture: "sun",
    cut: "knit",
    note: "橙黄活力装，更俏皮、更有舞台感。"
  }
};

export function getMbtiVisualGroup(type: MbtiType) {
  return mbtiVisualGroups[type];
}

export function getMbtiPersona(type: MbtiType) {
  return mbtiPersonas[type];
}

export function getMbtiStyleNote(type: MbtiType) {
  return mbtiStyleNotes[type];
}

export function getMbtiCharacterAsset(type: MbtiType) {
  return mbtiCharacterAssets[type];
}

export function getMbtiCharacterThumbnail(type: MbtiType) {
  return `/characters/mbti-v2/thumbs/${type.toLowerCase()}.webp`;
}

export function getCharacterAsset(type: MbtiType, _gender: Gender = "female") {
  return getMbtiCharacterAsset(type);
}

export function getCharacterImageSize(type: MbtiType, gender: Gender = "female") {
  return characterImageSizes[gender][getMbtiVisualGroup(type)];
}

export function getCharacterAssetKey(type: MbtiType, gender: Gender = "female"): CharacterAssetKey {
  return `${gender}-${getMbtiVisualGroup(type)}`;
}

export function getCharacterAnchors(type: MbtiType, gender: Gender = "female") {
  return characterAnchors[gender][getMbtiVisualGroup(type)];
}

export function getWearableForAccessory(accessory: Accessory) {
  if (accessory === "none") {
    return undefined;
  }

  return wearableItems[accessory];
}

export function getOutfitsForMbti(type: MbtiType) {
  const visualGroup = getMbtiVisualGroup(type);
  return outfits.filter((outfit) => outfit.visualGroup === visualGroup);
}

export function getDefaultOutfitForMbti(type: MbtiType): Outfit {
  return getOutfitsForMbti(type)[0].id;
}

export function getRecommendedOptionsForMbti(type: MbtiType): AvatarOptions {
  const persona = getMbtiPersona(type);
  const style = getMbtiStyleNote(type);

  return {
    hairStyle: persona.recommendedHair,
    hairColor: style.hairColor,
    eyeStyle: style.eyeStyle,
    expression: persona.defaultExpression,
    accessory: persona.recommendedAccessory,
    outfit: getDefaultOutfitForMbti(type),
    roomBackground: style.roomBackground
  };
}

export function isOutfitAllowedForMbti(type: MbtiType, outfit: Outfit) {
  return getOutfitsForMbti(type).some((item) => item.id === outfit);
}

export function getOutfitLabel(outfit: Outfit) {
  return outfits.find((item) => item.id === outfit)?.label ?? "族群服装";
}

export function getOutfitVisual(outfit: Outfit) {
  return outfitVisuals[outfit];
}
