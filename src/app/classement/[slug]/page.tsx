import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Check } from "lucide-react";
import { getModelBySlug } from "@/lib/mock-data";

export default async function ModelDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const model = getModelBySlug(slug);
  if (!model) notFound();

  return (
    <div className="flex flex-col gap-6 pb-4">
      <Link
        href="/classement"
        className="flex items-center gap-1 text-[13px] font-medium text-zinc-400"
      >
        <ChevronLeft size={16} />
        Classement
      </Link>

      <div>
        <p className="text-[12px] font-medium uppercase tracking-wide text-zinc-500">
          {model.lab} · {model.category}
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">
          {model.name}
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-zinc-400">
          {model.description}
        </p>
      </div>

      <div className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4">
        <span className="text-4xl font-bold tabular-nums text-white">{model.score}</span>
        <span className="text-[13px] leading-snug text-zinc-500">
          Score agrégé
          <br />
          sur 100
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-[13px] font-semibold uppercase tracking-wide text-zinc-500">
          Détail des sources
        </h2>
        {model.sources.map((s) => (
          <div key={s.name} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-[13px] text-zinc-400">{s.name}</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-800">
              <div className="h-full rounded-full bg-white" style={{ width: `${s.score}%` }} />
            </div>
            <span className="w-6 shrink-0 text-right text-[13px] font-medium text-white">
              {s.score}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-[13px] font-semibold uppercase tracking-wide text-zinc-500">
          Points forts
        </h2>
        {model.strengths.map((s) => (
          <div key={s} className="flex items-center gap-2 text-[14px] text-zinc-300">
            <Check size={15} className="text-emerald-400" strokeWidth={2} />
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}
