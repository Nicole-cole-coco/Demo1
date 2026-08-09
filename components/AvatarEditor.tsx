"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import PersonaPreview from "@/components/PersonaPreview";
import { useAvatarStore } from "@/store/avatarStore";
import type { MbtiType, MbtiVisualGroup } from "@/types/avatar";
import {
  getMbtiCharacterThumbnail,
  getMbtiPersona,
  getMbtiStyleNote,
  getMbtiVisualGroup,
  mbtiGroupLabels,
  mbtiTypes
} from "@/types/avatar";

const paletteSwatches: Record<MbtiVisualGroup, string[]> = {
  nt: ["#25232a", "#6f4cac", "#c9b8e7", "#f3f2f5"],
  nf: ["#25322c", "#347b5d", "#9bc5ad", "#f1f3ef"],
  sj: ["#242d38", "#326fa8", "#9ebdd7", "#f1f3f5"],
  sp: ["#292722", "#d29418", "#f0c45c", "#f4f2ed"]
};

const layerDefinitions = [
  { key: "01", label: "Base Human Body", value: "标准人类体态" },
  { key: "02", label: "Face", value: "人格专属脸型" },
  { key: "03", label: "Hair", value: "独立发型与发色" },
  { key: "04", label: "Eyes", value: "独立眼神与表情" },
  { key: "05", label: "Clothes", value: "人格主题服装" },
  { key: "06", label: "Accessories", value: "标志性配饰" }
] as const;

function CharacterRosterCard({
  type,
  selected,
  onSelect
}: {
  type: MbtiType;
  selected: boolean;
  onSelect: (type: MbtiType) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(type)}
      aria-pressed={selected}
      className={[
        "group flex min-h-20 items-center gap-3 overflow-hidden rounded-lg border p-2 text-left transition",
        selected
          ? "border-[#24484b] bg-white shadow-soft ring-2 ring-[#d5e2df]"
          : "border-slate-200 bg-white/60 hover:border-slate-400 hover:bg-white"
      ].join(" ")}
    >
      <span className="relative h-16 w-12 shrink-0 overflow-hidden rounded-md bg-slate-100">
        <Image
          src={getMbtiCharacterThumbnail(type)}
          alt=""
          fill
          sizes="48px"
          className="object-cover object-top transition duration-300 group-hover:scale-105"
        />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-bold tracking-wide text-slate-900">{type}</span>
        <span className="mt-1 block text-xs font-semibold text-slate-500">
          {mbtiGroupLabels[getMbtiVisualGroup(type)]}
        </span>
      </span>
    </button>
  );
}

export default function AvatarEditor() {
  const router = useRouter();
  const profile = useAvatarStore((state) => state.profile);
  const setMbti = useAvatarStore((state) => state.setMbti);
  const updateName = useAvatarStore((state) => state.updateName);
  const moveIn = useAvatarStore((state) => state.moveIn);
  const persona = getMbtiPersona(profile.mbti);
  const styleNote = getMbtiStyleNote(profile.mbti);
  const visualGroup = getMbtiVisualGroup(profile.mbti);

  const handleSubmit = () => {
    moveIn();
    router.push("/room");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_27rem]">
      <div className="rounded-lg border border-slate-200 bg-white/72 p-5 shadow-soft sm:p-6">
        <div className="flex flex-col gap-7">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">角色名字</span>
            <input
              value={profile.name}
              onChange={(event) => updateName(event.target.value)}
              placeholder="给人格角色起一个名字"
              className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-base font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#24484b] focus:ring-4 focus:ring-[#dceae7]"
              maxLength={12}
            />
          </label>

          <section>
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-bold tracking-[0.16em] text-slate-400">BASE CHARACTER</p>
                <h2 className="mt-1 text-xl font-semibold text-slate-900">选择人格角色</h2>
              </div>
              <p className="text-sm font-semibold text-slate-500">
                {String(mbtiTypes.indexOf(profile.mbti) + 1).padStart(2, "0")} / 16
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {mbtiTypes.map((type) => (
                <CharacterRosterCard
                  key={type}
                  type={type}
                  selected={profile.mbti === type}
                  onSelect={setMbti}
                />
              ))}
            </div>
          </section>

          <section className="border-t border-slate-200 pt-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <p className="text-xs font-bold tracking-[0.16em] text-slate-400">CHARACTER PROFILE</p>
                <h2 className="mt-1 text-xl font-semibold text-slate-900">
                  {profile.mbti} · {persona.archetype}
                </h2>
              </div>
              <div className="flex gap-2" aria-label="人格配色">
                {paletteSwatches[visualGroup].map((color) => (
                  <span
                    key={color}
                    className="h-7 w-7 rounded-md border border-black/10 shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-700">{styleNote.posture}</p>
            <p className="mt-1 text-sm leading-6 text-slate-500">{styleNote.detail}</p>
          </section>

          <section className="border-t border-slate-200 pt-6">
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-bold tracking-[0.16em] text-slate-400">AVATAR LAYERS</p>
                <h2 className="mt-1 text-xl font-semibold text-slate-900">基础角色分层</h2>
              </div>
              <span className="text-xs font-semibold text-slate-500">BASE 01</span>
            </div>
            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {layerDefinitions.map((layer) => (
                <div key={layer.key} className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 py-3">
                  <span className="font-mono text-xs font-bold text-slate-400">{layer.key}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{layer.label}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{layer.value}</p>
                  </div>
                  <span className="h-2 w-2 rounded-full bg-emerald-500" aria-label="已启用" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <aside className="order-first lg:order-last lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-lg border border-slate-200 bg-white/76 p-4 shadow-soft">
          <div className="mb-3 flex items-center justify-between gap-3 px-1">
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-slate-400">LIVE PREVIEW</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">{mbtiGroupLabels[visualGroup]}</p>
            </div>
            <span className="text-xs font-semibold text-slate-500">点击角色互动</span>
          </div>
          <PersonaPreview profile={profile} size="hero" showInfo={false} />
          <button
            type="button"
            onClick={handleSubmit}
            className="mt-4 h-12 w-full rounded-lg bg-[#24484b] px-5 text-sm font-semibold text-white shadow-soft transition hover:bg-[#1d3d40] focus:outline-none focus:ring-4 focus:ring-[#c8ddd9]"
          >
            确认人格角色
          </button>
        </div>
      </aside>
    </div>
  );
}
