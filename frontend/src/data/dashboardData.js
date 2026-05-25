export const COLORS = {
  blue: "#4F6EF7",
  amber: "#F59E0B",
  purple: "#A78BFA",
  green: "#10B981",
  red: "#EF4444",
  teal: "#22D3A5",
  coral: "#F7794F",
};

// ✅ Dashboard Stats (NEW CLEAN STRUCTURE)
export const dashboardStats = {
  totalTasks: 48,
  inProgress: 18,
  members: 9,
  completedTasks: 21,   // ✅ ADDED
  pendingTasks: 18,     // ✅ ADDED
  overdueTasks: 9,      // ✅ ADDED

};

// 📊 Weekly Progress Data
export const weeklyData = [
  { week: "Wk 1", completed: 6, target: 12 },
  { week: "Wk 2", completed: 9, target: 12 },
  { week: "Wk 3", completed: 7, target: 12 },
  { week: "Wk 4", completed: 14, target: 12 },
];

// 🥧 Task Status Data (Pie Chart)
export const statusData = [
  { name: "Pending", value: 12, color: COLORS.amber },
  { name: "In Progress", value: 18, color: COLORS.blue },
  { name: "Completed", value: 14, color: COLORS.green },
];

// 📌 Sample Tasks
export const tasks = [
  {
    id: 1,
    name: "Design login UI screens",
    project: "Auth Module",
    assignee: "KA",
    assigneeName: "Kashish",
    priority: "High",
    status: "In Progress",
    due: "May 25",
    color: "blue",
  },
];