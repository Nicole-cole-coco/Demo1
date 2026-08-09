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

type CharacterPreviewProps = {
  profile?: AvatarProfile;
  options?: AvatarOptions;
  name?: string;
  mood?: Mood;
  size?: "sm" | "md" | "lg" | "hero";
  showRoom?: boolean;
  className?: string;
};

type HairPalette = {
  base: string;
  deep: string;
  shine: string;
};

type OutfitPalette = {
  base: string;
  deep: string;
  trim: string;
  accent: string;
};

const fallbackOutfitPalette: OutfitPalette = {
  base: "#abdcd4",
  deep: "#78bdb3",
  trim: "#fff1f4",
  accent: "#ef9ca9"
};

const roomClasses: Record<RoomBackground, string> = {
  morning: "from-[#fff4e9] via-[#fbfffb] to-[#d8f0eb]",
  greenhouse: "from-[#ecfbf0] via-[#fff8ef] to-[#d7f2e8]",
  studio: "from-[#fff1f3] via-[#fbf7ef] to-[#e7f5ff]",
  night: "from-[#e8eef9] via-[#f8f1ff] to-[#e1f7f1]"
};

const hairPalettes: Record<HairColor, HairPalette> = {
  mocha: { base: "#7b564b", deep: "#4f352f", shine: "#b27e6d" },
  "milk-tea": { base: "#d7a970", deep: "#9c7048", shine: "#f1cf99" },
  rose: { base: "#d98c9b", deep: "#a85f70", shine: "#f3b4bf" },
  mist: { base: "#90a7b4", deep: "#607784", shine: "#c0d1d8" }
};

const outfitPalettes: Partial<Record<string, OutfitPalette>> = {
  knit: { base: "#f1a899", deep: "#d98377", trim: "#fff2d4", accent: "#dd7f76" },
  dress: { base: "#abdcd4", deep: "#78bdb3", trim: "#fff1f4", accent: "#ef9ca9" },
  hoodie: { base: "#b8caed", deep: "#829ed2", trim: "#f3eaff", accent: "#9f8bd0" },
  apron: { base: "#f3bf63", deep: "#cf9141", trim: "#fff4d8", accent: "#83bfae" }
};

const frameClasses = {
  sm: "h-24 w-24",
  md: "h-72 w-full",
  lg: "h-[26rem] w-full sm:h-[30rem]",
  hero: "h-[28rem] w-full sm:h-[34rem]"
};

function RoomDecor({ background }: { background: RoomBackground }) {
  if (background === "greenhouse") {
    return (
      <>
        <div className="absolute left-6 top-6 h-28 w-24 rounded-t-full border border-white/70 bg-white/30 shadow-sm" />
        <div className="absolute left-12 top-16 h-20 w-px bg-white/50" />
        <div className="absolute bottom-16 right-8 h-28 w-24 rounded-t-full bg-emerald-200/40 shadow-sm" />
        <div className="absolute bottom-24 right-14 h-16 w-10 rounded-full bg-emerald-400/20" />
      </>
    );
  }

  if (background === "studio") {
    return (
      <>
        <div className="absolute left-7 top-10 h-2 w-36 rounded-full bg-white/50" />
        <div className="absolute left-7 top-[4.25rem] h-20 w-32 rounded-lg bg-white/40 shadow-sm" />
        <div className="absolute bottom-16 right-10 h-16 w-16 rounded-full bg-rose-200/50" />
        <div className="absolute bottom-28 right-16 h-10 w-3 rounded-full bg-white/50" />
      </>
    );
  }

  if (background === "night") {
    return (
      <>
        <div className="absolute right-12 top-12 h-12 w-12 rounded-full bg-white/75 shadow-[0_0_34px_rgba(255,255,255,0.72)]" />
        <div className="absolute left-12 top-24 h-1.5 w-1.5 rounded-full bg-white/80" />
        <div className="absolute right-28 top-28 h-1 w-1 rounded-full bg-white/80" />
        <div className="absolute left-24 top-14 h-1 w-1 rounded-full bg-white/80" />
      </>
    );
  }

  return (
    <>
      <div className="absolute left-8 top-10 h-24 w-32 rounded-t-full bg-white/40 shadow-sm" />
      <div className="absolute left-16 top-16 h-16 w-px bg-white/50" />
      <div className="absolute bottom-16 right-8 h-16 w-24 rounded-lg bg-teal-100/60 shadow-sm" />
    </>
  );
}

function HairBack({ style, palette }: { style: HairStyle; palette: HairPalette }) {
  if (style === "long-wave") {
    return (
      <>
        <path d="M103 126c-26 30-31 75-20 124 9 39 3 64-18 82 36 14 75 2 90-25 14-27 5-62 13-91 8-25 31-45 26-73-5-28-40-48-91-17Z" fill={palette.deep} opacity="0.94" />
        <path d="M217 126c26 30 31 75 20 124-9 39-3 64 18 82-36 14-75 2-90-25-14-27-5-62-13-91-8-25-31-45-26-73 5-28 40-48 91-17Z" fill={palette.deep} opacity="0.94" />
      </>
    );
  }

  if (style === "twin-tail") {
    return (
      <>
        <path d="M102 163c-36 3-58 22-58 50 0 31 27 55 63 51 29-3 47-23 46-52-1-31-21-52-51-49Z" fill={palette.base} />
        <path d="M218 163c36 3 58 22 58 50 0 31-27 55-63 51-29-3-47-23-46-52 1-31 21-52 51-49Z" fill={palette.base} />
        <path d="M78 185c-17 15-24 43-9 63" stroke={palette.shine} strokeLinecap="round" strokeWidth="7" opacity="0.45" />
        <path d="M242 185c17 15 24 43 9 63" stroke={palette.shine} strokeLinecap="round" strokeWidth="7" opacity="0.45" />
      </>
    );
  }

  if (style === "low-bun") {
    return (
      <>
        <circle cx="224" cy="153" r="35" fill={palette.deep} />
        <circle cx="229" cy="147" r="24" fill={palette.base} />
        <path d="M116 125c-28 23-38 75-19 113 19 39 83 41 113 10 31-31 26-91-1-117-23-22-66-30-93-6Z" fill={palette.deep} />
      </>
    );
  }

  return (
    <path d="M99 127c-25 24-33 70-14 105 18 34 64 41 102 28 41-14 62-54 52-91-9-35-38-57-77-58-25-1-48 4-63 16Z" fill={palette.deep} />
  );
}

function HairFront({ style, palette }: { style: HairStyle; palette: HairPalette }) {
  const sideLocks =
    style === "long-wave" ? (
      <>
        <path d="M103 171c-9 19-8 47 8 65" stroke={palette.shine} strokeLinecap="round" strokeWidth="8" opacity="0.45" />
        <path d="M217 171c9 19 8 47-8 65" stroke={palette.shine} strokeLinecap="round" strokeWidth="8" opacity="0.45" />
      </>
    ) : null;

  return (
    <>
      <path d="M97 146c6-44 43-69 82-62 37 6 61 34 58 72-22-25-54-30-83-24-25 5-42 15-57 14Z" fill={palette.base} />
      <path d="M108 149c17-23 37-35 64-35-3 27-20 45-52 55-6 2-12-4-12-20Z" fill={palette.shine} opacity="0.55" />
      <path d="M165 112c28 11 47 31 54 57-23-5-39-23-54-57Z" fill={palette.deep} opacity="0.42" />
      <path d="M97 148c-10 14-14 31-11 50 9-17 19-29 34-37Z" fill={palette.base} />
      <path d="M232 147c9 15 12 33 7 50-8-17-18-29-33-37Z" fill={palette.base} />
      {sideLocks}
    </>
  );
}

function Eyes({ style }: { style: EyeStyle }) {
  if (style === "sleepy") {
    return (
      <>
        <path d="M124 182c11 7 24 7 35 0" fill="none" stroke="#4d3f46" strokeLinecap="round" strokeWidth="5" />
        <path d="M184 182c11 7 24 7 35 0" fill="none" stroke="#4d3f46" strokeLinecap="round" strokeWidth="5" />
      </>
    );
  }

  if (style === "calm") {
    return (
      <>
        <path d="M121 180c13-8 27-8 39 0" fill="none" stroke="#3f363d" strokeLinecap="round" strokeWidth="5" />
        <path d="M183 180c13-8 27-8 39 0" fill="none" stroke="#3f363d" strokeLinecap="round" strokeWidth="5" />
        <circle cx="142" cy="183" r="5" fill="#4f4657" />
        <circle cx="204" cy="183" r="5" fill="#4f4657" />
      </>
    );
  }

  const bright = style === "bright";
  const leftEye = bright
    ? "M119 178c6-18 34-18 42 0 4 13-5 26-21 26-15 0-25-13-21-26Z"
    : "M119 179c7-15 33-16 43 0 4 12-6 23-21 23-15 0-26-11-22-23Z";
  const rightEye = bright
    ? "M183 178c6-18 34-18 42 0 4 13-5 26-21 26-15 0-25-13-21-26Z"
    : "M182 179c7-15 33-16 43 0 4 12-6 23-21 23-15 0-26-11-22-23Z";

  return (
    <>
      <path d={leftEye} fill="#fffafa" />
      <path d={rightEye} fill="#fffafa" />
      <circle cx="141" cy="184" r={bright ? 12 : 10} fill="#56445b" />
      <circle cx="204" cy="184" r={bright ? 12 : 10} fill="#56445b" />
      <circle cx="137" cy="180" r="3.5" fill="white" />
      <circle cx="200" cy="180" r="3.5" fill="white" />
      <path d="M118 174c11-9 32-9 45 2" fill="none" stroke="#3f363d" strokeLinecap="round" strokeWidth="3" opacity="0.45" />
      <path d="M181 176c13-11 35-11 46-2" fill="none" stroke="#3f363d" strokeLinecap="round" strokeWidth="3" opacity="0.45" />
    </>
  );
}

function Mouth({ expression }: { expression: Expression }) {
  if (expression === "spark") {
    return (
      <>
        <path d="M150 218c7 13 24 13 31 0" fill="none" stroke="#b45f66" strokeLinecap="round" strokeWidth="4" />
        <path d="M155 219c5 5 16 5 21 0" fill="none" stroke="#fff6f4" strokeLinecap="round" strokeWidth="2" opacity="0.8" />
      </>
    );
  }

  if (expression === "shy") {
    return <path d="M155 219c7 7 17 7 24 0" fill="none" stroke="#b45f66" strokeLinecap="round" strokeWidth="3" />;
  }

  if (expression === "focus") {
    return <path d="M154 219c8 3 18 3 26 0" fill="none" stroke="#9b6463" strokeLinecap="round" strokeWidth="3" />;
  }

  return <path d="M152 218c8 10 22 10 30 0" fill="none" stroke="#b45f66" strokeLinecap="round" strokeWidth="3.5" />;
}

function AccessoryLayer({ accessory, palette }: { accessory: Accessory; palette: HairPalette }) {
  if (accessory === "ribbon") {
    return (
      <g transform="translate(139 78)">
        <path d="M20 18C4 3-6 9 6 27c14 8 24 1 14-9Z" fill="#ee858d" />
        <path d="M39 18C55 3 65 9 53 27c-14 8-24 1-14-9Z" fill="#ee858d" />
        <circle cx="30" cy="20" r="8" fill="#d96b75" />
        <path d="M10 18c8-3 13-2 18 3" fill="none" stroke="#ffd2d6" strokeLinecap="round" strokeWidth="2" opacity="0.75" />
      </g>
    );
  }

  if (accessory === "beret") {
    return (
      <g transform="translate(104 79) rotate(-8 64 27)">
        <ellipse cx="62" cy="34" rx="64" ry="22" fill={palette.deep} />
        <ellipse cx="62" cy="28" rx="50" ry="24" fill={palette.base} />
        <path d="M48 12c19-9 40-3 54 10" fill="none" stroke={palette.shine} strokeLinecap="round" strokeWidth="5" opacity="0.45" />
      </g>
    );
  }

  if (accessory === "glasses") {
    return (
      <g fill="none" stroke="#60686c" strokeWidth="3" opacity="0.82">
        <circle cx="141" cy="185" r="18" />
        <circle cx="204" cy="185" r="18" />
        <path d="M159 184c9-5 18-5 27 0" strokeLinecap="round" />
      </g>
    );
  }

  return null;
}

function OutfitLayer({ palette }: { palette: OutfitPalette }) {
  return (
    <>
      <path d="M105 320c10-47 31-72 57-72s48 25 57 72l9 57H96Z" fill={palette.base} />
      <path d="M126 265c18 19 49 19 68 0l11 35c-23 18-62 18-90 0Z" fill={palette.trim} opacity="0.9" />
      <path d="M155 254c-16 15-24 33-26 61" fill="none" stroke={palette.deep} strokeLinecap="round" strokeWidth="5" opacity="0.34" />
      <path d="M171 254c17 16 25 36 28 63" fill="none" stroke={palette.deep} strokeLinecap="round" strokeWidth="5" opacity="0.34" />
      <circle cx="163" cy="303" r="4" fill={palette.accent} opacity="0.8" />
      <circle cx="163" cy="326" r="4" fill={palette.accent} opacity="0.8" />
    </>
  );
}

function PrettyCharacter({ options, size }: { options: AvatarOptions; size: CharacterPreviewProps["size"] }) {
  const hair = hairPalettes[options.hairColor];
  const outfit = outfitPalettes[options.outfit] ?? fallbackOutfitPalette;
  const viewBox = size === "sm" ? "76 50 168 176" : "0 18 320 402";

  return (
    <svg className="absolute inset-0 h-full w-full" viewBox={viewBox} role="img" aria-label="人格小人预览">
      <ellipse cx="160" cy="382" rx="86" ry="18" fill="#5d7971" opacity="0.12" />

      <g>
        <path d="M102 284c-27 10-44 34-50 71" fill="none" stroke="#f4c8ba" strokeLinecap="round" strokeWidth="22" />
        <path d="M218 284c27 10 44 34 50 71" fill="none" stroke="#f4c8ba" strokeLinecap="round" strokeWidth="22" />
        <path d="M72 356c12 4 22 2 30-6" fill="none" stroke="#ffd9cc" strokeLinecap="round" strokeWidth="8" />
        <path d="M248 350c8 8 18 10 30 6" fill="none" stroke="#ffd9cc" strokeLinecap="round" strokeWidth="8" />
      </g>

      <OutfitLayer palette={outfit} />
      <path d="M137 247c2 22 44 22 47 0v-28h-47Z" fill="#f4c8ba" />
      <path d="M141 244c13 10 27 10 39 0v-13h-39Z" fill="#e5a99f" opacity="0.35" />

      <HairBack style={options.hairStyle} palette={hair} />

      <g>
        <ellipse cx="160" cy="172" rx="65" ry="76" fill="#ffd7c8" />
        <ellipse cx="160" cy="174" rx="55" ry="66" fill="#ffddcf" opacity="0.82" />
        <circle cx="96" cy="181" r="12" fill="#f4c8ba" />
        <circle cx="224" cy="181" r="12" fill="#f4c8ba" />
        <ellipse cx="126" cy="205" rx="16" ry="8" fill="#f2a0a9" opacity="0.45" />
        <ellipse cx="195" cy="205" rx="16" ry="8" fill="#f2a0a9" opacity="0.45" />
        <path d="M164 189c-4 8-6 14-2 19" fill="none" stroke="#de9d92" strokeLinecap="round" strokeWidth="3" opacity="0.62" />
        <Eyes style={options.eyeStyle} />
        <Mouth expression={options.expression} />
      </g>

      <HairFront style={options.hairStyle} palette={hair} />
      <AccessoryLayer accessory={options.accessory} palette={hair} />
    </svg>
  );
}

export default function CharacterPreview({
  profile,
  options,
  name,
  mood,
  size = "lg",
  showRoom = true,
  className = ""
}: CharacterPreviewProps) {
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
