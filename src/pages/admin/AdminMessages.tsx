import { useMemo, useState, useEffect, useRef } from "react";
import { useContactMessages, useUpdateContactMessage, useDeleteContactMessage } from "@/hooks/usePortfolioData";
import { useToast } from "@/hooks/use-toast";
import {
  Search, Inbox, CheckCircle2, Check, CheckCheck, Trash2, Reply, Mail, MailOpen,
  Phone, MoreVertical, Send, Paperclip, Smile, ArrowLeft, Filter, Star, Archive,
} from "lucide-react";

type Msg = any;

type Thread = {
  email: string;
  name: string;
  messages: Msg[];
  last: Msg;
  unread: number;
  hasUnreplied: boolean;
};

const AVATAR_COLORS = [
  "from-neutral-800 to-neutral-950",
  "from-zinc-700 to-black",
  "from-stone-700 to-neutral-900",
  "from-gray-700 to-black",
  "from-neutral-900 to-zinc-700",
];

function hashPick<T>(str: string, arr: T[]): T {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return arr[Math.abs(h) % arr.length];
}

function initials(name?: string, email?: string) {
  const src = (name || email || "?").trim();
  const parts = src.split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return src.slice(0, 2).toUpperCase();
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const yest = new Date(now); yest.setDate(now.getDate() - 1);
  if (d.toDateString() === yest.toDateString()) return "Yesterday";
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays < 7) return d.toLocaleDateString([], { weekday: "short" });
  return d.toLocaleDateString([], { day: "2-digit", month: "2-digit", year: "2-digit" });
}

function formatDayLabel(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return "Today";
  const yest = new Date(now); yest.setDate(now.getDate() - 1);
  if (d.toDateString() === yest.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

export default function AdminMessages() {
  const { data: messages, isLoading } = useContactMessages();
  const updateMessage = useUpdateContactMessage();
  const deleteMessage = useDeleteContactMessage();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "unreplied" | "replied">("all");
  const [activeEmail, setActiveEmail] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Group messages by email into threads
  const threads = useMemo<Thread[]>(() => {
    if (!messages) return [];
    const map = new Map<string, Thread>();
    for (const m of messages as Msg[]) {
      const key = (m.email || "unknown").toLowerCase();
      if (!map.has(key)) {
        map.set(key, { email: m.email, name: m.name || m.email, messages: [], last: m, unread: 0, hasUnreplied: false });
      }
      const t = map.get(key)!;
      t.messages.push(m);
    }
    for (const t of map.values()) {
      t.messages.sort((a, b) => new Date(a.received_at).getTime() - new Date(b.received_at).getTime());
      t.last = t.messages[t.messages.length - 1];
      t.unread = t.messages.filter((m) => !m.is_read).length;
      t.hasUnreplied = t.messages.some((m) => !m.is_replied);
      t.name = t.last.name || t.name;
    }
    return Array.from(map.values()).sort(
      (a, b) => new Date(b.last.received_at).getTime() - new Date(a.last.received_at).getTime()
    );
  }, [messages]);

  const filteredThreads = threads.filter((t) => {
    if (filter === "unread" && t.unread === 0) return false;
    if (filter === "unreplied" && !t.hasUnreplied) return false;
    if (filter === "replied" && t.hasUnreplied) return false;
    if (search) {
      const s = search.toLowerCase();
      return (
        t.name?.toLowerCase().includes(s) ||
        t.email?.toLowerCase().includes(s) ||
        t.messages.some((m) => m.subject?.toLowerCase().includes(s) || m.message?.toLowerCase().includes(s))
      );
    }
    return true;
  });

  const activeThread = threads.find((t) => t.email?.toLowerCase() === activeEmail?.toLowerCase()) || null;

  // Auto-select first thread on desktop
  useEffect(() => {
    if (!activeEmail && filteredThreads[0]) {
      setActiveEmail(filteredThreads[0].email);
    }
  }, [filteredThreads, activeEmail]);

  // Mark unread messages read when opening a thread
  useEffect(() => {
    if (!activeThread) return;
    activeThread.messages.forEach((m) => {
      if (!m.is_read) updateMessage.mutateAsync({ id: m.id, is_read: true }).catch(() => {});
    });
    // scroll to bottom
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeEmail]);

  const totalCount = messages?.length || 0;
  const unreadCount = messages?.filter((m: Msg) => !m.is_read).length || 0;
  const unrepliedCount = messages?.filter((m: Msg) => !m.is_replied).length || 0;

  const handleToggleReplied = async (msg: Msg, next?: boolean) => {
    try {
      const nextReplied = typeof next === "boolean" ? next : !msg.is_replied;
      await updateMessage.mutateAsync({
        id: msg.id,
        is_replied: nextReplied,
        replied_at: nextReplied ? new Date().toISOString() : null,
        is_read: true,
      });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    try {
      await deleteMessage.mutateAsync(id);
      toast({ title: "Message deleted" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const handleSend = () => {
    if (!draft.trim() || !activeThread) return;
    const subj = activeThread.last.subject ? `Re: ${activeThread.last.subject}` : "Re: your message";
    const body = encodeURIComponent(draft);
    window.location.href = `mailto:${activeThread.email}?subject=${encodeURIComponent(subj)}&body=${body}`;
    // Mark last message as replied
    handleToggleReplied(activeThread.last, true);
    setDraft("");
    toast({ title: "Opening your email client…" });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-neutral-300 border-t-neutral-900 rounded-full" />
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="text-2xl font-display font-bold" style={{ color: "hsl(var(--admin-fg))" }}>
            Message Center
          </h1>
          <p className="text-sm mt-1" style={{ color: "hsl(var(--admin-muted-fg))" }}>
            {totalCount} conversations · {unreadCount} unread · {unrepliedCount} awaiting reply
          </p>
        </div>
      </div>

      {/* WhatsApp-style shell */}
      <div
        className="admin-card-bordered overflow-hidden"
        style={{
          borderRadius: 22,
          height: "calc(100vh - 220px)",
          minHeight: 560,
          padding: 0,
          background: "linear-gradient(180deg, hsl(0 0% 100%), hsl(0 0% 98.5%))",
        }}
      >
        <div className="grid h-full" style={{ gridTemplateColumns: "minmax(300px, 380px) 1fr" }}>
          {/* ============ LEFT COLUMN — CHAT LIST ============ */}
          <aside
            className={`flex flex-col border-r ${activeThread ? "hidden md:flex" : "flex"}`}
            style={{ borderColor: "hsl(var(--admin-border))", background: "hsl(0 0% 99%)" }}
          >
            {/* Search + filters */}
            <div className="p-4 border-b" style={{ borderColor: "hsl(var(--admin-border))" }}>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search or start new chat"
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-full bg-neutral-100 border border-transparent focus:bg-white focus:border-neutral-300 focus:outline-none transition-colors"
                />
              </div>
              <div className="flex gap-1.5 mt-3 overflow-x-auto no-scrollbar">
                {([
                  ["all", "All", totalCount],
                  ["unread", "Unread", unreadCount],
                  ["unreplied", "Pending", unrepliedCount],
                  ["replied", "Replied", totalCount - unrepliedCount],
                ] as const).map(([k, label, count]) => (
                  <button
                    key={k}
                    onClick={() => setFilter(k as any)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all ${
                      filter === k
                        ? "bg-neutral-900 text-white shadow-sm"
                        : "bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-400"
                    }`}
                  >
                    {label}
                    <span
                      className={`min-w-[16px] px-1 rounded-full text-[10px] ${
                        filter === k ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Thread list */}
            <div className="flex-1 overflow-y-auto">
              {filteredThreads.length === 0 && (
                <div className="p-8 text-center">
                  <Inbox size={36} className="mx-auto mb-3 text-neutral-300" />
                  <p className="text-sm font-medium text-neutral-700">No conversations</p>
                  <p className="text-xs text-neutral-500 mt-1">
                    {search ? "Try a different search" : "New messages will appear here"}
                  </p>
                </div>
              )}
              {filteredThreads.map((t) => {
                const isActive = activeEmail === t.email;
                const avatarGrad = hashPick(t.email || t.name || "?", AVATAR_COLORS);
                return (
                  <button
                    key={t.email}
                    onClick={() => setActiveEmail(t.email)}
                    className={`w-full text-left flex gap-3 px-4 py-3 border-b transition-colors relative ${
                      isActive ? "bg-neutral-100" : "hover:bg-neutral-50"
                    }`}
                    style={{ borderColor: "hsl(var(--admin-border) / 0.4)" }}
                  >
                    {isActive && <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-neutral-900" />}
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-br ${avatarGrad} text-white flex items-center justify-center text-sm font-semibold flex-shrink-0 shadow-sm ring-1 ring-black/5`}
                    >
                      {initials(t.name, t.email)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-sm truncate ${t.unread > 0 ? "font-bold text-neutral-900" : "font-semibold text-neutral-800"}`}
                        >
                          {t.name}
                        </span>
                        <span className={`text-[11px] flex-shrink-0 ${t.unread > 0 ? "text-neutral-900 font-semibold" : "text-neutral-500"}`}>
                          {formatTime(t.last.received_at)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        <p className={`text-xs truncate flex items-center gap-1 ${t.unread > 0 ? "text-neutral-800" : "text-neutral-500"}`}>
                          {t.last.is_replied && <CheckCheck size={13} className="text-neutral-500 flex-shrink-0" />}
                          <span className="truncate">{t.last.subject ? `${t.last.subject} — ` : ""}{t.last.message}</span>
                        </p>
                        {t.unread > 0 ? (
                          <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-neutral-900 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                            {t.unread}
                          </span>
                        ) : t.hasUnreplied ? (
                          <span className="w-2 h-2 rounded-full bg-neutral-400 flex-shrink-0" title="Awaiting reply" />
                        ) : null}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* ============ RIGHT COLUMN — CONVERSATION ============ */}
          <section
            className={`flex flex-col ${activeThread ? "flex" : "hidden md:flex"}`}
            style={{
              backgroundColor: "hsl(0 0% 97%)",
              backgroundImage:
                "radial-gradient(hsl(0 0% 0% / 0.035) 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }}
          >
            {!activeThread ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
                <div className="w-24 h-24 rounded-full bg-white border border-neutral-200 flex items-center justify-center mb-6 shadow-sm">
                  <Mail size={40} className="text-neutral-400" />
                </div>
                <h2 className="text-xl font-display font-semibold text-neutral-900">Message Center</h2>
                <p className="text-sm text-neutral-500 mt-2 max-w-sm">
                  Select a conversation from the left to read messages and reply.
                </p>
              </div>
            ) : (
              <>
                {/* Chat header */}
                <header
                  className="flex items-center gap-3 px-5 py-3 border-b bg-white/90 backdrop-blur"
                  style={{ borderColor: "hsl(var(--admin-border))" }}
                >
                  <button
                    className="md:hidden p-1 rounded hover:bg-neutral-100"
                    onClick={() => setActiveEmail(null)}
                    aria-label="Back"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${hashPick(activeThread.email, AVATAR_COLORS)} text-white flex items-center justify-center text-sm font-semibold ring-1 ring-black/5`}
                  >
                    {initials(activeThread.name, activeThread.email)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-neutral-900 truncate">{activeThread.name}</h3>
                      {activeThread.hasUnreplied ? (
                        <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-neutral-900 text-white">
                          Pending
                        </span>
                      ) : (
                        <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600 border border-neutral-200">
                          Replied
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 truncate">
                      {activeThread.email} · {activeThread.messages.length} message{activeThread.messages.length > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <a
                      href={`mailto:${activeThread.email}`}
                      className="p-2 rounded-full hover:bg-neutral-100 text-neutral-600"
                      title="Email"
                    >
                      <Mail size={16} />
                    </a>
                    <button
                      onClick={() => handleToggleReplied(activeThread.last)}
                      className="p-2 rounded-full hover:bg-neutral-100 text-neutral-600"
                      title={activeThread.last.is_replied ? "Mark as not replied" : "Mark as replied"}
                    >
                      <CheckCircle2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(activeThread.last.id)}
                      className="p-2 rounded-full hover:bg-red-50 text-neutral-600 hover:text-red-600"
                      title="Delete latest"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </header>

                {/* Messages scroll area */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
                  {(() => {
                    let lastDay = "";
                    return activeThread.messages.map((m: Msg) => {
                      const day = formatDayLabel(m.received_at);
                      const showDay = day !== lastDay;
                      lastDay = day;
                      return (
                        <div key={m.id}>
                          {showDay && (
                            <div className="flex justify-center my-4">
                              <span className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-white border border-neutral-200 text-neutral-600 shadow-sm">
                                {day}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-start mb-2 group">
                            <div className="max-w-[75%] relative">
                              <div
                                className="bg-white border border-neutral-200 rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-sm"
                                style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
                              >
                                {m.subject && (
                                  <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                                    {m.subject}
                                  </p>
                                )}
                                <p className="text-sm text-neutral-900 whitespace-pre-wrap leading-relaxed">
                                  {m.message}
                                </p>
                                <div className="flex items-center justify-end gap-1 mt-1 -mb-1">
                                  <span className="text-[10px] text-neutral-400">
                                    {new Date(m.received_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                  </span>
                                  {m.is_replied ? (
                                    <CheckCheck size={12} className="text-neutral-900" />
                                  ) : m.is_read ? (
                                    <CheckCheck size={12} className="text-neutral-400" />
                                  ) : (
                                    <Check size={12} className="text-neutral-400" />
                                  )}
                                </div>
                              </div>
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-2 right-0 flex gap-1 bg-white border border-neutral-200 rounded-full px-1 py-0.5 shadow-sm">
                                <button
                                  onClick={() => handleToggleReplied(m)}
                                  className="p-1 rounded-full hover:bg-neutral-100 text-neutral-500"
                                  title={m.is_replied ? "Mark as not replied" : "Mark as replied"}
                                >
                                  <CheckCircle2 size={12} />
                                </button>
                                <button
                                  onClick={() => handleDelete(m.id)}
                                  className="p-1 rounded-full hover:bg-red-50 text-neutral-500 hover:text-red-600"
                                  title="Delete"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>

                {/* Composer */}
                <footer
                  className="px-3 md:px-5 py-3 border-t bg-white/90 backdrop-blur"
                  style={{ borderColor: "hsl(var(--admin-border))" }}
                >
                  <div className="flex items-end gap-2">
                    <button
                      type="button"
                      className="p-2.5 rounded-full text-neutral-500 hover:bg-neutral-100 hidden sm:inline-flex"
                      title="Attach (opens in email)"
                      disabled
                    >
                      <Paperclip size={18} />
                    </button>
                    <div className="flex-1 relative">
                      <textarea
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                          }
                        }}
                        rows={1}
                        placeholder={`Reply to ${activeThread.name}…`}
                        className="w-full resize-none max-h-32 rounded-3xl border border-neutral-200 bg-white pl-4 pr-10 py-3 text-sm focus:outline-none focus:border-neutral-400 shadow-sm"
                        style={{ minHeight: 44 }}
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-neutral-400 hover:text-neutral-700"
                        title="Emoji (coming soon)"
                        disabled
                      >
                        <Smile size={16} />
                      </button>
                    </div>
                    <button
                      onClick={handleSend}
                      disabled={!draft.trim()}
                      className="p-3 rounded-full bg-neutral-900 text-white hover:bg-black shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                      title="Send via email"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-2 text-center">
                    Press Enter to send · Shift+Enter for a new line · Reply opens in your email client
                  </p>
                </footer>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
