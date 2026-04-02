import { useEffect, useState } from "react";
import API from "../services/api";
import DashboardCard from "../components/DashboardCards";
import StatusChart from "../components/StatusChart";
import TrendChart from "../components/TrendChart";

export default function Dashboard() {
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    API.get("/jobs/analytics/summary").then((res) => {
      setSummary(res.data);
    });
  }, []);

  const statusData = summary
    ? Object.entries(summary.status_breakdown).map(([key, value]) => ({
        name: key,
        value,
      }))
    : [];

  const trendData = [
    { week: "W1", applications: 4 },
    { week: "W2", applications: 7 },
    { week: "W3", applications: 5 },
    { week: "W4", applications: 9 },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">
        Smart Job Tracker Dashboard
      </h1>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <DashboardCard
          title="Total Applications"
          value={summary?.total_jobs || 0}
        />
        <DashboardCard title="Interviews" value={3} />
        <DashboardCard title="Offers" value={1} />
        <DashboardCard title="Rejected" value={2} />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <StatusChart data={statusData} />
        <TrendChart data={trendData} />
      </div>
    </div>
  );
}