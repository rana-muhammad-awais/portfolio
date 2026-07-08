"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, ArrowLeft, Link2 } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import Link from "next/link";
import { use } from "react";
import ImageUploader from "@/components/admin/ImageUploader";
import TagInput from "@/components/admin/TagInput";

export default function EditProjectPage({
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
    title: "",
    subtitle: "",
    description: "",
    tags: [] as string[],
    imageUrl: "",
    githubUrl: "",
    liveUrl: "",
    gradient: "from-coral/20 via-purple/10 to-violet/20",
    visible: true,
  });

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/projects`)
        .then((res) => res.json())
        .then((data) => {
          const project = data.find((p: any) => p.id === unwrappedParams.id);
          if (project) {
            setFormData({
              ...project,
              tags: JSON.parse(project.tags || "[]"),
            });
          } else {
            setError("Project not found");
          }
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to load project");
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
        tags: JSON.stringify(formData.tags),
      };

      const url = isNew ? "/api/projects" : `/api/projects/${unwrappedParams.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save");
      
      router.push("/admin/projects");
      router.refresh(); // Refresh the list
    } catch {
      setError("Failed to save project");
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

  const GRADIENTS = [
    { label: "Coral to Violet", value: "from-coral/20 via-purple/10 to-violet/20" },
    { label: "Purple to Coral", value: "from-purple/20 via-violet/10 to-coral/20" },
    { label: "Violet to Coral", value: "from-violet/20 via-coral/10 to-purple/20" },
    { label: "Blue to Emerald", value: "from-blue-500/20 via-cyan-500/10 to-emerald-500/20" },
    { label: "Rose to Orange", value: "from-rose-500/20 via-pink-500/10 to-orange-500/20" },
  ];

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/projects"
          className="p-2 text-content-dim hover:text-content hover:bg-[var(--subtle-hover)] rounded-xl transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-3xl font-heading font-bold text-content">
            {isNew ? "New Project" : "Edit Project"}
          </h2>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <section className="glass-card p-6 rounded-2xl space-y-6">
              <div>
                <label className="block text-sm font-medium text-content-dim mb-2">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--input-bg)] border border-subtle rounded-xl text-content focus:border-violet/40 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-content-dim mb-2">Subtitle *</label>
                <input
                  type="text"
                  required
                  value={formData.subtitle}
                  onChange={(e) => handleChange("subtitle", e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--input-bg)] border border-subtle rounded-xl text-content focus:border-violet/40 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-content-dim mb-2">Description *</label>
                <textarea
                  required
                  rows={5}
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--input-bg)] border border-subtle rounded-xl text-content focus:border-violet/40 focus:outline-none"
                />
              </div>

              <TagInput
                label="Technologies / Tags"
                tags={formData.tags}
                onChange={(tags) => handleChange("tags", tags)}
                placeholder="Add tech stack..."
              />
            </section>
          </div>

          <div className="space-y-6">
            <section className="glass-card p-6 rounded-2xl space-y-6">
              <ImageUploader
                label="Project Image"
                folder="portfolio/projects"
                value={formData.imageUrl}
                onChange={(url) => handleChange("imageUrl", url)}
              />

              <div>
                <label className="block text-sm font-medium text-content-dim mb-2">Background Glow</label>
                <select
                  value={formData.gradient}
                  onChange={(e) => handleChange("gradient", e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--input-bg)] border border-subtle rounded-xl text-content focus:border-violet/40 focus:outline-none appearance-none cursor-pointer"
                >
                  {GRADIENTS.map((g) => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
                <div className={`mt-3 h-12 rounded-xl bg-gradient-to-br ${formData.gradient} opacity-50`}></div>
              </div>
            </section>

            <section className="glass-card p-6 rounded-2xl space-y-6">
              <div>
                <label className="block text-sm font-medium text-content-dim mb-2">Live URL</label>
                <div className="relative">
                  <Link2 className="absolute left-3 top-3.5 text-content-dim" size={18} />
                  <input
                    type="url"
                    value={formData.liveUrl || ""}
                    onChange={(e) => handleChange("liveUrl", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[var(--input-bg)] border border-subtle rounded-xl text-content focus:border-violet/40 focus:outline-none"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-content-dim mb-2">GitHub URL</label>
                <div className="relative">
                  <GithubIcon className="absolute left-3 top-3.5 text-content-dim" width={18} height={18} />
                  <input
                    type="url"
                    value={formData.githubUrl || ""}
                    onChange={(e) => handleChange("githubUrl", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[var(--input-bg)] border border-subtle rounded-xl text-content focus:border-violet/40 focus:outline-none"
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-subtle">
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
            </section>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            href="/admin/projects"
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
            {saving ? "Saving..." : "Save Project"}
          </button>
        </div>
      </form>
    </div>
  );
}
