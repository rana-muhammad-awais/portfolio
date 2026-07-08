"use client";

import { useState, useEffect } from "react";
import { Plus, Edit3, Trash2, GripVertical, Loader2, Eye, EyeOff, GraduationCap, Briefcase } from "lucide-react";
import Link from "next/link";

export default function ExperiencePage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperience();
  }, []);

  const fetchExperience = async () => {
    try {
      const res = await fetch("/api/experience");
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error("Failed to fetch experience");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;
    try {
      await fetch(`/api/experience/${id}`, { method: "DELETE" });
      setItems(items.filter((item) => item.id !== id));
    } catch (error) {
      alert("Failed to delete entry");
    }
  };

  const toggleVisibility = async (id: string, currentVisible: boolean) => {
    try {
      const res = await fetch(`/api/experience/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visible: !currentVisible }),
      });
      if (res.ok) {
        setItems(
          items.map((item) =>
            item.id === id ? { ...item, visible: !currentVisible } : item
          )
        );
      }
    } catch {
      alert("Failed to update visibility");
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
    <div className="max-w-5xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-heading font-bold text-content">Experience & Education</h2>
          <p className="text-content-dim mt-2">Manage your timeline entries.</p>
        </div>
        <Link
          href="/admin/experience/new"
          className="flex items-center gap-2 px-6 py-3 bg-violet text-white rounded-xl font-medium hover:bg-violet/90 transition-colors"
        >
          <Plus size={18} />
          Add Entry
        </Link>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        {items.length === 0 ? (
          <div className="p-8 text-center text-content-dim">
            No entries found. Click "Add Entry" to create one.
          </div>
        ) : (
          <div className="divide-y divide-subtle">
            {items.map((item) => (
              <div key={item.id} className="p-6 flex items-center gap-6 group hover:bg-[var(--subtle-hover)] transition-colors">
                <div className="cursor-move text-content-dim/30 group-hover:text-content-dim transition-colors">
                  <GripVertical size={20} />
                </div>
                
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  item.type === 'education' ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'
                }`}>
                  {item.type === 'education' ? <GraduationCap size={24} /> : <Briefcase size={24} />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-content truncate">{item.role}</h3>
                    {!item.visible && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/10 text-red-500 font-medium">
                        Hidden
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-content-dim">
                    <span className="font-medium text-violet">{item.company}</span>
                    <span>•</span>
                    <span>{item.period}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleVisibility(item.id, item.visible)}
                    className="p-2 text-content-dim hover:text-content rounded-lg hover:bg-[var(--input-bg)] transition-colors"
                    title={item.visible ? "Hide from site" : "Show on site"}
                  >
                    {item.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  <Link
                    href={`/admin/experience/${item.id}`}
                    className="p-2 text-content-dim hover:text-blue-500 rounded-lg hover:bg-blue-500/10 transition-colors"
                    title="Edit"
                  >
                    <Edit3 size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-content-dim hover:text-red-500 rounded-lg hover:bg-red-500/10 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
