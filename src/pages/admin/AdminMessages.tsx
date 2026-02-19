import { useState } from "react";
import { useContactMessages, useUpdateContactMessage, useDeleteContactMessage } from "@/hooks/usePortfolioData";
import { useToast } from "@/hooks/use-toast";
import { Mail, MailOpen, Trash2, Reply, Search, Inbox, Clock, User, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

export default function AdminMessages() {
  const { data: messages, isLoading } = useContactMessages();
  const updateMessage = useUpdateContactMessage();
  const deleteMessage = useDeleteContactMessage();
  const { toast } = useToast();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [search, setSearch] = useState("");

  const handleMarkRead = async (id: string, is_read: boolean) => {
    try {
      await updateMessage.mutateAsync({ id, is_read });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    try {
      await deleteMessage.mutateAsync(id);
      toast({ title: "Message deleted!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const filtered = messages?.filter((m: any) => {
    if (filter === "unread" && m.is_read) return false;
    if (filter === "read" && !m.is_read) return false;
    if (search) {
      const s = search.toLowerCase();
      return m.name?.toLowerCase().includes(s) || m.email?.toLowerCase().includes(s) || m.subject?.toLowerCase().includes(s) || m.message?.toLowerCase().includes(s);
    }
    return true;
  });

  const unreadCount = messages?.filter((m: any) => !m.is_read).length || 0;
  const totalCount = messages?.length || 0;

  if (isLoading) return <div className="flex items-center justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-gray-800 rounded-full" /></div>;

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold" style={{ color: "hsl(var(--admin-fg))" }}>
            Inbox
          </h1>
          <p className="text-sm mt-1" style={{ color: "hsl(var(--admin-muted-fg))" }}>
            {totalCount} messages • {unreadCount} unread
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "hsl(var(--admin-muted-fg))" }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search messages..."
            className="admin-input-bordered pl-10 w-full"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "unread", "read"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${filter === f ? "bg-gray-900 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
              style={filter === f ? {} : { color: "hsl(var(--admin-fg))" }}
            >
              {f === "all" ? "All" : f === "unread" ? `Unread (${unreadCount})` : "Read"}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      <div className="admin-card-bordered rounded-xl overflow-hidden divide-y divide-gray-100">
        {filtered?.map((msg: any) => {
          const isExpanded = expandedId === msg.id;
          return (
            <div
              key={msg.id}
              className={`transition-colors ${!msg.is_read ? "bg-blue-50/50" : "bg-white"}`}
            >
              {/* Message Row */}
              <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => {
                  setExpandedId(isExpanded ? null : msg.id);
                  if (!msg.is_read) handleMarkRead(msg.id, true);
                }}
              >
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold ${!msg.is_read ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                  {msg.name?.charAt(0)?.toUpperCase() || "?"}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${!msg.is_read ? "font-semibold" : "font-medium"}`} style={{ color: "hsl(var(--admin-fg))" }}>
                      {msg.name}
                    </span>
                    {!msg.is_read && <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
                  </div>
                  <p className="text-sm truncate" style={{ color: msg.subject ? "hsl(var(--admin-fg))" : "hsl(var(--admin-muted-fg))" }}>
                    {msg.subject || msg.message}
                  </p>
                </div>

                {/* Time & Actions */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs" style={{ color: "hsl(var(--admin-muted-fg))" }}>
                    {formatTime(msg.received_at)}
                  </span>
                  {isExpanded ? <ChevronUp size={16} style={{ color: "hsl(var(--admin-muted-fg))" }} /> : <ChevronDown size={16} style={{ color: "hsl(var(--admin-muted-fg))" }} />}
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-5 pb-5 border-t border-gray-100">
                  <div className="mt-4 ml-14">
                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-sm mb-4" style={{ color: "hsl(var(--admin-muted-fg))" }}>
                      <span className="flex items-center gap-1"><User size={14} /> {msg.name}</span>
                      <span className="flex items-center gap-1"><Mail size={14} /> {msg.email}</span>
                      <span className="flex items-center gap-1"><Clock size={14} /> {new Date(msg.received_at).toLocaleString()}</span>
                    </div>

                    {/* Subject */}
                    {msg.subject && (
                      <h3 className="font-semibold text-base mb-3" style={{ color: "hsl(var(--admin-fg))" }}>
                        {msg.subject}
                      </h3>
                    )}

                    {/* Message Body */}
                    <div className="p-4 rounded-lg bg-gray-50 mb-4">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "hsl(var(--admin-fg))" }}>
                        {msg.message}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <a
                        href={`mailto:${msg.email}?subject=Re: ${msg.subject || "Your inquiry"}`}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        <Reply size={14} /> Reply
                      </a>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleMarkRead(msg.id, !msg.is_read); }}
                        className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition-colors"
                        style={{ color: "hsl(var(--admin-fg))" }}
                        title={msg.is_read ? "Mark unread" : "Mark read"}
                      >
                        {msg.is_read ? <MailOpen size={14} /> : <Mail size={14} />}
                        {msg.is_read ? "Mark Unread" : "Mark Read"}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }}
                        className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-red-50 text-red-600 transition-colors ml-auto"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Empty State */}
        {(!filtered || filtered.length === 0) && (
          <div className="py-16 text-center">
            <Inbox size={48} className="mx-auto mb-4" style={{ color: "hsl(var(--admin-muted-fg))" }} />
            <p className="font-medium" style={{ color: "hsl(var(--admin-fg))" }}>
              {search ? "No messages match your search" : filter !== "all" ? "No messages in this filter" : "No messages yet"}
            </p>
            <p className="text-sm mt-1" style={{ color: "hsl(var(--admin-muted-fg))" }}>
              Messages from your contact form will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
