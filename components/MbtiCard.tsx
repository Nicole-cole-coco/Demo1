"use client";

import type { MbtiType } from "@/types/avatar";
import { getMbtiMeta } from "@/types/avatar";

type MbtiCardProps = {
  type: MbtiType;
  selected?: boolean;
  compact?: boolean;
  onSelect?: (type: MbtiType) => void;
};

export default function MbtiCard({
  type,
  selected = false,
  compact = false,
  onSelect
}: MbtiCardProps) {
  const meta = getMbtiMeta(type);

  return (
    <button
      type="button"
      onClick={() => onSelect?.(type)}
      className={[
        "group relative w-full overflow-hidden rounded-lg border p-4 text-left transition duration-200",
        "bg-white/60 shadow-soft backdrop-blur-xl hover:-translate-y-0.5 hover:bg-white/80",
        selected
          ? "border-teal-400 ring-2 ring-teal-200"
          : "border-white/70 hover:border-white",
        compact ? "min-h-24" : "min-h-36"
      ].join(" ")}
      aria-pressed={selected}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${meta.accent} opacity-70 transition group-hover:opacity-90`}
      />
      <div className="absolute right-3 top-3 h-10 w-10 rounded-full bg-white/40 blur-xl" />
      <div className="relative flex h-full flex-col justify-between gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-2xl font-semibold tracking-normal text-slate-800">
              {type}
            </p>
            <p className="mt-1 text-sm font-medium text-slate-700">{meta.title}</p>
          </div>
          <span className="rounded-full bg-white/60 px-2.5 py-1 text-xs font-medium text-slate-600">
            {meta.group}
          </span>
        </div>
        {!compact && (
          <div>
            <p className="text-xs font-medium text-slate-500">{meta.clan}</p>
            <p className="mt-1 text-sm leading-6 text-slate-700">
              {meta.temperament}
            </p>
          </div>
        )}
      </div>
    </button>
  );
}
