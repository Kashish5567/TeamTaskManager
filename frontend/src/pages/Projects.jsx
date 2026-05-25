import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import CreateProjectModal from "../components/CreateProjectModal";
import { createProject, getProjects } from "../api/projects";
import { getProjectTasks } from "../api/tasks";
import { colorForId, getInitials, mapTaskStatusFromApi } from "../api/utils";
import { useRole } from "../context/Rolecontext";

const ICONS = [
  { icon: "💻", bg: "#E6F1FB" },
  { icon: "📊", bg: "#EAF3DE" },
  { icon: "📱", bg: "#FAEEDA" },
  { icon: "🖥️", bg: "#EEEDFE" },
  { icon: "📁", bg: "#F3F4F6" },
];

/* const initialProjects = [
  {
    id: 1,
    name: "Auth Module",
    description: "Login, register & JWT token management system",
    role: "Admin",
    progress: 65,
    icon: "💻",
    iconBg: "#E6F1FB",
    completedTasks: 13,
    totalTasks: 20,
    members: [
      { initials: "KA", bg: "#E6F1FB", color: "#185FA5" },
      { initials: "MR", bg: "#EAF3DE", color: "#3B6D11" },
      { initials: "SR", bg: "#FAEEDA", color: "#854F0B" },
      { initials: "AK", bg: "#EEEDFE", color: "#534AB7" },
    ],
  },
  {
    id: 2,
    name: "Dashboard UI",
    description: "Analytics dashboard with charts and stats cards",
    role: "Admin",
    progress: 80,
    icon: "📊",
    iconBg: "#EAF3DE",
    completedTasks: 8,
    totalTasks: 10,
    members: [
      { initials: "KA", bg: "#E6F1FB", color: "#185FA5" },
      { initials: "PR", bg: "#FBEAF0", color: "#993556" },
    ],
  },
  {
    id: 3,
    name: "Mobile App",
    description: "React Native mobile application for task management",
    role: "Member",
    progress: 30,
    icon: "📱",
    iconBg: "#FAEEDA",
    completedTasks: 6,
    totalTasks: 20,
    members: [
      { initials: "MR", bg: "#EAF3DE", color: "#3B6D11" },
      { initials: "SR", bg: "#FAEEDA", color: "#854F0B" },
      { initials: "AK", bg: "#EEEDFE", color: "#534AB7" },
    ],
  },
  {
    id: 4,
    name: "Backend API",
    description: "Node.js REST API with MongoDB integration",
    role: "Member",
    progress: 50,
    icon: "🖥️",
    iconBg: "#EEEDFE",
    completedTasks: 10,
    totalTasks: 20,
    members: [
      { initials: "KA", bg: "#E6F1FB", color: "#185FA5" },
      { initials: "AK", bg: "#EEEDFE", color: "#534AB7" },
      { initials: "SR", bg: "#FAEEDA", color: "#854F0B" },
      { initials: "MR", bg: "#EAF3DE", color: "#3B6D11" },
    ],
  },
]; */

export default function Projects() {
  const { can } = useRole();
  const [projectsRaw, setProjectsRaw] = useState([]);
  const [projectTasks, setProjectTasks] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const list = await getProjects();
        if (!alive) return;
        setProjectsRaw(list);

        const tasksEntries = await Promise.all(
          list.map(async (p) => {
            try {
              const t = await getProjectTasks(p._id);
              return [p._id, t];
            } catch {
              return [p._id, []];
            }
          })
        );

        if (!alive) return;
        setProjectTasks(Object.fromEntries(tasksEntries));
      } catch {
        if (!alive) return;
        setProjectsRaw([]);
        setProjectTasks({});
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const projects = useMemo(() => {
    return projectsRaw.map((p, idx) => {
      const iconCfg = ICONS[idx % ICONS.length];
      const tasks = projectTasks[p._id] || [];
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(
        (t) => mapTaskStatusFromApi(t.status) === "completed"
      ).length;
      const progress = totalTasks
        ? Math.round((completedTasks / totalTasks) * 100)
        : 0;

      const members = (p.members || []).map((m) => {
        const colors = colorForId(m._id || m.email || m.name);
        return {
          initials: getInitials(m.name || m.email),
          bg: colors.bg,
          color: colors.color,
        };
      });

      return {
        id: p._id,
        name: p.title,
        description: p.description || "",
        role: "Member",
        progress,
        icon: iconCfg.icon,
        iconBg: iconCfg.bg,
        completedTasks,
        totalTasks,
        members,
      };
    });
  }, [projectsRaw, projectTasks]);

  const handleCreate = async (data) => {
    try {
      const created = await createProject({
        title: data.name,
        description: data.description,
      });

      setProjectsRaw((prev) => [created, ...prev]);

      try {
        const tasks = await getProjectTasks(created._id);
        setProjectTasks((prev) => ({ ...prev, [created._id]: tasks }));
      } catch {
        setProjectTasks((prev) => ({ ...prev, [created._id]: [] }));
      }
    } catch {
      // keep UI unchanged (silent fail)
    }

    return; /*
    const newProject = {
      id: projects.length + 1,
      name: data.name,
      description: data.description,
      role: "Admin",
      progress: 0,
      icon: "📁",
      iconBg: "#F3F4F6",
      completedTasks: 0,
      totalTasks: 0,
      members: [{ initials: "ME", bg: "#E6F1FB", color: "#185FA5" }],
    };
    // synced via backend */
  };

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        display: "flex",
        background: "#F9FAFB",
        minHeight: "100vh",
      }}
    >
      <Sidebar />

      <div style={{ flex: 1, minWidth: 0 }}>
        <Navbar />

        <div style={{ padding: 20 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 600, marginBottom: 2 }}>
                Projects
              </h1>
              <p style={{ fontSize: 13, color: "#6B7280" }}>
                {filtered.length} projects
              </p>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  border: "1px solid #E5E7EB",
                  borderRadius: 8,
                  padding: "7px 12px",
                  fontSize: 13,
                  width: 200,
                }}
              />
              <button
                onClick={() => can("createProject") && setShowModal(true)}
                disabled={!can("createProject")}
                style={{
                  background: "#4F6EF7",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  opacity: can("createProject") ? 1 : 0.6,
                  pointerEvents: can("createProject") ? "auto" : "none",
                }}
              >
                + New project
              </button>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <CreateProjectModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}
