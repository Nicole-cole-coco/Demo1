"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/companion", label: "人格交流", mobileLabel: "交流" },
  { href: "/lab", label: "关系实验", mobileLabel: "实验" },
  { href: "/report", label: "互动报告", mobileLabel: "报告" },
  { href: "/test", label: "自我探索", mobileLabel: "探索" }
] as const;

export default function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="universe-header sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-3 sm:gap-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2.5 font-semibold text-[var(--ink)]">
          <span className="relative grid h-7 w-7 shrink-0 grid-cols-2 gap-0.5 rounded-md border border-white/15 bg-white/5 p-1 shadow-[0_0_22px_rgba(154,176,226,0.18)]" aria-hidden="true">
            <span className="rounded-[1px] bg-[var(--energy-blue)]" />
            <span className="rounded-[1px] bg-[var(--energy-green)]" />
            <span className="rounded-[1px] bg-[var(--energy-yellow)]" />
            <span className="rounded-[1px] bg-[var(--energy-purple)]" />
          </span>
          <span className="hidden sm:inline">PERSONA UNIVERSE</span>
        </Link>
        <nav className="flex min-w-0 items-center" aria-label="主导航">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                data-active={isActive}
                className="universe-nav-link sm:px-3 sm:text-sm"
              >
                <span className="sm:hidden">{item.mobileLabel}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
