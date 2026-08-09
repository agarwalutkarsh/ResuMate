import { OWNER_NAME } from "@/lib/config";

export default function TypingIndicator() {
  return (
    <div className="animate-fade-up flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent-500 to-indigo-500 text-xs font-semibold text-ink-950">
        {OWNER_NAME.charAt(0)}
      </div>

      <div className="pt-0.5">
        <p className="mb-1 text-xs font-medium text-slate-500">
          {OWNER_NAME}&apos;s assistant
        </p>
        <div className="inline-flex items-center gap-1.5 rounded-2xl border border-white/5 bg-ink-850 px-4 py-4">
          <span className="h-1.5 w-1.5 animate-blink rounded-full bg-slate-400" />
          <span
            className="h-1.5 w-1.5 animate-blink rounded-full bg-slate-400"
            style={{ animationDelay: "0.2s" }}
          />
          <span
            className="h-1.5 w-1.5 animate-blink rounded-full bg-slate-400"
            style={{ animationDelay: "0.4s" }}
          />
        </div>
      </div>
    </div>
  );
}
