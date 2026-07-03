import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, ArrowUp, Bot, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

async function streamChat({
  messages, onDelta, onDone, onError,
}: {
  messages: Msg[];
  onDelta: (t: string) => void;
  onDone: () => void;
  onError: (e: string) => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages }),
  });

  if (!resp.ok) {
    const data = await resp.json().catch(() => ({}));
    if (resp.status === 429) return onError("I'm getting a lot of questions right now — try again in a moment.");
    if (resp.status === 402) return onError("The AI service is temporarily unavailable. Please use the contact form.");
    return onError(data.error || "Something went wrong. Please try again.");
  }
  if (!resp.body) return onError("No response body");

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let nl: number;
    while ((nl = buf.indexOf("\n")) !== -1) {
      let line = buf.slice(0, nl);
      buf = buf.slice(nl + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;
      const j = line.slice(6).trim();
      if (j === "[DONE]") { onDone(); return; }
      try {
        const p = JSON.parse(j);
        const c = p.choices?.[0]?.delta?.content;
        if (c) onDelta(c);
      } catch {
        buf = line + "\n" + buf;
        break;
      }
    }
  }
  onDone();
}

const quickQuestions = [
  "What services do you offer?",
  "What's your pricing?",
  "How do we get started?",
];

export function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Allow anywhere in the app to open the live chat via a global event
  useEffect(() => {
    const openHandler = () => setIsOpen(true);
    window.addEventListener("livechat:open", openHandler);
    return () => window.removeEventListener("livechat:open", openHandler);
  }, []);

  const send = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Msg = { role: "user", content: text.trim() };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setIsLoading(true);
    let acc = "";
    const upsert = (chunk: string) => {
      acc += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: acc } : m));
        }
        return [...prev, { role: "assistant", content: acc }];
      });
    };
    try {
      await streamChat({
        messages: [...messages, userMsg],
        onDelta: upsert,
        onDone: () => setIsLoading(false),
        onError: (e) => {
          setMessages((p) => [...p, { role: "assistant", content: e }]);
          setIsLoading(false);
        },
      });
    } catch {
      setMessages((p) => [...p, { role: "assistant", content: "Sorry, something went wrong." }]);
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] bg-background border border-foreground/15 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{ height: "min(560px, 78vh)" }}
          >
            {/* Header */}
            <div className="relative px-6 pt-5 pb-4 bg-gradient-to-b from-[hsl(24_100%_96%)] to-background border-b border-foreground/10">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-foreground/50 mb-3">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  § Live · Nauman Ellahi
                </span>
                <span>Reply · 12–24h</span>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="display-h2 text-2xl">
                  Chat with <span className="font-serif-italic text-foreground/70">us</span>
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-foreground/10 rounded-lg transition-colors text-foreground/60"
                  aria-label="Close chat"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Section marker */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-foreground/10 font-mono text-[10px] uppercase tracking-widest text-foreground/50">
              <span>✦ § 01 — Ask anything</span>
              <span>AI · Instant</span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {messages.length === 0 && (
                <div>
                  <h4 className="text-2xl font-semibold mb-1">
                    Welcome <span className="accent-underline font-serif-italic text-foreground/80">back</span>.
                  </h4>
                  <p className="text-sm text-foreground/60 mb-6">
                    Ask about services, pricing, or how we work together.
                  </p>
                  <div className="space-y-2">
                    {quickQuestions.map((q) => (
                      <button
                        key={q}
                        onClick={() => send(q)}
                        className="block w-full text-left text-sm px-4 py-3 rounded-xl border border-foreground/10 hover:border-foreground/40 hover:bg-foreground/[0.02] transition"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] px-4 py-2.5 text-sm rounded-2xl ${
                      msg.role === "user"
                        ? "bg-foreground text-background rounded-br-md"
                        : "bg-foreground/[0.04] border border-foreground/10 rounded-bl-md"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm max-w-none [&>p]:mb-1 [&>p:last-child]:mb-0">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}

              {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex gap-2 items-center">
                  <div className="w-6 h-6 rounded-full bg-foreground text-background grid place-items-center">
                    <Bot size={12} />
                  </div>
                  <div className="bg-foreground/[0.04] border border-foreground/10 rounded-2xl rounded-bl-md px-4 py-3">
                    <Loader2 size={14} className="animate-spin text-foreground/50" />
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="border-t border-foreground/10 p-3 flex items-center gap-2 bg-background"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message…"
                className="flex-1 px-4 py-3 text-sm bg-foreground/[0.04] rounded-full border border-transparent focus:outline-none focus:border-foreground/30 focus:bg-background transition"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition"
                aria-label="Send"
              >
                <ArrowUp size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger — bottom-right, editorial pill */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="inline-flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-full bg-foreground text-background shadow-lg font-mono text-[11px] uppercase tracking-widest hover:opacity-90 transition"
          aria-label={isOpen ? "Close chat" : "Open live chat"}
        >
          <span className="w-6 h-6 rounded-full bg-background/15 grid place-items-center">
            {isOpen ? <X size={13} /> : <MessageCircle size={13} />}
          </span>
          <span>{isOpen ? "Close" : "Chat"}</span>
        </motion.button>
      </div>
    </>
  );
}
