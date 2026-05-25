import { useNavigate } from "react-router-dom";

export default function ProjectCard({ project, onClick }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/projects/${project.id}`);
  };

  const roleColor =
    project.role === "Admin"
      ? { bg: "#E6F1FB", color: "#185FA5" }
      : { bg: "#EAF3DE", color: "#3B6D11" };

  const progressColor =
    project.progress >= 70
      ? "#10B981"
      : project.progress >= 40
      ? "#4F6EF7"
      : "#F59E0B";

  return (
    <div
      onClick={handleClick}
      style={{
        background: "white",
        border: "1px solid #E5E7EB",
        borderRadius: 12,
        padding: 16,
        cursor: "pointer",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 10,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: project.iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
          }}
        >
          {project.icon}
        </div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 500,
            padding: "3px 8px",
            borderRadius: 20,
            background: roleColor.bg,
            color: roleColor.color,
          }}
        >
          {project.role}
        </span>
      </div>

      <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
        {project.name}
      </p>
      <p
        style={{
          fontSize: 12,
          color: "#6B7280",
          marginBottom: 14,
          lineHeight: 1.5,
        }}
      >
        {project.description}
      </p>

      <div style={{ marginBottom: 14 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 11,
            color: "#6B7280",
            marginBottom: 5,
          }}
        >
          <span>Progress</span>
          <span>{project.progress}%</span>
        </div>
        <div
          style={{
            height: 4,
            background: "#F3F4F6",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${project.progress}%`,
              height: "100%",
              background: progressColor,
              borderRadius: 4,
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex" }}>
          {project.members.slice(0, 3).map((m, i) => (
            <div
              key={i}
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: m.bg,
                color: m.color,
                fontSize: 10,
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid white",
                marginLeft: i === 0 ? 0 : -6,
              }}
            >
              {m.initials}
            </div>
          ))}
          {project.members.length > 3 && (
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "#F3F4F6",
                color: "#6B7280",
                fontSize: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid white",
                marginLeft: -6,
              }}
            >
              +{project.members.length - 3}
            </div>
          )}
        </div>
        <span style={{ fontSize: 11, color: "#6B7280" }}>
          {project.completedTasks}/{project.totalTasks} tasks
        </span>
      </div>
    </div>
  );
}