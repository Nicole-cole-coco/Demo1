"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { companionList, getCompanionCatalogProfile } from "@/lib/companionCatalog";
import type { MbtiType } from "@/types/avatar";
import type { CompanionGender } from "@/types/companion";
import { getCompanionAvatar } from "@/types/companion";

const groupStyles = {
  analyst: {
    theme: "persona-theme-analyst",
    line: "bg-[var(--energy-purple)]",
    selected: "border-violet-300/60 shadow-[0_0_30px_rgba(176,144,220,0.24)]",
    label: "幻想深空",
    description: "洞察、推演与隐藏在秩序背后的可能性"
  },
  diplomat: {
    theme: "persona-theme-diplomat",
    line: "bg-[var(--energy-green)]",
    selected: "border-emerald-300/60 shadow-[0_0_30px_rgba(121,200,151,0.22)]",
    label: "成长森林",
    description: "理解、连接与缓慢发生的内在生长"
  },
  sentinel: {
    theme: "persona-theme-sentinel",
    line: "bg-[var(--energy-blue)]",
    selected: "border-sky-300/60 shadow-[0_0_30px_rgba(116,169,238,0.24)]",
    label: "理性星域",
    description: "稳定、责任与让生活可靠运转的力量"
  },
  explorer: {
    theme: "persona-theme-explorer",
    line: "bg-[var(--energy-yellow)]",
    selected: "border-amber-300/60 shadow-[0_0_30px_rgba(240,196,109,0.2)]",
    label: "探索光芒",
    description: "行动、体验与回应当下世界的热情"
  }
} as const;

const groupOrder = ["analyst", "diplomat", "sentinel", "explorer"] as const;

export default function HomePersonaGrid() {
  const [gender, setGender] = useState<CompanionGender>("female");
  const [selectedMbti, setSelectedMbti] = useState<MbtiType>("INTJ");
  const selectedProfile = getCompanionCatalogProfile(selectedMbti);
  const selectedStyle = groupStyles[selectedProfile.group];

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 border-b border-white/15 pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="v3-kicker">16 位人格旅伴</p>
          <h2 className="v3-title mt-2 text-2xl sm:text-3xl">在星图中选择一次相遇</h2>
          <p className="v3-muted mt-2 max-w-2xl text-sm">
            点击角色节点，聆听他们不同的思考方式。每一段聊天都会独立保留，等待下一次相遇。
          </p>
        </div>

        <div className="inline-grid w-fit grid-cols-2 rounded-md border border-white/15 bg-white/5 p-1 shadow-sm" aria-label="头像性别">
          {(["female", "male"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setGender(option)}
              aria-pressed={gender === option}
              className={`h-9 min-w-20 rounded px-4 text-sm font-bold transition ${
                gender === option
                  ? "bg-white/14 text-white shadow-sm"
                  : "text-[var(--ink-soft)] hover:bg-white/7 hover:text-white"
              }`}
            >
              {option === "female" ? "女性形象" : "男性形象"}
            </button>
          ))}
        </div>
      </div>

      <section className={`universe-glass ${selectedStyle.theme} mt-7 overflow-hidden rounded-lg`}>
        <div key={`${selectedMbti}-${gender}`} className="v3-enter grid min-h-[390px] lg:grid-cols-[0.88fr_1.12fr]">
          <div className="relative min-h-[330px] overflow-hidden bg-[linear-gradient(145deg,var(--persona-glow),rgba(8,10,20,0.35))]">
            <div className="absolute inset-x-12 bottom-7 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" aria-hidden="true" />
            <Image
              src={getCompanionAvatar(selectedMbti, gender)}
              alt={`${selectedMbti} ${selectedProfile.universeTitle}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 44vw"
              className="universe-avatar object-cover object-center drop-shadow-[0_24px_32px_rgba(0,0,0,0.32)]"
            />
          </div>

          <div className="flex flex-col justify-center border-t border-white/10 p-6 sm:p-9 lg:border-l lg:border-t-0">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-bold text-[var(--persona-accent)]">{selectedStyle.label}</span>
              <span className="h-px w-12 bg-[var(--persona-accent)] opacity-60" />
              <span className="text-xs text-[var(--ink-faint)]">{selectedProfile.groupLabel}</span>
            </div>
            <div className="mt-5 flex items-end gap-3">
              <strong className="text-4xl font-semibold text-white sm:text-5xl">{selectedMbti}</strong>
              <span className="pb-1 text-sm font-semibold text-[var(--ink-soft)]">{selectedProfile.title}</span>
            </div>
            <h3 className="mt-4 text-2xl font-semibold text-[var(--ink)]">「{selectedProfile.universeTitle}」</h3>
            <p className="v3-muted mt-5 max-w-xl text-base">{selectedProfile.summary}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {selectedProfile.tags.map((tag) => <span key={tag} className="v3-chip">{tag}</span>)}
            </div>
            <div className="mt-7 flex flex-wrap gap-3 border-t border-white/10 pt-6">
              <Link href={`/companion?mbti=${selectedMbti}&gender=${gender}`} className="v3-button-primary">
                与 {selectedMbti} 相遇
              </Link>
              <Link href={`/lab?mbti=${selectedMbti}&gender=${gender}`} className="v3-button-secondary">
                进入关系剧情
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-12 space-y-14" aria-label="16 型人格星图">
        {groupOrder.map((group) => {
          const style = groupStyles[group];
          const profiles = companionList.filter((profile) => profile.group === group);

          return (
            <section key={group} className={`energy-zone ${style.theme} py-6 sm:py-8`}>
              <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                <div>
                  <div className="flex items-center gap-3">
                    <span className={`h-0.5 w-9 ${style.line}`} aria-hidden="true" />
                    <p className="text-xs font-bold text-[var(--persona-accent)]">人格能量 · 0{groupOrder.indexOf(group) + 1}</p>
                  </div>
                  <h3 className="mt-2 text-xl font-semibold text-white sm:text-2xl">{style.label}</h3>
                </div>
                <p className="max-w-md text-sm leading-6 text-[var(--ink-soft)]">{style.description}</p>
              </div>

              <div className="mobile-snap-row -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-5 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
                {profiles.map((profile) => {
                  const selected = profile.mbti === selectedMbti;
                  return (
                    <article
                      key={profile.mbti}
                      data-selected={selected}
                      className="persona-story-card group w-[78vw] shrink-0 sm:w-auto"
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedMbti(profile.mbti)}
                        aria-pressed={selected}
                        className="block w-full text-left"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
                          <Image
                            src={getCompanionAvatar(profile.mbti, gender)}
                            alt={`${profile.mbti} ${profile.universeTitle}`}
                            fill
                            sizes="(max-width: 640px) 78vw, (max-width: 1024px) 46vw, 23vw"
                            className={`object-cover transition duration-500 group-hover:scale-[1.05] ${selected ? "scale-[1.025]" : ""}`}
                          />
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#080a14] via-[#080a14]/60 to-transparent px-4 pb-3 pt-14">
                            <p className="text-xl font-bold text-white">{profile.mbti}</p>
                            <p className="text-sm font-semibold text-white/80">「{profile.universeTitle}」</p>
                          </div>
                        </div>
                        <div className="min-h-36 px-4 py-4">
                          <div className="flex flex-wrap gap-1.5">
                            {profile.tags.slice(0, 3).map((tag) => <span key={tag} className="v3-chip">{tag}</span>)}
                          </div>
                          <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--ink-soft)]">{profile.summary}</p>
                        </div>
                      </button>
                      <div className="grid grid-cols-2 border-t border-white/10">
                        <Link
                          href={`/companion?mbti=${profile.mbti}&gender=${gender}`}
                          className="flex min-h-11 items-center justify-center text-xs font-bold text-[var(--persona-accent)] hover:bg-white/7"
                        >
                          开始交流
                        </Link>
                        <Link
                          href={`/lab?mbti=${profile.mbti}&gender=${gender}`}
                          className="flex min-h-11 items-center justify-center border-l border-white/10 text-xs font-bold text-[var(--ink-soft)] hover:bg-white/7 hover:text-white"
                        >
                          进入剧情
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
