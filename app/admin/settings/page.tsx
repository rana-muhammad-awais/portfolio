"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Link2 } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import TagInput from "@/components/admin/TagInput";

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        setSettings({
          ...data,
          // Parse JSON strings back to arrays for the form
          aboutSkills: JSON.parse(data.aboutSkills || "[]"),
          heroHeadline: JSON.parse(data.heroHeadline || "[]"),
        });
        setLoading(false);
      });
  }, []);

  const handleChange = (field: string, value: any) => {
    setSettings((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleHeroHeadlineChange = (text: string) => {
    // Basic parser: split by space, make the last 4 words gradient
    const words = text.split(" ").filter(w => w);
    const total = words.length;
    const parsed = words.map((w, i) => ({
      text: w,
      gradient: i >= total - 4 // make last 4 words gradient by default
    }));
    handleChange("heroHeadline", parsed);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const { id, createdAt, updatedAt, ...restSettings } = settings;
      const payload = {
        ...restSettings,
        // Stringify arrays back to JSON for DB
        aboutSkills: JSON.stringify(settings.aboutSkills),
        heroHeadline: JSON.stringify(settings.heroHeadline),
      };

      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save");
      setMessage("Settings saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setMessage("Error saving settings");
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

  const currentHeadlineStr = settings.heroHeadline.map((w: any) => w.text).join(" ");

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-heading font-bold text-content">Site Settings</h2>
          <p className="text-content-dim mt-2">Manage your homepage content and personal information.</p>
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

      <form className="space-y-8" onSubmit={handleSave}>
        {/* Images Section */}
        <section className="glass-card p-6 rounded-2xl space-y-6">
          <h3 className="text-xl font-bold text-content flex items-center gap-2 border-b border-subtle pb-4">
            Images & Documents
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ImageUploader
              label="Profile Photo (Hero section)"
              value={settings.profileImageUrl}
              onChange={(url) => handleChange("profileImageUrl", url)}
            />
            <ImageUploader
              label="CV / Resume (PDF)"
              value={settings.cvUrl}
              onChange={(url) => handleChange("cvUrl", url)}
            />
          </div>
        </section>

        {/* Hero Section */}
        <section className="glass-card p-6 rounded-2xl space-y-6">
          <h3 className="text-xl font-bold text-content border-b border-subtle pb-4">Hero Section</h3>
          
          <div>
            <label className="block text-sm font-medium text-content-dim mb-2">Headline</label>
            <textarea
              value={currentHeadlineStr}
              onChange={(e) => handleHeroHeadlineChange(e.target.value)}
              rows={2}
              className="w-full px-4 py-3 bg-[var(--input-bg)] border border-subtle rounded-xl text-content focus:border-violet/40 focus:outline-none"
            />
            <p className="text-xs text-content-dim mt-2">The last 4 words will automatically have the gradient color applied.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-content-dim mb-2">Subtext</label>
            <textarea
              value={settings.heroSubtext}
              onChange={(e) => handleChange("heroSubtext", e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-[var(--input-bg)] border border-subtle rounded-xl text-content focus:border-violet/40 focus:outline-none"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-content-dim mb-2">Availability Text</label>
              <input
                type="text"
                value={settings.availabilityText}
                onChange={(e) => handleChange("availabilityText", e.target.value)}
                className="w-full px-4 py-3 bg-[var(--input-bg)] border border-subtle rounded-xl text-content focus:border-violet/40 focus:outline-none"
              />
            </div>
            <div className="flex items-center pt-8">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.availabilityActive}
                  onChange={(e) => handleChange("availabilityActive", e.target.checked)}
                  className="w-5 h-5 accent-emerald-500"
                />
                <span className="text-sm font-medium text-content-dim">Show Indicator</span>
              </label>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="glass-card p-6 rounded-2xl space-y-6">
          <h3 className="text-xl font-bold text-content border-b border-subtle pb-4">About Section</h3>
          
          <div>
            <label className="block text-sm font-medium text-content-dim mb-2">Biography (Markdown supported)</label>
            <textarea
              value={settings.aboutBio}
              onChange={(e) => handleChange("aboutBio", e.target.value)}
              rows={8}
              className="w-full px-4 py-3 bg-[var(--input-bg)] border border-subtle rounded-xl text-content focus:border-violet/40 focus:outline-none"
            />
          </div>

          <TagInput
            label="Skills (Marquee)"
            tags={settings.aboutSkills}
            onChange={(tags) => handleChange("aboutSkills", tags)}
            placeholder="Add skill (e.g. Next.js, Python, OpenCV)"
          />
        </section>

        {/* Contact & Social Links */}
        <section className="glass-card p-6 rounded-2xl space-y-6">
          <h3 className="text-xl font-bold text-content flex items-center gap-2 border-b border-subtle pb-4">
            Contact & Socials
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-content-dim mb-2">Contact Email</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => handleChange("contactEmail", e.target.value)}
                className="w-full px-4 py-3 bg-[var(--input-bg)] border border-subtle rounded-xl text-content focus:border-violet/40 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-content-dim mb-2">Location</label>
              <input
                type="text"
                value={settings.contactLocation}
                onChange={(e) => handleChange("contactLocation", e.target.value)}
                className="w-full px-4 py-3 bg-[var(--input-bg)] border border-subtle rounded-xl text-content focus:border-violet/40 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-content-dim mb-2">GitHub URL</label>
              <div className="relative">
                <Link2 className="absolute left-3 top-3.5 text-content-dim" size={18} />
                <input
                  type="url"
                  value={settings.githubUrl || ""}
                  onChange={(e) => handleChange("githubUrl", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[var(--input-bg)] border border-subtle rounded-xl text-content focus:border-violet/40 focus:outline-none"
                  placeholder="https://github.com/..."
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-content-dim mb-2">LinkedIn URL</label>
              <div className="relative">
                <Link2 className="absolute left-3 top-3.5 text-content-dim" size={18} />
                <input
                  type="url"
                  value={settings.linkedinUrl || ""}
                  onChange={(e) => handleChange("linkedinUrl", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[var(--input-bg)] border border-subtle rounded-xl text-content focus:border-violet/40 focus:outline-none"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
            </div>
          </div>
        </section>

      </form>
    </div>
  );
}
