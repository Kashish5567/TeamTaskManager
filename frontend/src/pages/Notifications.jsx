import { useEffect, useState } from "react";
import {
  dismissNotification,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../api/notifications";

const TYPE = {
  task:     { icon: "📋", bg: "#ede9fe", ic: "#7c3aed", label: "Task assigned",     lbg: "#ede9fe", lc: "#5b21b6" },
  deadline: { icon: "⏰", bg: "#fef3c7", ic: "#d97706", label: "Deadline reminder",  lbg: "#fef3c7", lc: "#92400e" },
  message:  { icon: "💬", bg: "#eff6ff", ic: "#3b82f6", label: "New message",        lbg: "#eff6ff", lc: "#1e40af" },
  invite:   { icon: "👥", bg: "#ecfdf5", ic: "#10b981", label: "Project invite",     lbg: "#ecfdf5", lc: "#065f46" },
};

const INITIAL_NOTIFS = []; /*
  { id: 1, type: "task",     unread: true,  title: "Karan A. assigned you a task",               desc: "Design login page UI — Auth Module · High priority",           time: "2 min ago" },
  { id: 2, type: "deadline", unread: true,  title: "Deadline approaching for REST API endpoints", desc: "Due in 2 days · Backend API project",                          time: "15 min ago" },
  { id: 3, type: "message",  unread: true,  title: "New message in Dashboard UI chat",            desc: '"Hey can someone review the stats card PR?" — Mita R.',        time: "34 min ago" },
  { id: 4, type: "invite",   unread: true,  title: "Sam R. invited you to a project",             desc: "Mobile App · You have been added as a Member",                 time: "1 hr ago" },
  { id: 5, type: "task",     unread: false, title: "Mita R. assigned you a task",                 desc: "Implement JWT token refresh — Auth Module · High priority",    time: "3 hrs ago" },
  { id: 6, type: "deadline", unread: false, title: "Deadline approaching for Build analytics",    desc: "Due tomorrow · Dashboard UI project",                          time: "5 hrs ago" },
  { id: 7, type: "message",  unread: false, title: "New message in Backend API chat",             desc: '"MongoDB schema is ready for review" — Arjun K.',              time: "Yesterday" },
  { id: 8, type: "task",     unread: false, title: "Arjun K. assigned you a task",               desc: "MongoDB schema design — Backend API · Medium priority",         time: "Yesterday" },
]; */

const FILTERS = [
  { key: "all",      label: "All" },
  { key: "task",     label: "Task assigned" },
  { key: "deadline", label: "Deadline" },
  { key: "message",  label: "Messages" },
  { key: "invite",   label: "Invites" },
];

export default function Notifications() {
  const [notifs, setNotifs]         = useState(INITIAL_NOTIFS);
  const [activeFilter, setFilter]   = useState("all");

  useEffect(() => {
    let alive = true;
    getNotifications()
      .then((data) => {
        if (!alive) return;
        const mapped = (data || []).map((n) => ({
          id: n._id,
          type: n.type,
          unread: !!n.unread,
          title: n.title,
          desc: n.desc || "",
          time: n.createdAt ? new Date(n.createdAt).toLocaleString() : "",
        }));
        setNotifs(mapped);
      })
      .catch(() => {
        if (!alive) return;
        setNotifs([]);
      });

    return () => {
      alive = false;
    };
  }, []);

  const filtered = activeFilter === "all"
    ? notifs
    : notifs.filter((n) => n.type === activeFilter);

  const unreadCount = notifs.filter((n) => n.unread).length;

  const markAllRead  = async () => {
    setNotifs((p) => p.map((n) => ({ ...n, unread: false })));
    try {
      await markAllNotificationsRead();
    } catch {
      // silent
    }
  };

  const markRead = async (id) => {
    setNotifs((p) => p.map((n) => (n.id === id ? { ...n, unread: false } : n)));
    try {
      await markNotificationRead(id);
    } catch {
      // silent
    }
  };

  const dismiss = async (id, e) => {
    e.stopPropagation();
    setNotifs((p) => p.filter((n) => n.id !== id));
    try {
      await dismissNotification(id);
    } catch {
      // silent
    }
  };

  const count = (type) => notifs.filter((n) => n.type === type).length;

  return (
    <div style={S.page}>

      {/* Header */}
      <div style={S.topbar}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h1 style={S.title}>Notifications</h1>
            {unreadCount > 0 && (
              <span style={S.unreadBadge}>{unreadCount} unread</span>
            )}
          </div>
          <p style={S.sub}>Stay updated on your team's activity</p>
        </div>
        <button style={S.markAllBtn} onClick={markAllRead}>
          Mark all as read
        </button>
      </div>

      {/* Summary cards */}
      <div style={S.summaryRow}>
        {[
          { type: "task",     label: "Task alerts",   bg: "#ede9fe", ic: "#7c3aed", emoji: "📋" },
          { type: "deadline", label: "Deadlines",     bg: "#fef3c7", ic: "#d97706", emoji: "⏰" },
          { type: "message",  label: "Messages",      bg: "#eff6ff", ic: "#3b82f6", emoji: "💬" },
          { type: "invite",   label: "Invites",       bg: "#ecfdf5", ic: "#10b981", emoji: "👥" },
        ].map((s) => (
          <div key={s.type} style={S.scard}>
            <div style={{ ...S.scardIcon, background: s.bg }}>
              <span style={{ fontSize: 16 }}>{s.emoji}</span>
            </div>
            <div>
              <div style={S.scardNum}>{count(s.type)}</div>
              <div style={S.scardLbl}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={S.filterRow}>
        {FILTERS.map((f) => (
          <button
            key={f.key}
            style={{
              ...S.ftab,
              ...(activeFilter === f.key ? S.ftabActive : {}),
            }}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      {filtered.length === 0 ? (
        <div style={S.empty}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔔</div>
          <p style={S.emptyTitle}>No notifications</p>
          <p style={S.emptySub}>You're all caught up!</p>
        </div>
      ) : (
        <div style={S.list}>
          {filtered.map((n) => {
            const t = TYPE[n.type];
            return (
              <div
                key={n.id}
                style={{
                  ...S.ncard,
                  borderLeft: n.unread ? "3px solid #7c3aed" : "0.5px solid #e5e7eb",
                }}
                onClick={() => markRead(n.id)}
              >
                {/* Icon */}
                <div style={{ ...S.nicon, background: t.bg }}>
                  <span style={{ fontSize: 17 }}>{t.icon}</span>
                </div>

                {/* Body */}
                <div style={S.nbody}>
                  <p style={{
                    ...S.ntitle,
                    fontWeight: n.unread ? 600 : 500,
                  }}>
                    {n.title}
                  </p>
                  <p style={S.ndesc}>{n.desc}</p>
                  <div style={S.nmeta}>
                    <span style={S.ntime}>🕐 {n.time}</span>
                    <span style={{ ...S.typeBadge, background: t.lbg, color: t.lc }}>
                      {t.label}
                    </span>
                  </div>
                </div>

                {/* Right */}
                <div style={S.nright}>
                  {n.unread && <div style={S.unreadDot} />}
                  <button
                    style={S.dismissBtn}
                    onClick={(e) => dismiss(n.id, e)}
                    title="Dismiss"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const S = {
  page: {
    padding: "32px",
    background: "#f9fafb",
    minHeight: "100vh",
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#111827",
    margin: 0,
  },
  sub: {
    fontSize: "13px",
    color: "#6b7280",
    marginTop: "4px",
    marginBottom: 0,
  },
  unreadBadge: {
    background: "#7c3aed",
    color: "#fff",
    fontSize: "11px",
    fontWeight: "600",
    padding: "2px 8px",
    borderRadius: "999px",
  },
  markAllBtn: {
    background: "transparent",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "8px 14px",
    fontSize: "13px",
    color: "#6b7280",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  summaryRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "10px",
    marginBottom: "20px",
  },
  scard: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "12px 14px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  scardIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  scardNum: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#111827",
    lineHeight: 1,
  },
  scardLbl: {
    fontSize: "11px",
    color: "#6b7280",
    marginTop: "2px",
  },
  filterRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "16px",
    flexWrap: "wrap",
  },
  ftab: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 14px",
    border: "1px solid #e5e7eb",
    borderRadius: "999px",
    background: "#fff",
    fontSize: "13px",
    color: "#6b7280",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  ftabActive: {
    background: "#7c3aed",
    color: "#fff",
    borderColor: "#7c3aed",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  ncard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "14px 16px",
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    cursor: "pointer",
    border: "1px solid #e5e7eb",
  },
  nicon: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  nbody: {
    flex: 1,
    minWidth: 0,
  },
  ntitle: {
    fontSize: "13px",
    color: "#111827",
    marginBottom: "3px",
    lineHeight: 1.4,
  },
  ndesc: {
    fontSize: "12px",
    color: "#6b7280",
    lineHeight: 1.5,
    marginBottom: "6px",
  },
  nmeta: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  ntime: {
    fontSize: "11px",
    color: "#9ca3af",
  },
  typeBadge: {
    fontSize: "11px",
    fontWeight: "600",
    padding: "2px 8px",
    borderRadius: "999px",
  },
  nright: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "8px",
    flexShrink: 0,
  },
  unreadDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#7c3aed",
  },
  dismissBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "#9ca3af",
    fontSize: "13px",
    padding: "2px",
    fontFamily: "inherit",
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
