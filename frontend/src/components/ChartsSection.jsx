import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { weeklyData, statusData } from "../data/dashboardData";

export default function ChartsSection() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: 20,
      }}
    >
      <div
        style={{
          background: "white",
          padding: 20,
          borderRadius: 12,
        }}
      >
        <h3>Weekly Progress</h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyData}>
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="completed" fill="#4F6EF7" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div
        style={{
          background: "white",
          padding: 20,
          borderRadius: 12,
        }}
      >
        <h3>Status</h3>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={statusData} dataKey="value">
              {statusData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}