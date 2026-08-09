"use client";

import Image from "next/image";
import { companionList, getCompanionCatalogProfile } from "@/lib/companionCatalog";
import type { MbtiType } from "@/types/avatar";
import type { CompanionGender } from "@/types/companion";
import { getCompanionAvatar } from "@/types/companion";

const groupPresentation = {
  analyst: { label: "幻想深空", theme: "persona-theme-analyst" },
  diplomat: { label: "成长森林", theme: "persona-theme-diplomat" },
  sentinel: { label: "理性星域", theme: "persona-theme-sentinel" },
  explorer: { label: "探索光芒", theme: "persona-theme-explorer" }
} as const;

const groupOrder = ["analyst", "diplomat", "sentinel", "explorer"] as const;

type PersonaSelectorProps = {
  selectedMbti: MbtiType;
  selectedGender: CompanionGender;
  onSelect: (mbti: MbtiType) => void;
  onGenderChange: (gender: CompanionGender) => void;
  compact?: boolean;
};

export default function PersonaSelector({
  selectedMbti,
  selectedGender,
  onSelect,
  onGenderChange,
  compact = false
}: PersonaSelectorProps) {
  const selectedProfile = getCompanionCatalogProfile(selectedMbti);

  return (
    <section className={`universe-glass ${groupPresentation[selectedProfile.group].theme} overflow-hidden rounded-lg`}>
      <div className="border-b border-[var(--line)] px-4 py-4 pr-14 sm:px-5 sm:py-5 sm:pr-16">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-white/20 bg-[var(--persona-soft)]">
              <Image
                src={getCompanionAvatar(selectedMbti, selectedGender)}
                alt=""
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="v3-kicker">人格图鉴 · {groupPresentation[selectedProfile.group].label}</p>
              <h2 className="mt-1 truncate text-lg font-semibold text-[var(--ink)]">{selectedMbti} · {selectedProfile.universeTitle}</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 overflow-hidden rounded-md border border-[var(--line)] bg-[var(--surface-muted)] p-1">
            {(["female", "male"] as const).map((gender) => (
              <button
                key={gender}
                type="button"
                onClick={() => onGenderChange(gender)}
                className={`h-8 px-3 text-xs font-bold transition ${
                  selectedGender === gender
                    ? "bg-white/14 text-white shadow-sm"
                    : "text-[var(--ink-soft)] hover:text-[var(--ink)]"
                }`}
              >
                {gender === "female" ? "女性" : "男性"}
              </button>
            ))}
          </div>
        </div>
        {!compact && <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--ink-soft)]">{selectedProfile.summary}</p>}
      </div>

      <div className="max-h-[62vh] overflow-y-auto">
        {groupOrder.map((group) => (
          <section key={group} className={`energy-zone ${groupPresentation[group].theme} p-3 sm:p-5`}>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-[var(--persona-accent)]">{groupPresentation[group].label}</h3>
              <span className="text-[10px] font-semibold text-[var(--ink-faint)]">4 位人格伙伴</span>
            </div>
            <div className={`grid gap-2 ${compact ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-2 sm:grid-cols-4"}`}>
              {companionList.filter((profile) => profile.group === group).map((profile) => {
                const selected = profile.mbti === selectedMbti;
                return (
                  <button
                    key={profile.mbti}
                    type="button"
                    onClick={() => onSelect(profile.mbti)}
                    aria-pressed={selected}
                    className="persona-story-card group p-2 text-left"
                    data-selected={selected}
                  >
                    <div className="flex items-center gap-2">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-white/20 bg-white/5 sm:h-14 sm:w-14">
                        <Image
                          src={getCompanionAvatar(profile.mbti, selectedGender)}
                          alt={`${profile.mbti} ${profile.title}`}
                          fill
                          sizes="56px"
                          className="object-cover transition duration-500 group-hover:scale-[1.06]"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-white">{profile.mbti}</p>
                        <p className="truncate text-[11px] text-[var(--ink-soft)]">{profile.universeTitle}</p>
                      </div>
                    </div>
                    {!compact && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {profile.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="rounded bg-white/7 px-1.5 py-0.5 text-[10px] font-semibold text-[var(--persona-accent)]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
