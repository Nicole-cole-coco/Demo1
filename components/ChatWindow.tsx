"use client";

import Image from "next/image";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { ChatService } from "@/lib/chatService";
import { chatScenarios } from "@/lib/chatScenarios";
import { getCompanionCatalogProfile } from "@/lib/companionCatalog";
import { getPersonaDefinition } from "@/lib/personas";
import { useExplorationStore } from "@/store/explorationStore";
import type { MbtiType } from "@/types/avatar";
import type { ChatEmotion, ChatResponseMode } from "@/types/chat";
import type { ChatScenarioId } from "@/types/companion";

type ChatWindowProps = {
  onSwitchCompanion: () => void;
};

export default function ChatWindow({ onSwitchCompanion }: ChatWindowProps) {
  const [input, setInput] = useState("");
  const [pendingMbti, setPendingMbti] = useState<MbtiType | null>(null);
  const [responseMode, setResponseMode] = useState<ChatResponseMode | null>(null);
  const [companionEmotion, setCompanionEmotion] = useState<ChatEmotion>("calm");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const selectedCompanion = useExplorationStore((state) => state.selectedCompanion);
  const userMbti = useExplorationStore((state) => state.userProfile.selfMbti);
  const messages = useExplorationStore((state) => state.getMessages(state.selectedCompanion.mbti));
  const activeScenario = useExplorationStore((state) => state.activeScenarioByMbti[state.selectedCompanion.mbti] ?? null);
  const setActiveScenario = useExplorationStore((state) => state.setActiveScenario);
  const addUserMessage = useExplorationStore((state) => state.addUserMessage);
  const addAssistantMessage = useExplorationStore((state) => state.addAssistantMessage);
  const clearChat = useExplorationStore((state) => state.clearChat);
  const personaProfile = getCompanionCatalogProfile(selectedCompanion.mbti);
  const activePending = pendingMbti === selectedCompanion.mbti;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, activePending, selectedCompanion.mbti]);

  useEffect(() => {
    setResponseMode(null);
    setCompanionEmotion("calm");
    setSuggestions([]);
    setInput("");
  }, [selectedCompanion.mbti]);

  const sendMessage = async (content: string, scenario: ChatScenarioId | null = activeScenario) => {
    const trimmed = content.trim();
    if (!trimmed || pendingMbti) return;

    const requestCompanion = selectedCompanion;
    const requestMbti = requestCompanion.mbti;
    const history = messages.slice(-12).map((message) => ({
      role: message.role,
      content: message.content
    }));
    const personaDefinition = getPersonaDefinition(requestMbti);

    setInput("");
    setPendingMbti(requestMbti);
    setActiveScenario(requestMbti, scenario);
    addUserMessage(requestMbti, trimmed);

    try {
      const data = await ChatService.send({
        mbti: requestMbti,
        gender: requestCompanion.gender,
        personaDefinition,
        userMbti,
        conversationHistory: history,
        userMessage: trimmed,
        scenario
      });
      addAssistantMessage(requestMbti, data.reply);
      if (useExplorationStore.getState().selectedCompanion.mbti === requestMbti) {
        setResponseMode(data.mode);
        setCompanionEmotion(data.emotion);
        setSuggestions(data.suggestions);
      }
    } catch {
      addAssistantMessage(requestMbti, "刚才连接没有成功，但你的消息已经保存在本地。稍后再试一次，我们可以从这里继续。");
    } finally {
      setPendingMbti(null);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(input);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage(input);
    }
  };

  const handleScenario = (scenarioId: ChatScenarioId, prompt: string) => {
    void sendMessage(prompt, scenarioId);
  };

  return (
    <section className="universe-glass -mx-4 flex h-[calc(100svh-var(--nav-height))] min-h-0 flex-col overflow-hidden border-x-0 sm:mx-0 sm:h-[calc(100svh-6rem)] sm:rounded-lg sm:border-x lg:h-[calc(100vh-7.5rem)] lg:min-h-[42rem]">
      <header className="border-b border-white/10 bg-[linear-gradient(105deg,var(--persona-soft),rgba(12,14,27,0.78)_58%)] px-3 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-white/20 bg-white/5 shadow-sm ${activePending ? "shadow-[0_0_24px_var(--persona-accent)]" : ""}`}>
              <Image src={selectedCompanion.avatar} alt="" fill sizes="48px" className={`${activePending ? "universe-avatar-thinking" : "universe-avatar"} object-cover`} />
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-sm font-bold text-[var(--ink)]">{selectedCompanion.mbti} · {personaProfile.title}</h2>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-[var(--ink-soft)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--persona-accent)]" />
                {activePending
                  ? "正在认真想你的话"
                  : responseMode === "safety"
                    ? "温柔支持中"
                    : ({ calm: "安静陪伴", curious: "好奇倾听", supportive: "认真接住你", focused: "一起理清思路", energized: "被你的分享点亮" } as const)[companionEmotion]}
              </p>
              <div className="mt-2 hidden flex-wrap gap-1.5 sm:flex">
                {personaProfile.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="rounded bg-white/7 px-2 py-1 text-[10px] font-semibold text-[var(--persona-accent)]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={onSwitchCompanion}
              className="v3-button-secondary min-h-10 px-2.5 py-2 text-xs sm:px-3"
            >
              <span className="sm:hidden">切换</span><span className="hidden sm:inline">切换人格</span>
            </button>
            <button
              type="button"
              onClick={() => {
                clearChat(selectedCompanion.mbti);
                setResponseMode(null);
              }}
              className="min-h-10 rounded border border-white/10 bg-white/5 px-2.5 py-2 text-xs font-semibold text-[var(--ink-soft)] hover:border-white/25 hover:bg-white/10 hover:text-white sm:px-3"
            >
              <span className="sm:hidden">清空</span><span className="hidden sm:inline">清空记录</span>
            </button>
          </div>
        </div>
        <div className="mobile-snap-row mt-3 flex snap-x gap-2 overflow-x-auto pb-1 sm:mt-4" aria-label="快捷情景">
          {chatScenarios.map((scenario) => (
            <button
              key={scenario.id}
              type="button"
              disabled={Boolean(pendingMbti)}
              onClick={() => handleScenario(scenario.id, scenario.prompt)}
              className={`shrink-0 rounded border px-3 py-2 text-xs font-semibold transition disabled:opacity-50 ${
                activeScenario === scenario.id
                  ? "border-[var(--persona-accent)] bg-[var(--persona-soft)] text-[var(--persona-accent)]"
                  : "border-white/10 bg-white/5 text-[var(--ink-soft)] hover:border-white/25 hover:bg-white/10"
              }`}
              title={scenario.label}
            >
              {scenario.shortLabel}
            </button>
          ))}
        </div>
      </header>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-[linear-gradient(180deg,rgba(8,10,20,0.2),rgba(8,10,20,0.56))] px-3 py-5 sm:space-y-5 sm:px-6 sm:py-6">
        {messages.map((message) => {
          const isUser = message.role === "user";
          return (
            <div key={message.id} className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
              {!isUser && (
                <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-md border border-white/15 bg-white/5 shadow-sm">
                  <Image src={selectedCompanion.avatar} alt="" fill sizes="32px" className="object-cover" />
                </div>
              )}
              <div
                className={`max-w-[88%] whitespace-pre-wrap rounded-lg px-3.5 py-2.5 text-sm leading-7 shadow-sm sm:max-w-[72%] sm:px-4 sm:py-3 ${
                  isUser
                    ? "border border-white/10 bg-[linear-gradient(135deg,var(--persona-deep),rgba(75,67,101,0.9))] text-white shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
                    : "border border-white/12 border-l-[3px] border-l-[var(--persona-accent)] bg-[rgba(27,29,47,0.72)] text-[var(--ink)] shadow-[0_12px_30px_rgba(0,0,0,0.18)] backdrop-blur-md"
                }`}
              >
                {message.content}
              </div>
            </div>
          );
        })}
        {activePending && (
          <div className="flex items-end gap-2">
            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-md border border-[var(--persona-accent)] bg-white/5 shadow-[0_0_20px_var(--persona-glow)]">
              <Image src={selectedCompanion.avatar} alt="" fill sizes="32px" className="universe-avatar-thinking object-cover" />
            </div>
            <div className="flex min-h-11 items-center gap-2 rounded-lg border border-white/12 border-l-[3px] border-l-[var(--persona-accent)] bg-[rgba(27,29,47,0.74)] px-4 py-3 shadow-sm backdrop-blur-md" aria-label={`${selectedCompanion.mbti} 正在回应`}>
              <span className="chat-typing-dot" />
              <span className="chat-typing-dot" />
              <span className="chat-typing-dot" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="app-safe-bottom border-t border-white/10 bg-[rgba(10,12,24,0.82)] p-3 backdrop-blur-xl sm:p-4">
        {suggestions.length > 0 && !activePending && (
          <div className="mobile-snap-row mb-2 flex snap-x gap-2 overflow-x-auto pb-1" aria-label="继续聊天建议">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setInput(suggestion)}
                className="min-h-9 shrink-0 snap-start rounded border border-white/10 bg-white/5 px-3 text-xs font-semibold text-[var(--ink-soft)] hover:border-[var(--persona-accent)] hover:text-white"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-end gap-2 sm:gap-3">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value.slice(0, 2000))}
            onKeyDown={handleKeyDown}
            placeholder={`和 ${selectedCompanion.mbti} 聊聊一个具体问题...`}
            rows={1}
            className="max-h-32 min-h-12 flex-1 resize-y rounded-md border border-white/15 bg-white/6 px-3.5 py-3 text-sm leading-6 text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-faint)] focus:border-[var(--persona-accent)] focus:bg-white/9 focus:ring-4 focus:ring-[var(--persona-glow)] sm:min-h-14 sm:px-4"
          />
          <button
            type="submit"
            disabled={Boolean(pendingMbti) || !input.trim()}
            aria-label="发送消息"
            title="发送"
            className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-[var(--persona-deep)] text-xl font-bold text-white shadow-[0_8px_20px_var(--persona-glow)] transition hover:-translate-y-0.5 hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-[var(--persona-glow)] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30 disabled:shadow-none sm:h-14 sm:w-14"
          >
            ↑
          </button>
        </div>
      </form>
    </section>
  );
}
