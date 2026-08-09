'use client';

import { reset } from "@/lib/api";
import { OWNER_NAME } from "@/lib/config";

export default function Header() {
  const handleReset = async () => {
    await reset();
  };

  return (
    <header className="sticky top-0 z-20 border-b border-white/5 bg-ink-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-3xl items-center gap-3 px-4 sm:px-6">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-indigo-500 text-sm font-semibold text-ink-950 shadow-lg shadow-accent-600/20">
          {OWNER_NAME.charAt(0)}
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold tracking-tight text-slate-100">
            Ask {OWNER_NAME}
          </h1>
          <p className="truncate text-xs text-slate-500">
            AI assistant trained on {OWNER_NAME}&apos;s resume
          </p>
        </div>
        <div className="ml-auto flex gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400 transition hover:bg-white/10 sm:flex"
          >
            New chat
          </button>

          <span className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Online
          </span>
        </div>
      </div>
    </header>
  );
}
