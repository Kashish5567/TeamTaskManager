export default function StatusBadge({ status }) {
  const map = {
    Completed: {
      bg: "rgba(16,185,129,0.1)",
      color: "#059669",
    },
    "In Progress": {
      bg: "rgba(79,110,247,0.1)",
      color: "#4F6EF7",
    },
    Pending: {
      bg: "rgba(245,158,11,0.1)",
      color: "#B45309",
    },
  };

  const s = map[status];

  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: 20,
        background: s.bg,
        color: s.color,
        fontSize: 11,
      }}
    >
      {status}
    </span>
  );
}