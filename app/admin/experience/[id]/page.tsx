"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import TagInput from "@/components/admin/TagInput";

export default function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  const isNew = unwrappedParams.id === "new";
  const router = useRouter();

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    type: "work",
    role: "",
    company: "",
    period: "",
    bullets: [] as string[],
    visible: true,
  });

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/experience`)
        .then((res) => res.json())
        .then((data) => {
          const item = data.find((p: any) => p.id === unwrappedParams.id);
          if (item) {
            setFormData({
              ...item,
              bullets: JSON.parse(item.bullets || "[]"),
            });
          } else {
            setError("Entry not found");
          }
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to load entry");
          setLoading(false);
        });
    }
  }, [isNew, unwrappedParams.id]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const { id, createdAt, updatedAt, ...restData } = formData as any;
      const payload = {
        ...restData,
        bullets: JSON.stringify(formData.bullets),
      };

      const url = isNew ? "/api/experience" : `/api/experience/${unwrappedParams.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save");
      
      router.push("/admin/experience");
      router.refresh(); // Refresh the list
    } catch {
      setError("Failed to save entry");
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
    <div className="max-w-3xl space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/experience"
          className="p-2 text-content-dim hover:text-content hover:bg-[var(--subtle-hover)] rounded-xl transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-3xl font-heading font-bold text-content">
            {isNew ? "New Entry" : "Edit Entry"}
          </h2>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-card p-8 rounded-2xl space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-content-dim mb-2">Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="work"
                  checked={formData.type === "work"}
                  onChange={(e) => handleChange("type", e.target.value)}
                  className="w-4 h-4 accent-violet"
                />
                <span className="text-content font-medium">Work Experience</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="education"
                  checked={formData.type === "education"}
                  onChange={(e) => handleChange("type", e.target.value)}
                  className="w-4 h-4 accent-violet"
                />
                <span className="text-content font-medium">Education</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-content-dim mb-2">Role / Degree *</label>
            <input
              type="text"
              required
              value={formData.role}
              onChange={(e) => handleChange("role", e.target.value)}
              className="w-full px-4 py-3 bg-[var(--input-bg)] border border-subtle rounded-xl text-content focus:border-violet/40 focus:outline-none"
              placeholder="e.g. AI/ML Engineer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-content-dim mb-2">Company / Institution *</label>
            <input
              type="text"
              required
              value={formData.company}
              onChange={(e) => handleChange("company", e.target.value)}
              className="w-full px-4 py-3 bg-[var(--input-bg)] border border-subtle rounded-xl text-content focus:border-violet/40 focus:outline-none"
              placeholder="e.g. DevelopersHub"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-content-dim mb-2">Period *</label>
            <input
              type="text"
              required
              value={formData.period}
              onChange={(e) => handleChange("period", e.target.value)}
              className="w-full px-4 py-3 bg-[var(--input-bg)] border border-subtle rounded-xl text-content focus:border-violet/40 focus:outline-none"
              placeholder="e.g. Mar 2026 - Present"
            />
          </div>
        </div>

        <div>
          <TagInput
            label="Bullet Points"
            tags={formData.bullets}
            onChange={(tags) => handleChange("bullets", tags)}
            placeholder="Add an achievement or responsibility..."
          />
        </div>

        <div className="pt-4 border-t border-subtle">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.visible}
              onChange={(e) => handleChange("visible", e.target.checked)}
              className="w-5 h-5 accent-violet"
            />
            <span className="text-sm font-medium text-content">Visible on Website</span>
          </label>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-subtle">
          <Link
            href="/admin/experience"
            className="px-6 py-3 rounded-xl font-medium text-content-dim hover:text-content hover:bg-[var(--subtle-hover)] transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-violet text-white rounded-xl font-medium hover:bg-violet/90 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? "Saving..." : "Save Entry"}
          </button>
        </div>
      </form>
    </div>
  );
}
