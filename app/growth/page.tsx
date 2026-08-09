import Link from "next/link";

export default function GrowthPage() {
  return (
    <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-5xl px-4 py-16 sm:px-6">
      <p className="text-xs font-bold tracking-[0.18em] text-[#35685c]">GROWTH / P1</p>
      <h1 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-5xl">人格成长</h1>
      <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
        每日探索、测试趋势与成长回顾将在 P1 开放。当前版本先确保你能获得稳定的人格伙伴并完成连续对话。
      </p>
      <div className="mt-10 border-y border-slate-200 py-6">
        <p className="text-sm font-semibold text-slate-800">当前可用</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/test" className="rounded-md bg-[#24484b] px-5 py-3 text-sm font-bold text-white">重新探索人格</Link>
          <Link href="/chat" className="rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700">与伙伴对话</Link>
        </div>
      </div>
    </main>
  );
}
