"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ChatWindow from "@/components/ChatWindow";
import PersonaSelector from "@/components/PersonaSelector";
import { companionList, getCompanionCatalogProfile } from "@/lib/companionCatalog";
import { useExplorationStore } from "@/store/explorationStore";
import { mbtiTypes, type MbtiType } from "@/types/avatar";
import type { CompanionGender } from "@/types/companion";

const validMbti = new Set<MbtiType>(mbtiTypes);

const themeClass = {
  analyst: "persona-theme-analyst",
  diplomat: "persona-theme-diplomat",
  sentinel: "persona-theme-sentinel",
  explorer: "persona-theme-explorer"
} as const;

const backdropClass: Partial<Record<MbtiType, string>> = {
  INTJ: "chat-backdrop-intj",
  INFP: "chat-backdrop-infp",
  ENFP: "chat-backdrop-enfp",
  ENTJ: "chat-backdrop-entj"
};

const groupBackdropClass = {
  analyst: "chat-backdrop-analyst",
  diplomat: "chat-backdrop-diplomat",
  sentinel: "chat-backdrop-sentinel",
  explorer: "chat-backdrop-explorer"
} as const;

export default function ChatExperience() {
  const [mounted, setMounted] = useState(false);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedCompanion = useExplorationStore((state) => state.selectedCompanion);
  const chatHistory = useExplorationStore((state) => state.chatHistory);
  const selectCompanion = useExplorationStore((state) => state.selectCompanion);
  const setCompanionGender = useExplorationStore((state) => state.setCompanionGender);
  const selectedProfile = getCompanionCatalogProfile(selectedCompanion.mbti);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!selectorOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectorOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectorOpen]);

  useEffect(() => {
    const mbtiParam = searchParams.get("mbti")?.toUpperCase();
    const genderParam = searchParams.get("gender");
    if (mbtiParam && validMbti.has(mbtiParam as MbtiType)) {
      const gender: CompanionGender | undefined =
        genderParam === "female" || genderParam === "male" ? genderParam : undefined;
      selectCompanion(mbtiParam as MbtiType, gender);
    }
  }, [searchParams, selectCompanion]);

  const messageCountByMbti = useMemo(() => {
    return companionList.reduce<Partial<Record<MbtiType, number>>>((acc, profile) => {
      acc[profile.mbti] =
        chatHistory[profile.mbti]?.filter(
          (message) => message.role !== "assistant" || !message.id.startsWith("starter-")
        ).length ?? 0;
      return acc;
    }, {});
  }, [chatHistory]);

  const handleSelect = (mbti: MbtiType) => {
    selectCompanion(mbti);
    const params = new URLSearchParams(searchParams.toString());
    params.set("mbti", mbti);
    params.set("gender", selectedCompanion.gender);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    setSelectorOpen(false);
  };

  const handleGenderChange = (gender: CompanionGender) => {
    setCompanionGender(gender);
    const params = new URLSearchParams(searchParams.toString());
    params.set("mbti", selectedCompanion.mbti);
    params.set("gender", gender);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  if (!mounted) return <main className="v3-page" />;

  return (
    <main className={`v3-page persona-universe persona-atmosphere chat-space ${themeClass[selectedProfile.group]} ${backdropClass[selectedCompanion.mbti] ?? groupBackdropClass[selectedProfile.group]}`}>
      <div className="v3-shell grid gap-5 py-0 sm:py-4 lg:grid-cols-[19rem_minmax(0,1fr)] lg:py-7">
        <aside className="hidden space-y-4 lg:sticky lg:top-24 lg:block lg:self-start">
          <section className="universe-glass overflow-hidden rounded-lg">
            <div className="relative aspect-[5/4] overflow-hidden bg-[var(--persona-soft)]">
              <Image
                src={selectedCompanion.avatar}
                alt={`${selectedCompanion.mbti} ${selectedProfile.title}`}
                fill
                priority
                sizes="304px"
                className="universe-avatar object-cover transition duration-500 hover:scale-[1.025]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/35 to-transparent px-5 pb-4 pt-16 text-white">
                <div className="flex items-center gap-2 text-xs font-semibold text-white/80">
                  <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_0_4px_rgba(110,231,183,0.16)]" />
                  人格伙伴在线
                </div>
                <h1 className="mt-2 text-2xl font-semibold">{selectedCompanion.mbti} · {selectedProfile.title}</h1>
                <p className="text-sm font-semibold text-white/80">「{selectedProfile.universeTitle}」</p>
              </div>
            </div>

            <div className="p-5">
              <p className="text-sm leading-7 text-[var(--ink-soft)]">{selectedProfile.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedProfile.tags.map((tag) => (
                  <span
                    key={tag}
                    className="v3-chip border-[color:var(--persona-glow)] bg-[var(--persona-soft)] text-[var(--persona-accent)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between border-y border-white/10 py-3 text-xs text-[var(--ink-soft)]">
                <span>{selectedCompanion.gender === "female" ? "女性形象" : "男性形象"}</span>
                <span><strong className="text-[var(--ink)]">{messageCountByMbti[selectedCompanion.mbti] ?? 0}</strong> 条交流</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectorOpen(true)}
                className="v3-button-secondary mt-3 w-full"
              >
                切换人格或头像
              </button>
            </div>
          </section>

          <Link href="/" className="v3-button-secondary w-full">
            回到人格宇宙
          </Link>
        </aside>

        <ChatWindow onSwitchCompanion={() => setSelectorOpen(true)} />
      </div>

      {selectorOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          onMouseDown={() => setSelectorOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="选择人格角色与头像"
            className="relative max-h-[calc(100svh-4rem)] w-full max-w-5xl overflow-y-auto sm:max-h-[88vh]"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectorOpen(false)}
              aria-label="关闭人格选择"
              title="关闭"
              className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-md border border-white/15 bg-[#141626] text-xl text-[var(--ink-soft)] shadow-sm transition hover:bg-white/10 hover:text-white"
            >
              ×
            </button>
            <PersonaSelector
              selectedMbti={selectedCompanion.mbti}
              selectedGender={selectedCompanion.gender}
              onSelect={handleSelect}
              onGenderChange={handleGenderChange}
            />
          </div>
        </div>
      )}
    </main>
  );
}
