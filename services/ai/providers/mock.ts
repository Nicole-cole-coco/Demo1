import type { MbtiType } from "@/types/avatar";
import type {
  ChatMessage,
  LLMProvider,
  ProviderChatOptions,
  ProviderChatResult
} from "@/services/ai/types";

type MockVoice = {
  emotion: string;
  task: string;
  daily: string;
};

const voices: Record<MbtiType, MockVoice> = {
  INTJ: {
    emotion: "……这件事不像一句‘想开点’就能过去。先别急着修好它，你现在最难受的是哪一部分？",
    task: "我先说一个判断：问题未必是你不够努力，更像是优先级互相打架了。把最不能失去的那一项告诉我。",
    daily: "嗯，这个细节我会记住。它看起来很小，但通常真正影响一天心情的，反而就是这种事。后来呢？"
  },
  INTP: {
    emotion: "我刚才差点直接去分析原因。换个说法吧：这听起来确实很不好受，而且你可能已经自己想过很多遍了。",
    task: "也许不是能力问题，而是目前的解法默认了一个错误前提。我们只挑最可疑的那个前提看看？",
    daily: "这件事有点意思，尤其是那个反常的小地方。我不确定自己有没有猜对，你当时第一反应是什么？"
  },
  ENTJ: {
    emotion: "我能听出你已经撑了一阵子。方案可以晚一点谈，先告诉我：现在最让你受不了的到底是什么？",
    task: "先抓核心。目标、限制、下一步里，一定有一个目前还没说清；把它找出来，事情会快很多。",
    daily: "好，我大概看见现场了。你真正想做的是继续推进，还是先把这口气顺下来？"
  },
  ENTP: {
    emotion: "我本来想讲另一个角度，但现在抛观点可能挺烦的。先说真的：你被这件事刺到了，对吧？",
    task: "等等，或许我们一直在回答错的问题。要是把现在默认不能改的那一项翻过来，会发生什么？",
    daily: "这发展比我预想的有趣。别急着给它定性，我更想知道中间那个转折是怎么发生的。"
  },
  INFJ: {
    emotion: "你说得很平静，可这件事听起来并不轻。是不是有一部分失望，你到现在都还没真正说出来？",
    task: "眼前当然有事要处理，不过我更在意它为什么让你反复卡住。这里可能碰到了一个很重要的需要。",
    daily: "我听见的不只是事情本身，还有你说到那个瞬间时语气的变化。那一刻对你意味着什么？"
  },
  INFP: {
    emotion: "我不是想把它说得更严重，只是……那一瞬间，你大概真的觉得自己没有被看见。",
    task: "现实办法要找，但别急着把最在意的部分删掉。我们能不能先守住一个你不想背叛的东西？",
    daily: "这个画面很具体，我好像能理解你为什么一直记着。它让你开心，还是有一点说不清的遗憾？"
  },
  ENFJ: {
    emotion: "先不用照顾别人会怎么想。你已经替所有人考虑得够多了，现在轮到你说自己需要什么。",
    task: "我们可以一起理顺，不过别把所有责任又揽到你身上。哪一步应该由对方回应？",
    daily: "听起来你今天经历了不少。先不总结，我想知道其中哪一个瞬间最留在你心里。"
  },
  ENFP: {
    emotion: "其实我一开始有点替你生气。不是说一定谁错了，只是你当时好像真的被晾在了原地。",
    task: "我一下想到好几个可能，不过先收一收。现在最让你有一点期待的那个方向，是哪一个？",
    daily: "等一下，这件事很有画面感。你继续说，我想知道后来有没有出现一个完全没料到的转折。"
  },
  ISTJ: {
    emotion: "你已经把事情讲得很克制了，但不代表影响很小。哪一个具体承诺没有被做到？",
    task: "先按发生顺序看，会比较清楚。当前最需要确认的是事实、责任，还是新的时间点？",
    daily: "我记下这个细节了。它和你原本预期的不太一样，所以才会一直挂在心上吧。"
  },
  ISFJ: {
    emotion: "你可能已经忍了一会儿，才把这句话说出来。先别急着说自己没事，我在听。",
    task: "可以慢慢处理，但别再默认由你一个人补上所有空缺。这里谁应该和你一起承担？",
    daily: "这种小事很容易被别人略过，可它确实会改变一天的感受。你后来有好好休息一下吗？"
  },
  ESTJ: {
    emotion: "我不想拿一句安慰敷衍你。影响已经发生了，先把最让你不舒服的那一点说清楚。",
    task: "目前缺的不是更多想法，是一个明确下一步。谁做、做到什么程度、什么时候确认？",
    daily: "好，这件事我听明白了。你现在想把它处理掉，还是只是想先把经过说完？"
  },
  ESFJ: {
    emotion: "听到这里，我有点心疼你当时还要装作没关系。那个人后来有发现你的失落吗？",
    task: "事情要推进，关系里的回应也不能一直欠着。你希望对方具体做什么，才会觉得自己没有被落下？",
    daily: "这个瞬间听起来很真实，我能想象你当时的表情。后来你有跟谁分享吗？"
  },
  ISTP: {
    emotion: "这事挺堵的。你不用现在把所有感受讲完整，先说最直接的那一个就行。",
    task: "先别铺太大。找一个今天就能试、失败成本也不高的动作，看反馈再决定。",
    daily: "嗯，我大概懂了。中间那个具体细节比较关键，你当时做了什么？"
  },
  ISFP: {
    emotion: "……我不知道这样说会不会太直接，但那一刻你应该很不舒服。你不用马上把它解释合理。",
    task: "办法可以慢一点。先确认哪一种选择不会让你一直勉强自己，再看现实怎么调整。",
    daily: "这件小事的感觉很特别。比起别人怎么评价，我更想知道你自己当时喜不喜欢。"
  },
  ESTP: {
    emotion: "我听到了。先不绕弯，这件事确实让你受伤了。你现在想当面说开，还是先缓一下？",
    task: "先做一个能拿到真实反馈的动作，但把风险底线定清楚。你最多能承受哪种结果？",
    daily: "这现场听着挺有意思。要是我在，大概会先看接下来能做什么；你当时怎么反应的？"
  },
  ESFP: {
    emotion: "我刚才还想把气氛拉轻一点，但算了，这次先不急。你难受的部分值得好好待一会儿。",
    task: "我们可以找办法，不过不用把今天变成任务清单。先挑一个能让你重新有点力气的小动作。",
    daily: "你一说这个，我脑子里立刻有画面了。那个瞬间应该挺难忘的吧，后来发生什么了？"
  }
};

function lastUserMessages(messages: readonly ChatMessage[]) {
  return messages.filter((message) => message.role === "user").slice(-2);
}

function inferKind(message: string) {
  if (/难过|焦虑|委屈|失望|失落|伤心|沮丧|孤独|生气|烦|累|崩溃|吵架|分手|害怕/.test(message)) return "emotion";
  if (/工作|学习|考试|计划|方案|选择|职业|项目|目标|怎么办|怎么做/.test(message)) return "task";
  return "daily";
}

function continuityLine(messages: readonly ChatMessage[]) {
  const userMessages = lastUserMessages(messages);
  if (userMessages.length < 2) return "";
  const previous = userMessages[0].content.replace(/\s+/g, " ").slice(0, 22);
  if (!previous) return "";
  return `你前面说到“${previous}${userMessages[0].content.length > 22 ? "…" : ""}”，现在这件事听起来像是接在那后面。\n\n`;
}

export class MockProvider implements LLMProvider {
  readonly id = "mock";
  readonly model = "mock-persona-natural";

  async chat(messages: readonly ChatMessage[], options: ProviderChatOptions): Promise<ProviderChatResult> {
    if (options.fallbackReply) {
      return { reply: options.fallbackReply, model: this.model };
    }

    const current = lastUserMessages(messages).at(-1)?.content ?? "";
    const kind = inferKind(current);
    const voice = voices[options.mbti][kind];
    const continuity = continuityLine(messages);
    return { reply: `${continuity}${voice}`.trim(), model: this.model };
  }
}
