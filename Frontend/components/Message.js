import { OWNER_NAME } from "@/lib/config";

function Avatar({ role }) {
  if (role === "user") {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-xs font-medium text-slate-300">
        You
      </div>
    );
  }

  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent-500 to-indigo-500 text-xs font-semibold text-ink-950">
      {OWNER_NAME.charAt(0)}
    </div>
  );
}

export default function Message({ role, content, error }) {
  const isUser = role === "user";

  return (
    <div className="animate-fade-up flex gap-3">
      <Avatar role={role} />

      <div className="min-w-0 flex-1 pt-0.5">
        <p className="mb-1 text-xs font-medium text-slate-500">
          {isUser ? "You" : `${OWNER_NAME}'s assistant`}
        </p>

        <div
          className={[
            "inline-block max-w-full rounded-2xl px-4 py-3 text-sm leading-relaxed",
            isUser
              ? "border border-white/10 bg-white/[0.06] text-slate-100"
              : error
              ? "border border-rose-500/30 bg-rose-500/10 text-rose-200"
              : "border border-white/5 bg-ink-850 text-slate-200",
          ].join(" ")}
        >
          <p className="whitespace-pre-wrap break-words">{content}</p>
        </div>
      </div>
    </div>
  );
}
