"use client";

import { useState, useEffect } from "react";
import { Trash2, Loader2, MailOpen, Mail, CheckCircle2 } from "lucide-react";

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/messages");
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      await fetch(`/api/messages/${id}`, { method: "DELETE" });
      setMessages(messages.filter((m) => m.id !== id));
    } catch (error) {
      alert("Failed to delete message");
    }
  };

  const toggleReadStatus = async (id: string, currentRead: boolean) => {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: !currentRead }),
      });
      if (res.ok) {
        setMessages(
          messages.map((m) => (m.id === id ? { ...m, read: !currentRead } : m))
        );
      }
    } catch {
      alert("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-violet" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-3xl font-heading font-bold text-content">Messages</h2>
        <p className="text-content-dim mt-2">Manage inquiries from your contact form.</p>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        {messages.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <CheckCircle2 size={48} className="text-emerald-500 mb-4" />
            <p className="text-content font-medium text-lg">Inbox Zero</p>
            <p className="text-content-dim">You don't have any messages yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-subtle">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`p-6 transition-colors ${!message.read ? 'bg-[var(--subtle-hover)]' : ''}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className={`text-lg ${!message.read ? 'font-bold text-content' : 'font-medium text-content-dim'}`}>
                        {message.name}
                      </h3>
                      {!message.read && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-coral/10 text-coral font-bold">
                          New
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-content-dim mb-4">
                      <a href={`mailto:${message.email}`} className="text-violet hover:underline">
                        {message.email}
                      </a>
                      <span>•</span>
                      <span>{new Date(message.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="bg-[var(--input-bg)] p-4 rounded-xl text-content border border-subtle whitespace-pre-wrap">
                      {message.message}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => toggleReadStatus(message.id, message.read)}
                      className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
                        message.read 
                          ? 'text-content-dim hover:text-violet hover:bg-violet/10' 
                          : 'text-violet bg-violet/10 hover:bg-violet/20'
                      }`}
                      title={message.read ? "Mark as unread" : "Mark as read"}
                    >
                      {message.read ? <Mail size={18} /> : <MailOpen size={18} />}
                    </button>
                    <button
                      onClick={() => handleDelete(message.id)}
                      className="p-2 text-content-dim hover:text-red-500 rounded-lg hover:bg-red-500/10 transition-colors flex items-center justify-center"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
