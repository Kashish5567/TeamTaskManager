import { useState, useEffect } from "react";
import { getInitials, colorForId } from "../api/utils";

const PRIO_CFG = {
  low:    { color: "#10b981", border: "#bbf7d0" },
  medium: { color: "#f59e0b", border: "#fde68a" },
  high:   { color: "#ef4444", border: "#fecaca" },
};

export default function CreateTaskModal({ task, projects, projectMembers = [], onClose, onSave, onProjectChange }) {
  const isEdit = !!task;

  const [title,      setTitle]      = useState("");
  const [desc,       setDesc]       = useState("");
  const [project,    setProject]    = useState(projects[0] || "");
  const [status,     setStatus]     = useState("todo");
  const [priority,   setPriority]   = useState("medium");
  const [due,        setDue]        = useState("");
  const [assignedTo, setAssignedTo] = useState(null);

  // Populate form when editing
  useEffect(() => {
    if (task) {
      setTitle(task.title       || "");
      setDesc(task.desc         || "");
      setProject(task.project   || projects[0] || "");
      setStatus(task.status     || "todo");
      setPriority(task.priority || "medium");
      setDue(task.due           || "");
      setAssignedTo(task.assignedTo || null);
    }
  }, [task, projects]);

  // Reset assignee when member list changes (project switch)
  useEffect(() => {
    if (!isEdit) {
      setAssignedTo(projectMembers.length > 0 ? projectMembers[0]._id : null);
    }
  }, [projectMembers, isEdit]);

  const handleSave = () => {
    if (!title.trim()) { alert("Task title is required"); return; }
    if (!due)          { alert("Due date is required");   return; }
    onSave({ title, desc, project, status, priority, due, assignedTo });
  };

  return (
    <div style={S.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={S.modal}>

        {/* Header */}
        <div style={S.header}>
          <h2 style={S.title}>{isEdit ? "Edit Task" : "Create New Task"}</h2>
          <button style={S.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div style={S.body}>

          {/* Title */}
          <div style={S.field}>
            <label style={S.label}>Task title <span style={{ color: "#ef4444" }}>*</span></label>
            <input
              style={S.input}
              placeholder="Enter task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div style={S.field}>
            <label style={S.label}>Description</label>
            <textarea
              style={{ ...S.input, height: 72, resize: "vertical" }}
              placeholder="Describe the task..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>

          {/* Project + Status */}
          <div style={S.row}>
            <div style={{ ...S.field, flex: 1 }}>
              <label style={S.label}>Project</label>
              <select style={S.select} value={project} onChange={(e) => { setProject(e.target.value); onProjectChange?.(e.target.value); }}>
                {projects.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div style={{ ...S.field, flex: 1 }}>
              <label style={S.label}>Status</label>
              <select style={S.select} value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Priority */}
          <div style={S.field}>
            <label style={S.label}>Priority</label>
            <div style={{ display: "flex", gap: 8 }}>
              {["low", "medium", "high"].map((p) => {
                const cfg    = PRIO_CFG[p];
                const active = priority === p;
                return (
                  <button
                    key={p}
                    style={{
                      ...S.prioBtn,
                      background:  active ? cfg.color : "transparent",
                      color:       active ? "#fff"    : cfg.color,
                      borderColor: active ? cfg.color : cfg.border,
                    }}
                    onClick={() => setPriority(p)}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Due date */}
          <div style={S.field}>
            <label style={S.label}>Due date <span style={{ color: "#ef4444" }}>*</span></label>
            <input
              type="date"
              style={S.input}
              value={due}
              onChange={(e) => setDue(e.target.value)}
            />
          </div>

          {/* Assignee */}
          <div style={S.field}>
            <label style={S.label}>Assign to</label>
            {projectMembers.length === 0 ? (
              <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>
                No members in this project yet.
              </p>
            ) : (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {projectMembers.map((m) => {
                  const active  = assignedTo === m._id;
                  const colors  = colorForId(m._id);
                  const initials = getInitials(m.name || m.email);
                  return (
                    <button
                      key={m._id}
                      style={{
                        ...S.assBtn,
                        outline:       active ? `2px solid ${colors.color}` : "none",
                        outlineOffset: "2px",
                      }}
                      onClick={() => setAssignedTo(m._id)}
                      title={m.name || m.email}
                    >
                      <div style={{ ...S.avatar, background: colors.bg, color: colors.color }}>
                        {initials}
                      </div>
                      <span style={{ fontSize: 12, color: "#374151" }}>{m.name || m.email}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div style={S.footer}>
          <button style={S.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={S.saveBtn}   onClick={handleSave}>
            {isEdit ? "Save Changes" : "Create Task"}
          </button>
        </div>

      </div>
    </div>
  );
}

const S = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    backdropFilter: "blur(2px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: 20,
  },
  modal: {
    background: "#fff",
    borderRadius: 16,
    width: "100%",
    maxWidth: 520,
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    maxHeight: "90vh",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 22px 14px",
    borderBottom: "1px solid #f3f4f6",
  },
  title: {
    fontSize: 17,
    fontWeight: 700,
    color: "#111827",
    margin: 0,
  },
  closeBtn: {
    background: "#f3f4f6",
    border: "none",
    borderRadius: 8,
    width: 30,
    height: 30,
    cursor: "pointer",
    fontSize: 13,
    color: "#6b7280",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    padding: "18px 22px",
    overflowY: "auto",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
  row: {
    display: "flex",
    gap: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
  },
  input: {
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: "8px 12px",
    fontSize: 14,
    color: "#111827",
    outline: "none",
    fontFamily: "inherit",
    width: "100%",
    boxSizing: "border-box",
    background: "#fafafa",
  },
  select: {
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: "8px 12px",
    fontSize: 14,
    color: "#111827",
    outline: "none",
    background: "#fafafa",
    cursor: "pointer",
    width: "100%",
  },
  prioBtn: {
    flex: 1,
    padding: "8px 0",
    borderRadius: 8,
    border: "1px solid",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.15s",
  },
  assBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "5px 10px",
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    cursor: "pointer",
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: 10,
    fontWeight: 700,
  },
  footer: {
    padding: "14px 22px",
    borderTop: "1px solid #f3f4f6",
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
  },
  cancelBtn: {
    padding: "9px 18px",
    background: "#f3f4f6",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    color: "#374151",
    cursor: "pointer",
  },
  saveBtn: {
    padding: "9px 20px",
    background: "#7c3aed",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    color: "#fff",
    cursor: "pointer",
  },
};