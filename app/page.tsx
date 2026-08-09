import Image from "next/image";
import Link from "next/link";
import HomePersonaGrid from "@/components/HomePersonaGrid";
import { getCompanionCatalogProfile } from "@/lib/companionCatalog";
import type { MbtiType } from "@/types/avatar";
import { getCompanionAvatar } from "@/types/companion";

const mainEntrances = [
  { href: "/companion", index: "01", title: "人格交流", detail: "选择不同人格角色，聊日常、想法与正在经历的事", energy: "blue" },
  { href: "/lab", index: "02", title: "进入关系剧情", detail: "在故事选择中观察沟通变化", energy: "green" },
  { href: "/report", index: "03", title: "开启人格档案", detail: "回看本轮互动留下的关系回声", energy: "purple" },
  { href: "/test", index: "04", title: "探索内在坐标", detail: "从情景选择理解自然反应", energy: "yellow" }
] as const;

const featuredMbti: readonly MbtiType[] = ["INTJ", "INFJ", "ENFP", "ENTJ"];

export default function HomePage() {
  return (
    <main className="v3-page persona-universe">
      <section className="relative border-b border-white/10">
        <div className="v3-shell grid min-h-[calc(100svh-9rem)] items-center gap-7 py-8 md:grid-cols-[0.86fr_1.14fr] md:gap-9 md:py-12">
          <div className="v3-enter max-w-xl">
            <p className="v3-kicker">MBTI 人格探索与关系模拟</p>
            <h1 className="v3-title mt-4 max-w-xl text-4xl sm:text-5xl">人格宇宙<br /><span className="text-[var(--ink-soft)]">Persona Universe</span></h1>
            <p className="v3-muted mt-5 max-w-lg text-base sm:text-lg">
              穿过理性星域、成长森林、探索光芒与幻想深空。在这里遇见不同人格伙伴，也在一段段关系故事里看见自己的沟通轨迹。
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="#persona-atlas" className="v3-button-primary">开始人格交流</Link>
              <Link href="/lab" className="v3-button-secondary">进入关系剧情</Link>
            </div>
            <div className="mt-8 grid max-w-lg grid-cols-4 gap-2 text-[10px] font-semibold text-[var(--ink-faint)] sm:text-xs">
              <span className="border-t border-[var(--energy-blue)] pt-2">理性星域</span>
              <span className="border-t border-[var(--energy-green)] pt-2">成长森林</span>
              <span className="border-t border-[var(--energy-yellow)] pt-2">探索光芒</span>
              <span className="border-t border-[var(--energy-purple)] pt-2">幻想深空</span>
            </div>
          </div>

          <div className="relative grid h-[245px] grid-cols-4 items-end gap-2 sm:h-[360px] sm:gap-3 md:h-[390px]" aria-label="代表性人格伙伴">
            <div className="absolute inset-x-8 bottom-3 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" aria-hidden="true" />
            {featuredMbti.map((mbti, index) => {
              const profile = getCompanionCatalogProfile(mbti);
              return (
                <Link
                  key={mbti}
                  href={`/companion?mbti=${mbti}&gender=female`}
                  className={`universe-glass group relative overflow-hidden rounded-lg transition hover:-translate-y-2 hover:border-white/30 hover:shadow-[0_22px_58px_rgba(89,104,168,0.28)] ${index % 2 === 0 ? "mb-5 sm:mb-8" : "mb-1"}`}
                >
                  <div className="relative aspect-[3/5] min-h-[180px] sm:min-h-[250px]">
                    <Image
                      src={getCompanionAvatar(mbti, "female")}
                      alt={`${mbti} ${profile.title}`}
                      fill
                      priority
                      sizes="(max-width: 768px) 24vw, 15vw"
                      className="universe-avatar object-cover transition duration-500 group-hover:scale-[1.045]"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 to-transparent px-2 pb-3 pt-12 text-white sm:px-3">
                      <p className="text-xs font-bold sm:text-lg">{mbti}</p>
                      <p className="hidden truncate text-xs text-white/80 sm:block">{profile.universeTitle}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-black/15 backdrop-blur-sm">
        <div className="v3-shell grid grid-cols-2 lg:grid-cols-4">
          {mainEntrances.map((entrance, index) => (
            <Link
              key={entrance.index}
              href={entrance.href}
              className={`group flex min-h-36 flex-col justify-between border-b border-white/10 px-3 py-5 transition hover:bg-white/[0.035] sm:px-5 lg:border-b-0 ${index % 2 === 1 ? "border-l border-white/10" : ""} ${index > 0 ? "lg:border-l lg:border-white/10" : ""}`}
            >
              <span className={`text-xs font-bold ${
                entrance.energy === "blue" ? "text-[var(--energy-blue)]" :
                  entrance.energy === "green" ? "text-[var(--energy-green)]" :
                    entrance.energy === "yellow" ? "text-[var(--energy-yellow)]" : "text-[var(--energy-purple)]"
              }`}>{entrance.index}</span>
              <div className="mt-5">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-sm font-semibold text-[var(--ink)] group-hover:text-[var(--brand)] sm:text-base">{entrance.title}</h2>
                  <span className="text-lg text-white/30 transition group-hover:translate-x-1 group-hover:text-white" aria-hidden="true">→</span>
                </div>
                <p className="mt-1 text-sm leading-6 text-[var(--ink-soft)]">{entrance.detail}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="persona-atlas" className="scroll-mt-20 py-12 sm:py-16">
        <div className="v3-shell">
          <HomePersonaGrid />
        </div>
      </section>
    </main>
  );
}
