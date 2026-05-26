import { useEffect, useMemo, useState } from "react";
import TaskCard from "../components/TaskCard";
import CreateTaskModal from "../components/CreateTaskModal";
import { getProjects } from "../api/projects";
import {
  createTask,
  deleteTask,
  getProjectTasks,
  updateTask,
  updateTaskStatus,
} from "../api/tasks";
import {
  mapPriorityFromApi,
  mapPriorityToApi,
  mapTaskStatusFromApi,
  mapTaskStatusToApi,
} from "../api/utils";
import { useRole } from "../context/Rolecontext";

const initialTasks = [
  {
    id: 1,
    title: "Design login page UI",
    desc: "Create responsive login and register page with JWT integration",
    status: "completed",
    priority: "high",
    project: "Auth Module",
    assignee: { i: "KA", c: "#6366f1" },
    due: "2025-12-15",
  },
  {
    id: 2,
    title: "Implement JWT token refresh",
    desc: "Auto-refresh tokens before expiry to maintain session",
    status: "in-progress",
    priority: "high",
    project: "Auth Module",
    assignee: { i: "MR", c: "#ec4899" },
    due: "2025-12-20",
  },
  {
    id: 3,
    title: "Build analytics charts",
    desc: "Integrate recharts for dashboard analytics visualization",
    status: "in-progress",
    priority: "medium",
    project: "Dashboard UI",
    assignee: { i: "SR", c: "#f59e0b" },
    due: "2025-12-18",
  },
  {
    id: 4,
    title: "Stats cards component",
    desc: "Create reusable stats card with trend indicators",
    status: "todo",
    priority: "low",
    project: "Dashboard UI",
    assignee: { i: "KA", c: "#6366f1" },
    due: "2025-12-25",
  },
  {
    id: 5,
    title: "React Native navigation setup",
    desc: "Configure bottom tab and stack navigation for mobile app",
    status: "todo",
    priority: "high",
    project: "Mobile App",
    assignee: { i: "MR", c: "#ec4899" },
    due: "2025-12-22",
  },
  {
    id: 6,
    title: "MongoDB schema design",
    desc: "Design user, project, and task schemas with relationships",
    status: "completed",
    priority: "medium",
    project: "Backend API",
    assignee: { i: "SR", c: "#f59e0b" },
    due: "2025-12-10",
  },
  {
    id: 7,
    title: "REST API endpoints",
    desc: "Create CRUD endpoints for tasks with validation middleware",
    status: "in-progress",
    priority: "high",
    project: "Backend API",
    assignee: { i: "KA", c: "#6366f1" },
    due: "2025-12-19",
  },
  {
    id: 8,
    title: "Push notifications",
    desc: "Implement FCM push notifications for task reminders",
    status: "todo",
    priority: "low",
    project: "Mobile App",
    assignee: { i: "MR", c: "#ec4899" },
    due: "2025-12-30",
  },
];

const TABS = ["all", "todo", "in-progress", "completed"];
const TAB_LABELS = {
  all: "All",
  todo: "To Do",
  "in-progress": "In Progress",
  completed: "Completed",
};
// const PROJECTS = ["all", "Auth Module", "Dashboard UI", "Mobile App", "Backend API"];

export default function Tasks() {
  const { can } = useRole();
  const [tasks, setTasks] = useState(initialTasks);
  const [projectsRaw, setProjectsRaw] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterProject, setFilterProject] = useState("all");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [modalProject, setModalProject] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const projects = await getProjects();
        if (!alive) return;
        setProjectsRaw(projects);

        const tasksByProject = await Promise.all(
          projects.map(async (p) => {
            try {
              const t = await getProjectTasks(p._id);
              return { project: p, tasks: t };
            } catch {
              return { project: p, tasks: [] };
            }
          })
        );

        if (!alive) return;
        const mapped = tasksByProject.flatMap(({ project, tasks: t }) =>
          t.map((task) => ({
            id: task._id,
            title: task.title,
            desc: task.description || "",
            status: mapTaskStatusFromApi(task.status),
            priority: mapPriorityFromApi(task.priority),
            project: project.title,
            projectId: project._id,
            assignee: { i: "ME", c: "#6366f1" },
            due: task.dueDate ? String(task.dueDate).slice(0, 10) : "",
          }))
        );

        setTasks(mapped);
      } catch {
        if (!alive) return;
        setProjectsRaw([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const projectOptions = useMemo(() => {
    const titles = projectsRaw.map((p) => p.title);
    return ["all", ...titles];
  }, [projectsRaw]);

  const projectTitleToId = useMemo(() => {
    const map = new Map();
    projectsRaw.forEach((p) => map.set(p.title, p._id));
    return map;
  }, [projectsRaw]);

  const projectTitleToMembers = useMemo(() => {
    const map = new Map();
    projectsRaw.forEach((p) => map.set(p.title, p.members || []));
    return map;
  }, [projectsRaw]);

  const modalProjectMembers = useMemo(() => {
    const title = modalProject || (projectOptions.find((p) => p !== "all") ?? "");
    return projectTitleToMembers.get(title) || [];
  }, [modalProject, projectOptions, projectTitleToMembers]);

  const counts = {
    all: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    "in-progress": tasks.filter((t) => t.status === "in-progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  const filtered = tasks.filter((t) => {
    if (activeTab !== "all" && t.status !== activeTab) return false;
    if (filterPriority !== "all" && t.priority !== filterPriority) return false;
    if (filterProject !== "all" && t.project !== filterProject) return false;
    if (
      search &&
      !t.title.toLowerCase().includes(search.toLowerCase()) &&
      !t.desc.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const handleSave = async (data) => {
    const projectId = projectTitleToId.get(data.project) || editingTask?.projectId;

    if (!projectId) {
      setShowModal(false);
      setEditingTask(null);
      return;
    }

    try {
      if (editingTask) {
        const updated = await updateTask(editingTask.id, {
          title: data.title,
          description: data.desc,
          dueDate: data.due || undefined,
          priority: mapPriorityToApi(data.priority),
          assignedTo: data.assignedTo || undefined,
        });

        setTasks((prev) =>
          prev.map((t) =>
            t.id === editingTask.id
              ? {
                  ...t,
                  ...data,
                  due: updated.dueDate ? String(updated.dueDate).slice(0, 10) : data.due,
                  projectId,
                }
              : t
          )
        );
      } else {
        const created = await createTask({
          title: data.title,
          description: data.desc,
          dueDate: data.due || undefined,
          priority: mapPriorityToApi(data.priority),
          projectId,
          assignedTo: data.assignedTo || undefined,
        });

        setTasks((prev) => [
          ...prev,
          {
            ...data,
            id: created._id,
            projectId,
            due: created.dueDate ? String(created.dueDate).slice(0, 10) : data.due,
          },
        ]);
      }
    } catch {
      // silent
    }

    setShowModal(false);
    setEditingTask(null);
    setModalProject("");
  };

  const handleDelete = async (id) => {
    if (!can("deleteTasks")) return;
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await deleteTask(id);
    } catch {
      // silent
    }
  };

  const handleEdit = (task) => {
    if (!can("assignTasks")) return;
    setEditingTask(task);
    setModalProject(task.project || "");
    setShowModal(true);
  };

  const handleStatusChange = async (id, status) => {
    if (!can("assignTasks")) return;
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    try {
      await updateTaskStatus(id, mapTaskStatusToApi(status));
    } catch {
      // silent
    }
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Tasks</h1>
          <p style={styles.subtitle}>{tasks.length} total tasks across all projects</p>
        </div>
        <button
          style={styles.newBtn}
          onClick={() => {
            if (!can("assignTasks")) return;
            setEditingTask(null);
            setModalProject(projectOptions.find((p) => p !== "all") ?? "");
            setShowModal(true);
          }}
          disabled={!can("assignTasks")}
        >
          + New Task
        </button>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {TABS.map((s) => (
          <button
            key={s}
            style={{ ...styles.tab, ...(activeTab === s ? styles.tabActive : {}) }}
            onClick={() => setActiveTab(s)}
          >
            {TAB_LABELS[s]}
            <span style={{
              ...styles.badge,
              background: activeTab === s ? "#ede9fe" : "#f3f4f6",
              color: activeTab === s ? "#7c3aed" : "#6b7280",
            }}>
              {counts[s]}
            </span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div style={styles.filtersRow}>
        <div style={styles.searchWrap}>
          <svg width="15" height="15" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            style={styles.searchInput}
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          style={styles.select}
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
        >
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          style={styles.select}
          value={filterProject}
          onChange={(e) => setFilterProject(e.target.value)}
        >
          {projectOptions.map((p) => (
            <option key={p} value={p}>
              {p === "all" ? "All Projects" : p}
            </option>
          ))}
        </select>

        {/* View Toggle */}
        <div style={styles.viewToggle}>
          <button
            style={{ ...styles.vBtn, ...(viewMode === "grid" ? styles.vBtnActive : {}) }}
            onClick={() => setViewMode("grid")}
            title="Grid view"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </button>
          <button
            style={{ ...styles.vBtn, ...(viewMode === "list" ? styles.vBtnActive : {}) }}
            onClick={() => setViewMode("list")}
            title="List view"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="5" width="18" height="2" rx="1" />
              <rect x="3" y="11" width="18" height="2" rx="1" />
              <rect x="3" y="17" width="18" height="2" rx="1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Board */}
      {filtered.length === 0 ? (
        <div style={styles.empty}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          <p style={styles.emptyTitle}>No tasks found</p>
          <p style={styles.emptySub}>Try changing your filters or create a new task</p>
        </div>
      ) : viewMode === "grid" ? (
        <div style={styles.grid}>
          {filtered.map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              viewMode="grid"
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <div style={styles.list}>
          {filtered.map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              viewMode="list"
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <CreateTaskModal
          task={editingTask}
          projects={projectOptions.filter((p) => p !== "all")}
          projectMembers={modalProjectMembers}
          onProjectChange={setModalProject}
          onClose={() => { setShowModal(false); setEditingTask(null); setModalProject(""); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

const styles = {
  page: {
    padding: "32px",
    background: "#f9fafb",
    minHeight: "100vh",
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "24px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#111827",
    margin: 0,
  },
  subtitle: {
    fontSize: "14px",
    color: "#6b7280",
    marginTop: "4px",
    marginBottom: 0,
  },
  newBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "#7c3aed",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 18px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  tabs: {
    display: "flex",
    gap: "2px",
    marginBottom: "16px",
    borderBottom: "1px solid #e5e7eb",
  },
  tab: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 16px",
    border: "none",
    background: "transparent",
    fontSize: "14px",
    fontWeight: "500",
    color: "#6b7280",
    cursor: "pointer",
    borderBottom: "2px solid transparent",
    marginBottom: "-1px",
  },
  tabActive: {
    color: "#7c3aed",
    borderBottom: "2px solid #7c3aed",
  },
  badge: {
    fontSize: "12px",
    fontWeight: "600",
    padding: "2px 7px",
    borderRadius: "999px",
  },
  filtersRow: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  searchWrap: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "8px 12px",
    flex: 1,
    minWidth: "180px",
  },
  searchInput: {
    border: "none",
    outline: "none",
    fontSize: "14px",
    color: "#374151",
    width: "100%",
    background: "transparent",
  },
  select: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "8px 12px",
    fontSize: "14px",
    color: "#374151",
    cursor: "pointer",
    outline: "none",
  },
  viewToggle: {
    display: "flex",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    overflow: "hidden",
  },
  vBtn: {
    padding: "8px 10px",
    border: "none",
    background: "transparent",
    color: "#9ca3af",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
  vBtnActive: {
    background: "#f3f4f6",
    color: "#7c3aed",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
    gap: "16px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  empty: {
    textAlign: "center",
    padding: "60px 20px",
  },
  emptyTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#374151",
    margin: "0 0 8px",
  },
  emptySub: {
    fontSize: "14px",
    color: "#9ca3af",
    margin: 0,
  },
};
