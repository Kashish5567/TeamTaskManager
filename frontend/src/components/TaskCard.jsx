import { useState } from "react";

const PRIO = {
  high:   { color: "#ef4444", bg: "#fef2f2" },
  medium: { color: "#f59e0b", bg: "#fffbeb" },
  low:    { color: "#10b981", bg: "#ecfdf5" },
};

const STAT = {
  "todo":        { label: "To Do",       color: "#6b7280", bg: "#f3f4f6" },
  "in-progress": { label: "In Progress", color: "#3b82f6", bg: "#eff6ff" },
  "completed":   { label: "Completed",   color: "#10b981", bg: "#ecfdf5" },
};

function dueLabel(due) {
  const diff = Math.ceil((new Date(due) - new Date()) / 864e5);
  if (diff < 0)  return { text: `${Math.abs(diff)}d overdue`, color: "#ef4444" };
  if (diff === 0) return { text: "Due today",                  color: "#f59e0b" };
  if (diff <= 2)  return { text: `${diff}d left`,              color: "#f59e0b" };
  return { text: due, color: "#6b7280" };
}

export default function TaskCard({ task, viewMode = "grid", onEdit, onDelete, onStatusChange }) {
  const [menuOpen, setMenuOpen]     = useState(false);
  const [statusDD, setStatusDD]     = useState(false);

  const pr  = PRIO[task.priority] || PRIO.medium;
  const st  = STAT[task.status]   || STAT.todo;
  const dl  = dueLabel(task.due);
  const done = task.status === "completed";

  /* ── LIST ROW ─────────────────────────────────────────────── */
  if (viewMode === "list") {
    return (
      <div style={L.row}>
        {/* Checkbox */}
        <button
          style={{
            ...L.check,
            background:   done ? "#7c3aed" : "transparent",
            borderColor:  done ? "#7c3aed" : "#d1d5db",
          }}
          onClick={() => onStatusChange(task.id, done ? "todo" : "completed")}
          aria-label="Toggle complete"
        >
          {done && (
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        {/* Title + project */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ ...L.title, textDecoration: done ? "line-through" : "none",
                      color: done ? "#9ca3af" : "#111827" }}>
            {task.title}
          </p>
          <p style={L.proj}>{task.project}</p>
        </div>

        {/* Badges */}
        <div style={L.badges}>
          <span style={{ ...L.badge, color: pr.color, background: pr.bg }}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
          <span style={{ ...L.badge, color: st.color, background: st.bg }}>
            {st.label}
          </span>
        </div>

        {/* Right: avatar + due + actions */}
        <div style={L.right}>
          <div style={{ ...C.avatar, background: task.assignee.c }}>{task.assignee.i}</div>
          <span style={{ ...L.due, color: dl.color }}>{dl.text}</span>
          <button style={L.editBtn}  onClick={() => onEdit(task)}>Edit</button>
          <button style={L.delBtn}   onClick={() => onDelete(task.id)}>✕</button>
        </div>
      </div>
    );
  }

  /* ── GRID CARD ────────────────────────────────────────────── */
  return (
    <div
      style={C.card}
      onMouseLeave={() => { setMenuOpen(false); setStatusDD(false); }}
    >
      {/* Top row */}
      <div style={C.topRow}>
        <span style={C.projTag}>{task.project}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ ...C.prioBadge, color: pr.color, background: pr.bg }}>
            <span style={{ ...C.dot, background: pr.color }} />
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
          {/* 3-dot menu */}
          <div style={{ position: "relative" }}>
            <button style={C.menuBtn} onClick={(e) => { e.stopPropagation(); setMenuOpen(p => !p); setStatusDD(false); }}>
              ⋯
            </button>
            {menuOpen && (
              <div style={C.menu}>
                <button style={C.menuItem} onClick={() => { onEdit(task); setMenuOpen(false); }}>
                  ✏️ Edit
                </button>
                <button style={{ ...C.menuItem, color: "#ef4444" }} onClick={() => onDelete(task.id)}>
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Title */}
      <h3 style={{
        ...C.taskTitle,
        textDecoration: done ? "line-through" : "none",
        color:          done ? "#9ca3af"      : "#111827",
      }}>
        {task.title}
      </h3>

      {/* Description */}
      <p style={C.desc}>{task.desc}</p>

      {/* Status dropdown */}
      <div style={{ position: "relative", marginBottom: 12 }}>
        <button
          style={{ ...C.statusBtn, color: st.color, background: st.bg, borderColor: st.color + "40" }}
          onClick={(e) => { e.stopPropagation(); setStatusDD(p => !p); setMenuOpen(false); }}
        >
          {st.label}
          <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor" style={{ marginLeft: 4 }}>
            <path d="M6 8L2 4h8z" />
          </svg>
        </button>
        {statusDD && (
          <div style={C.statusMenu}>
            {Object.entries(STAT).map(([key, val]) => (
              <button
                key={key}
                style={{ ...C.statusItem, color: val.color }}
                onClick={() => { onStatusChange(task.id, key); setStatusDD(false); }}
              >
                {val.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div style={C.divider} />

      {/* Bottom row */}
      <div style={C.bottomRow}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ ...C.avatar, background: task.assignee.c }}>{task.assignee.i}</div>
          <span style={C.assigneeName}>{task.assignee.i}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
               stroke={dl.color} strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          <span style={{ fontSize: 12, color: dl.color, fontWeight: dl.color !== "#6b7280" ? 600 : 400 }}>
            {dl.text}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── GRID STYLES ─────────────────────────────────────────────── */
const C = {
  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "16px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  projTag: {
    fontSize: 11,
    fontWeight: 600,
    color: "#7c3aed",
    background: "#f5f3ff",
    padding: "2px 8px",
    borderRadius: 4,
  },
  prioBadge: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    fontSize: 11,
    fontWeight: 600,
    padding: "3px 8px",
    borderRadius: 999,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    display: "inline-block",
  },
  menuBtn: {
    background: "transparent",
    border: "none",
    fontSize: 18,
    cursor: "pointer",
    color: "#9ca3af",
    padding: "0 4px",
    lineHeight: 1,
    letterSpacing: 1,
  },
  menu: {
    position: "absolute",
    right: 0,
    top: "100%",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
    zIndex: 100,
    minWidth: 130,
    overflow: "hidden",
    marginTop: 4,
  },
  menuItem: {
    display: "block",
    width: "100%",
    textAlign: "left",
    padding: "9px 14px",
    background: "transparent",
    border: "none",
    fontSize: 13,
    cursor: "pointer",
    color: "#374151",
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: 600,
    margin: "0 0 6px",
    lineHeight: 1.4,
  },
  desc: {
    fontSize: 13,
    color: "#6b7280",
    margin: "0 0 12px",
    lineHeight: 1.5,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  statusBtn: {
    display: "inline-flex",
    alignItems: "center",
    border: "1px solid",
    borderRadius: 6,
    padding: "4px 10px",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  },
  statusMenu: {
    position: "absolute",
    top: "100%",
    left: 0,
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
    zIndex: 100,
    overflow: "hidden",
    minWidth: 140,
    marginTop: 4,
  },
  statusItem: {
    display: "block",
    width: "100%",
    textAlign: "left",
    padding: "9px 14px",
    background: "transparent",
    border: "none",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  divider: {
    height: 1,
    background: "#f3f4f6",
    margin: "0 0 12px",
  },
  bottomRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: 11,
    fontWeight: 700,
  },
  assigneeName: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: 500,
  },
};

/* ── LIST STYLES ─────────────────────────────────────────────── */
const L = {
  row: {
    background: "#fff",
    borderRadius: 10,
    padding: "12px 16px",
    border: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    gap: 12,
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
  },
  check: {
    width: 20,
    height: 20,
    borderRadius: 6,
    border: "2px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
  },
  title: {
    fontSize: 14,
    fontWeight: 600,
    margin: "0 0 2px",
  },
  proj: {
    fontSize: 12,
    color: "#7c3aed",
    fontWeight: 500,
    margin: 0,
  },
  badges: {
    display: "flex",
    gap: 6,
    flexShrink: 0,
  },
  badge: {
    fontSize: 11,
    fontWeight: 600,
    padding: "3px 10px",
    borderRadius: 999,
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexShrink: 0,
  },
  due: {
    fontSize: 12,
    fontWeight: 500,
    minWidth: 80,
    textAlign: "right",
  },
  editBtn: {
    background: "#f5f3ff",
    color: "#7c3aed",
    border: "none",
    borderRadius: 6,
    padding: "5px 12px",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  },
  delBtn: {
    background: "#fef2f2",
    color: "#ef4444",
    border: "none",
    borderRadius: 6,
    padding: "5px 10px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
};