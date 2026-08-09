"use client";

import { useEffect, useRef } from "react";

function SendIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 animate-spin" aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
        opacity="0.25"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function ChatInput({ value, onChange, onSubmit, isLoading }) {
  const textareaRef = useRef(null);

  // Auto-grow the textarea up to a max height.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [value]);

  // Return focus to the input once a response finishes.
  useEffect(() => {
    if (!isLoading) textareaRef.current?.focus();
  }, [isLoading]);

  const canSend = value.trim().length > 0 && !isLoading;

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend) onSubmit();
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (canSend) onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-ink-900/80 p-2 shadow-xl shadow-black/30 backdrop-blur transition-colors focus-within:border-accent-500/50">
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder={
            isLoading ? "Waiting for a reply…" : "Ask about experience, skills, projects…"
          }
          aria-label="Ask a question"
          className="max-h-40 flex-1 resize-none bg-transparent px-3 py-2.5 text-sm leading-relaxed text-slate-100 placeholder:text-slate-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
        />

        <button
          type="submit"
          disabled={!canSend}
          aria-label={isLoading ? "Waiting for response" : "Send message"}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-500 text-ink-950 transition-all hover:bg-accent-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900 disabled:cursor-not-allowed disabled:bg-ink-700 disabled:text-slate-500"
        >
          {isLoading ? <SpinnerIcon /> : <SendIcon />}
        </button>
      </div>

      <p className="mt-2 text-center text-[11px] text-slate-600">
        Press Enter to send · Shift + Enter for a new line
      </p>
    </form>
  );
}
