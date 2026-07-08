import type { ReactNode } from "react";
import { TopNav } from "./TopNav";
import { BottomNav } from "./BottomNav";
import { PointsToastHost } from "./PointsToastHost";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <TopNav />
      <PointsToastHost />
      <main className="mx-auto w-full max-w-lg flex-1 px-4 pt-[calc(env(safe-area-inset-top,0px)+4.5rem)] pb-[calc(6rem+env(safe-area-inset-bottom,0px))]">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
