"use client";

import { useState, useEffect } from "react";
import { Plus, Edit3, Trash2, GripVertical, Loader2, ExternalLink, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await fetch(`/api/projects/${id}`, { method: "DELETE" });
      setProjects(projects.filter((p) => p.id !== id));
    } catch (error) {
      alert("Failed to delete project");
    }
  };

  const toggleVisibility = async (id: string, currentVisible: boolean) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visible: !currentVisible }),
      });
      if (res.ok) {
        setProjects(
          projects.map((p) =>
            p.id === id ? { ...p, visible: !currentVisible } : p
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
          <h2 className="text-3xl font-heading font-bold text-content">Projects</h2>
          <p className="text-content-dim mt-2">Manage your featured projects portfolio.</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 px-6 py-3 bg-violet text-white rounded-xl font-medium hover:bg-violet/90 transition-colors"
        >
          <Plus size={18} />
          Add Project
        </Link>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        {projects.length === 0 ? (
          <div className="p-8 text-center text-content-dim">
            No projects found. Click "Add Project" to create one.
          </div>
        ) : (
          <div className="divide-y divide-subtle">
            {projects.map((project, index) => (
              <div key={project.id} className="p-6 flex items-center gap-6 group hover:bg-[var(--subtle-hover)] transition-colors">
                <div className="cursor-move text-content-dim/30 group-hover:text-content-dim transition-colors">
                  <GripVertical size={20} />
                </div>
                
                {project.imageUrl ? (
                  <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-subtle shrink-0">
                    <Image src={project.imageUrl} alt={project.title} fill className="object-cover" unoptimized />
                  </div>
                ) : (
                  <div className="w-24 h-16 rounded-lg bg-[var(--input-bg)] border border-subtle flex items-center justify-center shrink-0">
                    <span className="text-xs text-content-dim">No image</span>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-content truncate">{project.title}</h3>
                    {!project.visible && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/10 text-red-500 font-medium">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-content-dim truncate">{project.subtitle}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleVisibility(project.id, project.visible)}
                    className="p-2 text-content-dim hover:text-content rounded-lg hover:bg-[var(--input-bg)] transition-colors"
                    title={project.visible ? "Hide from site" : "Show on site"}
                  >
                    {project.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-content-dim hover:text-violet rounded-lg hover:bg-violet/10 transition-colors"
                      title="View live"
                    >
                      <ExternalLink size={18} />
                    </a>
                  )}
                  <Link
                    href={`/admin/projects/${project.id}`}
                    className="p-2 text-content-dim hover:text-blue-500 rounded-lg hover:bg-blue-500/10 transition-colors"
                    title="Edit"
                  >
                    <Edit3 size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(project.id)}
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

