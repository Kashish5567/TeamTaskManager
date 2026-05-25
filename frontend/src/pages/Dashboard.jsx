import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ChartsSection from "../components/ChartsSection";
import StatsCards from "../components/StatsCards";

import { CheckSquare, AlertCircle, CheckCircle, Clock } from "lucide-react";

import { getDashboard } from "../api/dashboard";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let alive = true;
    getDashboard()
      .then((data) => {
        if (!alive) return;
        setStats(data);
      })
      .catch(() => {
        if (!alive) return;
        setStats(null);
      });
    return () => {
      alive = false;
    };
  }, []);

  const totalTasks = stats?.totalTasks ?? 0;
  const completedTasks = stats?.completedTasks ?? 0;
  const pendingTasks = stats?.pendingTasks ?? 0;
  const overdueTasks = stats?.overdueTasks ?? 0;

  return (
    <div
      style={{
        display: "flex",
        background: "#F9FAFB",
        minHeight: "100vh",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          minWidth: 0,
        }}
      >
        <Navbar />

        <div
          style={{
            padding: 20,
            overflowX: "hidden",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
              gap: 20,
              marginBottom: 20,
            }}
          >
            <StatsCards
              icon={CheckSquare}
              num={totalTasks}
              label="Total Tasks"
              iconColor="#4F6EF7"
            />

            <StatsCards
              icon={CheckCircle}
              num={completedTasks}
              label="Completed Tasks"
              iconColor="#10B981"
            />

            <StatsCards
              icon={Clock}
              num={pendingTasks}
              label="Pending Tasks"
              iconColor="#F59E0B"
            />

            <StatsCards
              icon={AlertCircle}
              num={overdueTasks}
              label="Overdue Tasks"
              iconColor="#EF4444"
            />
          </div>

          <div
            style={{
              width: "100%",
              minWidth: 0,
            }}
          >
            <ChartsSection />
          </div>
        </div>
      </div>
    </div>
  );
}
