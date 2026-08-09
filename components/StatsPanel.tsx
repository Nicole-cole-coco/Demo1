import type { AvatarProfile, AvatarStats } from "@/types/avatar";

type StatsPanelProps = {
  profile: AvatarProfile;
  stats: AvatarStats;
};

function Meter({
  label,
  value,
  tone
}: {
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-600">{label}</span>
        <span className="font-semibold text-slate-800">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/70">
        <div
          className={`h-full rounded-full ${tone}`}
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
}

export default function StatsPanel({ profile, stats }: StatsPanelProps) {
  return (
    <div className="glass-panel rounded-lg p-5">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-white/50 p-3">
          <p className="text-xs font-medium text-slate-500">MBTI</p>
          <p className="mt-1 text-lg font-semibold text-slate-800">
            {profile.mbti}
          </p>
        </div>
        <div className="rounded-lg bg-white/50 p-3">
          <p className="text-xs font-medium text-slate-500">族群</p>
          <p className="mt-1 text-lg font-semibold text-slate-800">
            {profile.clan}
          </p>
        </div>
        <div className="col-span-2 rounded-lg bg-white/50 p-3">
          <p className="text-xs font-medium text-slate-500">心情</p>
          <p className="mt-1 text-lg font-semibold text-slate-800">
            {profile.mood}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <Meter
          label="亲密度"
          value={stats.intimacy}
          tone="bg-gradient-to-r from-[#f19595] to-[#f4c26e]"
        />
        <Meter
          label="能量值"
          value={stats.energy}
          tone="bg-gradient-to-r from-[#7dcfc0] to-[#88bde8]"
        />
        <Meter
          label="灵感值"
          value={stats.inspiration}
          tone="bg-gradient-to-r from-[#b9a7ea] to-[#ef9abb]"
        />
      </div>
    </div>
  );
}
