"use client";

import { useState, useEffect } from "react";
import { Save, Plus, Trash2, Loader2, GripVertical } from "lucide-react";

export default function StatsPage() {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data.length ? data : []);
        setLoading(false);
      });
  }, []);

  const handleChange = (index: number, field: string, value: any) => {
    const newStats = [...stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setStats(newStats);
  };

  const handleAddStat = () => {
    setStats([
      ...stats,
      {
        id: `temp-${Date.now()}`,
        value: 0,
        label: "",
        suffix: "",
        decimals: 0,
        sortOrder: stats.length,
      },
    ]);
  };

  const handleDelete = (index: number) => {
    const newStats = stats.filter((_, i) => i !== index);
    setStats(newStats.map((s, i) => ({ ...s, sortOrder: i })));
  };

  const moveStat = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === stats.length - 1)
    ) return;

    const newStats = [...stats];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    const temp = newStats[index];
    newStats[index] = newStats[newIndex];
    newStats[newIndex] = temp;
    
    setStats(newStats.map((s, i) => ({ ...s, sortOrder: i })));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/stats", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stats: stats.map((s, i) => ({ ...s, sortOrder: i })) }),
      });

      if (!res.ok) throw new Error("Failed to save");
      
      const updated = await res.json();
      setStats(updated);
      
      setMessage("Stats saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setMessage("Error saving stats");
    } finally {
      setSaving(false);
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-heading font-bold text-content">Stats</h2>
          <p className="text-content-dim mt-2">Manage the statistics shown in the About section.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-violet text-white rounded-xl font-medium hover:bg-violet/90 transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl ${message.includes("Error") ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-500"}`}>
          {message}
        </div>
      )}

      <div className="space-y-4">
        {stats.map((stat, i) => (
          <div key={stat.id} className="glass-card p-6 rounded-2xl flex gap-6 items-start">
            <div className="flex flex-col gap-2 text-content-dim pt-2">
              <button 
                onClick={() => moveStat(i, 'up')} 
                disabled={i === 0}
                className="hover:text-content disabled:opacity-30 disabled:hover:text-content-dim"
              >
                ▲
              </button>
              <button 
                onClick={() => moveStat(i, 'down')} 
                disabled={i === stats.length - 1}
                className="hover:text-content disabled:opacity-30 disabled:hover:text-content-dim"
              >
                ▼
              </button>
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-content-dim mb-1">Label</label>
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => handleChange(i, "label", e.target.value)}
                  placeholder="e.g. CGPA"
                  className="w-full px-4 py-2 bg-[var(--input-bg)] border border-subtle rounded-xl text-content focus:border-violet/40 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-content-dim mb-1">Value</label>
                <input
                  type="number"
                  step="0.01"
                  value={stat.value}
                  onChange={(e) => handleChange(i, "value", parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2 bg-[var(--input-bg)] border border-subtle rounded-xl text-content focus:border-violet/40 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-content-dim mb-1">Suffix (Optional)</label>
                <input
                  type="text"
                  value={stat.suffix || ""}
                  onChange={(e) => handleChange(i, "suffix", e.target.value)}
                  placeholder="e.g. +, /4.00"
                  className="w-full px-4 py-2 bg-[var(--input-bg)] border border-subtle rounded-xl text-content focus:border-violet/40 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-content-dim mb-1">Decimals to show</label>
                <input
                  type="number"
                  min="0"
                  max="4"
                  value={stat.decimals}
                  onChange={(e) => handleChange(i, "decimals", parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 bg-[var(--input-bg)] border border-subtle rounded-xl text-content focus:border-violet/40 focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={() => handleDelete(i)}
              className="p-3 mt-6 text-content-dim hover:text-red-500 rounded-xl hover:bg-red-500/10 transition-colors"
              title="Delete stat"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={handleAddStat}
        className="w-full py-4 border-2 border-dashed border-subtle rounded-2xl text-content-dim font-medium hover:border-violet/50 hover:text-violet hover:bg-violet/5 transition-all flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        Add New Stat
      </button>
    </div>
  );
}
