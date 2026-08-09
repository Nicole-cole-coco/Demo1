import Link from "next/link";

export default function JournalPage() {
  return (
    <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-5xl px-4 py-16 sm:px-6">
      <p className="text-xs font-bold tracking-[0.18em] text-[#35685c]">JOURNAL / P1</p>
      <h1 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-5xl">人格记录</h1>
      <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
        日记、周期洞察和数据隐私控制将在 P1 一起设计。当前页面不会收集或保存你的记录。
      </p>
      <Link href="/chat" className="mt-10 inline-flex h-12 items-center justify-center rounded-md bg-[#24484b] px-6 text-sm font-bold text-white">
        先和人格伙伴聊聊
      </Link>
    </main>
  );
}
