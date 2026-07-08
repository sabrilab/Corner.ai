import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Check } from "lucide-react";
import { getModelBySlug } from "@/lib/mock-data";
import { modelCategoryStyles } from "@/lib/theme";

export default async function ModelDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const model = getModelBySlug(slug);
  if (!model) notFound();

  const style = modelCategoryStyles[model.category];

  return (
    <div className="flex flex-col gap-6 pb-4">
      <Link href="/classement" className="flex items-center gap-1 text-[13px] font-semibold text-foreground/50">
        <ChevronLeft size={16} />
        Classement
      </Link>

      <div className={`rounded-3xl ${style.bg} p-5`}>
        <p className={`text-[12px] font-bold uppercase tracking-wide ${style.text} opacity-60`}>
          {model.lab} · {style.label}
        </p>
        <h1 className={`mt-1 text-2xl font-extrabold tracking-tight ${style.text}`}>{model.name}</h1>
        <p className={`mt-2 text-[14px] leading-relaxed ${style.text} opacity-80`}>{model.description}</p>
      </div>

      <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4">
        <span className="text-4xl font-extrabold tabular-nums text-foreground">{model.score}</span>
        <span className="text-[13px] font-medium leading-snug text-foreground/50">
          Score agrégé
          <br />
          sur 100
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-[13px] font-bold uppercase tracking-wide text-foreground/40">
          Détail des sources
        </h2>
        {model.sources.map((s) => (
          <div key={s.name} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-[13px] font-medium text-foreground/60">{s.name}</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/10">
              <div className={`h-full rounded-full ${style.solid}`} style={{ width: `${s.score}%` }} />
            </div>
            <span className="w-6 shrink-0 text-right text-[13px] font-bold text-foreground">
              {s.score}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-[13px] font-bold uppercase tracking-wide text-foreground/40">
          Points forts
        </h2>
        {model.strengths.map((s) => (
          <div key={s} className="flex items-center gap-2 text-[14px] font-medium text-foreground/80">
            <Check size={15} className="text-emerald-500" strokeWidth={2.5} />
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}
