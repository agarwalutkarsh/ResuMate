"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import ChatInput from "./ChatInput";
import Message from "./Message";
import SuggestedQuestions from "./SuggestedQuestions";
import TypingIndicator from "./TypingIndicator";
import Welcome from "./Welcome";
import { askQuestion } from "@/lib/api";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const bottomRef = useRef(null);
  const idRef = useRef(0);

  const hasStarted = messages.length > 0;

  useEffect(() => {
    if (hasStarted) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, isLoading, hasStarted]);

  const send = useCallback(
    async (rawText) => {
      const question = rawText.trim();
      if (!question || isLoading) return;

      const userId = ++idRef.current;
      setMessages((prev) => [
        ...prev,
        { id: userId, role: "user", content: question },
      ]);
      setInput("");
      setIsLoading(true);

      try {
        const answer = await askQuestion(question);
        setMessages((prev) => [
          ...prev,
          { id: ++idRef.current, role: "assistant", content: answer },
        ]);
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          {
            id: ++idRef.current,
            role: "assistant",
            error: true,
            content:
              err?.message ||
              "Something went wrong while fetching the answer. Please try again.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading]
  );

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col">
      {/* Scrollable conversation area */}
      <div className="thin-scroll flex-1 overflow-y-auto">
        <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col px-4 sm:px-6">
          {!hasStarted ? (
            <div className="flex flex-1 flex-col justify-center py-10">
              <Welcome />
              <div className="mt-10">
                <SuggestedQuestions onSelect={send} disabled={isLoading} />
              </div>
            </div>
          ) : (
            <div className="space-y-6 py-8">
              {messages.map((m) => (
                <Message
                  key={m.id}
                  role={m.role}
                  content={m.content}
                  error={m.error}
                />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </div>

      {/* Composer */}
      <div className="border-t border-white/5 bg-ink-950/70 backdrop-blur-xl">
        <div className="mx-auto w-full max-w-3xl px-4 py-4 sm:px-6">
          <ChatInput
            value={input}
            onChange={setInput}
            onSubmit={() => send(input)}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
