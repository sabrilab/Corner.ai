import { Flame, Bookmark, Share2 } from "lucide-react";

const STATS = [
  { label: "Streak", value: "7 jours", icon: Flame, bg: "bg-orange-100", text: "text-orange-950", iconColor: "text-orange-500" },
  { label: "Sauvegardés", value: "12", icon: Bookmark, bg: "bg-sky-100", text: "text-sky-950", iconColor: "text-sky-500" },
  { label: "Partagés", value: "4", icon: Share2, bg: "bg-pink-100", text: "text-pink-950", iconColor: "text-pink-500" },
];

export default function ProfilPage() {
  return (
    <div className="flex flex-col gap-6 pb-4">
      <div className="flex flex-col items-center gap-3 pt-2 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 text-xl font-extrabold text-violet-950">
          S
        </div>
        <div>
          <h1 className="text-lg font-extrabold tracking-tight text-foreground">Sabri</h1>
          <p className="text-[13px] text-foreground/50">Ta veille IA, jour après jour</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {STATS.map(({ label, value, icon: Icon, bg, text, iconColor }) => (
          <div key={label} className={`flex flex-col items-center gap-2 rounded-2xl ${bg} p-4`}>
            <Icon size={18} className={iconColor} strokeWidth={2} />
            <span className={`text-[15px] font-extrabold ${text}`}>{value}</span>
            <span className={`text-[11px] font-medium ${text} opacity-60`}>{label}</span>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-surface p-4">
        <h2 className="text-[13px] font-bold uppercase tracking-wide text-foreground/40">
          Historique
        </h2>
        <p className="mt-2 text-[13px] leading-relaxed text-foreground/60">
          Ton historique de veille (items vus, sauvegardés, partagés) s&apos;affichera ici.
        </p>
      </div>
    </div>
  );
}
