export default function PriorityBadge({ priority }) {
  const map = {
    High: {
      bg: "rgba(239,68,68,0.1)",
      color: "#DC2626",
    },
    Medium: {
      bg: "rgba(245,158,11,0.1)",
      color: "#B45309",
    },
    Low: {
      bg: "rgba(16,185,129,0.1)",
      color: "#059669",
    },
  };

  const p = map[priority];

  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: 20,
        background: p.bg,
        color: p.color,
        fontSize: 11,
      }}
    >
      {priority}
    </span>
  );
}