export function getInitials(nameOrEmail) {
  const raw = (nameOrEmail || "").trim();
  if (!raw) return "NA";

  const parts = raw.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  if (raw.includes("@")) {
    const left = raw.split("@")[0] || "";
    return left.slice(0, 2).toUpperCase() || "NA";
  }

  return raw.slice(0, 2).toUpperCase();
}

export function colorForId(id) {
  const str = String(id || "");
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  const palette = [
    { bg: "#E6F1FB", color: "#185FA5" },
    { bg: "#EAF3DE", color: "#3B6D11" },
    { bg: "#FAEEDA", color: "#854F0B" },
    { bg: "#EEEDFE", color: "#534AB7" },
    { bg: "#FBEAF0", color: "#993556" },
  ];
  return palette[hash % palette.length];
}

export function mapTaskStatusFromApi(status) {
  if (status === "To Do") return "todo";
  if (status === "In Progress") return "in-progress";
  if (status === "Done") return "completed";
  return "todo";
}

export function mapTaskStatusToApi(status) {
  if (status === "todo") return "To Do";
  if (status === "in-progress") return "In Progress";
  if (status === "completed") return "Done";
  return "To Do";
}

export function mapPriorityFromApi(priority) {
  if (priority === "Low") return "low";
  if (priority === "Medium") return "medium";
  if (priority === "High") return "high";
  return "medium";
}

export function mapPriorityToApi(priority) {
  if (priority === "low") return "Low";
  if (priority === "medium") return "Medium";
  if (priority === "high") return "High";
  return "Medium";
}

