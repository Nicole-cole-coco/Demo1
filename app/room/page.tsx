"use client";

import Link from "next/link";
import PersonaPreview from "@/components/PersonaPreview";
import StatsPanel from "@/components/StatsPanel";
import { useAvatarStore } from "@/store/avatarStore";

export default function RoomPage() {
  const profile = useAvatarStore((state) => state.profile);
  const stats = useAvatarStore((state) => state.stats);
  const petHead = useAvatarStore((state) => state.petHead);
  const feed = useAvatarStore((state) => state.feed);
  const refreshTodayStatus = useAvatarStore((state) => state.refreshTodayStatus);

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <section className="flex flex-col gap-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold tracking-[0.16em] text-teal-700">
                ROOM
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-5xl">
                {profile.name} 的小屋
              </h1>
            </div>
            <Link
              href="/create"
              className="inline-flex h-10 self-start items-center justify-center rounded-lg border border-white/70 bg-white/60 px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-white/80 sm:self-auto"
            >
              换装
            </Link>
          </div>

          <PersonaPreview profile={profile} size="hero" />

          <div className="grid gap-3 sm:grid-cols-5">
            <Link
              href="/chat"
              className="flex h-12 items-center justify-center rounded-lg bg-[#24484b] px-4 text-sm font-semibold text-white shadow-soft transition hover:bg-[#1d3d40]"
            >
              聊天
            </Link>
            <Link
              href="/create"
              className="flex h-12 items-center justify-center rounded-lg border border-white/70 bg-white/60 px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-white/80"
            >
              换装
            </Link>
            <button
              type="button"
              onClick={petHead}
              className="h-12 rounded-lg border border-white/70 bg-white/60 px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-white/80"
            >
              摸摸头
            </button>
            <button
              type="button"
              onClick={feed}
              className="h-12 rounded-lg border border-white/70 bg-white/60 px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-white/80"
            >
              投喂
            </button>
            <button
              type="button"
              onClick={refreshTodayStatus}
              className="h-12 rounded-lg border border-white/70 bg-white/60 px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-white/80"
            >
              今日状态
            </button>
          </div>
        </section>

        <aside className="flex flex-col gap-4 lg:pt-24">
          <StatsPanel profile={profile} stats={stats} />
          <div className="glass-panel rounded-lg p-5">
            <p className="text-sm font-semibold text-slate-800">当前小屋记录</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {profile.name} 住在 {profile.clan}，现在心情是 {profile.mood}。
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
