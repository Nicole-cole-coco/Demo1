import Link from "next/link";
import AvatarEditor from "@/components/AvatarEditor";

export default function CreatePage() {
  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold tracking-[0.16em] text-teal-700">
              CHARACTER CREATOR
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-5xl">
              创建人格角色
            </h1>
          </div>
          <Link
            href="/"
            className="inline-flex h-10 self-start items-center justify-center rounded-lg border border-white/70 bg-white/60 px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-white/80 sm:self-auto"
          >
            返回首页
          </Link>
        </div>

        <AvatarEditor />
      </div>
    </main>
  );
}
