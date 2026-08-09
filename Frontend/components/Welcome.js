import { OWNER_NAME } from "@/lib/config";

export default function Welcome() {
  return (
    <div className="animate-fade-up text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-500 to-indigo-500 text-2xl font-semibold text-ink-950 shadow-xl shadow-accent-600/20">
        {OWNER_NAME.charAt(0)}
      </div>

      <h2 className="text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
        Hi, I&apos;m {OWNER_NAME}&apos;s AI assistant
      </h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-400 sm:text-base">
        Ask me anything about {OWNER_NAME}&apos;s experience, skills, education
        or projects — I&apos;ll answer straight from the resume.
      </p>
    </div>
  );
}
