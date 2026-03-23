import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function WeeklyChart({ data = [] }) {
  const chartData = Array.isArray(data) ? data : [];

  return (
    <div className="chart-card">
      <h2>Weekly Activity</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Bar dataKey="admissions" fill="#2a9d8f" />
          <Bar dataKey="discharges" fill="#3a86ff" />
          <Bar dataKey="surgeries" fill="#e76f51" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
