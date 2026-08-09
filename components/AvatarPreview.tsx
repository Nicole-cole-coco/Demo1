import type {
  Accessory,
  AvatarOptions,
  AvatarProfile,
  EyeStyle,
  Expression,
  HairColor,
  HairStyle,
  Mood,
  Outfit,
  RoomBackground
} from "@/types/avatar";
import PersonaPreview from "@/components/PersonaPreview";
import { defaultAvatarOptions } from "@/types/avatar";

type AvatarPreviewProps = {
  profile?: AvatarProfile;
  options?: AvatarOptions;
  name?: string;
  mood?: Mood;
  size?: "sm" | "md" | "lg" | "hero";
  showRoom?: boolean;
  className?: string;
};

const roomClasses: Record<RoomBackground, string> = {
  morning: "from-[#fff3e4] via-[#f9fffb] to-[#dff4ee]",
  greenhouse: "from-[#eefcf1] via-[#fff8ee] to-[#d8f3e8]",
  studio: "from-[#fff4f5] via-[#fbf7ec] to-[#e8f6ff]",
  night: "from-[#e9eef9] via-[#f8f1ff] to-[#e4f8f3]"
};

const hairClasses: Record<HairColor, string> = {
  mocha: "bg-[#6f5148]",
  "milk-tea": "bg-[#d8ad77]",
  rose: "bg-[#d9919d]",
  mist: "bg-[#91a8b3]"
};

const outfitClasses: Partial<Record<string, string>> = {
  knit: "from-[#f8b8a7] to-[#f4dfb5]",
  dress: "from-[#bfe8e1] to-[#fff0f2]",
  hoodie: "from-[#bcd2ef] to-[#f2e5fb]",
  apron: "from-[#f7c56f] to-[#a8d8c7]"
};

const frameClasses = {
  sm: "h-24 w-24",
  md: "h-72 w-full",
  lg: "h-[30rem] w-full",
  hero: "h-[34rem] w-full"
};

const scaleClasses = {
  sm: "scale-[0.42]",
  md: "scale-[0.78]",
  lg: "scale-100",
  hero: "scale-110"
};

function Hair({
  style,
  color
}: {
  style: HairStyle;
  color: HairColor;
}) {
  const colorClass = hairClasses[color];

  if (style === "long-wave") {
    return (
      <>
        <div
          className={`absolute -left-5 top-5 h-36 w-12 rounded-full ${colorClass}`}
        />
        <div
          className={`absolute -right-5 top-5 h-36 w-12 rounded-full ${colorClass}`}
        />
        <div
          className={`absolute -left-1 top-0 h-20 w-28 rounded-t-full ${colorClass}`}
        />
      </>
    );
  }

  if (style === "twin-tail") {
    return (
      <>
        <div
          className={`absolute -left-8 top-10 h-16 w-12 rounded-full ${colorClass}`}
        />
        <div
          className={`absolute -right-8 top-10 h-16 w-12 rounded-full ${colorClass}`}
        />
        <div
          className={`absolute -left-1 top-0 h-20 w-28 rounded-t-full ${colorClass}`}
        />
      </>
    );
  }

  if (style === "low-bun") {
    return (
      <>
        <div
          className={`absolute -right-7 top-16 h-12 w-12 rounded-full ${colorClass}`}
        />
        <div
          className={`absolute -left-1 top-0 h-20 w-28 rounded-t-full ${colorClass}`}
        />
      </>
    );
  }

  return (
    <div
      className={`absolute -left-1 top-0 h-24 w-28 rounded-t-full ${colorClass}`}
    />
  );
}

function Eyes({ style }: { style: EyeStyle }) {
  const base = "absolute top-[4.8rem] h-2.5 bg-[#34434a]";
  const shape: Record<EyeStyle, string> = {
    gentle: "w-4 rounded-full",
    bright: "w-3 rounded-full shadow-[0_0_0_3px_rgba(255,255,255,0.55)]",
    calm: "h-1.5 w-5 rounded-full",
    sleepy: "h-1 w-5 rounded-full"
  };

  return (
    <>
      <span className={`${base} ${shape[style]} left-8`} />
      <span className={`${base} ${shape[style]} right-8`} />
    </>
  );
}

function Mouth({ expression }: { expression: Expression }) {
  const common = "absolute left-1/2 top-[6.45rem] -translate-x-1/2";

  if (expression === "spark") {
    return (
      <span
        className={`${common} h-3 w-6 rounded-b-full border-b-2 border-[#c86f65]`}
      />
    );
  }

  if (expression === "shy") {
    return (
      <>
        <span className={`${common} h-1.5 w-4 rounded-full bg-[#c86f65]`} />
        <span className="absolute left-5 top-[5.8rem] h-2 w-4 rounded-full bg-[#f6a9a1]/70" />
        <span className="absolute right-5 top-[5.8rem] h-2 w-4 rounded-full bg-[#f6a9a1]/70" />
      </>
    );
  }

  if (expression === "focus") {
    return <span className={`${common} h-1.5 w-5 rounded-full bg-[#8b5a55]`} />;
  }

  return (
    <span
      className={`${common} h-3 w-5 rounded-b-full border-b-2 border-[#b96760]`}
    />
  );
}

function AccessoryLayer({
  accessory,
  hairColor
}: {
  accessory: Accessory;
  hairColor: HairColor;
}) {
  if (accessory === "ribbon") {
    return (
      <div className="absolute left-1/2 top-2 flex -translate-x-1/2 items-center">
        <span className="h-5 w-7 rounded-full bg-[#ef8d8d]" />
        <span className="h-3 w-3 rounded-full bg-[#d96f75]" />
        <span className="h-5 w-7 rounded-full bg-[#ef8d8d]" />
      </div>
    );
  }

  if (accessory === "beret") {
    return (
      <div
        className={`absolute left-4 top-0 h-9 w-20 -rotate-6 rounded-full ${hairClasses[hairColor]} shadow-sm`}
      />
    );
  }

  if (accessory === "glasses") {
    return (
      <div className="absolute left-1/2 top-[4.55rem] flex -translate-x-1/2 items-center gap-1.5">
        <span className="h-6 w-6 rounded-full border-2 border-[#5f6d70]/80" />
        <span className="h-px w-3 bg-[#5f6d70]/80" />
        <span className="h-6 w-6 rounded-full border-2 border-[#5f6d70]/80" />
      </div>
    );
  }

  return null;
}

function RoomDecor({ background }: { background: RoomBackground }) {
  if (background === "greenhouse") {
    return (
      <>
        <div className="absolute left-8 top-8 h-24 w-20 rounded-t-full border border-white/60 bg-white/20" />
        <div className="absolute bottom-16 right-8 h-24 w-20 rounded-t-full bg-emerald-200/30" />
      </>
    );
  }

  if (background === "studio") {
    return (
      <>
        <div className="absolute left-8 top-10 h-2 w-32 rounded-full bg-white/50" />
        <div className="absolute left-8 top-16 h-16 w-28 rounded-lg bg-white/30" />
        <div className="absolute bottom-16 right-10 h-16 w-16 rounded-full bg-rose-200/40" />
      </>
    );
  }

  if (background === "night") {
    return (
      <>
        <div className="absolute right-12 top-12 h-12 w-12 rounded-full bg-white/70 shadow-[0_0_32px_rgba(255,255,255,0.72)]" />
        <div className="absolute left-12 top-24 h-1.5 w-1.5 rounded-full bg-white/80" />
        <div className="absolute right-28 top-28 h-1 w-1 rounded-full bg-white/80" />
      </>
    );
  }

  return (
    <>
      <div className="absolute left-8 top-10 h-20 w-28 rounded-t-full bg-white/30" />
      <div className="absolute bottom-16 right-8 h-16 w-24 rounded-lg bg-teal-100/50" />
    </>
  );
}

export default function AvatarPreview({
  profile,
  options,
  name,
  mood,
  size = "lg",
  showRoom = true,
  className = ""
}: AvatarPreviewProps) {
  return (
    <PersonaPreview
      profile={profile}
      options={options}
      name={name}
      mood={mood}
      size={size}
      showRoom={showRoom}
      className={className}
    />
  );
}
