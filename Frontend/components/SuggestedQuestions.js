"use client";

import { SUGGESTED_QUESTIONS } from "@/lib/config";

export default function SuggestedQuestions({ onSelect, disabled }) {
  return (
    <div className="animate-fade-up">
      <p className="mb-3 text-center text-xs font-medium uppercase tracking-widest text-slate-500">
        Try one of these
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        {SUGGESTED_QUESTIONS.map((q) => (
          <button
            key={q.title}
            type="button"
            onClick={() => onSelect(q.text)}
            disabled={disabled}
            className="group h-full rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition-all hover:-translate-y-0.5 hover:border-accent-500/40 hover:bg-white/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/60 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            <span className="block text-sm font-medium text-slate-200">
              {q.title}
            </span>
            <span className="mt-1.5 block text-xs leading-relaxed text-slate-500 group-hover:text-slate-400">
              {q.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
