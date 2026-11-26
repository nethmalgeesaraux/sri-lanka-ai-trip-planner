"use client";

import { useEffect, useRef, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

const QUICK_PROMPTS = [
  "Best route from Colombo to Ella?",
  "Where to rest near Sigiriya?",
  "Current monsoon & weather tips?",
  "Hidden gems near Mirissa?",
];

export default function SupportChatWidget({
  pageName = "Home",
  dark = false,
}: {
  pageName?: string;
  dark?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Ayubowan! I'm your LankaTrails AI Support assistant. Ask me about Sri Lanka routes, places to rest, weather alerts, hidden gems, or budget tips.",
    },
  ]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open]);

  async function sendMessage(textToSend: string) {
    const trimmed = textToSend.trim();
    if (!trimmed || busy) return;

    const nextHistory = [...messages, { role: "user" as const, text: trimmed }];
    setMessages(nextHistory);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/travel/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-lankatrails-client": "1",
        },
        body: JSON.stringify({
          message: trimmed,
          page: pageName,
          history: nextHistory.slice(-6),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to reach AI support right now.");
      }
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.reply || "How else can I help?" },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            error instanceof Error
              ? error.message
              : "Sorry, AI support is temporarily unavailable.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {open && (
        <section
          aria-label="LankaTrails AI Support Chat"
          className={`animate-lt-fade-up flex h-[470px] w-[calc(100vw-2.5rem)] max-w-[380px] flex-col overflow-hidden rounded-2xl border shadow-2xl ${
            dark
              ? "border-[#2a4a6b] bg-[#0d243a] text-white"
              : "border-[#cce4d6] bg-white text-[#08233f]"
          }`}
        >
          <div className="flex items-center justify-between bg-gradient-to-r from-[#031d38] to-[#085c44] px-4 py-3 text-white">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1bc75c] text-xs font-extrabold text-[#031d38]">
                AI
              </span>
              <div>
                <p className="text-sm font-bold leading-tight">
                  LankaTrails AI Support
                </p>
                <p className="text-[11px] text-[#b7e36a]">
                  Online · Sri Lanka travel helper
                </p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Close AI Support"
              onClick={() => setOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-sm font-bold hover:bg-white/25"
            >
              ✕
            </button>
          </div>

          <div
            ref={listRef}
            className="flex-1 space-y-3 overflow-y-auto p-4 text-sm"
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-6 ${
                    m.role === "user"
                      ? "bg-[#087b35] text-white"
                      : dark
                        ? "bg-[#153554] text-slate-100"
                        : "bg-[#f1f8f4] text-[#08233f]"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {busy && (
              <div className="flex justify-start">
                <div
                  className={`rounded-2xl px-3.5 py-2 text-xs ${
                    dark
                      ? "bg-[#153554] text-slate-300"
                      : "bg-[#f1f8f4] text-slate-600"
                  }`}
                >
                  Thinking…
                </div>
              </div>
            )}
          </div>

          <div
            className={`flex gap-1.5 overflow-x-auto border-t px-3 py-2 ${
              dark ? "border-[#23415f]" : "border-slate-100"
            }`}
          >
            {QUICK_PROMPTS.map((q) => (
              <button
                key={q}
                type="button"
                disabled={busy}
                onClick={() => void sendMessage(q)}
                className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition ${
                  dark
                    ? "border-[#2c5275] bg-[#13304d] text-[#b7e36a] hover:bg-[#1a3e63]"
                    : "border-[#cce4d6] bg-[#f5faf7] text-[#087947] hover:bg-[#e5f5ec]"
                }`}
              >
                {q}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void sendMessage(input);
            }}
            className={`flex items-center gap-2 border-t p-3 ${
              dark ? "border-[#23415f]" : "border-slate-200"
            }`}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about Sri Lanka…"
              maxLength={800}
              className={`min-h-10 flex-1 rounded-full border px-4 text-sm outline-none focus:ring-2 focus:ring-[#1bc75c] ${
                dark
                  ? "border-[#2c5275] bg-[#13304d] text-white placeholder:text-slate-400"
                  : "border-slate-300 bg-white text-[#08233f]"
              }`}
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="min-h-10 rounded-full bg-gradient-to-r from-[#087b35] to-[#007b75] px-4 text-xs font-bold text-white disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Toggle AI Support Assistant"
        className="animate-lt-float flex min-h-12 items-center gap-2.5 rounded-full bg-gradient-to-r from-[#087b35] to-[#007b75] px-5 py-3 text-sm font-bold text-white shadow-xl ring-2 ring-white/80 transition hover:brightness-110 focus-visible:ring-4 focus-visible:ring-lime-300"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#b7e36a] text-xs font-extrabold text-[#031d38]">
          AI
        </span>
        <span>{open ? "Close Support" : "AI Travel Support"}</span>
      </button>
    </div>
  );
}
