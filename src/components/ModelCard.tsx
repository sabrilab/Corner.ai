import Link from "next/link";
import type { ModelEntry } from "@/lib/types";

export function ModelCard({ model, rank }: { model: ModelEntry; rank: number }) {
  return (
    <Link
      href={`/classement/${model.slug}`}
      className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4 transition-colors active:bg-zinc-900"
    >
      <span className="w-5 shrink-0 text-center text-[13px] font-semibold tabular-nums text-zinc-500">
        {rank}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-[15px] font-semibold tracking-tight text-white">
            {model.name}
          </h3>
        </div>
        <p className="truncate text-[12px] text-zinc-500">{model.lab}</p>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-white"
            style={{ width: `${model.score}%` }}
          />
        </div>
      </div>

      <span className="shrink-0 text-[15px] font-bold tabular-nums text-white">
        {model.score}
      </span>
    </Link>
  );
}
