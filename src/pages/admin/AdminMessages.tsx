import { useContactMessages, useUpdateContactMessage, useDeleteContactMessage } from "@/hooks/usePortfolioData";
import { useToast } from "@/hooks/use-toast";
import { Mail, MailOpen, Trash2, Archive } from "lucide-react";

export default function AdminMessages() {
  const { data: messages, isLoading } = useContactMessages();
  const updateMessage = useUpdateContactMessage();
  const deleteMessage = useDeleteContactMessage();
  const { toast } = useToast();

  const handleMarkRead = async (id: string, is_read: boolean) => {
    try { await updateMessage.mutateAsync({ id, is_read }); } catch (error: any) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    try { await deleteMessage.mutateAsync(id); toast({ title: "Message deleted!" }); } catch (error: any) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
  };

  const unreadCount = messages?.filter((m: any) => !m.is_read).length || 0;

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-bold" style={{ color: "hsl(var(--admin-fg))" }}>Messages {unreadCount > 0 && <span className="ml-2 px-2 py-0.5 text-sm rounded-full" style={{ background: "hsl(var(--admin-accent))", color: "hsl(var(--admin-accent-fg))" }}>{unreadCount} new</span>}</h1>
      </div>

      <div className="space-y-4">
        {messages?.map((msg: any) => (
          <div key={msg.id} className="admin-card p-6" style={{ borderLeft: msg.is_read ? "none" : "3px solid hsl(var(--admin-accent))" }}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-semibold" style={{ color: "hsl(var(--admin-fg))" }}>{msg.name}</span>
                  <span style={{ color: "hsl(var(--admin-muted-fg))" }}>•</span>
                  <a href={`mailto:${msg.email}`} className="text-sm hover:underline" style={{ color: "hsl(var(--admin-muted-fg))" }}>{msg.email}</a>
                </div>
                {msg.subject && <div className="font-medium mb-2" style={{ color: "hsl(var(--admin-fg))" }}>{msg.subject}</div>}
                <p style={{ color: "hsl(var(--admin-muted-fg))" }}>{msg.message}</p>
                <div className="mt-3 text-sm" style={{ color: "hsl(var(--admin-muted-fg))" }}>{new Date(msg.received_at).toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleMarkRead(msg.id, !msg.is_read)} className="p-2 hover:bg-gray-100 rounded" title={msg.is_read ? "Mark as unread" : "Mark as read"}>{msg.is_read ? <MailOpen size={18} /> : <Mail size={18} />}</button>
                <a href={`mailto:${msg.email}?subject=Re: ${msg.subject || "Your inquiry"}`} className="p-2 hover:bg-gray-100 rounded" title="Reply"><Mail size={18} /></a>
                <button onClick={() => handleDelete(msg.id)} className="p-2 hover:bg-gray-100 rounded text-red-500" title="Delete"><Trash2 size={18} /></button>
              </div>
            </div>
          </div>
        ))}
        {(!messages || messages.length === 0) && <p style={{ color: "hsl(var(--admin-muted-fg))" }}>No messages yet.</p>}
      </div>
    </div>
  );
}