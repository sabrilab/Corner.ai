import { Flame, Bookmark, Share2 } from "lucide-react";

const STATS = [
  { label: "Streak", value: "7 jours", icon: Flame },
  { label: "Sauvegardés", value: "12", icon: Bookmark },
  { label: "Partagés", value: "4", icon: Share2 },
];

export default function ProfilPage() {
  return (
    <div className="flex flex-col gap-6 pb-4">
      <div className="flex flex-col items-center gap-3 pt-2 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800 text-xl font-bold text-white">
          S
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white">Sabri</h1>
          <p className="text-[13px] text-zinc-500">Ta veille IA, jour après jour</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {STATS.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-2 rounded-xl border border-border bg-surface p-4"
          >
            <Icon size={18} className="text-zinc-400" strokeWidth={1.75} />
            <span className="text-[15px] font-bold text-white">{value}</span>
            <span className="text-[11px] text-zinc-500">{label}</span>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-surface p-4">
        <h2 className="text-[13px] font-semibold uppercase tracking-wide text-zinc-500">
          Historique
        </h2>
        <p className="mt-2 text-[13px] leading-relaxed text-zinc-400">
          Ton historique de veille (items vus, sauvegardés, partagés) s&apos;affichera ici.
        </p>
      </div>
    </div>
  );
}
