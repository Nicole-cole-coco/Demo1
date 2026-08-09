"use client";

import Image from "next/image";
import type { CSSProperties, PointerEvent } from "react";
import { useState } from "react";
import type {
  AvatarOptions,
  AvatarProfile,
  Gender,
  MbtiType,
  Mood,
  RoomBackground
} from "@/types/avatar";
import {
  defaultAvatarOptions,
  getMbtiCharacterAsset,
  getMbtiVisualGroup
} from "@/types/avatar";
import { mbtiPlaygroundProfiles } from "@/lib/mbtiPlayground";

type PersonaPreviewProps = {
  profile?: AvatarProfile;
  options?: AvatarOptions;
  name?: string;
  mbti?: MbtiType;
  gender?: Gender;
  mood?: Mood;
  size?: "sm" | "md" | "lg" | "hero";
  showRoom?: boolean;
  showInfo?: boolean;
  className?: string;
};

const frameClasses = {
  sm: "h-24 w-24",
  md: "h-72 w-full",
  lg: "h-[28rem] w-full sm:h-[32rem]",
  hero: "h-[30rem] w-full sm:h-[36rem]"
};

const roomClasses: Record<RoomBackground, string> = {
  morning: "bg-[#eef0f2]",
  greenhouse: "bg-[#edf2ef]",
  studio: "bg-[#f1eeee]",
  night: "bg-[#ececf1]"
};

const groupAccents = {
  nt: "#6f4cac",
  nf: "#347b5d",
  sj: "#326fa8",
  sp: "#d29418"
} as const;

const reactionLines: Record<MbtiType, string> = {
  INTJ: "正在分析你的选择。",
  INTP: "这个组合值得再推演一下。",
  ENTJ: "很好，就按这个方案推进。",
  ENTP: "要不要再试一个更大胆的版本？",
  INFJ: "这个选择很像你没有说出口的部分。",
  INFP: "它好像有一段自己的故事。",
  ENFJ: "这个形象会让人很愿意靠近你。",
  ENFP: "这个搭配太酷了！",
  ISTJ: "细节已经检查过，可以确认。",
  ISFJ: "这个形象看起来让人很安心。",
  ESTJ: "方向清楚，完成度也不错。",
  ESFJ: "它会成为人群里很亲切的存在。",
  ISTP: "结构合理，也足够利落。",
  ISFP: "这个颜色和气质很合拍。",
  ESTP: "就这个，现在出发。",
  ESFP: "很好看，应该让更多人看到！"
};

export default function PersonaPreview({
  profile,
  options,
  name,
  mbti,
  mood,
  size = "lg",
  showRoom = true,
  showInfo = true,
  className = ""
}: PersonaPreviewProps) {
  const [look, setLook] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const currentMbti = profile?.mbti ?? mbti ?? "INFP";
  const currentOptions = profile?.options ?? options ?? defaultAvatarOptions;
  const currentName = profile?.name ?? name ?? "小栩";
  const currentMood = profile?.mood ?? mood ?? "平静";
  const persona = mbtiPlaygroundProfiles[currentMbti];
  const visualGroup = getMbtiVisualGroup(currentMbti);
  const accent = groupAccents[visualGroup];
  const asset = getMbtiCharacterAsset(currentMbti);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (size === "sm") return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    setLook({ x: Math.max(-2.2, Math.min(2.2, x * 4.4)), y: Math.max(-1.4, Math.min(1.4, y * 2.8)) });
  };

  const handlePointerLeave = () => {
    setLook({ x: 0, y: 0 });
    setActive(false);
  };

  const handlePointerDown = () => {
    if (size === "sm") return;

    setActive(true);
    window.setTimeout(() => setActive(false), 900);
  };

  return (
    <div
      className={[
        "avatar-art-frame relative overflow-hidden rounded-lg border border-black/10 shadow-glow",
        showRoom ? roomClasses[currentOptions.roomBackground] : "bg-[#eef0f2]",
        frameClasses[size],
        className
      ].join(" ")}
      data-testid="avatar-preview"
      data-character-source="mbti-v2"
      data-mbti={currentMbti}
      onPointerDown={handlePointerDown}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      style={{ "--avatar-accent": accent } as CSSProperties}
    >
      <div className="absolute inset-y-0 left-0 z-[3] w-1.5 bg-[var(--avatar-accent)]" aria-hidden />
      <div className="absolute inset-x-0 top-0 z-[3] flex items-center justify-between px-4 pt-3 text-[10px] font-bold tracking-[0.16em] text-slate-500">
        <span>PERSONA / {currentMbti}</span>
        <span>BASE 01</span>
      </div>

      <div className="absolute inset-0 z-[1]">
        <div
          key={currentMbti}
          className={[
            "avatar-character-art relative h-full w-full",
            active ? "avatar-character-react" : ""
          ].join(" ")}
          style={{
            transform: `perspective(900px) rotateY(${look.x}deg) rotateX(${-look.y}deg)`
          }}
        >
          <Image
            src={asset}
            alt={`${currentMbti} ${persona.title}人格角色`}
            fill
            priority={size === "hero" || size === "lg"}
            sizes={size === "sm" ? "96px" : "(max-width: 1024px) 100vw, 440px"}
            className={size === "sm" ? "object-cover object-top" : "object-contain"}
          />
        </div>
      </div>

      {active && size !== "sm" && (
        <div className="avatar-reaction absolute right-4 top-10 z-[4] max-w-[14rem] rounded-md border border-slate-200 bg-white/92 px-3 py-2 text-xs font-semibold leading-5 text-slate-700 shadow-soft backdrop-blur-sm">
          {reactionLines[currentMbti]}
        </div>
      )}

      {showInfo && size !== "sm" && (
        <div className="absolute inset-x-0 bottom-0 z-[3] border-t border-white/70 bg-white/88 px-5 py-4 backdrop-blur-md">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900">{currentName}</p>
              <p className="mt-0.5 text-xs font-semibold text-slate-600">{currentMbti} · {persona.title}</p>
            </div>
            <span className="shrink-0 text-xs font-semibold text-slate-500">{currentMood}</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-semibold text-slate-500">
            {persona.keywords.map((keyword) => <span key={keyword}>#{keyword}</span>)}
          </div>
        </div>
      )}
    </div>
  );
}
