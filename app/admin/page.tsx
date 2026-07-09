import { prisma } from "@/lib/db";
import { 
  FolderOpen, 
  Briefcase, 
  MessageSquare,
  Eye,
  EyeOff
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [
    projectsCount,
    visibleProjectsCount,
    experienceCount,
    unreadMessagesCount,
    totalMessagesCount,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { visible: true } }),
    prisma.experience.count(),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.contactMessage.count(),
  ]);

  const stats = [
    {
      label: "Total Projects",
      value: projectsCount,
      subtext: `${visibleProjectsCount} visible on site`,
      icon: FolderOpen,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Experience Entries",
      value: experienceCount,
      subtext: "Timeline events",
      icon: Briefcase,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Unread Messages",
      value: unreadMessagesCount,
      subtext: `Out of ${totalMessagesCount} total`,
      icon: MessageSquare,
      color: unreadMessagesCount > 0 ? "text-coral" : "text-violet",
      bg: unreadMessagesCount > 0 ? "bg-coral/10" : "bg-violet/10",
    },
  ];

  const recentMessages = await prisma.contactMessage.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-heading font-bold gradient-text">Dashboard</h2>
        <p className="text-content-dim mt-2">Overview of your portfolio content.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card rounded-2xl p-6 flex items-start gap-4">
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-content-dim mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-content">{stat.value}</h3>
              <p className="text-xs text-content-dim/70 mt-1">{stat.subtext}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Messages Preview */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-subtle flex items-center justify-between">
          <h3 className="text-lg font-bold text-content flex items-center gap-2">
            <MessageSquare size={18} className="text-violet" />
            Recent Messages
          </h3>
          <a href="/admin/messages" className="text-sm text-violet hover:text-coral transition-colors font-medium">
            View All
          </a>
        </div>
        
        {recentMessages.length === 0 ? (
          <div className="p-8 text-center text-content-dim">
            No messages yet.
          </div>
        ) : (
          <div className="divide-y divide-subtle">
            {recentMessages.map((msg: any) => (
              <div key={msg.id} className={`p-6 flex items-start gap-4 transition-colors ${!msg.read ? 'bg-[var(--subtle-hover)]' : ''}`}>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-content flex items-center gap-2">
                      {msg.name}
                      {!msg.read && <span className="w-2 h-2 rounded-full bg-coral"></span>}
                    </h4>
                    <span className="text-xs text-content-dim">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <a href={`mailto:${msg.email}`} className="text-sm text-violet hover:underline mb-3 inline-block">
                    {msg.email}
                  </a>
                  <p className="text-sm text-content-dim line-clamp-2">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
