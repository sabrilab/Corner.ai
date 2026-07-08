import Link from "next/link";
import type { ModelEntry } from "@/lib/types";
import { modelCategoryStyles } from "@/lib/theme";

export function ModelCard({ model, rank }: { model: ModelEntry; rank: number }) {
  const style = modelCategoryStyles[model.category];

  return (
    <Link
      href={`/classement/${model.slug}`}
      className={`flex items-center gap-3 rounded-2xl ${style.bg} p-4 transition-transform active:scale-[0.98]`}
    >
      <span className={`w-6 shrink-0 text-center text-[13px] font-extrabold tabular-nums ${style.text} opacity-50`}>
        {rank}
      </span>

      <div className="min-w-0 flex-1">
        <h3 className={`truncate text-[15px] font-extrabold tracking-tight ${style.text}`}>
          {model.name}
        </h3>
        <p className={`truncate text-[12px] font-medium ${style.text} opacity-60`}>{model.lab}</p>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-black/10">
          <div className={`h-full rounded-full ${style.solid}`} style={{ width: `${model.score}%` }} />
        </div>
      </div>

      <span className={`shrink-0 text-[17px] font-extrabold tabular-nums ${style.text}`}>
        {model.score}
      </span>
    </Link>
  );
}
